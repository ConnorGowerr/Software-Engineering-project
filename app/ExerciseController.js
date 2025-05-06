const dbClient = require('./public/db.js')


class ExerciseController {
    constructor() {
    }  


    searchExercise(query, callback) {
        dbClient.query('SET SEARCH_PATH TO "Hellth", public;', (err) => {
            if (err) {
                console.error("Error setting search path:", err);
                return callback([]);  
            }

            const queryString = `SELECT * FROM Exercise WHERE LOWER(exercisename) LIKE LOWER($1)`;
            dbClient.query(queryString, [`%${query}%`], (err, res) => {
                if (err) {
                    console.error("Database query error:", err);
                    return callback([]);
                }

                callback(res.rows);  
            });
        });
    }




    returnExercise(query, callback) {
        dbClient.query('SET SEARCH_PATH TO "Hellth", public;', (err) => {
            if (err) {
                console.error("Error setting search path:", err);
                return callback([]);  
            }
    
            const queryString = `SELECT * FROM Exercise WHERE LOWER(exercisename) = LOWER($1)`;
            dbClient.query(queryString, [query], (err, res) => {
                if (err) {
                    console.error("Database query error:", err);
                    return callback([]);
                }

                callback(res.rows);  
            });
        });
    }

    //handles both activity and user activity
    saveActivity(req, res) {
        const {logtime, activityid, username, name, duration, intensity} = req.body;
    
    
        const insertQuery1 = `
        INSERT INTO Activity (activityid, username, name, duration, intensity)
        VALUES ($1, $2, $3, $4 $5)
        `;
        const insertQuery2 = `
        INSERT INTO UserActivity (username, activityid, logtime)
        VALUES ($1, $2, $3)
        `;

        const values1 = [activityid, username, name, duration, intensity];
        const values2 = [username, activityid, logtime];

        dbClient.query('SET SEARCH_PATH TO "Hellth", public;', (err) => {
            if (err) {
                console.error("Search path error:", err);
                return res.status(500).json({ error: "Failed to set search path" });
            }
    
            //activity
            dbClient.query(insertQuery1, values1, (err, result) => {
                if (err) {
                    console.error( err);
                    return res.status(500).json({ error: "Failed to insert activity" });
                }
    
                return res.status(201).json({ message: "Activity inserted", activity: result.rows[0] });
            });
            
            //user activity
            dbClient.query(insertQuery2, values2, (err, result) => {
                if (err) {
                    console.error( err);
                    return res.status(500).json({ error: "Failed to insert user activity" });
                }
    
                return res.status(201).json({ message: "User Activity inserted", useractivity: result.rows[0] });
            });
        });
    }

    
}    


module.exports = ExerciseController;