//FUNCTIONS TO ADD FOODS AND REMOVE THEM

const foodList = document.querySelector(".foodList");
const searchBar = document.querySelector(".search-bar");

const searchResultsContainer = document.createElement("div");
searchResultsContainer.classList.add("search-results");
foodList.appendChild(searchResultsContainer); 


function addItem(itemName) {
    const item = document.createElement("div");
    item.classList.add("item");
    
    const removeButton = document.createElement("button");
    removeButton.innerHTML = `<i class="fas fa-window-close" style="color: grey;"></i>`;
    
    removeButton.onclick = function() {
        item.remove();  
    };
    
    item.innerHTML = `${itemName} `;
    item.appendChild(removeButton);  
    foodList.appendChild(item);  
}

function removeFood(item){
    item.remove(item);

}
function filterFoods() {
    const query = searchBar.value.toLowerCase();
    const filteredFoods = dummyFoods.filter(food => food.toLowerCase().includes(query));

    searchResultsContainer.innerHTML = '';

    filteredFoods.forEach(food => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('item');
        resultItem.textContent = food;
        resultItem.addEventListener('click', function() {
            addItem(food);
            searchBar.value = '';
            searchResultsContainer.innerHTML = ''; 
        });
        searchResultsContainer.appendChild(resultItem);
    });
}

searchBar.addEventListener("input", filterFoods);

const dummyFoods = ["apple", "banana", "pizza", "sushi", "burger", "cod", "sausage"];
// dummyFoods.forEach(food => addItem(food)); 
