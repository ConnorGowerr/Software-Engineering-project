// Done (maybe more validations and stuff)
class Achievement {
    
    constructor(achievementName, achievementType, value) {
        this.achievementName = achievementName;
        this.achievementType = achievementType;
        this.value = value;

    }

    getAchievementName() {
        return this.achievementName;
    }

    getAchievementType() {
        return this.achievementType;
    }

    getValue() {
        return this.value;
    }



    toString(){
        return `Name: ${this.achievementName}. Type: ${this.achievementType}. Value: ${this.value}`;
    }

    }

export default Achievement;
