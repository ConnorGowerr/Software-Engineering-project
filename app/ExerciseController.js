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

            const queryString = `SELECT * FROM Exercise WHERE LOWER(exerciseName) LIKE LOWER($1)`;
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
    
            const queryString = `SELECT * FROM Exercise WHERE LOWER(exerciseName) = LOWER($1)`;
            dbClient.query(queryString, [query], (err, res) => {
                if (err) {
                    console.error("Database query error:", err);
                    return callback([]);
                }

                callback(res.rows);  
            });
        });
    }

    // saveActivity(req, res) {
    //     const {name, duration, intensity} = req.body;
    
    
    //     const insertQuery = `
    //     INSERT INTO Activity (name, duration, intensity)
    //     VALUES ($1, $2, $3)
    //     `;

    //     const values = [name, duration, intensity];

    //     dbClient.query('SET SEARCH_PATH TO "Hellth", public;', (err) => {
    //         if (err) {
    //             console.error("Search path error:", err);
    //             return res.status(500).json({ error: "Failed to set search path" });
    //         }
    
    //         dbClient.query(insertQuery, values, (err, result) => {
    //             if (err) {
    //                 console.error( err);
    //                 return res.status(500).json({ error: "Failed to insert activity" });
    //             }
    
    //             return res.status(201).json({ message: "Activity inserted", activity: result.rows[0] });
    //         });
    //     });
    // }

    
}    


module.exports = ExerciseController;