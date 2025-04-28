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
var username = window.sessionStorage.getItem("username");

const maxPercent = caloriesLogged / calorieTarget;
const styleSheet = document.styleSheets[2];

fetch("http://localhost:8008/home.html", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({
        username
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
        circleAnimate(); 
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
    const circularFillAnim =
    `@keyframes progressFill {
    100% 
    {
        stroke-dashoffset: ${571 - ((caloriesLogged / calorieTarget) * 571)};
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

