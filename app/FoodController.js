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
        const { mealName, mealType, foods } = req.body;

        if (!mealName || !mealType || !foods) {
            return res.status(400).json({ error: "Missing meal data" });
        }

        console.log("Received meal:", mealName, mealType, foods);
        res.status(200).json({ message: "Meal received successfully" });
    }
    
    
}    


module.exports = FoodController;
