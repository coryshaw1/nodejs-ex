module.exports = function (session, data) {

    if (!data || !data.params || data.params.length < 1 || (data.params[0].toLowerCase() !== "heads" && data.params[0].toLowerCase() !== "tails"))
        return session.send("Need to call a side! Ex: !coinflip heads OR !coinflip tails");

    var sideChosen = Math.floor(Math.random() * 2) == 0 ? "heads" : "tails";

    session.send(sideChosen == data.params[0].toLowerCase()
            ? "It's " + sideChosen + "! You won!"
            : "Sorry, it landed on " + sideChosen);
};