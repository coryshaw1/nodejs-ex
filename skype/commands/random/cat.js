var request = require('request');

module.exports = function(session) {
    request('http://random.cat/meow', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);

            session.send(json.file);
        }
        else {
            session.send("Bad request to cats...");
        }
    });
}