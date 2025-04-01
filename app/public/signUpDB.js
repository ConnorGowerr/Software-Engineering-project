/* Function to grab all the data from the form and send a post request to the server to add new account to db
Will also perform checks on the data to sanitise it to see if its correct information
*/
function createAccount() {
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

// Puts data in correct format for db
    if (isMale) {
        isMale = "M";
    } else {
        isMale = "F";
    }
    
    console.log(username + userPassword + userConfirmPassword + email + fullName + day + month + year + weight + height + isMale + isMetric);

    var dob = `${day}-${month}-${year}`;

  

// Sends the data to the backend using a post request
    fetch("http://localhost:8008/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            username,
            password: userPassword,
            email,
            realName: fullName,      
            dob,
            weight,
            height,
            gender: isMale,          
            imperialMetric: isMetric, 
            dailyCalorieTarget: 2400
        })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error:", error));



}
