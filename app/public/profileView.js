

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


                const popupOverlay = document.querySelector("#addMemberOverlay");
                const popup = document.querySelector(".addMember");
                const confirmBtn = document.querySelector("#confirmBtn7");
                const cancelBtn = document.querySelector("#cancelBtn7");
           


                stats1.addEventListener('click', async function(event) {
                    

                    popupOverlay.style.display = "block";
                    popup.style.display = "block";

                    const confirmHandler = async () => {

                        const weight = Math.floor(document.querySelector("#search-bar-users2").value);
                        const username = userData[0].username;
                

          

                        try {
                            const response = await fetch('/update-weight', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ username, weight })
                            });

                            const result = await response.json();

                        
                            popupOverlay.style.display = "none";
                            popup.style.display = "none";
                            cleanup();
                            window.location.reload();
                   
                          
                        } catch (error) {
                            
                            console.error('Error:', error);
                        }
                        
                    }
                    const cancelHandler = () => {
                        popupOverlay.style.display = "none";
                        popup.style.display = "none";

                        cleanup();
                    };

                    function cleanup() {
                        confirmBtn.removeEventListener("click", confirmHandler);
                        cancelBtn.removeEventListener("click", cancelHandler);
                    }


                    confirmBtn.addEventListener("click", confirmHandler);
                    cancelBtn.addEventListener("click", cancelHandler);
                    });
                    


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

document.querySelector('.logoutBtn').addEventListener('click', (e) => {
    const overlay = document.querySelector("#logoutOverlay");
    const popup = document.querySelector(".logout");
    const confirmBtn = document.querySelector("#confirmBtn8");


    overlay.style.display = "block";
    popup.style.display = "block";

    confirmBtn.addEventListener('click', e =>{
        window.sessionStorage.setItem("username", null);
        window.sessionStorage.setItem("first", null);
        window.location.href = "http://localhost:8008";

    })

})

const buttons = document.querySelectorAll('.metricButton');

buttons.forEach(btn => {
    console.log("h")
    btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active')); 
        btn.classList.add('active'); 
    });
});


document.querySelector('.logout').addEventListener('click', e=>{
    logoutPopup();
})

function logoutPopup() {
    const overlay = document.querySelector("#logoutOverlay");
    const popup = document.querySelector(".logoutPopup");
    const confirmBtn = document.querySelector("#confirmBtn8");

    overlay.style.display = "block";
    popup.style.display = "block";


    confirmBtn.addEventListener('click', e=>{
        window.sessionStorage.setItem('username', null);
        window.sessionStorage.setItem('first', null)
        window.location.href ='http://localhost:8008'

    })
  

    const closePopup = () => {
        overlay.style.display = "none";
        popup.style.display = "none";
        confirmBtn.removeEventListener("click", handleConfirm);
        overlay.removeEventListener("click", handleOutsideClick);
    };

    overlay.addEventListener("click", closePopup);
}

window.addEventListener('load', () => {
    const skeleton = document.getElementById('skeleton-screen');
    if (skeleton) {
      skeleton.style.transition = 'opacity 0.4s ease';
      skeleton.style.opacity = '0';
      setTimeout(() => skeleton.remove(), 400); 
    }
  });
  
updateProfileStats();
