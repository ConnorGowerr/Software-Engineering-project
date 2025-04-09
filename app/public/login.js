function showPassword() {
    var box = document.getElementById("logInPassword");
    var img = document.getElementById("eyeIcon");
    var hover = document.getElementById("passwordIconBox");
    if (box.type === "password") {
        box.type = "text";
        img.src = "images/Eye.png";
        hover.title = "Hide password";
    } else {
        box.type = "password";
        img.src = "images/Eye off.png";
        hover.title = "Show password";
    }
}

var signUp = document.getElementById("signUpButton");

signUp.addEventListener("click", function()
{
    document.location.href = "http://localhost:8008/signup.html";
})

