var username = window.sessionStorage.getItem("username");
if (window.sessionStorage.getItem("first") == null) 
{
    window.sessionStorage.setItem("first", true);
} else 
{
    window.sessionStorage.setItem("first", false);
}

const trackB = document.getElementById("trackProgressButton");
const groupB = document.getElementById("groupsButton");
const helpB = document.getElementById("helpButton");

trackB.addEventListener("click", function() 
{
    window.location.href = "http://localhost:8008/progress.html"
});

groupB.addEventListener("click", function() 
{
    window.location.href = "http://localhost:8008/groups.html"
});

helpB.addEventListener("click", function() 
{
    window.location.href = "http://localhost:8008/faq.html"
});

let number = document.getElementById("caloriesNumber");
let circle = document.getElementById("circle");
let caloriesRemaining = document.getElementById("remainingCalories");
let targetCalorie = document.getElementById("targetCalorie");
let cGoalTitle = document.getElementById("currentGoalTitle");
let cGoalNumber = document.getElementById("currentGoalNumber");
let tGoalTitle = document.getElementById("targetGoalTitle");
let tGoalNumber = document.getElementById("targetGoalNumber");
let goalUnit = document.querySelectorAll(".goalUnit");
let cTitle = document.getElementById("challengeTitle");
let cTitleRemaining = document.getElementById("challengeTitleRemaining");
let cChallengeTitle = document.getElementById("currentChallengeTitle");
let cChallengeNumber = document.getElementById("currentChallengeNumber");
let tChallengeTitle = document.getElementById("targetChallengeTitle");
let tChallengeNumber = document.getElementById("targetChallengeNumber");
let challengeUnit = document.querySelectorAll(".challengeUnit");
let count = 0;
var caloriesLogged = 0;
var calorieTarget = 0;
var noData = false;


const maxPercent = caloriesLogged / calorieTarget;
const styleSheet = document.styleSheets[2];

const popup = document.querySelector(".popupGoals")
const popupOverlay = document.querySelector(".popup-overlay2")
const expireButton = document.getElementById("expiredCloseButton");
expireButton.addEventListener("click", function() 
{
    popup.style.display = "none";
    popupOverlay.style.display = "none";
    window.sessionStorage.setItem("first", false);
});

fetch("http://localhost:8008/home.html", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({
        username,
        first: window.sessionStorage.getItem("first")
    })
})
.then(response => 
{
    if (response.status == 401) 
    {
        noData = true;
    }
    return response.json()
})
.then(data => 
{
    console.log(data.expiredExerciseGoal);
    console.log(data.expiredMealGoal);
    if (data.expiredExerciseGoal != "N/A" || data.expiredMealGoal != "N/A") 
    {
        popup.style.display = "block";
        popupOverlay.style.display = "block";
        if (data.expiredExerciseGoal != "N/A") 
        {
            for (i = 0; i < data.expiredExerciseGoal.length; i++) 
            {
                const expiredGoalDiv = document.getElementById("expiredGoals");
                const expiredG = document.createElement("div");
                const expiredGName = document.createElement("h3");
                const expiredGDate = document.createElement("h3");
                expiredGName.innerHTML = data.expiredExerciseGoal[i].goalname;
                expiredGDate.innerHTML = data.expiredExerciseGoal[i].enddate.split("T")[0];
                expiredG.classList.add("expiredGoal2");
                expiredGoalDiv.appendChild(expiredG);
                expiredG.appendChild(expiredGName);
                expiredG.appendChild(expiredGDate);
            }
            
        }

        if (data.expiredMealGoal != "N/A") 
        {
            for (i = 0; i < data.expiredMealGoal.length; i++) 
            {
                const expiredGoalDiv = document.getElementById("expiredGoals");
                const expiredG = document.createElement("div");
                const expiredGName = document.createElement("h3");
                const expiredGDate = document.createElement("h3");
                expiredGName.innerHTML = data.expiredMealGoal[i].goalname;
                expiredGDate.innerHTML = data.expiredMealGoal[i].enddate.split("T")[0];
                expiredG.classList.add("expiredGoal2");
                expiredGoalDiv.appendChild(expiredG);
                expiredG.appendChild(expiredGName);
                expiredG.appendChild(expiredGDate);
            }
            
        }
    }
    calorieTarget = data.dailyTarget;
    if (!noData) 
    {
        caloriesLogged = data.calories;
        if (data.type == "activity") 
        {

            goalAnimation("Activity Today", "Weekly Activity Target", "Minutes", data.userActivity, data.activityTarget, -1);
            
        } else if (data.type == "weight")
        {

            goalAnimation("Current Weight", "Target Weight", "Kg", data.currentWeight, data.targetWeight, data.startWeight);

        } else if (data.type == "completed") 
        {
            goalAnimation("Activity Today", "Weekly Activity Target", "Minutes", data.userActivity, data.activityTarget, -1);
        }
        
// let cTitleRemaining = document.getElementById("challengeTitleRemaining");
// let cChallengeTitle = document.getElementById("currentChallengeTitle");

// let tChallengeTitle = document.getElementById("targetChallengeTitle");

// let challengeUnit = document.querySelectorAll(".challengeUnit");
        circleAnimate();
        cTitle.innerHTML = data.challengeT;
        cChallengeNumber.innerHTML = data.challengeC;
        tChallengeNumber.innerHTML = data.challengeTarg;
        cChallengeTitle.innerHTML = "Your Progress";
        tChallengeTitle.innerHTML = data.challengeTargetT;
        if (data.challengeC == "N/A") 
        {
            cTitleRemaining.innerHTML = "";
            const linearProgressFill = 
            `@keyframes linearProgressFill2 {
            0% 
            {
                width: 0%
            }
            100% 
            {
                width: 100%;
            }
            }`;
            styleSheet.insertRule(linearProgressFill, styleSheet.cssRules.length);

            const prog = document.querySelector(".progress2");
            prog.style.animation = 'none';
            void prog.offsetWidth;
            prog.style.animation = `linearProgressFill2 2s forwards`;
        } else 
        {
            var date1 = new Date(data.challengeE);
            var date2 = new Date();
            const diffInDays = Math.ceil((date1 - date2) / (1000 * 60 * 60 * 24));
            cTitleRemaining.innerHTML = `${diffInDays} Days left`;
            const linearProgressFill = 
            `@keyframes linearProgressFill2 {
            0% 
            {
                width: 0%
            }
            100% 
            {
                width: ${(data.challengeC / data.challengeTarg) * 100}%;
            }
            }`;
            styleSheet.insertRule(linearProgressFill, styleSheet.cssRules.length);

            const prog = document.querySelector(".progress2");
            prog.style.animation = 'none';
            void prog.offsetWidth;
            prog.style.animation = `linearProgressFill2 2s forwards`;
        }
    } else 
    {
        caloriesRemaining.innerHTML = calorieTarget;
        targetCalorie.innerHTML = calorieTarget;
        number.innerHTML = 0;
    }
    

})
.catch(error => console.error("Error:", error));

function goalAnimation(cTitle, tTitle, unit, cData, tData, startWeight) 
{
    var currentNum = 0;
    count = 0;
    console.log(cTitle, tTitle, unit, cData, tData, startWeight)

    cGoalTitle.innerHTML = cTitle;
    tGoalTitle.innerHTML = tTitle;
    cGoalNumber.innerHTML = cData;
    tGoalNumber.innerHTML = tData;
    goalUnit[0].innerHTML = unit;
    goalUnit[1].innerHTML = unit;

    if (unit == "Kg") 
    {
        const linearProgressFill = 
        `@keyframes linearProgressFill1 {
        100% 
        {
            width: ${(1 - (cData - tData) / (startWeight - tData)) * 100};
        }
        }`;
        styleSheet.insertRule(linearProgressFill, styleSheet.cssRules.length);

        const interval = setInterval(() => 
        {
            currentNum += Math.round(cData / 50);
            if (currentNum > cData) 
            {
                currentNum = cData;
            }
            cGoalNumber.innerHTML = `${currentNum}`;
            
        }, 30)

    } else 
    {
        const progression = (cData / tData) * 100;
        const linearProgressFill = 
        `@keyframes linearProgressFill1 {
        
        0% 
        {
            width: 0%;
        }
        100% 
        {
            width: ${progression}%;
        }
        }`;
        styleSheet.insertRule(linearProgressFill, styleSheet.cssRules.length);

        const prog = document.querySelector(".progress");
        prog.style.animation = 'none';
        void prog.offsetWidth;
        prog.style.animation = `linearProgressFill1 2s forwards`;

    }
    
    

}

function circleAnimate() 
{
    count = 0;
    targetCalorie.innerHTML = calorieTarget;
    var circularProg = 0;
    if (caloriesLogged > calorieTarget) 
    {
        circularProg = 0;
    } else 
    {
        circularProg = 571 - (caloriesLogged / calorieTarget) * 571;
    }
    const circularFillAnim =
    `@keyframes progressFill {
    100% 
    {
        stroke-dashoffset: ${circularProg};
    }
    }`;

    styleSheet.insertRule(circularFillAnim, styleSheet.cssRules.length);

 const interval = setInterval(() => {
    if (count < caloriesLogged) 
    {
        count += Math.round(caloriesLogged / 50);
        number.innerHTML = `${count}`;
        caloriesRemaining.innerHTML = calorieTarget - count;
    } else if (count > caloriesLogged) 
    {
        number.innerHTML = `${caloriesLogged}`;
        caloriesRemaining.innerHTML = calorieTarget - caloriesLogged;
    }
    else 
    {
        clearInterval(interval);
    }
}, 30);

}