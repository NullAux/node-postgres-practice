const format = require("pg-format")
const db = require("./initial-use")

//Setting up a practise database (copied from inital-use)
//Consider refactoring to async/await. Unsure if back-to-back queries within on then is reliable, but seems to work.
db.getClient()
.then((client) => {
    client.query('DROP TABLE IF EXISTS my_second_table')
    client.query('CREATE TABLE my_second_table (country_id SERIAL PRIMARY KEY, name VARCHAR(20), capital VARCHAR(20))')

    return client
})
.then((client) => {
    //...but now using pg-format to insert the data

    //Add the data from an array
    const data = [
    ['France', 'Paris'],
    ['Germany', 'Berlin'],
    ['Portugal', 'Lisbon']
    ]

    const formattedData = format('INSERT INTO my_second_table (name, capital) VALUES %L', data)
    //console.log(formattedData)

    result = client.query(formattedData)
    
    return Promise.all([client, result])
})
.then(([client, result]) => {
    console.log(result.rows, '<- Check data formatted by pg-format')//Result {command: 'INSERT', rowCount: 3...}

    //Get just the first entry of named row - based on example from https://www.npmjs.com/package/pg-format
    const SQLString = format('SELECT %I FROM %I %s', 'name', 'my_second_table', 'LIMIT 1')
    result = client.query(SQLString)

    return Promise.all([client, result])
})
.then(([client, result]) => {

    console.log(result.rows, "<- Get just the first entry of named column")

    client.release()
})

