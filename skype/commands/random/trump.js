var request = require('request');

module.exports = function(session) {
    request('https://api.tronalddump.io/random/quote', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);

            if (!json.value || json.value.length == 0)
                return session.send("Bad request to Trump... Probably busy building a wall");

            session.send(json.value
                            .replace('&quot;', '"')
                            .replace('&apos;', "'"));

            if (json._embedded && json._embedded.source && json._embedded.source.length > 0 &&
              json._embedded.source[0].url && json._embedded.source[0].url.length > 0)
                session.send("Source: " + json._embedded.source[0].url);
        }
        else {
            session.send("Bad request to Trump... Probably busy building a wall");
        }
    });
}