class FoodView {
    constructor() {
        this.foodList = document.querySelector('.foodList');
        this.resultsContainer = document.querySelector('.search-results');
        this.nutrientSection = document.querySelector('.nutrientSection');
        this.mealPopup = document.getElementById("foodPopup");
        this.popupOverlay = document.getElementById("foodOverlay");
        this.allMealFood=[];

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelector(".search-bar").addEventListener("input", (event) => {
            console.log("hi");
            const query = event.target.value;
            fetch(`/api/search-food?q=${query}`)
                .then(response => {
                    if (!response.ok) {
                        console.error('Server returned an error:', response.statusText);
                        throw new Error('Failed to fetch search results');
                    }
                    return response.json();
                })
                .then(data => {
                    this.renderSearchResults(data);
                })
                .catch(error => console.error('Error fetching search results:', error));
        });

        document.getElementById("mealBtn").onclick = () => {
            console.log("meal")
            this.createMeal();
        }
    }

    addFoodItemToUI(itemName) {
        fetch(`/api/return-food?q=${itemName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch search results');
                }
                return response.json();
            })
            .then(foodData => {
                console.log("Found food:", foodData[0]);
    
                let totalQuantity = 0;
                this.foodList.querySelectorAll('.quantity-input').forEach(input => {
                    totalQuantity += parseInt(input.value);
                });
    
                if (totalQuantity >= 20) {
                    showAlert("Maximum of 20 items per meal!");
                    return;
                }
    
                const item = document.createElement('div');
                item.classList.add('item');
    
                const textcontainer = document.createElement('div');
                textcontainer.classList.add('textcontainer');
                textcontainer.textContent = `${foodData[0].foodname} - ${foodData[0].calories} kcal`;
    
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
                item.appendChild(textcontainer);
                item.appendChild(quantityContainer);
    
                const removeButton = document.createElement('button');
                removeButton.innerHTML = `<i class="fas fa-window-close" style="color: grey;"></i>`;
                removeButton.onclick = () => {
                    item.remove();
                    this.calculateTotalCal();
                };
    
                item.appendChild(removeButton);
                this.foodList.appendChild(item);
    
                console.log("Food item added:", foodData);
                this.calculateTotalCal();
    
                quantityInput.addEventListener('input', () => {
                    let newTotal = 0;
                    this.foodList.querySelectorAll('.quantity-input').forEach(input => {
                        newTotal += parseInt(input.value);
                    });
    
                    if (newTotal > 20) {
                        this.showAlert("Total items cannot exceed 20!");
                        quantityInput.value = Math.max(1, 20 - (newTotal - parseInt(quantityInput.value)));
                    }
    
                    this.calculateTotalCal();
                });
            })
            .catch(error => console.error('Error fetching search results:', error));
    }
    

    //funtion to create a meal objecrs from all items in the current food list, user can confirm cancel (upon confirm reset everything and create meal, upon cancel drop the opoup)
    async createMeal() {
        const mealForm = document.getElementById("mealForm");
        const mealPopup = document.getElementById("mealPopup");
        const popupOverlay = document.getElementById("popupOverlay");
        const confirmBtn = document.getElementById("confirmBtn");
        const cancelBtn = document.getElementById("cancelBtn");
        const popupMessage = document.getElementById("popupMessage");
    
        const foodItems = document.querySelectorAll('.item');
        let totalCals = 0;
        this.allMealFood = [];
    
        for (const food of foodItems) {
            const foodName = food.textContent.split(' - ')[0]?.trim();
            const quantityInput = food.querySelector('.quantity-input');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
            try {
                const response = await fetch(`/api/return-food?q=${foodName}`);
                if (!response.ok) throw new Error('Failed to fetch food data');
    
                const foodData = await response.json();
                const foundFood = foodData[0];
    
                if (foundFood) {
                    totalCals += foundFood.calories * quantity;
                    foundFood.quantity = quantity;
                    this.allMealFood.push(foundFood);
                }
            } catch (err) {
                console.error(`Error fetching food data for "${foodName}":`, err);
            }
        }
   
        popupMessage.textContent = `Total Calories: ${totalCals}`;
        mealPopup.style.display = "block";
        popupOverlay.style.display = "block";
    
    
        mealForm.onsubmit = async (event) => {
            event.preventDefault();
    
            const mealName = document.getElementById("mealName").value;
            const mealType = document.getElementById("mealType").value;
    
            const mealData = {
                mealName,
                mealType,
                foods: this.allMealFood
            };
    
            try {
                const response = await fetch('/api/meal', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(mealData)
                });



                console.table(mealData);
                console.table(response);
                console.table(JSON.stringify(mealData))

    
                if (!response.ok) throw new Error('Failed to send meal to server');
    
                const result = await response.json();
                console.log('Meal saved:', result);
    
                this.allMealFood.length = 0;
                this.foodList.querySelectorAll('.item').forEach(item => item.remove());
                this.calculateTotalCal();
                mealPopup.style.display = "none";
                popupOverlay.style.display = "none";

    
            } catch (error) {
                console.error('Error saving meal:', error);
            }

            
        };
    
        cancelBtn.onclick = (event) => {
            event.preventDefault();
            mealPopup.style.display = "none";
            popupOverlay.style.display = "none";
        };

        
    }
    
    
    


    calculateTotalCal() {
        let totals = { calories: 0, protein: 0, fiber: 0, carbs: 0, fat: 0, sugar: 0, count: 0 };
        if (!this.foodList.hasChildNodes()) {
            this.updateNutritionUI(totals);
            return;
        }
    
        this.allMealFood = []; 
    
        const foodItems = [...this.foodList.querySelectorAll('.item')];
    
        const fetchPromises = foodItems.map(food => {
            const foodName = food.textContent.split(' - ')[0]?.trim();
            const quantity = food.querySelector('.quantity-input') ? parseInt(food.querySelector('.quantity-input').value) : 1;
    
            return fetch(`/api/return-food?q=${foodName}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch search results');
                    }
                    return response.json();
                })
                .then(foodData => {
                    totals.calories += foodData[0].calories * quantity;
                    totals.protein += foodData[0].protein * quantity;
                    totals.fiber += foodData[0].fibre * quantity;
                    totals.carbs += foodData[0].carb * quantity;
                    totals.fat += foodData[0].fat * quantity;
                    totals.sugar += foodData[0].sugarContent * quantity;
                    totals.count += quantity;
    
                    for (let i = 0; i < quantity; i++) {
                        this.allMealFood.push(foodData[0]);
                    }
                })
                .catch(error => console.error('Error fetching food data:', error));
        });
    
<<<<<<< HEAD
=======
        // wait for all fetches, if any fail then we have a problem
>>>>>>> 58112483e4d18f530d41e59fa56bcec03a8c5f17
        Promise.all(fetchPromises).then(() => {
            this.updateNutritionUI(totals);
        });
    }
    

    updateNutritionUI(totals) {
        this.nutrientSection.querySelector('.calorieTitle').textContent = `Total Calories: ${totals.calories}`;
        this.nutrientSection.querySelector('.itemTotalTitle').textContent = `Total Items: ${totals.count}`;
        this.nutrientSection.querySelector('.protein').textContent = `Protein: ${totals.protein}g`;
        this.nutrientSection.querySelector('.fiber').textContent = `Fiber: ${totals.fiber}g`;
        this.nutrientSection.querySelector('.carbs').textContent = `Carbohydrates: ${totals.carbs}g`;
        this.nutrientSection.querySelector('.fat').textContent = `Fat: ${totals.fat}g`;
        this.nutrientSection.querySelector('.sugar').textContent = `Sugar: ${totals.sugar}g`;
    }

    renderSearchResults(filteredFoodData) {
        this.resultsContainer.innerHTML = '';

        for (const food of filteredFoodData) {
            const resultItem = document.createElement('div');
            resultItem.classList.add('search-item');
            resultItem.textContent = `${food.foodname} - ${food.calories} kcals`;

            resultItem.onclick = async () => {
                const isConfirmed = await this.createMealPopup(food);

                if (isConfirmed) {
                    this.addFoodItemToUI(food.foodname);
                    document.querySelector('.search-bar').value = '';
                    this.resultsContainer.innerHTML = '';
                }
            };

            this.resultsContainer.appendChild(resultItem);
        }
    }

    async createMealPopup(item) {
        console.table(item)
       
        const formattedText = `
            <strong>${item.foodname}</strong> (${item.foodtype})<br>
            Calories: ${item.calories}<br>
            Protein: ${item.protein}g<br>
            Fibre: ${item.fibre}g<br>
            Carbs: ${item.carbs}g<br>
            Fat: ${item.fat}g<br>
            Sugar: ${item.sugar}g<br>
            Serving Size: ${item.servingsize}
        `;
        document.getElementById("foodMessagePopup").innerHTML = formattedText;

        this.mealPopup.style.display = "block";
        this.popupOverlay.style.display = "block";

        return new Promise((resolve) => {
            document.getElementById("confirmBtn2").onclick = (event) => {
                event.preventDefault();
                this.closePopup();
                resolve(true);
            };

            document.getElementById("cancelBtn2").onclick = (event) => {
                event.preventDefault();
                this.closePopup();
                resolve(false);
            };
        });
    }

    closePopup() {
        this.mealPopup.style.display = "none";
        this.popupOverlay.style.display = "none";
        
    }

    showAlert(message) {
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

            let food =  fetch(`/api/return-food?q=${foodName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch search results');
                }
                return response.json();
            })
            .then(foodData => {
                totals.calories += foodData[0].calories * quantity;
                totals.protein += foodData[0].protein * quantity;
                totals.fiber += foodData[0].fibre * quantity;
                totals.carbs += foodData[0].carb * quantity;
                totals.fat += foodData[0].fat * quantity;
                totals.sugar += foodData[0].sugarContent * quantity;
                totals.count += quantity;

                for (let i = 0; i < quantity; i++) {
                    this.allMealFood.push(foodData[0]);
                }
            });

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
}

const foodView = new FoodView();


