var username = window.sessionStorage.getItem("username");
if (username == null) 
{
    window.location.href = "http://localhost:8008";
}