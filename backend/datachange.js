const mysql = require('mysql2')
const p = require('pokeapi-js-wrapper')
const dex = new p.Pokedex();

const db = mysql.createConnection({
    host: "localHost",
    user: 'root',
    password: "Cubicle*2022",
    database: 'cubicleData'

})

let sql = "SELECT * FROM Pokemon;"
let num = [21, 29, 30, 32, 33, 41, 48, 70, 72, 79, 100, 120, 158, 167, 175, 192, 193, 194, 202, 209, 216, 218, 220, 236, 238, 252, 255, 263, 265, 276, 278, 283, 287, 288, 293, 320, 325, 328, 329, 333, 360, 361, 363, 387, 396, 397, 434, 451, 459, 495, 498, 505, 520, 527, 532, 535, 541, 543, 544, 562, 564, 568, 570, 577, 581, 582, 583, 602, 629, 634, 665, 682, 684, 690, 696, 705, 716, 717, 732, 734, 759, 762, 767, 791, 816, 819, 831, 848, 872, 888, 889, 892, 906, 938, 948, 958, 960, 965];
let count = 0;

//First query to get the list of names in an array
db.query(sql, async (err,data)=> {
        if(err) return err;
        //need for loop
        //need to store the database in a list
        //two queries
        //one to get name and one to put the data back
        for(let i = 0;i<num.length;i++){
            const name = num[i];
            console.log(name);
            fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Pokemon not found');
                        }
                        return response.json();
                    })
                    .then(pokemonData => {
                        // The 'id' property is the National Pokédex number
                        const dexNumber = pokemonData.id;
                        db.query("INSERT INTO pokemon (NamePoke, PointValue, ID) VALUES ('" + pokemonData.name + "',0," + dexNumber + ");", function (err, result) {
                if (err) throw err;
                console.log(result);
            })
                        console.log(`${pokemonData.name}: Dex Number #${dexNumber}`);
                    })
                    .catch(error => console.error(error));
        }
        console.log(num);
    })
//for(let i = 0;i<pokelist.length;i++){
    //let response = fetch("https://pokeapi.co/api/v2/pokemon/" + pokelist[i].NamePoke);
   // console.log(pokelist[i]);
//}
//Loop through array and assign numbers to names
//Fetch("https://pokeapi.co/api/v2/{name}")

/*
        */