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

app.post('/auth', (req, res) => {
    // Capture the input fields
    let username = req.body.username;
    let password = req.body.password;
    // Ensure the input fields exists and are not empty
    if (username && password) {
        // Execute SQL query that'll select the account from the database based on the specified username and password
        db.query('SELECT * FROM accounts WHERE username = ?', [username], async (err, results) => {
            if (results.length > 0) {
                const match = await bcrypt.compare(password, results[0].password);
                if (match) {
                    req.session.loggedin = true;
                    req.session.username = username;
                    res.send('Logged in successfully!');
                } else {
                    res.send('Incorrect Username and/or Password!');
                }
            }
        });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
});

app.get('/auth/status', (req, res) => {
    if (req.session.loggedin) {
        res.json({
            loggedin: true,
            username: req.session.username
        });
    } else {
        res.json({
            loggedin: false
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
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.json(err);
        db.query('INSERT INTO accounts (username, password) VALUES (?, ?)', [username, hash], (err, results) => {
            if (err) return res.json(err);
            return res.json(results);
        });
    })
})

app.listen(3030, () => {
    console.log("listening");
})

//10:55 https://www.youtube.com/watch?v=Q3ixb1w-QaY