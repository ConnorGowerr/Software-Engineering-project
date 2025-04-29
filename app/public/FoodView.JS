class FoodView {
    constructor() {
        this.foodList = document.querySelector('.foodList');
        this.resultsContainer = document.querySelector('.search-results');
        this.nutrientSection = document.querySelector('.nutrientSection');
        this.mealPopup = document.getElementById("foodPopup");
        this.popupOverlay = document.getElementById("foodOverlay");

        this.setupEventListeners();
    }


    // made this method to initialize all event listeners,self explanitory just initializes all main event listeners for the page
    setupEventListeners(){

        //search functionality, on every input the user does we send a request to our sevrer to obtain all values that contain the current input, and the return these values to the browser so we can display them to the user.
        document.querySelector(".search-bar").addEventListener("input", (event) => {
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
            this.createMeal();
        }

        this.cycleSearchPlaceholder('.search-bar', [
            "Pizza", "Sushi", "Tacos", "Cheese Burger", "Pasta",
            "Ramen", "Salad", "Curry", "Beef Steak", "Ice Cream"
        ]);

        document.querySelector(".extraButton").addEventListener("click", e => {
            e.preventDefault();
            this.ingredientPopup();
        });
    }

    ingredientPopup() {
        const Popup = document.querySelector("#ingredientPopup");
        const popupOverlay = document.getElementById("ingredientOverlay");
        const cancelBtn = document.getElementById("cancelBtn3");
        const foodForm = document.querySelector("#ingredientForm");
    
        
        Popup.style.display = "block";
        popupOverlay.style.display = "block";
        

        foodForm.onsubmit = async (event) => {
            console.log("Hiu")
            event.preventDefault();

            const name = document.getElementById("foodname").value;
            const type = document.getElementById("foodtype").value;
            const calories = document.getElementById("calories").value;
            const fats = document.getElementById("fats").value;
            const servingsize = document.getElementById("servingsize").value;
            const protein = document.getElementById("protein").value;
            const carbs = document.getElementById("carbs").value;
            const fibre = document.getElementById("fibre").value;
            const sugar = document.getElementById("sugar").value;


            const foodData = {
                name: name,
                type: type,
                calories: calories,
                fats: fats,
                servingsize: servingsize,
                protein: protein,
                carbs: carbs,
                fibre: fibre,
                sugar: sugar
            };

            console.table(JSON.stringify(foodData))
            try {
                const response = await fetch('/api/foodAdd', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(foodData)
                

                });

             

    
                if (!response.ok) throw new Error('Failed to send food to server');
                const result = await response.json();
                console.log('Food saved:', result);
                mealPopup.style.display = "none";
                popupOverlay.style.display = "none";
                this.addFoodItemToUI(name)
    
                
            } catch (error) {
                console.error('Error Food meal:', error);
                mealPopup.style.display = "none";
                popupOverlay.style.display = "none";
            }

        };

        cancelBtn.onclick = (event) => {
            event.preventDefault();
            mealPopup.style.display = "none";
            popupOverlay.style.display = "none";
        };

    }
    

    

  //Method to add a cetain food item to the 'basket' i.e. our food current selection.
  //Here we send a request for the parameter passed into this method and we return the exact food instance (itemname which is a unique field in our food Table)
  //then we create a custom 'item' div to store this object in the UI, we then appened this as a child to our basket.
  //we add extra functionality like a button with an event listener to allow for the button to be removed
  //we also add a quantity section to allow for users to change how many of a certain item they want.
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
    

    //Method to  allow user to log a meal
    //First were retrieve all food items from 'basket', we then request these from the database, wethen calculate total calories and store all these items in a new array
    //we then create the meal popup, i.e. a small popup so the user can enter the meal name and type they wish to use for this meal.
    //then we send a post request to our sever with all this information so that the server can work with the database to store this info
    async createMeal() {
        const mealForm = document.getElementById("mealForm");
        const mealPopup = document.getElementById("mealPopup");
        const popupOverlay = document.getElementById("popupOverlay");
        const confirmBtn = document.getElementById("confirmBtn");
        const cancelBtn = document.getElementById("cancelBtn");
        const popupMessage = document.getElementById("popupMessage");
        const totalCals = this.nutrientSection.querySelector('.calorieTitle').textContent;
        const calorieValue = totalCals.split(': ')[1];
        const protein = this.nutrientSection.querySelector('.protein').textContent;
        const proteinValue = protein.split(': ')[1];
        const carbs = this.nutrientSection.querySelector('.carbs').textContent;
        const carbsValue = carbs.split(': ')[1];
        const fat = this.nutrientSection.querySelector('.fat').textContent;
        const fatValue = fat.split(': ')[1];
       
 


        const foodItems = document.querySelectorAll('.item');
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
                    foundFood.quantity = quantity;
                    this.allMealFood.push(foundFood);
                }
            } catch (err) {
                console.error(`Error fetching food data for "${foodName}":`, err);
            }
        }
   
        popupMessage.innerHTML = `
        <div class="popupMessage">
            <div><Strong>Calories</Strong><br>${calorieValue}kcal</div>
            <div><Strong>Protein</Strong><br>${proteinValue}</div>
            <div><Strong>Carbs</Strong><br>${carbsValue}</div>
            <div><Strong>Fats</Strong><br>${fatValue}</div>
        </div>
        `;
         mealPopup.style.display = "block";
        popupOverlay.style.display = "block";
    
    
        mealForm.onsubmit = async (event) => {
            event.preventDefault();
    
            const mealName = document.getElementById("mealName").value;
            const mealType = document.getElementById("mealType").value;
    


            const fullDate = new Date();

            const dateOnly = new Date(fullDate.getFullYear(), fullDate.getMonth(), fullDate.getDate());

            const mealData = {
                user: window.sessionStorage.getItem("username"),
                // mealName,
                mealType,
                foods: this.allMealFood,
                date: dateOnly,
                date2: fullDate
            };

    
            try {
                const response = await fetch('/api/meal', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(mealData)
                });

    
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
    
    
    

    //Method to calculate every nutritional value for our basket items
    //for every item extract all values and sum them,then update the UI accordingly

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
                    totals.carbs += foodData[0].carbs * quantity;
                    totals.fat += foodData[0].fat * quantity;
                    totals.sugar += foodData[0].sugar * quantity;
                    totals.count += quantity;
    
                    for (let i = 0; i < quantity; i++) {
                        this.allMealFood.push(foodData[0]);
                    }
                })
                .catch(error => console.error('Error fetching food data:', error));
        });
    
        // wait for all fetches then process.
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


    //displays all of the food items returned that matched the users search.
    //then on clicking any of the items, we create a foodpopup to display the exact food selected.
    renderSearchResults(filteredFoodData) {
        this.resultsContainer.innerHTML = '';
    
        for (const food of filteredFoodData) {
            const resultItem = document.createElement('div');
            resultItem.classList.add('search-item');
    
            
            const plusIcon = document.createElement('span');
            plusIcon.innerHTML = '+'; 
            plusIcon.classList.add('plus-icon');
    
            plusIcon.onclick = async (event) => {
                event.stopPropagation(); 
                const isConfirmed = await this.createMealPopup(food);
    
                if (isConfirmed) {
                    this.addFoodItemToUI(food.foodname);
                    document.querySelector('.search-bar').value = '';
                    this.resultsContainer.innerHTML = '';
                }
            };
    
            const text = document.createElement('span');
            text.textContent = `${food.foodname} - ${food.calories} kcals`;
            text.classList.add('food-text');
    
            resultItem.appendChild(plusIcon);
            resultItem.appendChild(text);
    
            this.resultsContainer.appendChild(resultItem);
        }
    }

    
    //display popup with food attributes. 
    //On confirm add to basket and close popup
    //On cancel close popup
    async createMealPopup(item) {
        console.table(item)
        fetch('/meal')
        .then(res => res.json())
        .then(data => {
            console.log(data);
        });
       
        const formattedText = `
            <strong>${item.foodname}</strong>
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

    cycleSearchPlaceholder(className, items) {
        const element = document.querySelector(className);
        if (!element) return;
    
        let index = 0;
    
        function updatePlaceholder() {
            element.placeholder = `${items[index]}`;
            index = (index + 1) % items.length;
        }
    
        updatePlaceholder(); 
        setInterval(updatePlaceholder, 2000);
    }
}



const foodView = new FoodView();
