// UPDATES THE HTML
class FoodView {
    constructor() {
        this.foodListContainer = document.querySelector('.foodList');
    }

    addFoodItemToUI(foodData) {
        
        const item = document.createElement('div');
        item.classList.add('item');
        item.innerHTML = `<span class="food-name">${foodData.foodName}</span> - ${foodData.calories} kcal`;

        const removeButton = document.createElement('button');
        removeButton.innerHTML = `<i class="fas fa-window-close" style="color: grey;"></i>`;
        removeButton.onclick = () => {
            item.remove();
        };

        item.appendChild(removeButton);
        this.foodListContainer.appendChild(item);
    }

    updateNutritionUI(totals) {
        const nutritionInfo = document.querySelector('.nutrientSection');

        nutritionInfo.querySelector('.calorieTitle').textContent = `Total Calories: ${totals.calories}`;
        nutritionInfo.querySelector('.itemTotalTitle').textContent = `Total Items: ${totals.count}`;
        nutritionInfo.querySelector('.protein').textContent = `Protein: ${totals.protein}g`;
        nutritionInfo.querySelector('.fiber').textContent = `Fiber: ${totals.fiber}g`;
        nutritionInfo.querySelector('.carbs').textContent = `Carbohydrates: ${totals.carbs}g`;
        nutritionInfo.querySelector('.fat').textContent = `Fat: ${totals.fat}g`;
        nutritionInfo.querySelector('.sugar').textContent = `Sugar: ${totals.sugar}g`;
    
    }
}

export default FoodView;
