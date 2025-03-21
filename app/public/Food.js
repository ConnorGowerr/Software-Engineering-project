// Done (mahybe more validations and stuff)
class Food {

    static allFoodData = [];
    constructor(calories, foodName, foodType, servingSize, proteinContent, carbContent, fibreContent, sugarContent, fatContent) {
        this.foodName = foodName;
        this.foodType = foodType;
        this.calories = calories;
        this.servingSize = servingSize;
        this.proteinContent = proteinContent;
        this.carbContent = carbContent;
        this.fibreContent = fibreContent;
        this.sugarContent = sugarContent;
        this.fatContent = fatContent;
        Food.allFoodData.push(this);
    }

    // Getter methods
    getServingSize() {
        return this.servingSize;
    }

    getProteinContent() {
        return this.proteinContent;
    }

    getCarbContent() {
        return this.carbContent;
    }

    getFibreContent() {
        return this.fibreContent;
    }

    getSugarContent() {
        return this.sugarContent;
    }

    getFatContent() {
        return this.fatContent;
    }

    isNameValid() {
        return this.foodName && typeof this.foodName === "string" && this.foodName.trim().length > 0;
    }

    isCaloriesValid() {
        return Number.isInteger(this.calories) && this.calories >= 0;
    }

    static getAllFoodData() {
        return Food.allFoodData;
    }

    static getFoodData(foodName) {
        return Food.allFoodData.find(food => food.foodName.toLowerCase() === foodName.toLowerCase());
    }
}

export default Food;
