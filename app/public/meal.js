// Done (mahybe more validations and stuff)
class Meal {
    
    static allMealData = [];
    constructor(mealName, mealType, allFoods) {
        this.mealName = mealName;
        this.mealType = mealType;
        this.allFood = allFoods;
        Meal.allMealData.push(this);
    }

    getMealName() {
        return this.mealName;
    }

    getAllFoods() {
        return this.allFood;
    }

    getmealType() {
        return this.mealType;
    }


    static getAllMealData() {
        return Meal.allMealData;
    }

    static getMealData(mealName) {
        return Meal.allMealData.find(meal => meal.mealName.toLowerCase() === mealName.toLowerCase());
    }

    toString(){
        return `Name: ${this.mealName}. Type: ${this.mealType}. allFoods: ${this.allFood}`;
    }

    }

export default Meal;
