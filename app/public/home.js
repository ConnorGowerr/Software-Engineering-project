let number = document.getElementById("caloriesNumber");
let circle = document.getElementById("circle");
let count = 0;
var caloriesLogged = 1465;
var calorieTarget = 2200;

const maxPercent = caloriesLogged / calorieTarget;

setInterval(() => {
    
    if (count < caloriesLogged) 
    {
        count += Math.round(caloriesLogged / 50);
        number.innerHTML = `${count}`;
    } else if (count > caloriesLogged) 
    {
        number.innerHTML = `${caloriesLogged}`;
    }
    else 
    {
        clearInterval(interval);
    }
    
}, 30)