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

app.get('/matches', (req, res) => {
    const sql = "SELECT * FROM matches";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

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

app.listen(3030, () => {
    console.log("listening");
})

//10:55 https://www.youtube.com/watch?v=Q3ixb1w-QaY