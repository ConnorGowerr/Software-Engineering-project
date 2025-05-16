require('dotenv').config();
const { Client } = require('pg');

const connection = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});



connection.connect()
    .then(() => console.log("Database connected"))
    .catch(err => console.error("Error connecting to the database:", err));

module.exports = connection;
