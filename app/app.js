const express = require('express');
const dbClient = require('./db.js'); 
const FoodController = require('./FoodController.js');
const Food = require('./Food.js');
const app = express();
app.use(express.json()); 
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

app.get('/api/return-food', (req, res) => {
    const query = req.query.q;
    
    foodController.returnFood(query, (foodData) => {
        res.json(foodData);
    });
});

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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
