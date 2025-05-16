const dbClient = require('./public/db.js')
const { randomInt } = require('crypto');


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
    async saveActivity(req, res) {
        const {username, exercisename, activityduration, activityintensity} = req.body;
        let activityid = 0;
        let idCount = 0;
    
        const insertQuery1 = `
        INSERT INTO Activity (activityid, username, exercisename, duration, intensity)
        VALUES ($1, $2, $3, $4, $5)
        `;
        const insertQuery2 = `
        INSERT INTO UserActivity (username, activityid, logtime)
        VALUES ($1, $2, (CURRENT_TIMESTAMP + INTERVAL '1 hour'))
        `;
        const idCountQuery = `SELECT * FROM activity WHERE activityid = $1`;

        let values1 = [activityid, username, exercisename, activityduration, activityintensity];
        let values2 = [username, activityid];
        
            // dbClient.query('SET SEARCH_PATH TO "Hellth", public;', (err) => {
            //     if (err) {
            //         console.error("Search path error:", err);
            //         return res.status(500).json({ error: "Failed to set search path" });
            //     }

            //     //check if the id is valid
            //     // do{
            //     //     activityid = randomInt(1000000);
                    
            //     //     dbClient.query(idCountQuery, [activityid], (err, result1) => {
            //     //         if (err) {
            //     //             console.error("Database query error:", err);
            //     //         }
            //     //         return res.status(201).json({ message: "test", activity: result1 });
            //     //     });
            //     //     // idCount = idCountQuery.rows[0].count;
            //     // }
            //     // while(idCount > 0);
            //     console.log(idCount)
            //     console.log(activityid)



            //     //activity
            //     dbClient.query(insertQuery1, values1, (err, result2) => {
            //         if (err) {
            //             console.error( err);
            //             return res.status(500).json({ error: "Failed to insert activity" });
            //         }
        
            //         return res.status(201).json({ message: "Activity inserted", activity: result2.rows[0] });
            //     });
                
            //     //user activity
            //     dbClient.query(insertQuery2, values2, (err, result3) => {
            //         if (err) {
            //             console.error( err);
            //             return res.status(500).json({ error: "Failed to insert user activity" });
            //         }
        
            //         return res.status(201).json({ message: "User Activity inserted", useractivity: result3.rows[0] });
            //     });
            // });
        try {
            await dbClient.query('SET SEARCH_PATH TO "Hellth", public;');
            
            do{
                //Randomise id
                activityid = randomInt(1000000);
                //Find number of db entries with that id. If it's > 0, the id is taken.
                await (idCount = (await dbClient.query(idCountQuery, [activityid])).rowCount);   
                console.log(idCount)
                console.log(activityid)   
            //Loops until an unclaimed id is found
            }while(idCount > 0);
            
            //update the arrays where the id is needed
            values1[0] = activityid;
            values2[1] = activityid;

            await dbClient.query(insertQuery1, values1);

            await dbClient.query(insertQuery2, values2);

            return res.status(201).json({ message: "activity inserted", activityid });
        
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to save activity data" });
        }
    }


    
}    


module.exports = ExerciseController;