var request = require('request');

module.exports = function (session, data) {
    if(!data || !data.params || data.params.length < 1)
        return getRandomBrewery(session, data);
    else
        return getSearchedBrewery(session, data);
}

function getRandomBrewery(session, data) {
    var baseRequestUrl = 'http://api.brewerydb.com/v2/brewery/random?key=' + process.env.BREWERYDB_API_KEY;

    request(baseRequestUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);

            if (!json || !json.data)
                return session.send("No brewery found...");

            return messageBrewery(json.data, session, data);
        } else {
            return session.send("Bad request to BreweryDB...");
        }
    });
}

function getSearchedBrewery(session, data) {
    var baseRequestUrl = 'http://api.brewerydb.com/v2/search?type=brewery&q=' + data.params.join("%20") + '&key=' + process.env.BREWERYDB_API_KEY;

    request(baseRequestUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);

            if (!json || !json.data || json.data.length == 0)
                return session.send("No brewery found matching " + data.params.join(" ") + "...");

            return messageBrewery(json.data[0], session, data);
        } else {
            return session.send("Bad request to BreweryDB...");
        }
    });
}

function messageBrewery(brewery, session, data) {
    var breweryInfo = brewery.name;
    var breweryDesc = brewery.description
        ? brewery.description.replace("\r", "").replace("\n", "")
        : "";

    session.send(breweryInfo);
    session.send(breweryDesc + " - Link: " + (brewery.website ? brewery.website : "http://www.brewerydb.com/brewery/" + brewery.id));
}