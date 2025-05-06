

function updateProfileStats(){

    fetch(`/api/return-user?q=${window.sessionStorage.getItem("username")}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user');
                }
                return response.json();
            })
            .then(userData => {
                console.log("Found user:", userData[0]);
                if(!document.querySelector(".mainArticleStats")) return;

                const uname = document.querySelectorAll(".otherTitles")[0];
                uname.innerHTML = `${userData[0].username}`;



                var loginInfo = document.querySelector(".mainArticleStats").children;
                let login1= loginInfo[0];
                let login2 = loginInfo[1];
                let login3 = loginInfo[2];


                login1.innerHTML = `<p>Created On <br> ${userData[0].creationdate.split('T')[0]}</p>`;


                login3.innerHTML = `<p>Last Logged In <br> ${userData[0].lastlogin.split('T')[0]}</p>`;


                var stats = document.querySelector(".mainstatsSection").children;
                let stats1 = stats[0];
                let stats2 = stats[1];
                let stats3 = stats[2];
                let stats4 = stats[3];

                stats1.innerHTML = `<p>Weight <br> ${userData[0].weight}</p>`;

                stats2.innerHTML = `<p>Height <br> ${userData[0].height}</p>`;

                stats3.innerHTML = `<p>Gender <br> ${userData[0].gender}</p>`;

                stats4.innerHTML = `<p>Target Calories <br> ${userData[0].dailycalorietarget}</p>`;

            });
        

    
}


function mailboxPopup() {
    const Popup = document.querySelector("#mailboxContainer");
    const popupOverlay = document.getElementById("mailboxOverlay");

    
    Popup.style.display = "block";
    popupOverlay.style.display = "block";
}


document.querySelector(".top-left-btn").addEventListener("click", e => {
    e.preventDefault();
    mailboxPopup();
});

const buttons = document.querySelectorAll('.metricButton');

buttons.forEach(btn => {
    console.log("h")
    btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active')); 
        btn.classList.add('active'); 
    });
});




updateProfileStats();