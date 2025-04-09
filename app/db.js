const { Client } = require('pg');
require('dotenv').config();

const connection = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

console.log(process.env.DB_HOST)
console.log(process.env.DB_USER)

console.log(process.env.DB_PORT)
console.log(process.env.DB_PASSWORD)
console.log( process.env.DB_NAME)


connection.connect()
    .then(() => console.log("Database connected"))
    .catch(err => console.error("Error connecting to the database:", err.message));

module.exports = connection;
