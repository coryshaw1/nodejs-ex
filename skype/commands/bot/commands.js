var twitch = require(process.cwd() + "/plugins/twitch.js");

module.exports = function(session, data, commands) {
    var commandsNonTwitchEmotes = Object.keys(commands).filter(function(command) {
        return twitch.twitchCommands.indexOf(command) == -1;
    }).sort();

    session.send("The following commands are available to use:");
    session.send(process.env.COMMAND_PREFIX + commandsNonTwitchEmotes.join(", " + process.env.COMMAND_PREFIX));
}