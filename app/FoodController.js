const Food = require('./Food')
const Meal = require('./Meal')
const dbClient = require('./db.js')


class FoodController {
    constructor() {
        this.allMealFood = new Array();

        this.foodData = Food.getAllFoodData(); 
    }  


    //funtion to create a meal objecrs from all items in the current food list, user can confirm cancel (upon confirm reset everything and create meal, upon cancel drop the opoup)
    async createMeal() {
        const foodItems = document.querySelectorAll('.item');
        let totalCals = 0;

        // Calculate total nutrients
        foodItems.forEach(food => {
            const foodName = food.textContent.split(' - ')[0]?.trim();
            const quantity = food.querySelector('.quantity-input') 
                ? parseInt(food.querySelector('.quantity-input').value) 
                : 1;  
            const foodData = this.foodData.find(f => f.foodName.toLowerCase() === foodName.toLowerCase());

            if (foodData) {
                totalCals += foodData.calories * quantity;
            }
        });

        // Ask the View to show the popup
        const mealInfo = await this.foodView.showMealPopup(totalCals);

        if (mealInfo) {
            const { mealName, mealType } = mealInfo;
            const meal = new Meal(mealName, mealType, this.allMealFood);
            console.log(meal.toString());

            meal.getAllFoods().forEach(Food => console.log(Food.toString()));

            this.allMealFood.length = 0;  
            this.calculateTotalCal();
            this.createNotification();
        }
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
    
    
}    


module.exports = FoodController;
