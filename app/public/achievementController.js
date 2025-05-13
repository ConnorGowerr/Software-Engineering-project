//Functions to make an achievement and then fill progress randonmly( this will be replaced with real data)
import Achievement from "./achievement.js";


class AchievementController {
    constructor() {

        this.achievements = [
            new Achievement("Marathon Runner", "time", 180), 
            new Achievement("Weight Loss Champ", "weight", 10),
            new Achievement("Calorie Burner", "calories", 5000),
            new Achievement("Tracking Streak", "calories", 30), 
            new Achievement("5K Run", "time", 25),
            new Achievement("Muscle Gain", "weight", 5),  
            new Achievement("Fat Burner", "calories", 3000),  
            new Achievement("Daily Tracker", "calories", 7),
            new Achievement("Half-Marathon", "time", 120),
            new Achievement("10% Body Fat Drop", "weight", 10),  
            new Achievement("Extreme Calorie Burn", "calories", 100000),  
            new Achievement("Consistent Tracker", "calories", 100000),  
            new Achievement("1-Hour Run", "time", 60),  
            new Achievement("Goals Completed", "goals", 10),  
            new Achievement("Burn Master", "calories", 6000),  
            new Achievement("Long Distance runner", "activity", 1000),  
            new Achievement("5-Minute Plank", "time", 5),  
            new Achievement("Weight Cut", "weight", 12),  
            new Achievement("Daily Burn", "calories", 2000),  
            new Achievement("Yearly Tracker", "calories", 365)  
        ]

        fetch('/achievements')
        .then(res => res.json())
        .then(data => {
            console.log(data);
        });

    }


    makeRandomAchievements() {
        const achievements = [];

        for (let i = 0; i < 20; i++) {
            const achievement = this.achievements[i % this.achievements.length]; 
            const progress = Math.random() * 100;

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
            console.log(data.progress)
            const achievement = document.createElement('div');
            achievement.classList.add('achievement');

            const progressBar = document.createElement('div');
            progressBar.classList.add('progress-fill');
            progressBar.style.width = data.progress + "%";


            //unit->type
            const typeClassMap = {
                "time": "timeAchievement",
                "goals": "unitAchievement",
                "activity": "unitAchievement",
                "weight": "weightAchievement",
                "calories": "calorieAchievement",
            };
            
            progressBar.classList.add(typeClassMap[data.type]);
            
            
            
            
            const imageMaps = {
                "time": {
                    1: "images/Time1.png",
                    10: "images/Time2.png",
                    50: "images/Time3.png",
                    100: "images/Time4.png"
                },
                "calories": {
                    1: "images/Calories1.png",
                    10: "images/Calories2.png",
                    50: "images/Calories3.png",
                    100: "images/Calories4.png"
                },
                "goals": {
                    1: "images/Activity1.png",
                    10: "images/Activity2.png",
                    50: "images/Activity3.png",
                    100: "images/Activity4.png"
                },
                "activity": {
                    1: "images/Activity1.png",
                    10: "images/Activity2.png",
                    50: "images/Activity3.png",
                    100: "images/Activity4.png"
                },
                "weight": {
                    1: "images/Unit1.png",
                    10: "images/Unit2.png",
                    50: "images/Unit3.png",
                    100: "images/Unit4.png"
                }
            };

            const progressThresholds = [1, 10, 50, 100];

            const achievedImages = imageMaps[data.type] || {};

            let medalsHTML = progressThresholds.map(threshold => {
                let imageSrc = "images/unachieved.png";
                if (data.progress >= threshold) {
                    imageSrc = achievedImages[threshold] || imageSrc;
                }

                let result = Math.round(data.value * (threshold / 100));

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
                this.selectAchievement(event.currentTarget, data);
            });
        });
    }
    

    //to display the selected achievement bigger in middle of screen, also removes upon tapping of the screen other than the selected achievement
    selectAchievement(achievement, data) {
        console.log("achievement");

        const selectedAchievement = achievement.cloneNode(true);
        selectedAchievement.classList.add('selected'); 

        

        const extraInfo = document.createElement("div");
        extraInfo.classList.add("extraInfo")
        extraInfo.innerHTML = `<p>Keep going, only ${(Math.round((data.value * (100 - data.progress)) / 100))} left!</p>`;

        //put a text between medals and bar
        extraInfo.style.textAlign ="center";
        extraInfo.style.margin ="margin-auto";
        selectedAchievement.insertBefore(extraInfo, selectedAchievement.children[2]);
        selectedAchievement.children[1].style.height ="30%";
        selectedAchievement.children[1].style.margin ="2% 0 0 0%";

        //make progress bar glow
        selectedAchievement.children[3].style.boxShadow = "0 0 10px 5px rgba(255, 255, 255, 0.8)";

        // selectedAchievement.children[2].children.style.hover

        const overlay = document.createElement('div');
        overlay.classList.add('overlay'); 
        document.body.appendChild(overlay);

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