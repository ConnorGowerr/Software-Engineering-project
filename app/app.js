// All the require functions/api
const express = require('express')
const app = express();
const port = 8008;
const {Client} = require('pg');
const cors = require("cors");
require("dotenv").config();

app.use(express.static('public'));

// allows passing of data from front end to back
app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>  {
    //sends the static file (login page) once server is run to port 8008
    res.sendFile('login.html', {root: 'public'}, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

app.get('/signup', (req, res) =>  {
    res.sendFile('signup.html', {root: 'public'}, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

// allows server to wait on the correct port
app.listen(port, () => {
    console.log(`Server waiting response on port ${port}`)
});


/* When using this yourself make sure to create a file called .env and then type in it

DB_USERNAME="YOUR UEA USERNAME HERE"
DB_PASSWORD="YOUR DB PASSWORD HERE"

make sure to also be connected to vpn
*/
const connection = new Client({
    host: "cmpstudb-01.cmp.uea.ac.uk",
    user: process.env.DB_USERNAME,
    port: 5432,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_USERNAME,
})



connection.connect().then(() => console.log("Database is connected")).catch(err => console.error("Database failed to connect", err.message));

// sets the db connection to the correct schema
connection.query('SET SEARCH_PATH to "Hellth", public;', async (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("yipee search path found");
    }
})

/* Receives the data from the post request sent by the signup page and attemps to insert the data into the database into the user table


sets the status code based on whether the action was successful or not
*/
app.post("/signup", async (req, res) => {
    
    const {username, password, dailyCalorieTarget, email, realName, dob, height, weight, gender, imperialMetric} = req.body;

    try {
        const createAccount = `INSERT INTO Users (username, password, dailyCalorieTarget, email, realName, dob, creationDate, lastLogIn, height, weight, gender, isAdmin, imperialMetric)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, CURRENT_TIMESTAMP, $7, $8, $9, false, $10)`;

        const values = [username, password, dailyCalorieTarget, email, realName, dob, height, weight, gender, imperialMetric];
        
        const result = await connection.query(createAccount, values);
        res.status(201).json({ message: "User created successfully", user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "There was an error with the server" });
    }
       
})

app.get("/signup/:check", async (req, res) => {
    
    const {username, email} = req.query;
    try {
        if (username) 
        {
            const searchUser = await connection.query("SELECT username FROM Users WHERE username = $1", [username]);

            if (searchUser.rows.length === 0) 
            {
                res.status(404).json({error: "User not found"});
            }
            res.status(200).json(searchUser.rows[0]);
        }
        if (email) 
        {
            const searchEmail = await connection.query("SELECT email FROM Users WHERE email = $1", [email]);

            if (searchEmail.rows.length === 0) 
            {
                res.status(404).json({error: "Email not found"});
            }
            res.status(200).json(searchEmail.rows[0]);
        }
        
        
    } catch (error) {
        
        if (username) 
        {
            console.error("There was an error searching for users", error);
            res.status(500).json({ error: "There was an error with the server" });
        }
        if (email) 
        {
            console.error("There was an error searching for email", error);
            res.status(500).json({ error: "There was an error with the server" });
        }
    }
       
})

