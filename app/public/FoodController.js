import Food from './Food.js';
import FoodView from './FoodView.js';


//not fully compleeted however worksas intended with tests//
class FoodController {
    constructor() {
        this.view = new FoodView();
        this.foodList = document.querySelector('.foodList');

        new Food(120, "Apple", "Fruit", "1 medium", 0.5, 25, 4.5, 19, 0.3);
        new Food(150, "Banana", "Fruit", "1 medium", 1.3, 27, 3.1, 14, 0.4);
        new Food(200, "Chicken Breast", "Protein", "100g", 31, 0, 0, 0, 3.6);
        new Food(250, "Broccoli", "Vegetable", "1 cup", 2.5, 12, 5.5, 6, 1.0);
        new Food(100, "Carrot", "Vegetable", "1 medium", 1, 24, 2.8, 6, 0.2);
        new Food(220, "Salmon", "Protein", "100g", 25, 0, 0, 0, 13);
        new Food(90, "Strawberry", "Fruit", "1 cup", 1, 22, 2.9, 11, 0.3);
        new Food(160, "Almonds", "Nuts", "30g", 6, 6, 3.5, 1.2, 14);
        new Food(200, "Egg", "Protein", "1 large", 13, 1, 0, 1, 11);
        new Food(340, "Peanut Butter", "Spread", "2 tbsp", 8, 7, 2, 3, 28);
        new Food(180, "Oats", "Grain", "50g", 6, 30, 4, 1, 3);
        new Food(90, "Blueberries", "Fruit", "1 cup", 1, 21, 3.5, 14, 0.3);
        new Food(160, "Brown Rice", "Grain", "100g", 4, 34, 1.8, 0, 1.2);
        new Food(210, "Avocado", "Fruit", "1/2 medium", 2, 9, 7, 1, 18);
        new Food(180, "Greek Yogurt", "Dairy", "150g", 12, 9, 0, 5, 6);
        new Food(290, "Walnuts", "Nuts", "30g", 5, 3, 2, 0.7, 29);
        new Food(170, "Sweet Potato", "Vegetable", "1 medium", 2, 37, 3.8, 12, 0.1);
        new Food(110, "Tomato", "Vegetable", "1 large", 1, 7, 1.5, 5, 0.2);
        new Food(130, "Pineapple", "Fruit", "1 cup", 1, 33, 2, 24, 0.2);
        new Food(140, "Cottage Cheese", "Dairy", "100g", 12, 3, 0, 2, 4);
        new Food(230, "Beef Steak", "Protein", "100g", 26, 0, 0, 0, 17);
        new Food(260, "Pasta", "Grain", "100g", 8, 55, 2.8, 1, 1);
        new Food(180, "Lentils", "Legume", "100g", 9, 32, 8, 2, 0.6);
        new Food(350, "Cheese", "Dairy", "50g", 12, 1, 0, 0, 30);
        new Food(220, "Tofu", "Protein", "100g", 8, 2, 1.2, 0, 13);
        new Food(80, "Cucumber", "Vegetable", "1 medium", 1, 10, 1.5, 2, 0.1);
        new Food(150, "Mango", "Fruit", "1 medium", 1, 40, 2, 32, 0.5);
        new Food(320, "Cashews", "Nuts", "30g", 5, 9, 1, 2, 27);
        new Food(90, "Bell Pepper", "Vegetable", "1 medium", 1, 7, 2, 4, 0.3);
        new Food(290, "Granola", "Grain", "50g", 6, 40, 3, 20, 10);
        new Food(160, "Chickpeas", "Legume", "100g", 8, 30, 6, 4, 2.5);
        new Food(240, "Quinoa", "Grain", "100g", 9, 39, 4, 0, 3);
        new Food(140, "Orange", "Fruit", "1 medium", 1, 35, 3, 23, 0.2);
        new Food(70, "Zucchini", "Vegetable", "1 medium", 1, 6, 2, 3, 0.3);
        new Food(200, "Pumpkin Seeds", "Nuts", "30g", 7, 4, 2, 0, 17);
        new Food(180, "Spinach", "Vegetable", "1 cup", 2, 7, 4, 1, 0.3);
        new Food(210, "Dark Chocolate", "Snack", "30g", 3, 12, 3, 10, 15);
        new Food(250, "Whole Wheat Bread", "Grain", "2 slices", 7, 42, 6, 3, 3);
        new Food(100, "Pear", "Fruit", "1 medium", 0.6, 27, 4, 17, 0.2);

       
        this.foodData = Food.getAllFoodData(); 
    }

    addItem(itemName) {
        console.log(`Searching for food item: '${itemName}'`);
        const foodData = this.foodData.find(food => food.foodName.toLowerCase().includes(itemName.toLowerCase()));
    
        console.log(`Found food data:`, foodData);
    
        let totalQuantity = 0;
        this.foodList.querySelectorAll('.quantity-input').forEach(input => {
            totalQuantity += parseInt(input.value);
        });
    
        if (totalQuantity >= 20) {
            showAlert("Maximum of 20 items per meal!")
            return; 
        }
    
        const item = document.createElement('div');
        item.classList.add('item');
        item.textContent = `${foodData.foodName} - ${foodData.calories} kcal `;  
    
        const quantityContainer = document.createElement('div');
        quantityContainer.classList.add('quantity-container');
    
        const quantityLabel = document.createElement('label');
        quantityLabel.innerHTML = `Qty: `;
    
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = 1;  
        quantityInput.min = 1;    
        quantityInput.classList.add('quantity-input');
    
        quantityContainer.appendChild(quantityLabel);
        quantityContainer.appendChild(quantityInput);
        item.appendChild(quantityContainer);  
    
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
    
        quantityInput.addEventListener('input', () => {
            let newTotal = 0;
            this.foodList.querySelectorAll('.quantity-input').forEach(input => {
                newTotal += parseInt(input.value);
            });
    
            if (newTotal > 20) {
                showAlert("Total items cannot exceed 20!");
                quantityInput.value = Math.max(1, 20 - (newTotal - parseInt(quantityInput.value)));
            }
            
            this.calculateTotalCal();
        });
    }
    
    
    
    calculateTotalCal() {
        const foodItems = this.foodList.querySelectorAll('.item');
        let totals = { calories: 0, protein: 0, fiber: 0, carbs: 0, fat: 0, sugar: 0, count: 0 };
    
        foodItems.forEach(food => {
            const foodName = food.textContent.split(' - ')[0]?.trim();
            const quantity = food.querySelector('.quantity-input') ? parseInt(food.querySelector('.quantity-input').value) : 1;  
    
            const foodData = this.foodData.find(food => food.foodName.toLowerCase() === foodName.toLowerCase());
    
            if (foodData) {
                totals.calories += foodData.calories * quantity;  
                totals.protein += foodData.proteinContent * quantity;
                totals.fiber += foodData.fibreContent * quantity;
                totals.carbs += foodData.carbContent * quantity;
                totals.fat += foodData.fatContent * quantity;
                totals.sugar += foodData.sugarContent * quantity;
                totals.count += quantity;
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
            resultItem.innerHTML = `${food.foodName}  -  ${food.calories} kcals`;
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


//own alert 
function showAlert(message) {
    const alertBox = document.getElementById('quantity-alert');
    alertBox.textContent = message;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.animation = "fadeOut 0.7s ease-in-out";
        setTimeout(() => {
            alertBox.style.display = 'none';
            alertBox.style.animation = "fadeIn 0.7s ease-in-out";
        }, 300);
    }, 2000);
}

