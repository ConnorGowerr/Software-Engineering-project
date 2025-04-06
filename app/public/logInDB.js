
export async function logIn() 
{
    var username = document.getElementById("logInUsername").value;
    var userPassword = document.getElementById("logInPassword").value;

    // const hashedPassword = bcrypt.hashSync(userPassword, 10);
    // console.log(hashedPassword);

    fetch("http://localhost:8008", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    
        body: JSON.stringify({
            username,
            password: userPassword
        })
    })
    .then(response => {
        if (response.status == 401) 
        {
            warning("⚠︎ Password does not match existing account");
        } else if (response.status == 404) 
        {
            warning("⚠︎ User does not exist");
        } else 
        {
        
            document.location.href = "http://localhost:8008/home.html";
        
        }
    })
    .then(data => console.log(data))
    .catch(error => console.error("Error:", error));

    
}



function warning(string) 
{
    var warn = document.getElementById("warning");
    warn.innerText = string;
    warn.style.display = "inline-block";
}