class User {
    constructor(userName, name, email, password, currentWeight, dob, height, gender) {
        this.userName = userName;
        this.name = name;
        this.email = email;
        this.password = password;
        this.currentWeight = currentWeight;
        this.dob = new Date(dob);
        this.dateOfCreation = this.niceDate(new Date());
        this.height = height;
        this.gender = gender;
        this.achievementPoints = 0;
        this.allMeals = [];
        this.allActivities = [];
        this.allGroups = [];
        this.allGoals = [];
        this.allAchievements = [];
    }


    getUserName() { return this.userName; }
    getName() { return this.name; }
    getEmail() { return this.email; }
    getPassword() { return this.password; }
    getCurrentWeight() { return this.currentWeight; }
    getDob() { return this.dob; }
    getDateOfCreation() { return this.dateOfCreation; }
    getHeight() { return this.height; }
    getGender() { return this.gender; }
    getAchievementPoints() { return this.achievementPoints; }
    getAllMeals() { return this.allMeals; }
    getAllActivities() { return this.allActivities; }
    getAllGroups() { return this.allGroups; }
    getAllGoals() { return this.allGoals; }
    getAllAchievements() { return this.allAchievements; }
    
    toString() {
        return `User: ${this.userName}, Name: ${this.name}, Email: ${this.email}`;
    }
}

export default User;
