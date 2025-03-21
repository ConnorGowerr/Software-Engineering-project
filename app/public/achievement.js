//Functions to make an achievement and then fill progress randonmly( this will be replaced with real data)


function makeRandomAchievements() {
    const achievements = [];
    for (let i = 1; i <= 20; i++) {
        const progress = Math.floor(Math.random() * 101);         
        achievements.push({
            title: `Achievement ${i}`,
            medals: `Medals ${i}`,
            progress: progress
        });
    }
    return achievements;
}


async function fetchAchievementsData() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(achievementsData);
        }, 100); 
    });
}


async function generateAchievements() {
    const achievementContainer = document.querySelector('.AchievementContainer');
    
    const data = await fetchAchievementsData(); 

    data.forEach(data => {
        const achievement = document.createElement('div');
        achievement.classList.add('achievement');

        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-fill');
        
        progressBar.style.width = data.progress+ "%";

        const types = ["mealAchievement", "timeAchievement", "calorieTrackedAchievement", "calorieBurnedAchievement"];
        const randomType = types[Math.floor(Math.random() * types.length)];
        progressBar.classList.add(randomType);

        achievement.innerHTML = `
            <div id="achievementTitle">
                <p>${data.title}</p>
            </div>
            <div id="medals">${data.medals}</div>
            <div id="achievementProgressBar">
            </div>
        `;
        
        const progressBarContainer = achievement.querySelector('#achievementProgressBar');
        progressBarContainer.appendChild(progressBar);

        achievementContainer.appendChild(achievement);
    });
}



const achievementsData = makeRandomAchievements();

window.onload = generateAchievements;
