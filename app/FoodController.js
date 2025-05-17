const { randomInt } = require('crypto');

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

    async saveMeal(req, res) {
        const { user, mealType, foods, date, date2 } = req.body;
        const mealid = randomInt(1000000);
    
        const insertMealQuery = `
            INSERT INTO Meal (mealid, username, mealType, mealdate, mealtime)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const mealValues = [mealid, user, mealType, date, date2];
    
        try {
            await dbClient.query('SET SEARCH_PATH TO "Hellth", public;');
            await dbClient.query(insertMealQuery, mealValues);
    
            const insertPromises = foods.map(food => {
                const insertFoodQuery = `
                    INSERT INTO Mealcontents (mealid, foodid, quantity)
                    VALUES ($1, $2, $3)
                `;
                const foodValues = [mealid, food.foodid, food.quantity];
                return dbClient.query(insertFoodQuery, foodValues);
            });
    
            await Promise.all(insertPromises);
    
            return res.status(201).json({ message: "Meal and foods inserted", mealid });
    
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to save meal data" });
        }
    }
    





    saveFood(req, res) {
        const {name, type, calories, fats, servingsize, protein, carbs, fibre, sugar} = req.body;

        const foodid = randomInt(1000000)
    
        const insertQuery = `
        INSERT INTO Food (foodid, foodname, foodtype, servingsize, protein, carbs, fibre, sugar, fat, calories)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;

    
        const values = [foodid, name, type, servingsize, protein, carbs, fibre, sugar, fats, calories];
    
        console.table(values)
        dbClient.query('SET SEARCH_PATH TO "Hellth", public;', (err) => {
            if (err) {
                console.error("Search path error:", err);
                return res.status(500).json({ error: "Failed to set search path" });
            }
    
            dbClient.query(insertQuery, values, (err, result) => {
                if (err) {
                    console.error( err);
                    return res.status(500).json({ error: "Failed to insert food" });
                }
    
                return res.status(201).json({ message: "Food inserted", food: result.rows[0] });
            });
        });
    }


    
}    


module.exports = FoodController;