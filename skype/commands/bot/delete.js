module.exports = function(session) {
    for(var i = 0; i < 10; i++)
        session.send("Bots can't delete messages for some reason...");
};
