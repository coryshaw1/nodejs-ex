var request = require('request');

module.exports = function (session, data) {
    if(!data || !data.params || data.params.length < 1)
        return getRandomBeer(session, data);
    else
        return getSearchedBeer(session, data);
}

function getRandomBeer(session, data) {
    var baseRequestUrl = 'http://api.brewerydb.com/v2/beer/random?withBreweries=y&key=' + process.env.BREWERYDB_API_KEY;

    request(baseRequestUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);

            if (!json || !json.data)
                return session.send("No beer found...");

            return messageBeer(json.data, session, data);
        } else {
            return session.send("Bad request to BreweryDB...");
        }
    });
}

function getSearchedBeer(session, data) {
    var baseRequestUrl = 'http://api.brewerydb.com/v2/search?type=beer&withBreweries=y&q=' + data.params.join("%20") + '&key=' + process.env.BREWERYDB_API_KEY;

    request(baseRequestUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);

            if (!json || !json.data || json.data.length == 0)
                return session.send("No beer found matching " + data.params.join(" ") + "...");

            return messageBeer(json.data[0], session, data);
        } else {
            return session.send("Bad request to BreweryDB...");
        }
    });
}

function messageBeer(beer, session, data) {
    var beerInfo = "";
    var beerDesc = beer.description
        ? beer.description.replace("\r", "").replace("\n", "")
        : "";

    if (beer.style && beer.style.shortName && beer.abv)
        beerInfo = beer.nameDisplay + " (" + beer.style.shortName + " " + beer.abv + "%)";
    else
        beerInfo = beer.nameDisplay;

    if (beer.breweries && beer.breweries.length > 0)
        beerInfo += " - brewed by " + beer.breweries[0].name;

    session.send(beerInfo);
    session.send(beerDesc + " - Link: http://www.brewerydb.com/beer/" + beer.id);
}