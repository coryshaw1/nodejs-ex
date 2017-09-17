var builder = require('botbuilder');
var pkg = require(process.cwd() + "/package.json");
var fs = require('fs');
var path = require("path");
var request = require("request");
var twitch = require(process.cwd() + "/plugins/twitch");
var commands = {};

module.exports = function(expressApp) {
    // Create chat bot
    var connector = new builder.ChatConnector({
        appId: process.env.SKYPE_APP_ID,
        appPassword: process.env.SKYPE_APP_PASSWORD
    });
    var bot = new builder.UniversalBot(connector);
    expressApp.post('/api/messages', connector.listen());

    initializeCommands();
    initializeTwitchCommands();

    bot.dialog('/', handleCommand);

    function initializeCommands() {
        //cache all the commands here by auto requiring them and passing the bot
        //supports directories no matter how deep you go. twss
        var cmd = process.cwd() + "/skype/commands";
        var walk = function(dir) {
            fs.readdirSync(dir).forEach(function(file) {
                var _path = path.resolve(dir, file);
                fs.stat(_path, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(_path);
                    } else {
                        if (file.indexOf(".js") > -1) {
                            // add commands set in file if they exist
                            if(typeof(require(_path).extraCommands) !== "undefined"){
                                if(Array.isArray(require(_path).extraCommands)){
                                    // add each command in array into overall commands
                                    require(_path).extraCommands.forEach(function(command){
                                        commands[command] = require(_path);
                                    });
                                }
                                else {
                                    throw new TypeError("Invalid extraCommands export for file: " + _path);
                                }
                            }

                            commands[file.split(".")[0]] = require(_path);
                        }

                    }
                });
            });
        };
        walk(cmd);
    }

    function initializeTwitchCommands() {
        //Global emotes
        twitch.initializeGlobalTwitchEmotes(commands, function(key, url) {
            commands[key] = function(session, data) {
                session.send(url);
            };
        });

        //Subscriber emotes specified in assets/twitch.js
        twitch.initializeSubscriberTwitchEmotes(commands, function(key, url) {
            commands[key] = function(session, data) {
                session.send(url);
            };
        });

        //Bttv emotes
        twitch.initializeBttvEmotes(commands, function(key, url) {
            commands[key] = function(session, data) {
                session.send(url);
            };
        });
    }

    function handleCommand(session) {

        if(Object.keys(commands).length == 0)
            return setTimeout(handleCommand(session), 2000);

        var cmd = session.message.text,
            // array of the command triggers
            parsedCommands = [],
            data = {};
        //split the whole message words into tokens
        var tokens = cmd.split(" ");
        //command handler
        tokens.forEach(function(token) {
            //check if token starts with command prefix and we haven't already parsed command
            if (token.substr(0, process.env.COMMAND_PREFIX.length) === process.env.COMMAND_PREFIX 
                && parsedCommands.indexOf(token.substr(process.env.COMMAND_PREFIX.length)) == -1) {
                // add the command used to the data sent from the chat to be used later
                data.trigger = token.substr(process.env.COMMAND_PREFIX.length).toLowerCase();
                parsedCommands.push(data.trigger);
                //get index of token in all tokens
                var tokenIndex = tokens.indexOf(token);
                //the params are an array of the remaining tokens
                data.params = tokens.slice(tokenIndex + 1);
                //execute the command
                if (typeof(commands[data.trigger]) !== "undefined") {
                    //notify the user the bot received command by "typing"
                    session.sendTyping();
                    //passes session the data to the command
                    commands[data.trigger](session, data, commands);
                }
            }
        });
    }
}