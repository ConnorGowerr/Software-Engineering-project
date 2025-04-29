// All the require functions/api
const { checkHash } = require('./hash.js');
const express = require('express');;
const dbClient = require('./db.js'); 
const FoodController = require('./FoodController.js');
const UserController = require('./UserController.js');

const app = express();
app.use(express.json()); 
require('dotenv').config();

const port = 8008;
const {Client} = require('pg');
const cors = require("cors");
require("dotenv").config();
const foodController = new FoodController();
const userController = new UserController();



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




// Search food based on query (fetching from DB)
app.get('/api/search-food', (req, res) => {
    const query = req.query.q;
    
    foodController.searchFood(query, (foodData) => {
        res.json(foodData);
    });
});


// reutrn single food item 
app.get('/api/return-food', (req, res) => {
    const query = req.query.q;
    
    foodController.returnFood(query, (foodData) => {
        res.json(foodData);
    });
});

app.get('/api/return-user', (req, res) => {
    const query = req.query.q;
    
    userController.returnUser(query, (userData) => {
        res.json(userData);
    });
});

// recieve a post request with our new meal info 
app.post('/api/meal', express.json(), (req, res) => {
    // console.log(req.body);  

    foodController.saveMeal(req, res);
    
});

// recieve a post request with our new food info
app.post('/api/foodAdd', express.json(), (req, res) => {
  
    foodController.saveFood(req, res);
    
});


app.get('/', (req, res) => {
    res.sendFile('login.html', { root: 'public' }, (err) => {
        if (err) {
            console.log(err);
        }
    });
});

app.get('/achievements', (req, res) => {
    if (!dbClient) {
        return res.status(500).json({ error: 'Database client not initialized' });
    }

    dbClient.query('SET SEARCH_PATH TO "Hellth", public;', (err) => {
        if (err) {
            console.error("Error setting search path:", err);
            return res.status(500).json({ error: "Failed to set database search path" });
        }

        const queryString = 'SELECT * FROM achievements';
        dbClient.query(queryString, (err, result) => {
            if (err) {
                console.error("Error fetching achievements:", err);
                return res.status(500).json({ error: "Failed to fetch achievements" });
            }
            res.status(200).json(result.rows);
        });
    });
});


app.get('/meal', (req, res) => {
    if (!dbClient) {
        return res.status(500).json({ error: 'Database client not initialized' });
    }

    dbClient.query('SET SEARCH_PATH TO "Hellth", public;', (err) => {
        if (err) {
            console.error("Error setting search path:", err);
            return res.status(500).json({ error: "Failed to set database search path" });
        }

        const queryString = 'SELECT * FROM food';
        dbClient.query(queryString, (err, result) => {
            if (err) {
                console.error("Error fetching meal:", err);
                return res.status(500).json({ error: "Failed to fetch achievements" });
            }
            res.status(200).json(result.rows);
        });
    });
});



// allows server to wait on the correct port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


/* When using this yourself make sure to create a file called .env and then type in it

DB_USERNAME="YOUR UEA USERNAME HERE"
DB_PASSWORD="YOUR DB PASSWORD HERE"

make sure to also be connected to vpn
*/
// sets the db connection to the correct schema
/* Receives the data from the post request sent by the signup page and attemps to insert the data into the database into the user table


sets the status code based on whether the action was successful or not
*/
app.post("/signup", async (req, res) => {
    
    const {username, password, dailyCalorieTarget, email, realName, dob, height, weight, gender, imperialMetric} = req.body;

    try {
        const createAccount = `INSERT INTO Users (username, password, dailyCalorieTarget, email, realName, dob, creationDate, lastLogIn, height, weight, gender, isAdmin, imperialMetric)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, CURRENT_TIMESTAMP, $7, $8, $9, false, $10)`;

        const values = [username, password, dailyCalorieTarget, email, realName, dob, height, weight, gender, imperialMetric];
        
        const result = await dbClient.query(createAccount, values);
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

    if (!dbClient) {
        return res.status(500).json({ error: 'Database client not initialized' });
    }
    try {
        if (username) 
        {
            const searchUser = await dbClient.query("SELECT username FROM users WHERE username = $1", [username]);

            if (searchUser.rows.length === 0) 
            {
                res.status(404).json({error: "User not found"});
            }
            res.status(200).json(searchUser.rows[0]);
        }
        if (email) 
        {
            const searchEmail = await dbClient.query("SELECT email FROM users WHERE email = $1", [email]);

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
    const { username, password } = req.body;

    try {
        // Set the search path
        await dbClient.query('SET SEARCH_PATH TO "Hellth", public;');

        // Query the user
        const logIn = await dbClient.query(
            "SELECT username, password FROM Users WHERE username = $1",
            [username]
        );

        if (logIn.rows.length === 0) {
            console.log("User does not exist");
            return res.status(404).json({ error: "User not found" });
        }

        const user = logIn.rows[0];
        console.log(user);

        if (await checkHash(password, user.password)) {
            console.log("Log in successful");
            console.log(user.username);
            return res.status(200).json({
                message: "Login successful",
                username: user.username
            });
        } else {
            console.log("Password does not match existing account");
            return res.status(401).json({ message: "Invalid Password" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "There was an error with the server" });
    }
});


app.post("/home.html", async (req, res) => {
    const { username } = req.body;

    try {
        var challengeFound = "none";
        var challengeUnit = "N/A";
        var challengeCurrent = "N/A";
        var challengeTarget = "N/A";
        var challengeTargetTitle = "N/A";
        var challengeTitle = "You have no active challenges";
        var challengeEnd = "N/A";
        

        const dailyCalorie = await connection.query("SELECT SUM(calories * quantity) FROM Meal INNER JOIN MealContents ON Meal.mealID = mealContents.mealID INNER JOIN Food ON MealContents.foodID = Food.foodID WHERE username = $1 AND mealDate = CURRENT_DATE;", [username]);
        const dailyCalorieTarget = await connection.query("SELECT dailyCalorieTarget FROM Users WHERE username = $1", [username]);
        const weeklyGoals = await connection.query("SELECT * FROM Goal LEFT JOIN exerciseGoal ON goal.goalID = exerciseGoal.goalID WHERE exerciseGoal.username = $1 AND isGoalMet = false AND startDate BETWEEN (CURRENT_DATE - INTERVAL '7 days') AND CURRENT_DATE ORDER BY startDate;", [username])
        const weeklyCompletedGoals = await connection.query("SELECT * FROM Goal LEFT JOIN exerciseGoal ON goal.goalID = exerciseGoal.goalID WHERE exerciseGoal.username = $1 AND isGoalMet = true AND startDate BETWEEN (CURRENT_DATE - INTERVAL '7 days') AND CURRENT_DATE ORDER BY startDate;", [username]);
        const mealChallenge = await connection.query("SELECT MealChallenge.goalId, MealChallenge.groupID, MealChallenge.currentCalories, MealChallenge.calorieTarget, Goal.goalName, Goal.startDate, Goal.endDate FROM MealChallenge LEFT JOIN Goal ON Goal.goalID = MealChallenge.GoalID LEFT JOIN userGroups ON userGroups.groupID = MealChallenge.groupID LEFT JOIN groupMembers ON groupMembers.groupID = MealChallenge.groupID WHERE groupMembers.username = $1 AND  Goal.startDate <= CURRENT_DATE AND Goal.isGoalMet = 'false' AND Goal.endDate > CURRENT_DATE ORDER BY Goal.endDate;", [username]);
        const exerciseChallenge = await connection.query("SELECT ExerciseChallenge.goalId, ExerciseChallenge.groupID, ExerciseChallenge.caloriesBurnt, ExerciseChallenge.targetCaloriesBurnt, Goal.goalName, Goal.startDate, Goal.endDate FROM ExerciseChallenge LEFT JOIN Goal ON Goal.goalID = ExerciseChallenge.GoalID LEFT JOIN userGroups ON userGroups.groupID = ExerciseChallenge.groupID LEFT JOIN groupMembers ON groupMembers.groupID = ExerciseChallenge.groupID WHERE groupMembers.username = $1 AND  Goal.startDate <= CURRENT_DATE AND Goal.isGoalMet = 'false' AND Goal.endDate > CURRENT_DATE ORDER BY Goal.endDate;", [username]);
        if (weeklyGoals.rows.length === 0) 
        {
            weeklyGoals = await connection.query("SELECT * FROM Goal LEFT JOIN mealGoal ON goal.goalID = mealGoal.goalID WHERE mealGoal.username = $1 AND isGoalMet = false AND startDate BETWEEN (CURRENT_DATE - INTERVAL '7 days') AND CURRENT_DATE ORDER BY startDate;", [username])
            if (weeklyCompletedGoals.rows.length === 0) 
            {
                res.status(404).json({error: "Goals not found"});

                console.log("There are no goals for this user");
                return res.status(404).json({ error: "Goals not found" });
            }
        }
        if (mealChallenge.rows.length === 0) 
        {
            if (exerciseChallenge.rows.length === 0) 
            {
                console.log("There are no challenges for this user");
            } else 
            {
                challengeFound = "exercise";
            }
        } else 
        {
            challengeFound = "meal";
        }
        if (dailyCalorieTarget.rows.length === 0) 
        {
            res.status(404).json({error: "No data found"});
            console.log("User does not exist");
        } else 
        {
            if (challengeFound == "meal") 
            {
                challengeUnit = "Calories";
                challengeTarget = mealChallenge.rows[0].calorietarget;
                challengeCurrent = mealChallenge.rows[0].currentcalories;
                challengeTargetTitle = "Target Calories Eaten";
                challengeTitle = mealChallenge.rows[0].goalname;
                challengeEnd = mealChallenge.rows[0].enddate;

            } else if (challengeFound == "exercise") 
            {
                challengeUnit = "Calories";
                challengeTarget = exerciseChallenge.rows[0].targetcaloriesburnt;
                challengeCurrent = exerciseChallenge.rows[0].caloriesburnt;
                challengeTargetTitle = "Target Calories Burned";
                challengeTitle = exerciseChallenge.rows[0].goalname;
                challengeEnd = mealChallenge.rows[0].enddate;
            }
            if (dailyCalorie.rows[0].sum != null && weeklyGoals.rows[0].weeklyactivity != null) 
            {
                console.log("data retrieved");
                res.status(200).json({ 
                    message: "Data retrieved successfully",
                    type: "activity",
                    calories: dailyCalorie.rows[0].sum,
                    dailyTarget: dailyCalorieTarget.rows[0].dailycalorietarget,
                    userActivity: weeklyGoals.rows[0].weeklyactivity,
                    activityTarget: weeklyGoals.rows[0].targetactivity,
                    challengeU: challengeUnit,
                    challengeTarg: challengeTarget,
                    challengeC: challengeCurrent,
                    challengeTargetT: challengeTargetTitle,
                    challengeT: challengeTitle,
                    challengeE: challengeEnd

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
                    targetWeight: weeklyGoals.rows[0].targetweight,
                    startWeight: weeklyGoals.rows[0].startweight,
                    challengeU: challengeUnit,
                    challengeTarg: challengeTarget,
                    challengeC: challengeCurrent,
                    challengeTargetT: challengeTargetTitle,
                    challengeT: challengeTitle,
                    challengeE: challengeEnd
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
                    activityTarget: weeklyCompletedGoals.rows[0].targetactivity,
                    challengeU: challengeUnit,
                    challengeTarg: challengeTarget,
                    challengeC: challengeCurrent,
                    challengeTargetT: challengeTargetTitle,
                    challengeT: challengeTitle,
                    challengeE: challengeEnd
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
});

