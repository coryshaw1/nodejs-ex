var twitch = require(process.cwd() + "/plugins/twitch.js");

module.exports = function(session, data) {
    if(!data || !data.params || data.params.length < 1) {
        session.send("All global emotes, BetterTwitchTV emotes, and all of the following channels have their emotes added:");
        session.send(twitch.channels.sort().join(", "));
        session.send("To find out commands for each channel use: !twitch channelName");
        return;
    }
    
    //look up by first param after command
    var channelToLookup = data.params[0].toLowerCase();

    var matchingChannel = twitch.channelEmotes.filter(function(c){
        return c.channel == channelToLookup;
    });

    if(matchingChannel.length == 0)
        return session.send("No channel matching '" + channelToLookup + "' found!");

    session.send("The following commands are available for " + matchingChannel[0].channel + ": " + process.env.COMMAND_PREFIX + matchingChannel[0].emotes.sort().join(", " + process.env.COMMAND_PREFIX));
}