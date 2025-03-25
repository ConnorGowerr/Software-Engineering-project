const {Client} = require('pg');

const connection = new Client({
    host: "cmpstudb-01.cmp.uea.ac.uk",
    user: "xzs23sbu",
    port: 5432,
    password: "PressAWatch89_",
    database: "xzs23sbu",
})

connection.connect().then(() => console.log("Database is connected"));

connection.query('SET SEARCH_PATH to "Hellth", public;', (err) => {
    if (err) {
        console.log(err.message);
    } else {
        connection.query('SELECT * FROM Food;', (err, res) =>{
            if (!err) {
                console.log(res.rows);
            } else {
                console.log(err.message);
            }
            connection.end();
        });
    }
})
