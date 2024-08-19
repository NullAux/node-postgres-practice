const format = require("pg-format")
const pg = require("pg")//< Using this instead of suggested structure as this project is full of console.logs

const pool = new pg.Pool({
    database: 'node_postgres_practice_db' 
})

//Util functions, using pg-format
function dropTable() {
    return pool.query('DROP TABLE IF EXISTS seed_practice_table')
}

function createTable() {
    return pool.query('CREATE TABLE seed_practice_table (id SERIAL PRIMARY KEY, name VARCHAR(50))')
}

//Create and seed the table
async function seedTable() {

    //...Using arrays
    await dropTable()
    await createTable()

    const arrayData = 
    [
        ['Alpha'],
        ['Beta'],
        ['Gamma'],
        [{objectKey: 'objectValue'}]
    ]

    await pool.query(format('INSERT INTO seed_practice_table (name) VALUES %L', arrayData))
    console.log((await pool.query('SELECT * FROM seed_practice_table')).rows)

    //...Using JSON object
    await dropTable()
    await createTable()
    await pool.query('ALTER TABLE seed_practice_table ADD type VARCHAR(50), ADD jsonObj JSON')

    //Pokemon in form name : type
    const JSONData = {
        'Bulbasaur' : 'Grass',
    }

    const queryString = format("INSERT INTO seed_practice_table (name, type, jsonObj) VALUES (%L, %L, %L)", Object.keys(JSONData)[0], JSONData.Charmander, JSONData)
    console.log(queryString)
    await pool.query(queryString)
    console.log((await pool.query('SELECT * FROM seed_practice_table')).rows)


    //Now again, only using loops to add all
    await dropTable()
    await createTable()
    await pool.query('ALTER TABLE seed_practice_table ADD type VARCHAR(50), ADD jsonObj JSON')

    const JSONDataForLoop = {
        'Bulbasaur' : 'Grass',
        'Charmander': 'Fire',
        'Squirtle': 'Water'
    }

    for (pokemon in JSONDataForLoop)
    {
        const queryString = format("INSERT INTO seed_practice_table (name, type, jsonObj) VALUES (%L, %L, %L)", pokemon, JSONDataForLoop[pokemon], JSONDataForLoop)
        await pool.query(queryString)
    }

    console.log((await pool.query('SELECT * FROM seed_practice_table')).rows)

    //Alternate way, to update the table using queries directly with a JSON already in the table
    //await pool.query("UPDATE seed_practice_table SET type = jsonobj -> 'Bulbasaur' WHERE id = 1")
    //console.log((await pool.query('SELECT * FROM seed_practice_table')).rows)
}

await seedTable()
pool.end()