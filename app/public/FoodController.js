import Food from './Food.js';
import FoodView from './FoodView.js';

class FoodController {
    constructor() {
        this.view = new FoodView();
        this.foodList = document.querySelector('.foodList');

        new Food(120, "Apple", "Fruit", "1 medium", 0.5, 25, 4.5, 19, 0.3);
        new Food(150, "Banana", "Fruit", "1 medium", 1.3, 27, 3.1, 14, 0.4);
        new Food(200, "Chicken Breast", "Protein", "100g", 31, 0, 0, 0, 3.6);
        new Food(250, "Broccoli", "Vegetable", "1 cup", 2.5, 12, 5.5, 6, 1.0);
        new Food(100, "Carrot", "Vegetable", "1 medium", 1, 24, 2.8, 6, 0.2);
        new Food(100, "Carrot", "Vegetable", "1 medium", 1, 24, 2.8, 6, 0.2);
        new Food(100, "Carrot", "Vegetable", "1 medium", 1, 24, 2.8, 6, 0.2);
        new Food(100, "Carrot", "Vegetable", "1 medium", 1, 24, 2.8, 6, 0.2);
       
        this.foodData = Food.getAllFoodData(); 
    }

    addItem(itemName) {
        console.log(`Searching for food item: '${itemName}'`);

        const foodData = this.foodData.find(food => food.foodName.toLowerCase().includes(itemName.toLowerCase()));


        console.log(`Found food data:`, foodData);

        const item = document.createElement('div');
        item.classList.add('item');
        item.innerHTML = `${foodData.foodName} - ${foodData.calories} kcal`;

        const removeButton = document.createElement('button');
        removeButton.innerHTML = `<i class="fas fa-window-close" style="color: grey;"></i>`;
        removeButton.onclick = () => {
            item.remove();
            this.calculateTotalCal();
        };

        item.appendChild(removeButton);
        this.foodList.appendChild(item);

        console.log("Food item added:", foodData.foodName);
        this.calculateTotalCal();
    }

    calculateTotalCal() {
        const foodItems = this.foodList.querySelectorAll('.item');
        let totals = { calories: 0, protein: 0, fiber: 0, carbs: 0, fat: 0, sugar: 0, count: 0 };

        foodItems.forEach(food => {
            const foodName = food.textContent.split(' - ')[0]?.trim();
            const foodData = this.foodData.find(food => food.foodName.toLowerCase() === foodName.toLowerCase());

            if (foodData) {
                totals.calories += foodData.calories;
                totals.protein += foodData.proteinContent;
                totals.fiber += foodData.fibreContent;
                totals.carbs += foodData.carbContent;
                totals.fat += foodData.fatContent;
                totals.sugar += foodData.sugarContent;
                totals.count++;
            }
        });

        this.view.updateNutritionUI(totals);
    }

    showSearchResults(query) {
        const resultsContainer = document.querySelector('.search-results');
        resultsContainer.innerHTML = ''; 

        const filteredFoodData = this.foodData.filter(food => 
            food.foodName.toLowerCase().includes(query.toLowerCase())
        );

        filteredFoodData.forEach(food => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('search-item');
            resultItem.innerHTML = food.foodName;
            resultItem.onclick = () => {
                this.addItem(food.foodName); 
                document.querySelector('.search-bar').value = ''; 
                resultsContainer.innerHTML = ''; 
            };
            resultsContainer.appendChild(resultItem);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const foodController = new FoodController();

    document.querySelector(".search-bar").addEventListener("input", (event) => {
        const itemName = event.target.value.trim();
        if (itemName) {
            foodController.showSearchResults(itemName);
        } else {
            document.querySelector('.search-results').innerHTML = ''; 
        }
    });
});
