//Creating / adding to tables, the long way

//The example from the node-postgres docs (see https://node-postgres.com/):
const pg = require("pg")
const {Client, Pool} = pg

const client = new Client({
    database: 'node_postgres_practice_db'//< local DB I created empty for this project
})
client.connect()
.then(() => {
    const result = client.query('SELECT $1::text as message', ['Hello World!'])
    return result
})
.then((result) => {
    console.log(result.rows[0].message)
    client.end()
})

//Trying out postgreSQL commands:
//First, a pool, since I'll be doing a bunch of these and don't want thens to wait for each to finish
const pool = new Pool({
    database: 'node_postgres_practice_db'
})

//Then connect, using callbacks
pool.connect()
.then((client) => {
    const result = client.query('SELECT table_name FROM information_schema.tables WHERE table_schema=\'public\' AND table_type=\'BASE TABLE\'')
    return Promise.all([result, client])
})
.then(([result, client]) => {
    console.log(result)
    client.release()
})

//Now, let's start working with tables
pool.connect()
.then((client) => {
    client.query('DROP TABLE IF EXISTS my_first_table')
    client.query('CREATE TABLE my_first_table (country_id SERIAL PRIMARY KEY, name VARCHAR(20), capital VARCHAR(20))')
    client.query('INSERT INTO my_first_table (name, capital) VALUES (\'France\', \'Paris\'), (\'Germany\', \'Berlin\'), (\'Portgual\', \'Lisbon\')')
    result = client.query('SELECT * FROM my_first_table')
    return Promise.all([result, client])
})
.then(([result, client]) => {
    console.log(result.rows)
    client.release()
})

//Finally, let's set up the suggested code structure from the docs (see https://node-postgres.com/guides/project-structure)
const query = (text, params, callback) => 
{
    //diagnostic info
    return pool.query(text, params, callback)
}

const getClient = () => 
{
    return pool.connect()
}

module.exports = {query, getClient}