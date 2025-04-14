const express = require('express');
const dbClient = require('./db.js'); 
const FoodController = require('./FoodController.js');
const Food = require('./Food.js');
const app = express();
app.use(express.json()); 
require('dotenv').config();

const port = 8008;

app.use(express.static('public'));
const foodController = new FoodController();


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

// recievee a post request with our new meal info (will add db stuff)
app.post('/api/meal', express.json(), (req, res) => {
    foodController.saveMeal(req, res);
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
