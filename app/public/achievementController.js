//Functions to make an achievement and then fill progress randonmly( this will be replaced with real data)
import Achievement from "./achievement.js";


class AchievementController {
    constructor() {

        this.achievements = [
            new Achievement("Marathon Runner", "time", 180), 
            new Achievement("Weight Loss Champ", "weight", 10),
            new Achievement("Calorie Burner", "caloriesBurned", 5000),
            new Achievement("Tracking Streak", "caloriesTracked", 30), 
            new Achievement("5K Run", "time", 25),
            new Achievement("Muscle Gain", "weight", 5),  
            new Achievement("Fat Burner", "caloriesBurned", 3000),  
            new Achievement("Daily Tracker", "caloriesTracked", 7),
            new Achievement("Half-Marathon", "time", 120),
            new Achievement("10% Body Fat Drop", "weight", 10),  
            new Achievement("Extreme Calorie Burn", "caloriesBurned", 100000),  
            new Achievement("Consistent Tracker", "caloriesTracked", 100000),  
            new Achievement("1-Hour Run", "time", 60),  
            new Achievement("Goals Completed", "goals", 10),  
            new Achievement("Burn Master", "caloriesBurned", 6000),  
            new Achievement("Long Distance runner", "activity", ),  
            new Achievement("5-Minute Plank", "time", 5),  
            new Achievement("Weight Cut", "weight", 12),  
            new Achievement("Daily Burn", "caloriesBurned", 2000),  
            new Achievement("Yearly Tracker", "caloriesTracked", 365)  
        ]

    }


    makeRandomAchievements() {
        const achievements = [];

        for (let i = 0; i < 20; i++) {
            const achievement = this.achievements[i % this.achievements.length]; 
            const progress = Math.floor(Math.random() * 101); 

            achievements.push({
                title: achievement.getAchievementName(),
                medals: `Medals ${i + 1}`,
                progress: progress,
                type: achievement.getAchievementType(),
                value: achievement.getValue()
            });
        }
        return achievements;
    }

    async fetchAchievementsData() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(this.makeRandomAchievements());
            }, 100);
        });
    }

    async generateAchievements() {
        const achievementContainer = document.querySelector('.AchievementContainer');
        achievementContainer.innerHTML = "";

        const data = await this.fetchAchievementsData();

        data.forEach(data => {
            const achievement = document.createElement('div');
            achievement.classList.add('achievement');

            const progressBar = document.createElement('div');
            progressBar.classList.add('progress-fill');
            progressBar.style.width = data.progress + "%";

            const typeClassMap = {
                "time": "timeAchievement",
                "goals": "timeAchievement",
                "activity": "timeAchievement",
                "weight": "mealAchievement",
                "caloriesBurned": "calorieBurnedAchievement",
                "caloriesTracked": "calorieTrackedAchievement"
            };
            
            progressBar.classList.add(typeClassMap[data.type]); 

            const achievedImages = {
                1: "images/Meal25.png",
                10: "images/Meal50.png",
                50: "images/Meal75.png",
                100: "images/Meal100.png"
            };
            
            const progressThresholds = [1, 10, 50, 100];
            
            let medalsHTML = progressThresholds.map(threshold => {

                let imageSrc = "images/unachieved.png";
                if(data.progress>=threshold){
                   imageSrc = achievedImages[threshold];
                }

                let result =Math.max(Math.round(data.value * (threshold / 100)), 1);

                return `
                    <div class="medal">
                        <img src="${imageSrc}" alt="Medal ${threshold}%">
                        <p>${result} unit</p>
                    </div>
                `;
            }).join('');
            
            achievement.innerHTML = `
                <div id="achievementTitle">
                    <p>${data.title}</p>
                </div>
                <div class="medal-container">
                    ${medalsHTML}
                </div>
                <div id="achievementProgressBar"></div>
            `;


            const progressBarContainer = achievement.querySelector('#achievementProgressBar');
            progressBarContainer.appendChild(progressBar);
            achievementContainer.appendChild(achievement);

            achievement.addEventListener("click", (event) => {
                this.selectAchievement(event.currentTarget);
            });
        });
    }
    

    //to display the selected achievement bigger in middle of screen, also removes upon tapping of the screen other than the selected achievement
    selectAchievement(achievement) {
        console.log("achievement");

        const selectedAchievement = achievement.cloneNode(true);
        selectedAchievement.classList.add('selected'); 

        const overlay = document.createElement('div');
        overlay.classList.add('overlay'); 
        document.body.appendChild(overlay);

        selectedAchievement.style.position = 'fixed';
        selectedAchievement.style.top = '50%';
        selectedAchievement.style.left = '50%';
        selectedAchievement.style.transform = 'translate(-50%, -50%)';
        selectedAchievement.style.zIndex = '1000';
        selectedAchievement.style.width = '50vw'; 
        selectedAchievement.style.height = '40vh';  
        selectedAchievement.style.transition = 'transform 0.3s ease, width 0.3s ease, height 0.3s ease';

        document.body.appendChild(selectedAchievement);

        document.addEventListener("click", (event) =>{
            if (event.target === overlay) {
                document.body.removeChild(overlay);
                document.body.removeChild(selectedAchievement);
            }
        });

    }
}


const achievementController = new AchievementController();
achievementController.generateAchievements();