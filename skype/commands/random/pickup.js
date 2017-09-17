var request = require('request');

module.exports = function(session) {
    request('http://pebble-pickup.herokuapp.com/tweets/random', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);

            if(!json.tweet || json.tweet.length == 0) 
                return session.send("Bad request to Pickup Lines... Probably busy with that girl they picked up");

            session.send(json.tweet
                            .replace('&quot;', '"')
                            .replace('&apos;', "'"));
        }
        else {
            session.send("Bad request to Pickup Lines... Probably busy with that girl they picked up");
        }
    });
}

module.exports.extraCommands = ["pickupline"];