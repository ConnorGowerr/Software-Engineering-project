// All the require functions/api
const { checkHash } = require('./hash.js');
const express = require('express');
const app = express();
const port = 8008;
const {Client} = require('pg');
const cors = require("cors");
require("dotenv").config();


app.use(express.static('public'));

// allows passing of data from front end to back
app.use(cors({
    origin: 'http://localhost:8080' 
}));
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

connection.query(`SET TIME ZONE 'Europe/London';`, async (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("time zone set");
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
        res.status(201).json({ 
            message: "User created successfully", 
            user: result.rows[0]});
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

app.post("/", async (req, res) => {
    
    const {username, password} = req.body;

    try {
        const logIn = await connection.query("SELECT username, password FROM Users WHERE username = $1", [username]);

        if (logIn.rows.length === 0) 
        {
            res.status(404).json({error: "User not found"});
            console.log("User does not exist");
        } else 
        {
            console.log(logIn.rows[0]);
            if (await checkHash(password, logIn.rows[0].password)) 
            {
                console.log("Log in successful");
                res.status(200).json(
                    { 
                        message: "Login successful",
                        username: logIn.rows[0].username
                    });;
                    console.log(logIn.rows[0].username);
            } else 
            {
                console.log("Password does not match existing account");
                res.status(401).json({ message: "Invalid Password" });;
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "There was an error with the server" });
    }
       
})

app.post("/home.html", async (req, res) => {
    
    const {username} = req.body;

    try {
        const dailyCalorie = await connection.query("SELECT SUM(calories * quantity) FROM Meal INNER JOIN MealContents ON Meal.mealID = mealContents.mealID INNER JOIN Food ON MealContents.foodID = Food.foodID WHERE username = $1 AND mealDate = CURRENT_DATE;", [username]);
        const dailyCalorieTarget = await connection.query("SELECT dailyCalorieTarget FROM Users WHERE username = $1", [username]);
        const weeklyGoals = await connection.query("SELECT * FROM Goal LEFT JOIN mealGoal ON goal.goalID = mealGoal.goalID LEFT JOIN exerciseGoal ON goal.goalID = exerciseGoal.goalID WHERE exerciseGoal.username = $1 AND isGoalMet = false AND startDate BETWEEN (CURRENT_DATE - INTERVAL '7 days') AND CURRENT_DATE ORDER BY startDate;", [username])
        const weeklyCompletedGoals = await connection.query("SELECT * FROM Goal LEFT JOIN exerciseGoal ON goal.goalID = exerciseGoal.goalID WHERE exerciseGoal.username = $1 AND isGoalMet = true AND startDate BETWEEN (CURRENT_DATE - INTERVAL '7 days') AND CURRENT_DATE ORDER BY startDate;", [username]);
        if (weeklyGoals.rows.length === 0) 
        {
            if (weeklyCompletedGoals.rows.length === 0) 
            {
                res.status(404).json({error: "Goals not found"});
                console.log("There are no goals for this user");
            }
        }
        if (dailyCalorie.rows.length === 0) 
        {
            res.status(404).json({error: "User not found"});
            console.log("User does not exist");
        } else 
        {
            console.log(dailyCalorie.rows[0]);
            console.log(dailyCalorieTarget.rows[0]);
            if (dailyCalorie.rows[0].sum != null && weeklyGoals.rows[0].weeklyactivity != null) 
            {
                console.log("data retrieved");
                res.status(200).json({ 
                    message: "Data retrieved successfully",
                    type: "activity",
                    calories: dailyCalorie.rows[0].sum,
                    dailyTarget: dailyCalorieTarget.rows[0].dailycalorietarget,
                    userActivity: weeklyGoals.rows[0].weeklyactivity,
                    activityTarget: weeklyGoals.rows[0].targetactivity

                });
            } else if (dailyCalorie.rows[0].sum != null && weeklyGoals.rows[0].currentweight != null) 
            {
                console.log("data retrieved");
                res.status(200).json({ 
                    message: "Data retrieved successfully",
                    type: "weight",
                    calories: dailyCalorie.rows[0].sum,
                    dailyTarget: dailyCalorieTarget.rows[0].dailycalorietarget,
                    currentWeight: weeklyGoals.rows[0].currentweight,
                    targetWeight: weeklyGoals.rows[0].targetweight
                });
            } else if (dailyCalorie.rows[0].sum != null && weeklyCompletedGoals.rows[0].currentweight != null) 
            {
                console.log("data retrieved");
                res.status(200).json({ 
                    message: "Data retrieved successfully",
                    type: "completed",
                    calories: dailyCalorie.rows[0].sum,
                    dailyTarget: dailyCalorieTarget.rows[0].dailycalorietarget,
                    userActivity: weeklyCompletedGoals.rows[0].weeklyactivity,
                    activityTarget: weeklyCompletedGoals.rows[0].targetactivity
                });
            } else 
            {
                console.log("data not retrieved");
                res.status(401).json({ 
                    message: "Error: failure to retrieve data",
                    calories: 0
                    // dailyTarget: dailyCalorieTarget.rows[0].dailycalorietarget
                 });;
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "There was an error with the server" });
    }
       
})

app.get("/groups/:allgroups", async (req, res) => {
    connection.query('SET SEARCH_PATH TO "Hellth", public;', (err) => {
        if (err) {
            console.error("Error setting search path:", err);
            return res;  
        }

        const queryString = `SELECT * FROM userGroups`;
        connection.query(queryString, (err, resp) => {
            if (err) {
                console.error("Database query error:", err);
                return res;
            }
            
            return res.status(200).json(resp.rows);
        })
    })
})