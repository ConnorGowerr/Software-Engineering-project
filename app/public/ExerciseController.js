const Food = require('./Food')
const Meal = require('./Meal')
const dbClient = require('./db.js')


class FoodController {
    constructor() {
    }  


    searchFood(query, callback) {
        dbClient.query('SET SEARCH_PATH TO "Hellth", public;', (err) => {
            if (err) {
                console.error("Error setting search path:", err);
                return callback([]);  
            }

            const queryString = `SELECT * FROM Food WHERE LOWER(foodName) LIKE LOWER($1)`;
            dbClient.query(queryString, [`%${query}%`], (err, res) => {
                if (err) {
                    console.error("Database query error:", err);
                    return callback([]);
                }

                callback(res.rows);  
            });
        });
    }




    returnFood(query, callback) {
        dbClient.query('SET SEARCH_PATH TO "Hellth", public;', (err) => {
            if (err) {
                console.error("Error setting search path:", err);
                return callback([]);  
            }
    
            const queryString = `SELECT * FROM Food WHERE LOWER(foodName) = LOWER($1)`;
            dbClient.query(queryString, [query], (err, res) => {
                if (err) {
                    console.error("Database query error:", err);
                    return callback([]);
                }

                callback(res.rows);  
            });
        });
    }

    saveMeal(req, res) {
        const {username, mealtype, mealdate, mealtime } = req.body;
    
    
        const insertQuery = `
        INSERT INTO Meal (username, mealType, mealDate, mealTime)
        VALUES ($1, $2, $3, $4)
        `;

        const values = [username, mealtype, mealdate, mealtime];
    
        dbClient.query('SET SEARCH_PATH TO "Hellth", public;', (err) => {
            if (err) {
                console.error("Search path error:", err);
                return res.status(500).json({ error: "Failed to set search path" });
            }
    
            dbClient.query(insertQuery, values, (err, result) => {
                if (err) {
                    console.error( err);
                    return res.status(500).json({ error: "Failed to insert meal" });
                }
    
                return res.status(201).json({ message: "Meal inserted", meal: result.rows[0] });
            });
        });
    }

    
}    


module.exports = FoodController;