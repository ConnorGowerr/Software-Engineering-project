// All the require functions/api
const { checkHash } = require('./hash.js');
const express = require('express');;
const dbClient = require('./db.js'); 
const FoodController = require('./FoodController.js');
const ExerciseController = require('./ExerciseController.js');
const Food = require('./Food.js');
const UserController = require('./UserController.js');
const { randomInt } = require('crypto');

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

// app.get('/signup', (req, res) =>  {
//     res.sendFile('signup.html', {root: 'public'}, (err) => {
//         if(err) {
//             console.log(err);
//         }
//     })
// });

const exerciseController = new ExerciseController();



// Search food based on query (fetching from DB)
app.get('/api/search-food', (req, res) => {
    const query = req.query.q;
    
    foodController.searchFood(query, (foodData) => {
        res.json(foodData);
    });
});

// Search exercise based on query
app.get('/api/search-exercise', (req, res) => {
    const query = req.query.q;
    
    exerciseController.searchExercise(query, (exerciseData) => {
        res.json(exerciseData);
    });
});



// reutrn single food item 
app.get('/api/return-food', (req, res) => {
    const query = req.query.q;
    
    foodController.returnFood(query, (foodData) => {
        res.json(foodData);
    });
});


// return single exercise
app.get('/api/return-exercise', (req, res) => {
    const query = req.query.q;
    
    foodController.returnExercise(query, (exerciseData) => {
        res.json(exerciseData);
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

//set a groups status.
app.post('/api/groups/:id/status', express.json(), (req, res) => {
    console.log('Received request to update group status', req.body);
    userController.updateGroupStatus(req, res);
});

//send invite to a user from a certain group.
app.post('/api/groups/:groupId/invite', (req, res) => {
    console.log('Received request to invite user', req.body);

    userController.sendInvite(req, res);
});

//confirm user invitation.
app.get('/api/groups/confirm/:groupId', (req, res) => {
    console.log('Received request to confirm user', req.body);

    userController.confirmInvite(req, res);
});

//make user into an admin from a certain group
app.post('/api/group/admin', (req, res) => {
    console.log('Received request to confirm user to admin', req.body);

    userController.confirmAdmin(req, res);
});

//remove user from group
app.post('/api/group/removeUser', (req, res) => {
    console.log('Received request to remove user', req.body);

    userController.removeUserFromGroup(req, res);
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
    
        const getTablesQuery = `
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'Hellth' AND table_type = 'BASE TABLE';
        `;
    
        dbClient.query(getTablesQuery, async (err, tablesResult) => {
            if (err) {
                console.error("Error fetching table names:", err);
                return res.status(500).json({ error: "Failed to fetch table names" });
            }
    
            const tableNames = tablesResult.rows.map(row => row.table_name);
            const allData = {};
    
            try {
                for (const table of tableNames) {
                    const tableResult = await dbClient.query(`SELECT * FROM "Hellth"."${table}"`);
                    allData[table] = tableResult.rows;
                }
                res.status(200).json(allData);
            } catch (fetchErr) {
                console.error("Error fetching table data:", fetchErr);
                res.status(500).json({ error: "Failed to fetch data from all tables" });
            }
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
dbClient.query('SET SEARCH_PATH to "Hellth", public;', async (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("yipee search path found");
    }
})

dbClient.query(`SET TIME ZONE 'Europe/London';`, async (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("time zone set");
    }
})


// sets the db connection to the correct schema

/* Receives the data from the post request sent by the signup page and attemps to insert the data into the database into the user table


sets the status code based on whether the action was successful or not
*/
app.post("/signup", async (req, res) => {
    
    const {username, password, dailyCalorieTarget, email, realName, dob, height, weight, gender, imperialMetric} = req.body;

    try {
        const createAccount = `INSERT INTO "Hellth"."users" (username, password, dailyCalorieTarget, email, realName, dob, creationDate, lastLogIn, height, weight, gender, isAdmin, imperialMetric)
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
            const searchUser = await dbClient.query('SELECT username FROM "Hellth"."users" WHERE username = $1', [username]);

            if (searchUser.rows.length === 0) 
            {
                res.status(404).json({error: "User not found"});
            }
            res.status(200).json(searchUser.rows[0]);
        }
        if (email) 
        {
            const searchEmail = await dbClient.query('SELECT email FROM "Hellth"."users" WHERE email = $1', [email]);


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
            const goals = await dbClient.query
            (
                "SELECT * FROM ExerciseGoal INNER JOIN Goal ON Goal.goalid = ExerciseGoal.goalid WHERE ExerciseGoal.username = $1 AND Goal.isgoalmet = false AND Goal.startdate BETWEEN (CURRENT_DATE - INTERVAL '7 days') AND CURRENT_DATE;", [username]
            );
            if (goals.rows.length === 0) 
            {
                var valid = false;
                var id = randomInt(1000000);
                while (!valid) 
                {
                    const checkValidID = await dbClient.query 
                (
                    `SELECT * FROM Goal WHERE goalid = $1;`, [id]
                );
                if (checkValidID.rows.length === 0) 
                {
                    valid = true;
                } else 
                {
                    id = randomInt(1000000);
                }
                }
                
                const addGoal = await dbClient.query 
                (
                    "INSERT INTO Goal (goalid, goalname, startdate, enddate, isgoalmet, points) VALUES ($1, 'Weekly Activity', CURRENT_DATE, (CURRENT_DATE + INTERVAL '7 days'), false, 100);", [id]
                );
                const addEGoal = await dbClient.query
                (
                    `INSERT INTO ExerciseGoal (goalid, username, caloriesburnt, targetactivity, weeklyactivity) VALUES ($1, $2, 0, 180, 0)`, [id, username]
                );
            }
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

app.get("/groups/:allgroups", async (req, res) => {
    dbClient.query('SET SEARCH_PATH TO "Hellth", public;', (err) => {
        if (err) {
            console.error("Error setting search path:", err);
            return res;  
        }

        const queryString = `SELECT * FROM userGroups`;
        dbClient.query(queryString, (err, resp) => {
            if (err) {
                console.error("Database query error:", err);
                return res;
            }
            
            return res.status(200).json(resp.rows);
        })
    })
})

app.get('/group/:groupname', (req, res) => {
    res.sendFile(__dirname + '/public/group.html');
});



app.get('/api/groups/:groupname', (req, res) => {
    const groupname = decodeURIComponent(req.params.groupname);

    dbClient.query('SET SEARCH_PATH TO "Hellth", public;', (err) => {
        if (err) {
            console.error("Error setting search path:", err);
            return res.status(500).json({ error: "Failed to set database schema" });
        }
            
        dbClient.query('SELECT * FROM usergroups WHERE groupname = $1', [groupname], (err, result) => {
            if (err) {
                console.error("DB error:", err);
                return res.status(500).json({ error: "DB query failed" });
            }
            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Group not found" });
            }
            res.json(result.rows[0]);
        });
    });
});


app.get("/api/groupMembers/:id", (req, res) => {
    const groupId = req.params.id;

    dbClient.query('SET SEARCH_PATH TO "Hellth", public;', (err) => {
        if (err) {
            console.error("Error setting search path:", err);
            return res.status(500).json({ error: "Failed to set database schema" });
        }

        dbClient.query('SELECT * FROM groupmembers WHERE groupid = $1', [groupId], (err, result) => {
            if (err) {
                console.error("DB error:", err);
                return res.status(500).json({ error: "DB query failed" });
            }

    
            res.json(result.rows);
        });
    });
});


app.post("/home.html", async (req, res) => {
    const { username } = req.body;
    console.log(username)

    try {

        var dCalories = 0;
        var challengeFound = "none";
        var challengeUnit = "N/A";
        var challengeCurrent = "N/A";
        var challengeTarget = "N/A";
        var challengeTargetTitle = "N/A";
        var challengeTitle = "You have no active challenges";
        var challengeEnd = "N/A";

        const dailyCalorie = await dbClient.query(`
            SELECT SUM(calories * quantity)
            FROM "Hellth".meal
            INNER JOIN "Hellth".mealcontents ON meal.mealid = mealcontents.mealid
            INNER JOIN "Hellth".food ON mealcontents.foodid = food.foodid
            WHERE username = $1 AND mealdate = CURRENT_DATE;
        `, [username]);
            console.log(dailyCalorie);
        const dailyCalorieTarget = await dbClient.query(`
            SELECT dailycalorietarget
            FROM "Hellth".users
            WHERE username = $1;
        `, [username]);
            console.log(dailyCalorieTarget.rows[0].dailycalorietarget);
        let weeklyGoals = await dbClient.query(`
            SELECT *
            FROM "Hellth".goal
            LEFT JOIN "Hellth".exercisegoal ON goal.goalid = exercisegoal.goalid
            WHERE exercisegoal.username = $1 AND isgoalmet = false
            AND startdate BETWEEN (CURRENT_DATE - INTERVAL '7 days') AND CURRENT_DATE
            ORDER BY startdate;
        `, [username]);

        const weeklyCompletedGoals = await dbClient.query(`
            SELECT *
            FROM "Hellth".goal
            LEFT JOIN "Hellth".exercisegoal ON goal.goalid = exercisegoal.goalid
            WHERE exercisegoal.username = $1 AND isgoalmet = true
            AND startdate BETWEEN (CURRENT_DATE - INTERVAL '7 days') AND CURRENT_DATE
            ORDER BY startdate;
        `, [username]);

        const mealChallenge = await dbClient.query(`
            SELECT mealchallenge.goalid, mealchallenge.groupid, mealchallenge.currentcalories,
                   mealchallenge.calorietarget, goal.goalname, goal.startdate, goal.enddate
            FROM "Hellth".mealchallenge
            LEFT JOIN "Hellth".goal ON goal.goalid = mealchallenge.goalid
            LEFT JOIN "Hellth".usergroups ON usergroups.groupid = mealchallenge.groupid
            LEFT JOIN "Hellth".groupmembers ON groupmembers.groupid = mealchallenge.groupid
            WHERE groupmembers.username = $1 AND goal.startdate <= CURRENT_DATE
            AND goal.isgoalmet = false AND goal.enddate > CURRENT_DATE
            ORDER BY goal.enddate;
        `, [username]);

        const exerciseChallenge = await dbClient.query(`
            SELECT exercisechallenge.goalid, exercisechallenge.groupid, exercisechallenge.caloriesburnt,
                   exercisechallenge.targetcaloriesburnt, goal.goalname, goal.startdate, goal.enddate
            FROM "Hellth".exercisechallenge
            LEFT JOIN "Hellth".goal ON goal.goalid = exercisechallenge.goalid
            LEFT JOIN "Hellth".usergroups ON usergroups.groupid = exercisechallenge.groupid
            LEFT JOIN "Hellth".groupmembers ON groupmembers.groupid = exercisechallenge.groupid
            WHERE groupmembers.username = $1 AND goal.startdate <= CURRENT_DATE
            AND goal.isgoalmet = false AND goal.enddate > CURRENT_DATE
            ORDER BY goal.enddate;
        `, [username]);

        if (weeklyGoals.rows.length === 0) {
            weeklyGoals = await dbClient.query(`
                SELECT *
                FROM "Hellth".goal
                LEFT JOIN "Hellth".mealgoal ON goal.goalid = mealgoal.goalid
                WHERE mealgoal.username = $1 AND isgoalmet = false
                AND startdate BETWEEN (CURRENT_DATE - INTERVAL '7 days') AND CURRENT_DATE
                ORDER BY startdate;
            `, [username]);

            if (weeklyCompletedGoals.rows.length === 0) {
                console.log("There are no goals for this user");
                // return res.status(404).json({ error: "Goals not found" });
            }
        }

        if (mealChallenge.rows.length === 0) {
            if (exerciseChallenge.rows.length === 0) {
                console.log("There are no challenges for this user");
            } else {
                challengeFound = "exercise";
            }
        } else {
            challengeFound = "meal";
        }
        if (dailyCalorieTarget.rows.length === 0) {
            console.log("User does not exist");

            return res.status(404).json({ error: "No data found" });
        }
        if (dailyCalorie.rows[0].sum === null) 
        {
            console.log("No meals entered today")
        } else 
        {
            dCalories = dailyCalorie.rows[0].sum;
        }


        if (challengeFound == "meal") {
            challengeUnit = "Calories";
            challengeTarget = mealChallenge.rows[0].calorietarget;
            challengeCurrent = mealChallenge.rows[0].currentcalories;
            challengeTargetTitle = "Target Calories Eaten";
            challengeTitle = mealChallenge.rows[0].goalname;
            challengeEnd = mealChallenge.rows[0].enddate;

        } else if (challengeFound == "exercise") {
            challengeUnit = "Calories";
            challengeTarget = exerciseChallenge.rows[0].targetcaloriesburnt;
            challengeCurrent = exerciseChallenge.rows[0].caloriesburnt;
            challengeTargetTitle = "Target Calories Burned";
            challengeTitle = exerciseChallenge.rows[0].goalname;
            challengeEnd = exerciseChallenge.rows[0].enddate;
        }

        if (weeklyGoals.rows[0].weeklyactivity != null) {
            return res.status(200).json({
                message: "Data retrieved successfully",
                type: "activity",
                calories: dCalories,
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
        } else if (weeklyGoals.rows[0].currentweight != null) {
            return res.status(200).json({
                message: "Data retrieved successfully",
                type: "weight",
                calories: dCalories,
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
        } else if (weeklyCompletedGoals.rows[0].currentweight != null) {
            return res.status(200).json({
                message: "Data retrieved successfully",
                type: "completed",
                calories: dCalories,
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
        } else {
            return res.status(401).json({
                message: "Error: failure to retrieve data",
                calories: 0
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "There was an error with the server" });
    }
       
})

app.get("/groups/:allgroups", async (req, res) => {
    connection.query('SET SEARCH_PATH TO "Hellth", public;', (err) => {
        if (err) {
            console.error("Error setting search path:", err);
            return res;  
        }

        const queryString = `SELECT * FROM userGroups`;
        // const queryMembers = `SELECT username FROM Users LEFT JOIN userGroups.username ON Users.username WHERE userGroups.groupname = "group name here"`;
        connection.query(queryString, (err, resp) => {
            if (err) {
                console.error("Database query error:", err);
                return res;
            }
            // console.table(resp.rows);
            return res.status(200).json(resp.rows);
            
        })
    })
})


app.post('/api/goals', async (req, res) => {
  const { username } = req.body;
  try {
    const result = await dbClient.query('SELECT * FROM "Hellth".mealgoal WHERE username = $1', [username]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});
