

function updateProfileStats(){

    if(!document.querySelector(".mainArticleStats")) return;

    var loginInfo = document.querySelector(".mainArticleStats").children;
    let login1= loginInfo[0];
    let login2 = loginInfo[1];
    let login3 = loginInfo[2];

    let created = login1.querySelector('br');
    created.insertAdjacentHTML('afterend', `<p>${this.userInstance.dateOfCreation}</p>`);

    let lastLoggedIn = login3.querySelector('br');
    lastLoggedIn.insertAdjacentHTML('afterend', `<p>${this.userInstance.dateOfCreation}</p>`);


    var stats = document.querySelector(".mainstatsSection").children;
    let stats1 = stats[0];
    let stats2 = stats[1];
    let stats3 = stats[2];
    let stats4 = stats[3];

    let br1 = stats1.querySelector('br');
    br1.insertAdjacentHTML('afterend', `<p>${this.userInstance.currentWeight}</p>`);

    let br2 = stats2.querySelector('br');
    br2.insertAdjacentHTML('afterend', `<p>${this.userInstance.height}</p>`);

    let br3 = stats3.querySelector('br');
    br3.insertAdjacentHTML('afterend', `<p>${this.userInstance.gender}</p>`);

    let br4 = stats4.querySelector('br');
    br4.insertAdjacentHTML('afterend', `<p>${this.calculateDailyCal()}</p>`);

}


function mailboxPopup() {
    const Popup = document.querySelector("#mailboxContainer");
    const popupOverlay = document.getElementById("mailboxOverlay");

    
    Popup.style.display = "block";
    popupOverlay.style.display = "block";
}


document.querySelector(".top-left-btn").addEventListener("click", event => {
    userController.mailboxPopup();
});