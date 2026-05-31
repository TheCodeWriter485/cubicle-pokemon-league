//server.js
//connects to future pokemon database to pull pokemon, teams and matches out

const express = require('express');
const mysql = require('mysql2')
const cors = require('cors')
const bcrypt = require('bcrypt')

const app = express()
const session = require('express-session')

app.use(cors({
    origin: 'http://localhost:3000', // your frontend
    credentials: true
}))
app.use(session({
    secret: 'cubiclepokemonleague',
    resave: false,
    saveUninitialized: false
}))
app.use(express.json());

const db = mysql.createConnection({
    host: "localHost",
    user: 'root',
    password: "Cubicle*2022",
    database: 'cubicleData'
})

const dbPromise = db.promise();

function addPokemonStats(stats, pokemon, kills, deaths, wins, gamesPlayed) {
    if (!pokemon) return;
    if (!stats[pokemon]) {
        stats[pokemon] = {
            kills: 0,
            deaths: 0,
            wins: 0,
            gamesPlayed: 0,
            diff: 0
        };
    }

    stats[pokemon].kills += Number(kills) || 0;
    stats[pokemon].deaths += Number(deaths) || 0;
    stats[pokemon].wins += Number(wins) || 0;
    stats[pokemon].gamesPlayed += Number(gamesPlayed) || 0;
    stats[pokemon].diff = stats[pokemon].kills - stats[pokemon].deaths;
}

function getMatchStatTotals(matchData) {
    const totals = {
        team1: {
            ko: 0,
            dif: 0
        },
        team2: {
            ko: 0,
            dif: 0
        },
        pokemon: {}
    };

    const rounds = Array.isArray(matchData?.round_data) ? matchData.round_data : [];

    rounds.forEach((round) => {
        const p1Pokemon = Array.isArray(round?.p1?.pokemon) ? round.p1.pokemon : [];
        const p2Pokemon = Array.isArray(round?.p2?.pokemon) ? round.p2.pokemon : [];
        const pokemonKills = round?.pokemon_kills || {};
        const pokemonDeaths = round?.pokemon_deaths || {};

        totals.team1.ko += Number(round?.p1?.kills) || 0;
        totals.team1.dif += Number(round?.p1?.diff) || 0;
        totals.team2.ko += Number(round?.p2?.kills) || 0;
        totals.team2.dif += Number(round?.p2?.diff) || 0;

        p1Pokemon.forEach((pokemon) => {
            addPokemonStats(
                totals.pokemon,
                pokemon,
                pokemonKills[pokemon],
                pokemonDeaths[pokemon],
                round?.p1?.winner ? 1 : 0,
                1
            );
        });

        p2Pokemon.forEach((pokemon) => {
            addPokemonStats(
                totals.pokemon,
                pokemon,
                pokemonKills[pokemon],
                pokemonDeaths[pokemon],
                round?.p2?.winner ? 1 : 0,
                1
            );
        });
    });

    return totals;
}

async function applyMatchStatDelta(matchRow, totals, multiplier) {
    if (!matchRow || !totals || !multiplier) return;

    if (matchRow.team_1) {
        await dbPromise.query(
            "UPDATE team SET KO = COALESCE(KO, 0) + ?, Dif = COALESCE(Dif, 0) + ? WHERE id = ?",
            [totals.team1.ko * multiplier, totals.team1.dif * multiplier, matchRow.team_1]
        );
    }

    if (matchRow.team_2) {
        await dbPromise.query(
            "UPDATE team SET KO = COALESCE(KO, 0) + ?, Dif = COALESCE(Dif, 0) + ? WHERE id = ?",
            [totals.team2.ko * multiplier, totals.team2.dif * multiplier, matchRow.team_2]
        );
    }

    for (const [pokemon, pokemonTotals] of Object.entries(totals.pokemon)) {
        await dbPromise.query(
            `
                UPDATE Pokemon
                SET
                    Diff = COALESCE(Diff, 0) + ?,
                    Kills = COALESCE(Kills, 0) + ?,
                    Death = COALESCE(Death, 0) + ?,
                    Wins = COALESCE(Wins, 0) + ?,
                    GamesPlayed = COALESCE(GamesPlayed, 0) + ?,
                    HistDiff = COALESCE(HistDiff, 0) + ?,
                    HistKills = COALESCE(HistKills, 0) + ?,
                    HistDeath = COALESCE(HistDeath, 0) + ?,
                    HistWins = COALESCE(HistWins, 0) + ?,
                    HistGP = COALESCE(HistGP, 0) + ?
                WHERE NamePoke = ?
            `,
            [
                pokemonTotals.diff * multiplier,
                pokemonTotals.kills * multiplier,
                pokemonTotals.deaths * multiplier,
                pokemonTotals.wins * multiplier,
                pokemonTotals.gamesPlayed * multiplier,
                pokemonTotals.diff * multiplier,
                pokemonTotals.kills * multiplier,
                pokemonTotals.deaths * multiplier,
                pokemonTotals.wins * multiplier,
                pokemonTotals.gamesPlayed * multiplier,
                pokemon
            ]
        );

        await dbPromise.query(
            "UPDATE Pokemon SET Score = (COALESCE(Diff, 0) * 4) + (COALESCE(Kills, 0) * 10) + COALESCE(Wins, 0) WHERE NamePoke = ?",
            [pokemon]
        );
    }
}

app.get('/', (req, res) => {
    return res.json("From backend side");

})

app.get('/pokedata', (req, res) => {
    const sql = " SELECT * FROM Pokemon"
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.post('/pokemon/claim', (req, res) => {
    let username = req.body.username;
    let pokemonName = req.body.pokemonName;

    db.query('UPDATE Pokemon SET OwnedBy = ? WHERE NamePoke = ?', [username, pokemonName], (err, results) => {
        if (err) return res.json(err);
        return res.json(results);
    });
});

app.get('/pokemon/ownership/:name', (req, res) => {
    db.query('SELECT OwnedBy FROM Pokemon WHERE NamePoke = ?', [req.params.name], (err, results) => {
        if (err) return res.json(err);
        return res.json(results[0]);
    });
});

app.get('/team', (req, res) => {
    const sql = " SELECT * FROM team"
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get('/team/full', (req, res) => {
    const teamSql = "SELECT * FROM team";
    const memberSql = "SELECT * FROM teammembers";
    const itemSql = "SELECT * FROM teamitems";

    db.query(teamSql, (err, teams) => {
        if (err) return res.json(err);
        db.query(memberSql, (err, members) => {
            if (err) return res.json(err);
            db.query(itemSql, (err, items) => {
                if (err) return res.json(err);

                const fullTeams = teams.map((team) => ({
                    ...team,
                    members: members.filter((m) => m.team_id === team.id),
                    items: items.filter((i) => i.team_id === team.id)
                }));

                return res.json(fullTeams);
            });
        });
    });
});

app.post('/team/create', (req, res) => {
    const { Username, League, TeamName, Logo, Epithat, TrainerTip, Season, Wins, Losses, KO, Dif, ELO, Points } = req.body;
    db.query(
        'INSERT INTO team (Username, League, TeamName, Logo, Epithat, TrainerTip, Season, Wins, Losses, KO, Dif, Elo, Points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [Username, League, TeamName, Logo, Epithat, TrainerTip, Season, Wins, Losses, KO, Dif, ELO, Points],
        (err, results) => {
            if (err) return res.json(err);
            return res.json(results);
        }
    );
});

app.post('/team/updatepoints', (req, res) => {
    let username = req.body.username;
    let points = req.body.points;

    db.query('UPDATE team SET Points = ? WHERE Username = ?', [points, username], (err, results) => {
        if (err) return res.json(err);
        return res.json(results);
    });
});

app.post('/teamitem/create', (req, res) => {
    let team_id = req.body.team_id;
    let item = req.body.item;

    db.query('INSERT INTO teamitems (team_id, item) VALUES (?, ?)', [team_id, item], (err, results) => {
        if (err) return res.json(err);
        return res.json(results);
    });
});

app.post('/teammates/create', (req, res) => {
    let team_id = req.body.team_id;
    let pokemon = req.body.pokemon;

    db.query('INSERT INTO teammembers (team_id, pokemon) VALUES (?, ?)', [team_id, pokemon], (err, results) => {
        if (err) return res.json(err);
        return res.json(results);
    });
});

app.post('/teammembers/delete', (req, res) => {
    let team_id = req.body.team_id;
    let pokemon = req.body.pokemon;

    db.query('DELETE FROM teammembers WHERE team_id = ? AND pokemon = ? LIMIT 1', [team_id, pokemon], (err, results) => {
        if (err) return res.json(err);
        return res.json(results);
    });
});

app.post('/teamitems/delete', (req, res) => {
    let team_id = req.body.team_id;
    let item = req.body.item;

    db.query('DELETE FROM teamitems WHERE team_id = ? AND item = ? LIMIT 1', [team_id, item], (err, results) => {
        if (err) return res.json(err);
        return res.json(results);
    });
});

app.get('/itemshop', (req, res) => {
    const sql = " SELECT * FROM itemshop"
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.post('/auth', (req, res) => {
    // Capture the input fields
    let username = req.body.username;
    let password = req.body.password;
    console.log(username);
    // Ensure the input fields exists and are not empty
    if (username && password) {
        // Execute SQL query that'll select the account from the database based on the specified username and password
        db.query('SELECT * FROM accounts WHERE username = ?', [username], async (err, results) => {
            if (results.length > 0) {
                const match = await bcrypt.compare(password, results[0].password);
                if (match) {
                    req.session.loggedin = true;
                    req.session.username = username;
                    req.session.admin = results[0].admin;
                    res.send('Logged in successfully!');
                } else {
                    res.status(401).send('Incorrect Username and/or Password!');
                }
            }
        });
    }
    else {
        console.log("Please enter Username and Password!");
        res.status(401).send('Please enter Username and Password!');
    }
});

app.get('/auth/status', (req, res) => {
    if (req.session.loggedin) {
        res.json({
            loggedin: true,
            username: req.session.username,
            admin: req.session.admin
        });
    } else {
        res.json({
            loggedin: false,
            admin: false
        });
    }
});

app.post('/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.send('Logged out successfully!');
    });
});

app.post('/account/create', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let admin = req.body.admin;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.json(err);
        db.query('INSERT INTO accounts (username, password, admin) VALUES (?, ?, ?)', [username, hash, admin], (err, results) => {
            if (err) return res.json(err);
            return res.json(results);
        });
    })
})

app.get('/draft/schedule', (req, res) => {
    db.query('SELECT * FROM draftschedule', (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post('/draft/set', (req, res) => {
    const { league, draft_date, start_time, end_time } = req.body;
    db.query(
        'INSERT INTO draftschedule (league, draft_date, start_time, end_time) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE draft_date = ?, start_time = ?, end_time = ?',
        [league, draft_date, start_time, end_time, draft_date, start_time, end_time],
        (err, results) => {
            if (err) return res.json(err);
            return res.json(results);
        }
    );
});
app.get("/accounts", (req, res) => {
    const sql = "SELECT username FROM accounts"
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get("/matches", (req, res) => {
    const sql = `
        SELECT
            matches.*,
            team1.id AS team_1_id,
            team1.Username AS team_1_username,
            team1.League AS team_1_league,
            team1.TeamName AS team_1_name,
            team1.Logo AS team_1_logo,
            team1.showdown_acct AS team_1_showdown_acct,
            team2.id AS team_2_id,
            team2.Username AS team_2_username,
            team2.League AS team_2_league,
            team2.TeamName AS team_2_name,
            team2.Logo AS team_2_logo,
            team2.showdown_acct AS team_2_showdown_acct
        FROM matches
        LEFT JOIN team AS team1 ON matches.team_1 = team1.id
        LEFT JOIN team AS team2 ON matches.team_2 = team2.id
    `
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

function parseStoredMatchData(matchData) {
    if (!matchData) return null;
    if (typeof matchData === "object") return matchData;

    try {
        return JSON.parse(matchData);
    } catch (err) {
        console.warn("Could not parse stored match data:", err);
        return null;
    }
}

function validateSubmittedMatchData(matchRow, matchData, replayUrls) {
    if (!matchRow) return "Match not found";

    const rounds = Array.isArray(matchData?.round_data) ? matchData.round_data : [];
    if (rounds.length < 2) return "At least two rounds are required";
    if (!matchData?.match_winner) return "Match data must include a winner";
    if (!replayUrls[0] || !replayUrls[1]) return "Round 1 and Round 2 replay URLs are required";

    const team1Name = matchRow.team_1_name || `Team ${matchRow.team_1}`;
    const team2Name = matchRow.team_2_name || `Team ${matchRow.team_2}`;
    const team1Wins = Number(matchData?.p1?.round_wins) || rounds.filter((round) => round?.p1?.winner).length;
    const team2Wins = Number(matchData?.p2?.round_wins) || rounds.filter((round) => round?.p2?.winner).length;

    if (matchData?.p1?.name !== team1Name) return `Match data p1 must be ${team1Name}`;
    if (matchData?.p2?.name !== team2Name) return `Match data p2 must be ${team2Name}`;
    if (team1Wins === team2Wins) return "Match data must have a winner";
    if (Math.max(team1Wins, team2Wins) < 2) return "A team must win at least two rounds";

    for (const [index, round] of rounds.entries()) {
        if (!round?.id) return `Round ${index + 1} is missing a replay id`;
        if (!replayUrls[index]) return `Round ${index + 1} is missing a replay URL`;
        if (round?.source_url && round.source_url !== replayUrls[index]) return `Round ${index + 1} replay URL does not match loaded round data`;
        if (round?.p1?.name !== team1Name) return `Round ${index + 1} p1 must be ${team1Name}`;
        if (round?.p2?.name !== team2Name) return `Round ${index + 1} p2 must be ${team2Name}`;
        if (!round?.p1?.winner && !round?.p2?.winner) return `Round ${index + 1} must have a winner`;
        if (round?.p1?.winner && round?.p2?.winner) return `Round ${index + 1} cannot have two winners`;
    }

    if (![team1Name, team2Name].includes(matchData.match_winner)) {
        return "Match winner must be one of the teams in this match";
    }

    return null;
}

app.post("/matches/update", async (req, res) => {
    const match_id = req.body.match_id;
    const match_data = req.body.match_data;
    const round1_url = req.body.round1_url || null;
    const round2_url = req.body.round2_url || null;
    const round3_url = req.body.round3_url || null;
    const done = 1;
    const sql = "UPDATE matches SET match_data = ?, done = ?, winner = ?, round1_url = ?, round2_url = ?, round3_url = ? WHERE match_id = ?";

    try {
        await dbPromise.beginTransaction();

        const [matches] = await dbPromise.query(`
            SELECT
                matches.*,
                team1.TeamName AS team_1_name,
                team1.showdown_acct AS team_1_showdown_acct,
                team2.TeamName AS team_2_name,
                team2.showdown_acct AS team_2_showdown_acct
            FROM matches
            LEFT JOIN team AS team1 ON matches.team_1 = team1.id
            LEFT JOIN team AS team2 ON matches.team_2 = team2.id
            WHERE matches.match_id = ?
            FOR UPDATE
        `, [match_id]);
        if (!matches.length) {
            await dbPromise.rollback();
            return res.status(404).json({ error: "Match not found" });
        }

        const matchRow = matches[0];
        const validationError = validateSubmittedMatchData(matchRow, match_data, [round1_url, round2_url, round3_url]);
        if (validationError) {
            await dbPromise.rollback();
            return res.status(400).json({ error: validationError });
        }

        const previousMatchData = parseStoredMatchData(matchRow.match_data);
        const matchDataToStore = {
            ...(match_data || {}),
            stats_applied: true
        };
        const winner = matchDataToStore.match_winner;

        if (matchRow.done && previousMatchData?.stats_applied) {
            await applyMatchStatDelta(matchRow, getMatchStatTotals(previousMatchData), -1);
        }

        await applyMatchStatDelta(matchRow, getMatchStatTotals(match_data), 1);

        const [data] = await dbPromise.query(sql, [JSON.stringify(matchDataToStore), done, winner, round1_url, round2_url, round3_url, match_id]);
        await dbPromise.commit();

        return res.json(data);
    } catch (err) {
        await dbPromise.rollback();
        return res.json(err);
    }
})

app.post("/matches/create", (req, res) => {
    const { team_1, team_2, week } = req.body;
    const sql = "INSERT INTO matches (team_1, team_2, week) VALUES (?, ?, ?)";
    db.query(sql, [team_1, team_2, week], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.delete("/matches/delete/:id", (req, res) => {
    const match_id = req.params.id;
    const sql = "DELETE FROM matches WHERE match_id = ?";
    db.query(sql, [match_id], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})


app.listen(3030, () => {
    console.log("listening");
})

//10:55 https://www.youtube.com/watch?v=Q3ixb1w-QaY
