function showPassword() {
    var box = document.getElementById("logInPassword");
    var img = document.getElementById("eyeIcon");
    if (box.type === "password") {
        box.type = "text";
        img.src = "images/Eye.png";
    } else {
        box.type = "password";
        img.src = "images/Eye off.png";
    }
}


