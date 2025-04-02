const { Client } = require('pg');

const connection = new Client({
    host: "cmpstudb-01.cmp.uea.ac.uk",
    user: "xzs23sbu",
    port: 5432,
    password: "PressAWatch89_",
    database: "xzs23sbu",
});

connection.connect()
    .then(() => console.log("Database connected"))
    .catch(err => console.error("Error connecting to the database:", err.message));

module.exports = connection;
