var twitch = require(process.cwd() + "/plugins/twitch.js");

module.exports = function(session, data, commands) {
    if (!data || !data.params || data.params.length < 1) {
        session.send("Invalid request. Please use this command as: !twitchadd channelToSearch");
        return;
    }

    //look up by first param after command
    var channelToLookup = data.params[0].toLowerCase();

    twitch.addTwitchChannel(channelToLookup, commands, 
        function(key, url){
            //commandCallback
            commands[key] = function(bot, data) {
                session.send(url);
            };
        },
        function(message){
            //messageCallback
            session.send(message);
        }, 
        function(emotes){
            //emotesCallback
            session.send("Successfully add Twitch channel '" + channelToLookup + "'!");
            session.send("The following emote commands have been added: " + process.env.COMMAND_PREFIX + emotes.sort().join(", " + process.env.COMMAND_PREFIX));
        }
    )

}