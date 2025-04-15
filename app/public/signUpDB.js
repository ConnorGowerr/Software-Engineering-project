
/* Function to grab all the data from the form and send a post request to the server to add new account to db
Will also perform checks on the data to sanitise it to see if its correct information
*/
export async function createAccount() {

    var available = true;

    var username = document.getElementById("username").value;
    var userPassword = document.getElementById("passwordInput").value;
    var userConfirmPassword = document.getElementById("passwordConfirm").value;
    var email = document.getElementById("email").value;
    var fullName = document.getElementById("fullName").value;
    var day = document.getElementById("DD").value;
    var month = document.getElementById("MM").value;
    var year = document.getElementById("YYYY").value;
    var weight = document.getElementById("weight").value;
    var height = document.getElementById("height").value;
    var isMetric = document.getElementById("kg").classList.contains("yellow");
    var isMale = document.getElementById("man").classList.contains("yellowGender");

// checks if username already exists  - PASSED
const usernameResponse = await fetch(`http://localhost:8008/signup/check?username=${username}`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
})
.then(response => {
    
    if (response.status != 404) 
    {
        warning("⚠︎ Sorry that username already exists, please select a different one");
        document.getElementById("username").value = "";
        available = false;
    }
    response.json()
})
.then(data => console.log(data))
.catch(error => console.error("Error:", error));

//checks if username too long   - PASSED
if (username.length > 20) 
{
    warning("⚠︎ Sorry that username is too long, please select a different one");
    document.getElementById("username").value = "";
    available = false;
}

// checks if username too short  - PASSED
if (username.length < 5) 
{
    warning("⚠︎ Sorry that username is too short, please select a different one");
    document.getElementById("username").value = "";
    available = false;
}
// checks if passwords match  - PASSED
if (userPassword != userConfirmPassword) 
{
    warning("⚠︎ Sorry those passwords do not match, please try again");
    document.getElementById("passwordInput").value = "";
    document.getElementById("passwordConfirm").value = "";
    available = false;
}

// checks if password too short  - PASSED
if (userPassword.length < 6) 
{
    warning("⚠︎ Your password is too short! Please choose one that is at least 6 characters long");
    document.getElementById("passwordInput").value = "";
    document.getElementById("passwordConfirm").value = "";
    available = false;
}

/*
checks if full name contains any invalid characters   - PASSED

a regex used to only allow letters, spaces and dashes like -
caters to all languages including chinese and japanese letters for accessiblity for all users
\p{L} - any letter from any language
\p{M} - any diacritic letters
\p{Pd} - any form of hyphen like -
 - handles spaces (obviously)
/u allows for unicode letters to be recognised to allow the \p{} to work
Source: https://www.unicode.org/reports/tr18/#General_Category_Property*/

if (!(/^[\p{L}\p{M}\p{Pd} ]+$/u.test(fullName))) 
{
    warning("⚠︎ Sorry your full name contains an invalid character, please try again");
    document.getElementById("fullName").value = "";
    available = false;
}

// checks if email is already tied to an account  - PASSED
const emailResponse = await fetch(`http://localhost:8008/signup/check?email=${email}`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
})
.then(response => {
    
    if (response.status != 404) 
    {
        warning("⚠︎ Sorry that email has already been used, please select a different one");
        document.getElementById("email").value = "";
        available = false;
    }
    response.json()
})
.then(data => console.log(data))
.catch(error => console.error("Error:", error));

// All valid dob checks - PASSED

if (day > 31 || day < 1) 
{
    warning("⚠︎ Sorry that is not a valid day, please try again");
    document.getElementById("DD").value = "";
    available = false;
}

if (month > 12 || month < 1) 
{
    warning("⚠︎ Sorry that is not a valid month, please try again");
    document.getElementById("MM").value = "";
    available = false;
}

if (year > 2012 || year < 1900) 
{
    warning("⚠︎ Sorry that is not a valid year, please try again");
    document.getElementById("YYYY").value = "";
    available = false;
}

if (day > 30 && (month == 9 || month == 4 || month == 6 || month == 11)) 
{
    warning("⚠︎ Sorry that is not a valid date, please try again");
    document.getElementById("DD").value = "";
    document.getElementById("MM").value = "";
    available = false;
}

var leap = false;
if (year % 4 == 0) 
{
    if (year % 100 == 0) 
    {
        if (year % 400 == 0) 
        {
            leap = true;
        }
    } else 
    {
        leap = true;
    }
}

if (day > 28 && month == 2 && leap == false) 
{
    warning("⚠︎ Sorry that is not a valid date, please try again");
    document.getElementById("DD").value = "";
    document.getElementById("MM").value = "";
    document.getElementById("YYYY").value = "";
    available = false;
}

if (day > 29 && month == 2) 
    {
        warning("⚠︎ Sorry that is not a valid date, please try again");
        document.getElementById("DD").value = "";
        document.getElementById("MM").value = "";
        document.getElementById("YYYY").value = "";
        available = false;
    }

var dob = `${year}-${month}-${day}`;

// Checks to see if weight is in a realistic range - PASSED

if ((weight > 650 && isMetric) || (weight > 1433 && !isMetric)) 
{
    warning("⚠︎ Sorry that weight value is too large");
        document.getElementById("weight").value = "";
        available = false;
}

if ((weight < 5 && isMetric) || (weight < 11 && !isMetric)) 
{
    warning("⚠︎ Sorry that weight value is too small");
    document.getElementById("weight").value = "";
    available = false;
}

// Checks to see if height is in a realistic range - PASSED

if ((height > 275 && isMetric) || (height > 108 && !isMetric)) 
{
    warning("⚠︎ Sorry that height value is too large");
    document.getElementById("height").value = "";
    available = false;
}
    
if ((height < 65 && isMetric) || (height < 25 && !isMetric)) 
{
    warning("⚠︎ Sorry that height value is too small");
    document.getElementById("height").value = "";
    available = false;
}

// Puts data in correct format for db
if (isMale) {
    isMale = "M";
} else {
    isMale = "F";
}
    
const hashedPassword = bcrypt.hashSync(userPassword, 10);


var dobDate = new Date(dob);
var today = new Date();

let age = today.getFullYear() - dobDate.getFullYear();
let monthDiff = today.getMonth() - dobDate.getMonth();
let dayDiff = today.getDate() - dobDate.getDate();

// Will subtract 1 from age if their birthday has not happened yet this year
if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) 
{
    age--;
}

var calOffset = 5;
if (isMale == "F") {
    calOffset = -161;
}

var calorieTarget = Math.round((10 * parseFloat(weight)) + (6.25 * parseFloat(height)) - (5 * (age)) + calOffset + 400);


if (available) 
{
// Sends the data to the backend using a post request - PASSED
fetch("http://localhost:8008/signup", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({
        username,
        password: hashedPassword,
        email,
        realName: fullName,      
        dob,
        weight,
        height,
        gender: isMale,          
        imperialMetric: isMetric, 
        dailyCalorieTarget: calorieTarget
    })
})
.then(response => response.json())
.then(data => {
    window.location.href='login.html';
    showAlert("Your account has been created succesfully.");
})
.catch(error => console.error("Error:", error));
}

}

function warning(string) 
{
    var warn = document.getElementById("warning");
    warn.innerText = string;
    warn.style.display = "inline-block";
}


function showAlert(message) {
    const alertBox = document.getElementById('signupAlert');
    alertBox.textContent = message;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.animation = "fadeOut 0.7s ease-in-out";
        setTimeout(() => {
            alertBox.style.display = 'none';
            alertBox.style.animation = "fadeIn 0.7s ease-in-out";
        }, 300);
    }, 4000);
}

//Testing with the alert

// document.getElementById("PressTheButton").addEventListener("click", (event) => {
//     showAlert("Your account has been created succesfully.");
// });

// document.getElementById("PressTheButton").addEventListener("click", showAlert("This idiot pressed the button lmao"));

    