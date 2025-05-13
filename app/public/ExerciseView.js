class ExerciseView {
    #currentCph;
    #currentEx;
    #rendered;
    constructor() {
        this.exerciseList = document.querySelector('.exerciseList');
        this.selectedContainer = document.querySelector('.search-select');
        this.resultsContainer = document.querySelector('.search-results');
        this.calorieSection = document.querySelector('.calorieSection');
        this.activityPopup = document.getElementById("exercisePopup");
        this.popupOverlay = document.getElementById("exerciseOverlay");
        this.activityDuration = document.getElementById('activityDuration');
        this.activityIntensity = document.getElementById('activityIntensity');
        this.#currentCph = 0;
        this.#currentEx = 'No exercise selected';
        this.#rendered = 0;
        this.setupEventListeners();
    }

    setupEventListeners(){

        //search functionality (for every input fetch all exercises from database that contain the input)

        document.querySelector(".search-bar").addEventListener("input", (event) => {
            console.log("hi");
            const query = event.target.value;
            fetch(`/api/search-exercise?q=${query}`)
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

        //Note: i did try and use event listeners for these 2 events, 
        // but they don't seem to work when calling this.functions
        this.activityDuration.oninput = () =>{
            console.log('duration changed');
            this.updateSummaryUI();
        }
        this.activityIntensity.onchange = () =>{
            console.log('intensity changed');
            this.updateSummaryUI();
        }

        //2 activity buttons - 1 appears when wide screen, the other appears when thin screen.
        document.getElementById("activityBtn1").onclick = () => {
            console.log("activity")
            this.createActivity();
        }
        document.getElementById("activityBtn2").onclick = () => {
            console.log("activity")
            this.createActivity();
        }
    }

    selectExercise(itemName) {
        fetch(`/api/return-exercise?q=${itemName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch search results');
                }
                return response.json();
            })
            .then(exerciseData => {
                console.log("Found exercise:", exerciseData[0]);

                this.#currentEx = exerciseData[0].exercisename;
                this.#currentCph = exerciseData[0].caloriesperhour;
                this.selectedContainer.querySelector('#search-select').textContent = this.#currentEx;
                console.log('changed exercise');
                this.updateSummaryUI();
                // let totalQuantity = 0;
                // this.exerciseList.querySelectorAll('.quantity-input').forEach(input => {
                //     totalQuantity += parseInt(input.value);
                // });
    
                // if (totalQuantity >= 20) {
                //     showAlert("Maximum of 20 items per meal!");
                //     return;
                // }
    
                // const item = document.createElement('div');
                // item.classList.add('item');
    
                // const textcontainer = document.createElement('div');
                // textcontainer.classList.add('textcontainer');
                // textcontainer.textContent = `${exerciseData[0].foodname} - ${exerciseData[0].calories} kcal`;
    
                // const quantityContainer = document.createElement('div');
                // quantityContainer.classList.add('quantity-container');
    
                // const quantityLabel = document.createElement('label');
                // quantityLabel.innerHTML = `Qty: `;
    
                // const quantityInput = document.createElement('input');
                // quantityInput.type = 'number';
                // quantityInput.value = 1;
                // quantityInput.min = 1;
                // quantityInput.classList.add('quantity-input');
    
                // quantityContainer.appendChild(quantityLabel);
                // quantityContainer.appendChild(quantityInput);
                // item.appendChild(textcontainer);
                // item.appendChild(quantityContainer);
    
                // const removeButton = document.createElement('button');
                // removeButton.innerHTML = `<i class="fas fa-window-close" style="color: grey;"></i>`;
                // removeButton.onclick = () => {
                //     item.remove();
                //     this.calculateTotalCal();
                // };
    
                // item.appendChild(removeButton);
                // this.exerciseList.appendChild(item);
    
                // console.log("Food item added:", exerciseData);
                // this.calculateTotalCal();
    
                // quantityInput.addEventListener('input', () => {
                //     let newTotal = 0;
                //     this.exerciseList.querySelectorAll('.quantity-input').forEach(input => {
                //         newTotal += parseInt(input.value);
                //     });
    
                //     if (newTotal > 20) {
                //         this.showAlert("Total items cannot exceed 20!");
                //         quantityInput.value = Math.max(1, 20 - (newTotal - parseInt(quantityInput.value)));
                //     }
    
                //     this.calculateTotalCal();
                // });
            })
            .catch(error => console.error('Error fetching search results:', error));
    }
    

    //funtion to create a meal objecrs from all items in the current food list, user can confirm cancel (upon confirm reset everything and create meal, upon cancel drop the opoup)
    async createActivity() {
        const activityForm = document.getElementById("activityForm");
        const activityPopup = document.getElementById("activityPopup");
        const popupOverlay = document.getElementById("popupOverlay");
        const confirmBtn = document.getElementById("confirmBtn");
        const cancelBtn = document.getElementById("cancelBtn");

        const popupE = document.getElementById("popupE");
        const popupC = document.getElementById("popupC");
        const popupD = document.getElementById("popupD");
        const popupI = document.getElementById("popupI");
        const popupT = document.getElementById("popupT");
    
        const exercise = document.querySelectorAll('.item');
    
        // for (const food of exercise) {
        //     const foodName = food.textContent.split(' - ')[0]?.trim();
        //     const quantityInput = food.querySelector('.quantity-input');
        //     const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
        //     try {
        //         const response = await fetch(`/api/return-food?q=${foodName}`);
        //         if (!response.ok) throw new Error('Failed to fetch food data');
    
        //         const foodData = await response.json();
        //         const foundFood = foodData[0];
    
        //         if (foundFood) {
        //             totalCals += foundFood.calories * quantity;
        //             foundFood.quantity = quantity;
        //             this.allMealFood.push(foundFood);
        //         }
        //     } catch (err) {
        //         console.error(`Error fetching food data for "${foodName}":`, err);
        //     }
        // }
   
        popupE.textContent = this.#currentEx;
        popupC.textContent = this.#currentCph + ` calories per hour`;
        if (this.activityDuration.value == null || this.activityDuration.value <= 0)
        {
            popupD.textContent = `Duration: 0 minutes`;
        }
        else
        {
            popupD.textContent = `Duration: ` + this.activityDuration.value + ` minutes`;
        }
        popupI.textContent = this.activityIntensity.value + `x intensity`;
        popupT.textContent = `Total Calories: ` + Math.floor((this.#currentCph / 60) * this.activityDuration.value * this.activityIntensity.value);
        activityPopup.style.display = "block";
        popupOverlay.style.display = "block";
    
        confirmBtn.onclick = async (event) => {
            event.preventDefault();
            //Only proceeds if all the important data is valid, otherwise an alert is displayed.
            if (this.#currentEx !== 'No exercise selected' && this.activityIntensity.value != 0
                && this.activityDuration.value != null && this.activityDuration.value > 0
                && this.activityDuration.value <= 1440)
            {
                const activityDuration = document.getElementById("activityDuration").value;
                let activityIntensity = document.getElementById("activityIntensity").value;
                switch (activityIntensity)
                {
                    case "0.5":
                        activityIntensity = 'Smouldering';
                        break;
                    case "1.5":
                        activityIntensity = 'Inferno';
                        break;
                    case "2":
                        activityIntensity = 'Hellfire';
                        break;
                    default:
                        activityIntensity = 'Burning';
                        break;
                    //Switches intensity to a word because it's saved as an enum. Defaults to burning (1x) intensity

                }
                const activityData = {
                    username: window.sessionStorage.getItem("username"),
                    exercisename: this.#currentEx,
                    activityduration: activityDuration,
                    activityintensity: activityIntensity
                };
        
                try {
                    const response = await fetch('/api/activity', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(activityData)
                    });



                    console.table(activityData);
                    console.table(response);
                    console.table(JSON.stringify(activityData))

        
                    if (!response.ok) throw new Error('Failed to send activity to server');
                    const result = await response.json();
                    console.log('Activity saved:', result);
                    
                    activityPopup.style.display = "none";
                    popupOverlay.style.display = "none";

                    //Reset inputted data
                    
                    this.#currentCph = 0;
                    this.#currentEx = 'No exercise selected';
                    this.selectedContainer.querySelector('#search-select').textContent = this.#currentEx;
                    this.activityDuration.value = null;
                    this.activityIntensity.value = 0;
                    this.updateSummaryUI();

        
                } catch (error) {
                    console.error('Error saving activity:', error);
                } 
            }
            else
            {
                alert('Please fill in all information before submitting.')
            }
        };
    
        cancelBtn.onclick = (event) => {
            event.preventDefault();
            activityPopup.style.display = "none";
            popupOverlay.style.display = "none";
        };

        
    }
    
    
    

    //for every food in basket work out attributes

    // calculateTotalCal() {
    //     let totals = { caloriesPerHour: 0, duration: 0, calories: 0};
    //     if (!this.exerciseList.hasChildNodes()) {
    //         this.updateSummaryUI(totals);
    //         return;
    //     }
    
    //     this.allMealFood = []; 
    
    //     const foodItems = [...this.exerciseList.querySelectorAll('.item')];
    
    //     const fetchPromises = foodItems.map(food => {
    //         const foodName = food.textContent.split(' - ')[0]?.trim();
    //         const quantity = food.querySelector('.quantity-input') ? parseInt(food.querySelector('.quantity-input').value) : 1;
    
    //         return fetch(`/api/return-food?q=${foodName}`)
    //             .then(response => {
    //                 if (!response.ok) {
    //                     throw new Error('Failed to fetch search results');
    //                 }
    //                 return response.json();
    //             })
    //             .then(foodData => {
    //                 totals.calories += foodData[0].calories * quantity;
    //                 totals.protein += foodData[0].protein * quantity;
    //                 totals.fiber += foodData[0].fibre * quantity;
    //                 totals.carbs += foodData[0].carbs * quantity;
    //                 totals.fat += foodData[0].fat * quantity;
    //                 totals.sugar += foodData[0].sugar * quantity;
    //                 totals.count += quantity;
    
    //                 for (let i = 0; i < quantity; i++) {
    //                     this.allMealFood.push(foodData[0]);
    //                 }
    //             })
    //             .catch(error => console.error('Error fetching food data:', error));
    //     });
    
    //     // wait for all fetches then process.
    //     Promise.all(fetchPromises).then(() => {
    //         this.updateSummaryUI(totals);
    //     });
    // }
    
    //This works
    updateSummaryUI() {
        console.log('summary updated');
        this.calorieSection.querySelector('.calorieTitle1').textContent = `Calories Burnt per Hour: ` + this.#currentCph;
        if(this.activityDuration.value == '')
        {
            this.calorieSection.querySelector('.calorieTitle2').textContent = `Duration: 0 minutes`;
        }
        else
        {
            this.calorieSection.querySelector('.calorieTitle2').textContent = `Duration: ` + activityDuration.value + ` minutes`;
        }
        this.calorieSection.querySelector('.calorieTitle3').textContent = `Total Calories Burnt: `
             + Math.floor((this.#currentCph / 60) * activityDuration.value * activityIntensity.value);
    }

    renderSearchResults(filteredExerciseData) {
        this.resultsContainer.innerHTML = '';
        this.#rendered = 0;
        if (document.querySelector('.search-bar').value !== '')
        {
            for (const exercise of filteredExerciseData) {
                const resultItem = document.createElement('div');
                resultItem.classList.add('search-item');
                resultItem.textContent = `${exercise.exercisename} - ${exercise.caloriesperhour} kcals/hr`;

                resultItem.onclick = async () => {
                    //const isConfirmed = await this.createMealPopup(exercise);

                    //if (isConfirmed) {
                        this.selectExercise(exercise.exercisename);
                        document.querySelector('.search-bar').value = '';
                        this.resultsContainer.innerHTML = '';
                    //}
                };

                this.resultsContainer.appendChild(resultItem);
                this.#rendered = this.#rendered + 1;
                if (this.#rendered >= 10)
                {
                    break;
                }
            }
        }
    }

    
    //display popup with food attributes currently a bit buggy)

    // async createMealPopup(item) {
    //     console.table(item)
       
    //     const formattedText = `
    //         <strong>${item.foodname}</strong> (${item.foodtype})<br>
    //         Calories: ${item.calories}<br>
    //         Protein: ${item.protein}g<br>
    //         Fibre: ${item.fibre}g<br>
    //         Carbs: ${item.carbs}g<br>
    //         Fat: ${item.fat}g<br>
    //         Sugar: ${item.sugar}g<br>
    //         Serving Size: ${item.servingsize}
    //     `;
    //     document.getElementById("foodMessagePopup").innerHTML = formattedText;

    //     this.activityPopup.style.display = "block";
    //     this.popupOverlay.style.display = "block";

    //     return new Promise((resolve) => {
    //         document.getElementById("confirmBtn2").onclick = (event) => {
    //             event.preventDefault();
    //             this.closePopup();
    //             resolve(true);
    //         };

    //         document.getElementById("cancelBtn2").onclick = (event) => {
    //             event.preventDefault();
    //             this.closePopup();
    //             resolve(false);
    //         };
    //     });
    // }

    // closePopup() {
    //     this.activityPopup.style.display = "none";
    //     this.popupOverlay.style.display = "none";
        
    // }

    // showAlert(message) {
    //     const alertBox = document.getElementById('quantity-alert');
    //     alertBox.textContent = message;
    //     alertBox.style.display = 'block';

    //     setTimeout(() => {
    //         alertBox.style.animation = "fadeOut 0.7s ease-in-out";
    //         setTimeout(() => {
    //             alertBox.style.display = 'none';
    //             alertBox.style.animation = "fadeIn 0.7s ease-in-out";
    //         }, 300);
    //     }, 2000);
    // }
}

const exerciseView = new ExerciseView();