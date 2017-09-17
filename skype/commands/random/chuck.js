var request = require('request');

module.exports = function(session) {
    request('http://api.icndb.com/jokes/random', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);

            if(!json.type || json.type !== "success") 
                return session.send("Bad request to Chuck Norris... Probably busy kicking ass");

            session.send(json.value.joke
                            .replace('&quot;', '"')
                            .replace('&apos;', "'"));
        }
        else {
            session.send("Bad request to Chuck Norris... Probably busy kicking ass");
        }
    });
}