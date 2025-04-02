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
    


    calculateTotalCal() {
        let totals = { calories: 0, protein: 0, fiber: 0, carbs: 0, fat: 0, sugar: 0, count: 0 };
        if (!this.foodList.hasChildNodes()) {
            this.updateNutritionUI(totals);
            return;
        }
    
        this.allMealFood = []; 
    
        const foodItems = [...this.foodList.querySelectorAll('.item')];
    
        // Fetch data for all food items
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
    
        // Wait for all fetches to complete before updating UI
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
        const formattedText = `
            <strong>${item.foodName}</strong> (${item.foodType})<br>
            Calories: ${item.calories}<br>
            Protein: ${item.proteinContent}g<br>
            Fibre: ${item.fibreContent}g<br>
            Carbs: ${item.carbContent}g<br>
            Fat: ${item.fatContent}g<br>
            Sugar: ${item.sugarContent}g<br>
            Serving Size: ${item.servingSize}
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
}

const foodView = new FoodView();


