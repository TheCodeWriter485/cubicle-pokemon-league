//server.js
//connects to future pokemon database to pull pokemon, teams and matches out

const express = require('express');
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(cors())

const db = mysql.createConnection({
    host: "localHost",
    user: 'root',
    password: "Cubicle*2022",
    database: 'cubicleData'

})

app.get('/', (re,res)=> {
    return res.json("From backend side");

}) 

app.get('/pokedata', (req,res)=> {
    const sql = " SELECT * FROM Pokemon"
    db.query(sql, (err,data)=> {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.listen(3030, ()=> {
    console.log("listening");
})

//10:55 https://www.youtube.com/watch?v=Q3ixb1w-QaY