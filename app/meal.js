// Done (mahybe more validations and stuff)
class Meal {
    
    constructor(mealName, mealType, allFoods) {
        this.mealName = mealName;
        this.mealType = mealType;
        this.allFood = allFoods;
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



    toString(){
        return `Name: ${this.mealName}. Type: ${this.mealType}. allFoods: ${this.allFood}`;
    }

    }

module.exports = Meal;
