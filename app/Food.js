// Done (mahybe more validations and stuff)
class Food {
    
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
    }

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

    toString(){
        return `Name: ${this.foodName}. Type: ${this.foodType}. Calories: ${this.calories} ServingSize: ${this.servingSize}. Protein: ${this.proteinContent}. Carbs: ${this.carbContent} Fibre: ${this.fibreContent}. Sugar: ${this.sugarContent}. Fat: ${this.fatContent}`;
    }
}

module.exports = Food;
