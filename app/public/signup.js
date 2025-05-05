//When user presses the eye icon, the password will show, and the second function is for the confirm password box.
function showPassword() {
    var box = document.getElementById("passwordInput");
    var img = document.getElementById("eyeImg");
    if (box.type === "password") {
        box.type = "text";
        img.src = "images/Eye.png";
        img.title = "Hide password";
    } else {
        box.type = "password";
        img.src = "images/Eye off.png";
        img.title = "Show password";
    }
}

function showPasswordConfirm() {
    var box2 = document.getElementById("passwordConfirm");
    var imgConfirm = document.getElementById("eyeImgConfirm");
    if (box2.type === "password") {
        box2.type = "text";
        imgConfirm.src = "images/Eye.png";
        imgConfirm.title = "Hide password";
    } else {
        box2.type = "password";
        imgConfirm.src = "images/Eye off.png";
        imgConfirm.title = "Show password";
    }

}

// Added by connor, allows user to select between metric and imperial measurements as well as selecting a gender

var isMetric = true;
var isMale = true;

function metric() {
    var weightKG = document.getElementById("kg");
    var weightLBS = document.getElementById("lbs");
    var heightCM = document.getElementById("cm");
    var heightIN = document.getElementById("in");

    if (!isMetric) {
        weightKG.classList.toggle("yellow");
        heightCM.classList.toggle("yellow");
        weightLBS.classList.toggle("yellow");
        heightIN.classList.toggle("yellow");
        
        isMetric = true;

    }
}

function imperial() {
    var weightKG = document.getElementById("kg");
    var weightLBS = document.getElementById("lbs");
    var heightCM = document.getElementById("cm");
    var heightIN = document.getElementById("in");

    if (isMetric) {
        weightLBS.classList.toggle("yellow");
        heightIN.classList.toggle("yellow");
        weightKG.classList.toggle("yellow");
        heightCM.classList.toggle("yellow");
        isMetric = false;
    }
}

function male() {
    var male = document.getElementById("man");
    var female = document.getElementById("woman");
    

    if (!isMale) {
        male.classList.toggle("yellowGender");
        female.classList.toggle("yellowGender");
        isMale = true;
    }
}

function female() {
    var male = document.getElementById("man");
    var female = document.getElementById("woman");
    

    if (isMale) {
        male.classList.toggle("yellowGender");
        female.classList.toggle("yellowGender");
        isMale = false;
    }
}
