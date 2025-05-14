//Functions to make an achievement and then fill progress randonmly( this will be replaced with real data)
import Achievement from "./achievement.js";


class AchievementController {
    constructor() {



        fetch(`/achievements?q=${window.sessionStorage.username}`)
        .then(res => res.json())
        .then(data => {
            console.table(data);
           
            this.generateAchievements(this.makeRandomAchievements(data))
        });

    }


    makeRandomAchievements(data) {
    return data.map((achievement, index) => {
        let progress;

        const isFirstLog = 
            achievement.achievementname === 'First Meal Log' || 
            achievement.achievementname === 'First Activity Log';

        if (isFirstLog) {
            progress = Math.min(100, Math.floor((achievement.currentvalue / achievement.target) * 100));
        } else {
            progress = Math.floor(Math.random() * 100);
        }
       
        return {
            title: achievement.achievementname,
            medals: `Medals ${index + 1}`,
            progress,
            type: achievement.achievementtype,
            value: achievement.target
        };
    })
    }



    async generateAchievements(data) {
        const achievementContainer = document.querySelector('.AchievementContainer');
        achievementContainer.innerHTML = "";

      

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
            
            progressBar.classList.add(typeClassMap[data.type.toLowerCase()]);
            
            
            
            
            const imageMaps = {
                "time": {
                    1: "images/Time1.png",
                    10: "images/Time2.png",
                    50: "images/Time3.png",
                    100: "images/Time4.png"
                },
                "Time": {
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
            
            if (data.progress === 100) {
                achievement.innerHTML = `
                    <div id="achievementTitle">
                        <p>${data.title}</p>
                    </div>
                    <div class="medal-container">
                        ${medalsHTML}
                    </div>
                    <div id="achievementProgressBar" class="progress-bar dazzle"></div>
                `;
                
         
        
            } else {
                achievement.innerHTML = `
                    <div id="achievementTitle">
                        <p>${data.title}</p>
                    </div>
                    <div class="medal-container">
                        ${medalsHTML}
                    </div>
                    <div id="achievementProgressBar" class="progress-bar"></div>
                `;
            }



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
        if(data.progress == 100){
           extraInfo.innerHTML = `<p>Congrats You've Completed This Achievement</p>`;

        }
        else{
            extraInfo.innerHTML = `<p>Keep going, only ${(Math.round((data.value * (100 - data.progress)) / 100))} left!</p>`;
        }
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