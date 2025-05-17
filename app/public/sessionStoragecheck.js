window.addEventListener("DOMContentLoaded", () => {
    const username = window.sessionStorage.getItem("username");
    if (!username || username === "null" || username === "undefined") { 
        window.location.href = "http://localhost:8008";
    }
});