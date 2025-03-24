//When user presses the eye icon, the password will show, and the second function is for the confirm password box.
function showPassword() {
    var box = document.getElementById("passwordInput");
    var img = document.getElementById("eyeImg");
    if (box.type === "password") {
        box.type = "text";
        img.src = "images/Eye.png";
    } else {
        box.type = "password";
        img.src = "images/Eye off.png";
    }
}

function showPasswordConfirm() {
    var box2 = document.getElementById("passwordConfirm");
    var imgConfirm = document.getElementById("eyeImgConfirm");
    if (box2.type === "password") {
        box2.type = "text";
        imgConfirm.src = "images/Eye.png";
    } else {
        box2.type = "password";
        imgConfirm.src = "images/Eye off.png";
    }

}