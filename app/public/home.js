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
    window.location.href = "http://localhost:8008/FAQ.html"
});

let number = document.getElementById("caloriesNumber");
let circle = document.getElementById("circle");
let caloriesRemaining = document.getElementById("remainingCalories");
let targetCalorie = document.getElementById("targetCalorie");
let count = 0;
var caloriesLogged = 0;
var calorieTarget = 0;
var noData = false;
var username = window.sessionStorage.getItem("username");

const maxPercent = caloriesLogged / calorieTarget;


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
        circleAnimate();
    }
    caloriesRemaining.innerHTML = calorieTarget;
    targetCalorie.innerHTML = calorieTarget;
    number.innerHTML = 0;

})
.catch(error => console.error("Error:", error));

function circleAnimate() 
{

    targetCalorie.innerHTML = calorieTarget;
    const styleSheet = document.styleSheets[2];
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

