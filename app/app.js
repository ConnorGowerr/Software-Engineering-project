require('dotenv').config();
const {Client} = require('pg');
// All the require functions/api
const { checkHash } = require('./hash.js');
const express = require('express');;
const dbClient = require('./db.js');
const FoodController = require('./FoodController.js');
const ExerciseController = require('./ExerciseController.js');
const Food = require('./Food.js');
const UserController = require('./UserController.js');
const { randomInt } = require('crypto');
const bodyParser = require('body-parser');
const pool = require('./db');
const nodemailer = require('nodemailer');

const app = express();

app.use(express.json());
require('dotenv').config();

const port = 8008;
const cors = require("cors");
require("dotenv").config();

const userController = new UserController();


app.use(express.static('public'));

// allows passing of data from front end to back
app.use(cors({
    origin: 'http://localhost:8080'
}));
app.use(express.json());


app.get('/', (req, res) => {
    //sends the static file (login page) once server is run to port 8008
    res.sendFile('login.html', { root: 'public' }, (err) => {
        if (err) {
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
    exerciseController.returnExercise(query, (exerciseData) => {
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


//for creating new activity/user activity
app.post('/api/activity', express.json(), (req, res) => {
    // console.log(req.body);  

    exerciseController.saveActivity(req, res);
    
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
//Nodemailer Logic
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Adjust if HTML is served elsewhere

// === ROUTE TO HANDLE CONTACT FORM SUBMISSION ===
app.post('/submitContact', async (req, res) => {
    const { reason, feedbackInput } = req.body;

    // [TEST] Confirm form data is received
    console.log('[Form] Reason:', reason);
    console.log('[Form] Message:', feedbackInput);

    // Fallback to test user if cookie is missing
    const username = req.cookies?.username || 'Jimmy';
    console.log('[User] Detected username:', username);

    try {
        // === DB Lookup ===
        const result = await pool.query(
            'SELECT email FROM "Hellth".users WHERE username = $1',
            [username]
        );

        // [TEST] Confirm DB result
        if (result.rows.length === 0) {
            console.error('[DB] No user found');
            return res.status(404).send('User email not found');
        }

        const userEmail = result.rows[0].email;
        console.log('[DB] Found user email:', userEmail);

        // === Nodemailer Setup ===
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        // [TEST] Confirm transporter is working
        transporter.verify((error, success) => {
            if (error) {
                console.error('[Email] Transporter error:', error);
            } else {
                console.log('[Email] Server is ready to send emails');
            }
        });

        // === Send Confirmation Email ===
        await transporter.sendMail({
            from: `"Hellth Support" <${process.env.MAIL_USER}>`,
            to: userEmail,
            subject: `We've received your support request`,
            html: `
  <div style="background-color:#1C1F21; color:#EFEDE7; font-family:'Poppins', sans-serif; padding:2rem; border-radius:12px; max-width:600px; margin:auto; border:1px solid #444;">
    <div style="text-align:center; margin-bottom:2rem;">
      <h1 style="font-family:'Oswald', sans-serif; font-size:28px; color:#FF7043; margin:0;">Hellth Support</h1>
      <p style="margin-top:0.5rem; font-size:16px;">We've received your message!</p>
    </div>

    <div style="background-color:#2A2A2A; padding:1rem 1.5rem; border-radius:8px; margin-bottom:2rem;">
      <p style="margin:0;"><strong style="color:#FFA260;">Username:</strong> ${username}</p>
      <p style="margin:0;"><strong style="color:#FFA260;">Reason:</strong> ${reason}</p>
      <p style="margin-top:1rem;"><strong style="color:#FFA260;">Message:</strong></p>
      <p style="white-space:pre-wrap; line-height:1.6;">${feedbackInput}</p>
    </div>

    <p style="margin-bottom:2rem;">Our support team will get back to you shortly. Thank you for reaching out!</p>

    <hr style="border: none; border-top: 1px solid #555; margin: 2rem 0;">

    <p style="font-size:12px; color:#777; text-align:center;">This is an automated message from Hellth. Please do not reply directly to this email.</p>
  </div>
`

        });

        // [TEST] Confirm email sent
        console.log('[Email] Confirmation sent to', userEmail);

        return res.redirect('/contact.html');

    } catch (err) {
        // [ERROR] Full stack trace for debugging
        console.error('[Server Error]', err);
        return res.status(500).send('Failed to send email');
    }
});

//Admin Page Logic
app.get('/admin/support', async (req, res) => {
    const username = req.query.username;

    if (!username) return res.status(401).send('Missing username');

    const result = await pool.query(
        'SELECT isadmin FROM "Hellth".users WHERE username = $1',
        [username]
    );

    if (result.rows.length === 0 || !result.rows[0].isadmin) {
        return res.status(403).send('Forbidden: not an admin');
    }

    res.sendFile('adminSupport.html', { root: 'public' });
});
app.get('/api/admin/support-requests', async (req, res) => {
    const username = req.query.username;

    const result = await pool.query(
        'SELECT isadmin FROM "Hellth".users WHERE username = $1',
        [username]
    );

    if (result.rows.length === 0 || !result.rows[0].isadmin) {
        return res.status(403).send('Forbidden');
    }

    const tickets = await pool.query(`
        SELECT id, username, email, reason, message, submitted_at, is_resolved
        FROM "Hellth".support_requests
        ORDER BY submitted_at DESC
    `);

    res.status(200).json(tickets.rows);
});
app.post('/api/admin/resolve-ticket', async (req, res) => {
    const { ticketId, username } = req.body;

    const result = await pool.query(
        'SELECT isadmin FROM "Hellth".users WHERE username = $1',
        [username]
    );

    if (result.rows.length === 0 || !result.rows[0].isadmin) {
        return res.status(403).send('Forbidden');
    }

    await pool.query(`
        UPDATE "Hellth".support_requests
        SET is_resolved = true, resolved_at = CURRENT_TIMESTAMP
        WHERE id = $1
    `, [ticketId]);

    res.status(200).json({ success: true });
});


// Activity Chart Database
app.get('/api/chart/activity', async (req, res) => {
    if (!dbClient) {
        return res.status(500).json({ error: 'Database client not initialized' });
    }

    const scope = req.query.scope || 'week';
    let interval, groupBy, dateColumn;

    switch (scope) {
        case 'month':
            interval = `'29 days'`;
            groupBy = 'ua.logtime::date';
            dateColumn = 'ua.logtime::date';
            break;
        case 'year':
            interval = `'11 months'`;
            groupBy = `date_trunc('month', ua.logtime)::date`;
            dateColumn = `date_trunc('month', ua.logtime)::date`;
            break;
        case 'week':
        default:
            interval = `'6 days'`;
            groupBy = 'ua.logtime::date';
            dateColumn = 'ua.logtime::date';
    }

    try {
        console.log("Accessing activity data");
        await dbClient.query('SET SEARCH_PATH TO "Hellth", PUBLIC;');

        const result = await dbClient.query(`
WITH range AS (
  SELECT generate_series(
    ${scope === 'year' ? "date_trunc('month', CURRENT_DATE) - INTERVAL '11 months'" : "CURRENT_DATE - INTERVAL " + interval},
    ${scope === 'year' ? "date_trunc('month', CURRENT_DATE)" : "CURRENT_DATE"},
    INTERVAL '${scope === 'year' ? '1 month' : '1 day'}'
  )::date AS date
),
daily_activity AS (
  SELECT 
    ${dateColumn} AS date,
    SUM(a.duration) AS total_minutes
  FROM useractivity ua
  JOIN activity a ON ua.activityid = a.activityid
  WHERE ua.logtime >= ${scope === 'year' ? "date_trunc('month', CURRENT_DATE) - INTERVAL '11 months'" : "CURRENT_DATE - INTERVAL " + interval}
  GROUP BY ${groupBy}
)
SELECT 
  r.date,
  COALESCE(da.total_minutes, 0) AS total_minutes
FROM range r
LEFT JOIN daily_activity da ON r.date = da.date
ORDER BY r.date ASC;
        `);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(`Activity query (${scope}) failed:`, err);
        res.status(500).json({ error: 'Query failed' });
    }
});


// Calorie Chart Database
app.get('/api/chart/calories', async (req, res) => {
    if (!dbClient) {
        return res.status(500).json({ error: 'Database client not initialized' });
    }

    const scope = req.query.scope || 'week';
    let interval, groupBy, dateColumn;

    switch (scope) {
        case 'month':
            interval = `'29 days'`;
            groupBy = 'm.mealdate';
            dateColumn = 'm.mealdate';
            break;
        case 'year':
            interval = `'11 months'`;
            groupBy = `date_trunc('month', m.mealdate)::date`;
            dateColumn = `date_trunc('month', m.mealdate)::date`;
            break;
        case 'week':
        default:
            interval = `'6 days'`;
            groupBy = 'm.mealdate';
            dateColumn = 'm.mealdate';
    }

    try {
        console.log("Accessing caloric data");
        await dbClient.query('SET SEARCH_PATH TO "Hellth", PUBLIC;');

        const result = await dbClient.query(`
WITH range AS (
  SELECT generate_series(
    ${scope === 'year' ? "date_trunc('month', CURRENT_DATE) - INTERVAL '11 months'" : "CURRENT_DATE - INTERVAL " + interval},
    ${scope === 'year' ? "date_trunc('month', CURRENT_DATE)" : "CURRENT_DATE"},
    INTERVAL '${scope === 'year' ? '1 month' : '1 day'}'
  )::date AS date
),
daily_calories AS (
  SELECT 
    ${dateColumn} AS date,
    SUM(mc.quantity * f.calories) AS total_calories
  FROM meal m
  JOIN mealcontents mc ON m.mealid = mc.mealid
  JOIN food f ON mc.foodid = f.foodid
  WHERE m.mealdate >= ${scope === 'year' ? "date_trunc('month', CURRENT_DATE) - INTERVAL '11 months'" : "CURRENT_DATE - INTERVAL " + interval}
  GROUP BY ${groupBy}
)
SELECT 
  r.date,
  COALESCE(dc.total_calories, 0) AS total_calories
FROM range r
LEFT JOIN daily_calories dc ON r.date = dc.date
ORDER BY r.date ASC;
        `);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(`Calorie query (${scope}) failed:`, err);
        res.status(500).json({ error: 'Query failed' });
    }
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


// const connection = new Client({
//     host: "cmpstudb-01.cmp.uea.ac.uk",
//     user: process.env.DB_USERNAME,
//     port: 5432,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_USERNAME,
// })


// connection.connect().then(() => console.log("Database is connected")).catch(err => console.error("Database failed to connect", err.message));



// sets the db connection to the correct schema
dbClient.query('SET SEARCH_PATH to "Hellth", public;', async (err) => {
    if (err) {
        console.log(err.message);
    }
})

dbClient.query(`SET TIME ZONE 'Europe/London';`, async (err) => {
    if (err) {
        console.log(err.message);
    }
})


// sets the db connection to the correct schema

/* Receives the data from the post request sent by the signup page and attemps to insert the data into the database into the user table


sets the status code based on whether the action was successful or not
*/
app.post("/signup", async (req, res) => {

    const { username, password, dailyCalorieTarget, email, realName, dob, height, weight, gender, imperialMetric } = req.body;

    try {
        const createAccount = `INSERT INTO "Hellth"."users" (username, password, dailyCalorieTarget, email, realName, dob, creationDate, lastLogIn, height, weight, gender, isAdmin, imperialMetric)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, CURRENT_TIMESTAMP, $7, $8, $9, false, $10)`;

        const values = [username, password, dailyCalorieTarget, email, realName, dob, height, weight, gender, imperialMetric];


        const result = await dbClient.query(createAccount, values);
        res.status(201).json({
            message: "User created successfully",
            user: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "There was an error with the server" });
    }

})

app.get("/signup/:check", async (req, res) => {

    const { username, email } = req.query;


    if (!dbClient) {
        return res.status(500).json({ error: 'Database client not initialized' });
    }
    try {
        if (username) {
            const searchUser = await dbClient.query('SELECT username FROM "Hellth"."users" WHERE username = $1', [username]);

            if (searchUser.rows.length === 0) {
                res.status(404).json({ error: "User not found" });
            }
            res.status(200).json(searchUser.rows[0]);
        }
        if (email) {
            const searchEmail = await dbClient.query('SELECT email FROM "Hellth"."users" WHERE email = $1', [email]);


            if (searchEmail.rows.length === 0) {
                res.status(404).json({ error: "Email not found" });
            }
            res.status(200).json(searchEmail.rows[0]);
        }


    } catch (error) {

        if (username) {
            console.error("There was an error searching for users", error);
            res.status(500).json({ error: "There was an error with the server" });
        }
        if (email) {
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
            if (goals.rows.length === 0) {
                var valid = false;
                var id = randomInt(1000000);
                while (!valid) {
                    const checkValidID = await dbClient.query
                        (
                            `SELECT * FROM Goal WHERE goalid = $1;`, [id]
                        );
                    if (checkValidID.rows.length === 0) {
                        valid = true;
                    } else {
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

app.post('/api/goal/AddMealGoal', async (req, res) => {
    const goalid = Math.floor(Math.random() * 10000);
    const points = Math.floor(Math.random() * 100);
    const isgoalmet = false;
    const { goalname, username, currentweight, startdate, enddate, target } = req.body;

    try {
        
        const createGoal = `
            INSERT INTO "Hellth"."goal" (goalid, goalname, startdate, enddate, isgoalmet, points)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const goalValues = [goalid, goalname, startdate, enddate, isgoalmet, points];
        await dbClient.query(createGoal, goalValues);

        
        const createMealGoal = `
            INSERT INTO "Hellth"."mealgoal" (goalid, username, startweight, targetweight, currentweight, dailycalories)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const mealValues = [goalid, username, currentweight, target, currentweight, 2000];
        await dbClient.query(createMealGoal, mealValues);

        res.status(201).json({
            message: "Meal goal created successfully",
            goalid: goalid
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "There was an error with the server" });
    }
});


app.post('/api/goal/AddActivityGoal', async (req, res) => {
    const goalid = Math.floor(Math.random() * 10000);
    const points = Math.floor(Math.random() * 100);
    const weeklyactivity = 0
    const caloriesburnt = 0
    const isgoalmet = false;
    const { goalname, username, startdate, enddate, target } = req.body;

    try {
        
        const createGoal = `
            INSERT INTO "Hellth"."goal" (goalid, goalname, startdate, enddate, isgoalmet, points)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const goalValues = [goalid, goalname, startdate, enddate, isgoalmet, points];
        await dbClient.query(createGoal, goalValues);

        
        const createMealGoal = `
            INSERT INTO "Hellth"."exercisegoal" (goalid, username, caloriesburnt, targetactivity, weeklyactivity)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const mealValues = [goalid, username, caloriesburnt, target, weeklyactivity];
        await dbClient.query(createMealGoal, mealValues);

        res.status(201).json({
            message: "Meal goal created successfully",
            goalid: goalid
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "There was an error with the server" });
    }
});



app.post('/api/group/AddMealChallenge', async (req, res) => {
    const goalid = Math.floor(Math.random() * 10000);
    const points = Math.floor(Math.random() * 100);
    const isgoalmet = false;
    const { goalname, groupid, startdate, enddate, target } = req.body;

    try {
        
        const createGoal = `
            INSERT INTO "Hellth".goal (goalid, goalname, startdate, enddate, isgoalmet, points)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const goalValues = [goalid, goalname, startdate, enddate, isgoalmet, points];
        await dbClient.query(createGoal, goalValues);

        
        const createMealGoal = `
            INSERT INTO "Hellth".mealchallenge (goalid, groupid, calorietarget, currentcalories)
            VALUES ($1, $2, $3, $4)
        `;
        const mealValues = [goalid, groupid, target, 0];
        await dbClient.query(createMealGoal, mealValues);

        res.status(201).json({
            message: "Meal goal created successfully",
            goalid: goalid
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "There was an error with the server" });
    }
});


app.post('/api/group/AddActivityChallenge', async (req, res) => {
    const goalid = Math.floor(Math.random() * 10000);
    const points = Math.floor(Math.random() * 100);
    const weeklyactivity = 0
    const caloriesburnt = 0
    const isgoalmet = false;
    const { goalname, groupid, startdate, enddate, target } = req.body;

    try {
        
        const createGoal = `
            INSERT INTO "Hellth".goal (goalid, goalname, startdate, enddate, isgoalmet, points)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const goalValues = [goalid, goalname, startdate, enddate, isgoalmet, points];
        await dbClient.query(createGoal, goalValues);

        
        const createMealGoal = `
            INSERT INTO "Hellth".exercisechallenge (goalid, groupid, targetcaloriesburnt, caloriesburnt)
            VALUES ($1, $2, $3, $4)
        `;
        const mealValues = [goalid, groupid, target, 0];
        await dbClient.query(createMealGoal, mealValues);

        res.status(201).json({
            message: "Meal goal created successfully",
            goalid: goalid
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "There was an error with the server" });
    }
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
    const { username, first } = req.body;
    console.log(username + " " + first);

    try {

        var dCalories = 0;
        var challengeFound = "none";
        var challengeUnit = "N/A";
        var challengeCurrent = "N/A";
        var challengeTarget = "N/A";
        var challengeTargetTitle = "N/A";
        var challengeTitle = "You have no active challenges";
        var challengeEnd = "N/A";
        var expiredMealGoal = "N/A";
        var expiredExerciseGoal = "N/A";

        const failedExerciseGoals = await dbClient.query(`
            SELECT * 
            FROM "Hellth".Goal
            LEFT JOIN "Hellth".exerciseGoal ON exerciseGoal.goalid = goal.goalid
            LEFT JOIN "Hellth".users ON exerciseGoal.username = users.username
            WHERE isgoalmet = 'false' AND
            exerciseGoal.username = $1 AND
            enddate BETWEEN (CURRENT_DATE - INTERVAL '3 days') AND (CURRENT_DATE - INTERVAL '1 days');`, [username]);

        const failedMealGoals = await dbClient.query(`
            SELECT * 
            FROM "Hellth".Goal
            LEFT JOIN "Hellth".mealGoal ON mealGoal.goalid = goal.goalid
            LEFT JOIN "Hellth".users ON mealGoal.username = users.username
            WHERE isgoalmet = 'false' AND
            mealGoal.username = $1 AND
            enddate BETWEEN (CURRENT_DATE - INTERVAL '3 days') AND (CURRENT_DATE - INTERVAL '1 days');`, [username]);

            console.log(failedExerciseGoals.rows.length);
            console.log("First value:", first, "Type:", typeof first);
            if ((failedExerciseGoals.rows.length != 0 || failedMealGoals.rows.length != 0) && first == "true") 
            {
                console.log("bwhfgwifiuwgfiuweghfuigwufgwfuig")
                if (failedExerciseGoals.rows.length != 0) 
                {
                    expiredExerciseGoal = failedExerciseGoals.rows;
                }
                if (failedMealGoals.rows.length != 0) 
                {
                    expiredMealGoal = failedMealGoals.rows;
                }
                
            }

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
        if (dailyCalorie.rows[0].sum === null) {
            console.log("No meals entered today")
        } else {
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
                challengeE: challengeEnd,
                expiredExerciseGoal,
                expiredMealGoal
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
                challengeE: challengeEnd,
                expiredExerciseGoal,
                expiredMealGoal
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
                challengeE: challengeEnd,
                expiredExerciseGoal,
                expiredMealGoal
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
    dbClient.query('SET SEARCH_PATH TO "Hellth", public;', (err) => {
        if (err) {
            console.error("Error setting search path:", err);
            return res;
        }

        const queryString = `SELECT * FROM userGroups`;
        const queryMembers = `COUNT FROM groupMembers WHERE groupMembers.groupID = $1`;
        dbClient.query(queryString, (err, resp) => {
            if (err) {
                console.error("Database query error:", err);
                return res;
            }
            // console.table(resp.rows);
            return res.status(200).json(resp.rows);

        })
    })
})



app.get("/groups/:allgroups/userGroupSection", async (req, res) => {
    const query = req.query.q;
    // const groupid
    // console.log(query);
    // console.log("grouPID HERE" + groupid);
    
    const memberCount = [];
    const personalGroup = await dbClient.query(`SELECT * FROM groupMembers JOIN userGroups ON groupMembers.groupid = userGroups.groupid WHERE groupMembers.username = $1`, [query]);
    for(i=0; i<personalGroup.rows.length; i++){
        const memberno = await dbClient.query(`SELECT COUNT(*) FROM groupMembers WHERE groupMembers.groupid = $1`, [personalGroup.rows[i].groupid]);
        memberCount[i] = memberno.rows[0].count;
    }

    
    const userGroupCount = await dbClient.query(`SELECT COUNT(*)FROM groupMembers JOIN userGroups ON groupMembers.groupid = userGroups.groupid WHERE groupMembers.username = $1`, [query]);
    if (personalGroup.rows.length === 0) 
        {
            res.status(404).json({error: "Groups not found"});
        }else{
            res.status(200).json({
                groups: personalGroup.rows,
                groupcount: userGroupCount.rows[0],
                memberCount: memberCount
            });
        }

        // console.table(personalGroup.rows)
   
})

app.post("/groups/join", async (req, res) => {
    const {username, groupid} = req.body;
    console.log("groupid");

    try {
        const findgroup = await dbClient.query(`SELECT * FROM userGroups WHERE groupid = $1`, [groupid]);
        const adduser = await dbClient.query(`INSERT INTO groupMembers(groupID, username, isAdmin) VALUES ($1, $2, FALSE)`, [groupid, username]);
        const emailResult = await dbClient.query(`SELECT email FROM "Hellth".users WHERE username = $1`,[username]);
        const userEmail = emailResult.rows[0].email;
        const countResult = await dbClient.query(`SELECT COUNT(*) FROM groupMembers WHERE groupID = $1`,[groupid]);
        const memberCount = countResult.rows[0].count;

            const transporterGroup = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
        await transporterGroup.sendMail({
            from: `"Hellth Groups" <${process.env.MAIL_USER}>`,
            to: userEmail,
            subject: `You've joined ${findgroup.rows[0].groupname}`,
            html: `
                <div style="background:#1e1e1e; color:#f0f0f0; padding:20px; border-radius:10px; font-family:sans-serif;">
                    <h2>Group Join Confirmation</h2>
                    <p>Hi ${username},</p>
                    <p>You've successfully joined the group <strong>${findgroup.rows[0].groupname}</strong>.</p>
                    <p>Current number of members: <strong>${memberCount}</strong></p>
                    <p>Thank you for being a part of our community!</p>
                </div>
            `
        });
        res.status(201).json({message: "Joined group successfully",
            group: findgroup.rows[0],
            add: adduser.rows[0]
        });
        console.table(findgroup);
        console.table(adduser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "There was an error with the server" });
    }
})
app.post("/groups/createGroup", async (req, res) => {
    
    const {groupid, username, groupname, ispublic} = req.body;
    // console.table(req.body);

    try {
        const findgroupid = await dbClient.query(`SELECT * FROM userGroups WHERE groupid = $1`, [groupid]);
        const findgroupname = await dbClient.query(`SELECT * FROM userGroups where groupname = $1`, [groupname]);
        const createGroup = `INSERT INTO userGroups(groupID, createdBy, groupName, isPublic, creationDate) VALUES ($1, $2, $3, $4, CURRENT_DATE);`;
        const addToGroup = `INSERT INTO groupMembers(groupID, username, isAdmin) VALUES ($1, $2, TRUE)`;
        const valuesc = [groupid, username, groupname, ispublic];
        const valuesa = [groupid, username];
        // console.log(findgroupname.length);
        if(findgroupid.rows.length == 0 && findgroupname.rows.length == 0){
            const result = await dbClient.query(createGroup, valuesc);
            const result2 = await dbClient.query(addToGroup, valuesa);
            res.status(201).json({message: "Group created successfully",
            group: result.rows[0],
            groupmem: result2.rows[0]
            });
        }else{
            res.status(409).json({error: "Group id or name already exists"});
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "There was an error with the server" });
    }
       
})

app.post("/groups/:allgroups/:groupid", async (req, res) => {
    const groupid = req.body.groupid;
    // console.table(groupid)
    const queryMembers = await dbClient.query("SELECT COUNT(*) FROM groupMembers WHERE groupMembers.groupID = $1", [groupid]);
    // console.log(groupid);
    if (queryMembers.rows.length === 0) 
        {
            res.status(404).json({error: "Group not found"});
        }else{
            res.status(200).json(queryMembers.rows[0]);
        }
        
})


app.get('/mealchallenges', async (req, res) => {
  const groupId = req.query.id; 

  try {
    
    const result = await dbClient.query(
    `
        SELECT mc.*, g.*
        FROM "Hellth".mealchallenge mc
        JOIN "Hellth".goal g ON mc.goalid = g.goalid
        WHERE mc.groupid = $1
    `,
    [groupId]
    );


    
    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'No meal challenges found for this group' });
    }
    
    return res.json(result.rows);

  } catch (err) {
    console.error('Error executing query', err);
    return res.status(500).send({ error: 'Internal server error' });
  }
});



app.get('/activitychallenges', async (req, res) => {
  const groupId = req.query.id; 

  try {
    
    const result = await dbClient.query(
    `
        SELECT ac.*, g.*
        FROM "Hellth".exercisechallenge ac
        JOIN "Hellth".goal g ON ac.goalid = g.goalid
        WHERE ac.groupid = $1
    `,
    [groupId]
    );


    
    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'No meal challenges found for this group' });
    }
    
    return res.json(result.rows);

  } catch (err) {
    console.error('Error executing query', err);
    return res.status(500).send({ error: 'Internal server error' });
  }
});


app.get("/achievements", async (req, res) => {
    const query = req.query.q;
    console.log(query);
    

    const ac = await dbClient.query(`
        SELECT * 
        FROM baseachievement b
        
        WHERE b.username = $1
        `, [query]);

    if (ac.rows.length === 0) 
        {
            res.status(404).json({error: "achs not found"});
        }
        res.status(200).json(ac.rows);
   
})

app.post('/api/goals', async (req, res) => {
  const { username } = req.body;
  
  try {
   
    const mealGoalsQuery = `
      SELECT 
          g.goalid,
          g.*, 
          mg.*, 
          'meal' AS goaltag
      FROM "Hellth".goal g
      JOIN "Hellth".mealgoal mg ON g.goalid = mg.goalid
      WHERE mg.username = $1
    `;
    
 
    const activityGoalsQuery = `
      SELECT 
          g.goalid,
          g.*, 
          eg.*, 
          NULL AS extra_column,  
          'exercise' AS goaltag
      FROM "Hellth".goal g
      JOIN "Hellth".exercisegoal eg ON g.goalid = eg.goalid
      WHERE eg.username = $1
    `;
    
  
    const mealGoalsResult = await dbClient.query(mealGoalsQuery, [username]);
    const activityGoalsResult = await dbClient.query(activityGoalsQuery, [username]);

   
    const combinedResults = [
      ...mealGoalsResult.rows,
      ...activityGoalsResult.rows
    ];

    res.json(combinedResults);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.put('/update-weight', async (req, res) => {
  const { username, weight } = req.body;
  const result = await dbClient.query(
    'UPDATE "Hellth".users SET weight = $1 WHERE username = $2 RETURNING *',
    [weight, username]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json({
    message: 'Weight updated successfully',
    user: result.rows[0] 
  });
});

app.put('/removeChallenge', async (req, res) => {
  const { username, weight } = req.body;
  const result = await dbClient.query(
    'UPDATE "Hellth".users SET weight = $1 WHERE username = $2 RETURNING *',
    [weight, username]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json({
    message: 'Weight updated successfully',
    user: result.rows[0] 
  });
});

app.put('/api/goal/deleteMealGoal', async (req, res) => {
  const id = req.query.q;

  try {
    await dbClient.query(
      'DELETE FROM "Hellth".mealchallenge WHERE goalid = $1',
      [id]
    );

    const result = await dbClient.query(
      'DELETE FROM "Hellth".goal WHERE goalid = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (err) {
    console.error('Deletion error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.put('/api/goal/deleteActivityGoal', async (req, res) => {
  const id = req.query.q;

  try {
    await dbClient.query(
      'DELETE FROM "Hellth".exercisechallenge WHERE goalid = $1',
      [id]
    );

    const result = await dbClient.query(
      'DELETE FROM "Hellth".goal WHERE goalid = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (err) {
    console.error('Deletion error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.put('/removeMealChallenge', async (req, res) => {
  const {goalid } = JSON.parse(req.query.q);

  try {
    await dbClient.query(
      `DELETE FROM "Hellth".mealchallenge
       USING "Hellth".goal
       WHERE mealchallenge.goalid = goal.goalid
       AND goal.goalid = $1`,
      [goalid]
    );

    const result = await dbClient.query(
      `DELETE FROM "Hellth".goal
       WHERE goalid = $1 `,
      [goalid]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Goal not found or already deleted' });
    }

    res.status(200).json({
      message: 'Removed activity successfully',
      user: result.rows[0]
    });
  } catch (err) {
    console.error("Error removing activity:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.put('/removeActivityChallenge', async (req, res) => {
  const { username, goalid } = JSON.parse(req.query.q);

  try {
    await dbClient.query(
      `DELETE FROM "Hellth".exercisechallenge
       USING "Hellth".goal
       WHERE exercisechallenge.goalid = goal.goalid
       AND goal.goalid = $1`,
      [goalid]
    );

    const result = await dbClient.query(
      `DELETE FROM "Hellth".goal
       WHERE goalid = $1 `,
      [goalid]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Goal not found or already deleted' });
    }

    res.status(200).json({
      message: 'Removed activity successfully',
      user: result.rows[0]
    });
  } catch (err) {
    console.error("Error removing activity:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});