var EspnFF = require('espn-ff');

var ff = new EspnFF({
    leagueId: process.env.ESPN_FF_LEAGUE_ID /* Your league id */,
    cookie: process.env.ESPN_FF_COOKIE
});

module.exports = function(session, data) {
    if(!data || !data.params || data.params.length < 1) {
        return ff.getFantasyTeams(function(err, teams) {
            if (err)
                return session.send("Espn Error Getting Teams: " + err);
            
            teams.forEach(function(t) {
                session.send('ID: ' + t.id + ' - ' + t.name + ' - ' + t.owner_name.replace("\r\n", ""));
            });
        });
    }

    var teamId = parseInt(data.params[0]);
    var team = null;

    ff.getFantasyTeams(function(err, teams) {
        if (err)
            return session.send("Espn Error Getting Teams: " + err);
        
        team = teams.find(function(t) { return t.id == teamId; });
        
        if (!team) return session.send("No matching team ID found");
    
        ff.getRoster(teamId, function(err, roster) {
            if (err)
                return session.send("Espn Error Getting Roster: " + err);
    
            session.send('ID: ' + team.id + ' - ' + team.name + ' - ' + team.owner_name.replace("\r\n", "") + '\nStarters\n');
            roster.starters.forEach(function(s) {
                session.send(s.slot + ' - ' + s.player.name + ' (' + s.player.team + ') - ' + s.matchup.projected_or_current_points);
            });
            session.send('Total Pts Projected: ' + roster.starters
                .filter(function(s) { return s.matchup; })
                .map(function(s) { return s.matchup.projected_or_current_points; })
                .reduce(function(sum, value) {
                    return sum + value;
                }, 0));
            session.send('Bench');
            roster.bench
                .filter(function(s) { return s.matchup; })
                .forEach(function(s) {
                    session.send(s.player.name + ' (' + s.player.team + ') - ' + s.matchup.projected_or_current_points);
                });
        });
    });
}

module.exports.extraCommands = ["fantasyfootball", "espnff"];