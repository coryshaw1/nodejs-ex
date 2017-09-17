var request = require("request");

module.exports = function(session) {
    request('https://api.dubtrack.fm/room/' + process.env.DUBTRACK_ROOM_ID, function (error, response, body) {
        if (!error && response.statusCode != 404) {
            var json = JSON.parse(body);

            if(!json.code || json.code !== 200) 
                return;

            if(json.data.currentSong && json.data.currentSong.name)
                session.send("'" + json.data.currentSong.name + "' is currently playing in Dubtrack!");
            else
                session.send("There is not a song currently playing in Dubtrack!");
        }
        else {
            session.send("Bad request to Dubtrack");
        }
    });
}