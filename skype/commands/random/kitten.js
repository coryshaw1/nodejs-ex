module.exports = function(session) {
    session.send("http://www.placekitten.com/" + (Math.floor(Math.random() * 600) + 200) + "/" + (Math.floor(Math.random() * 600) + 200));
}