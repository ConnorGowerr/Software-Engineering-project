    
const popup = document.querySelector(".popupg2")
const popupoverlay = document.querySelector(".popup-overlay")
const createpopup = document.querySelector(".popup3")
const createpopupoverlay = document.querySelector(".popup-overlay2")
const yourgroups = document.getElementById("yourgroups");
const confirmbtn = document.getElementById("confirmBtn12");

const usersgroups = [];

const createbtn = document.getElementById("createGroupButton");
const available = false;
let usercount = 0;
// const joinbtn = document.getElementById("joinGroup");

// let username = window.sessionStorage.getItem("username");

rng = [];
arr = [3, 4, 5, 6, 7]
pubarr = [];

function randomiseGroup(d){
    const set = new Set();

    for(i = 0; i < d.length; i++){
        if(d[i].ispublic == true){
            pubarr.push(d[i]);
            // console.table(pubarr);
        }
    }
    while (set.size != pubarr.length) {
        set.add(Math.floor(Math.random() * pubarr.length));
        
    }
    rng = [...set];

}

    function one(){
    fetch(`/groups/:allgroups`)
        .then(response => {
            if (!response.ok) {
                console.error('Server returned an error:', response.statusText);
                throw new Error('Failed to fetch search results');
            }
            return response.json();
        })
        .then(data => {

            randomiseGroup(data);
            const box1 = document.getElementById("greyContainer3");
            const box2 = document.getElementById("greyContainer4");
            const box3 = document.getElementById("greyContainer5");
            const box4 = document.getElementById("greyContainer6");
            const box5 = document.getElementById("greyContainer7");

            const data1 = pubarr[rng[0]];
            const data2 = pubarr[rng[1]];

            const data3 = pubarr[rng[2]];
            const data4 = pubarr[rng[3]];
            const data5 = pubarr[rng[4]];

            const member1 = memberCount(data1.groupid, 2);
            const member2 = memberCount(data2.groupid, 3);
            const member3 = memberCount(data3.groupid, 4);
            const member4 = memberCount(data4.groupid, 5);
            const member5 = memberCount(data5.groupid, 6);

            box1.querySelector(".groupText").innerHTML = `${data1.groupname}`;
            box2.querySelector(".groupText").innerHTML = `${data2.groupname}`;
            box3.querySelector(".groupText").innerHTML = `${data3.groupname}`;
            box4.querySelector(".groupText").innerHTML = `${data4.groupname}`;
            box5.querySelector(".groupText").innerHTML = `${data5.groupname}`;

            document.getElementById("greyContainer" + arr[0]).addEventListener("click", (event) =>{

                popup.style.display = "block";
                popupoverlay.style.display = "block";
                document.querySelector(".otherTitlesg").innerHTML = `Would you like to join ${pubarr[rng[0]].groupname}?`
                
                confirmbtn.addEventListener("click", (event) => {
                    joinPubGroup(pubarr[rng[0]].groupid)
                    setTimeout(() => {
                        window.location.href=`/group/${encodeURIComponent(pubarr[rng[0]].groupname)}`;
                        }, 2000);


                    
                })
            })
            document.getElementById("greyContainer" + arr[1]).addEventListener("click", (event) =>{
                popup.style.display = "block";
                popupoverlay.style.display = "block";
                document.querySelector(".otherTitlesg").innerHTML = `Would you like to join ${pubarr[rng[1]].groupname}?`
                confirmbtn.addEventListener("click", (event) => {

                    joinPubGroup(pubarr[rng[1]].groupid);
                        setTimeout(() => {
                            window.location.href=`/group/${encodeURIComponent(pubarr[rng[1]].groupname)}`;
                        },);
                    }, 2000);
                    
            })
            document.getElementById("greyContainer" + arr[2]).addEventListener("click", (event) =>{
                popup.style.display = "block";
                popupoverlay.style.display = "block";
                document.querySelector(".otherTitlesg").innerHTML = `Would you like to join ${pubarr[rng[2]].groupname}?`
                confirmbtn.addEventListener("click", (event) => {
                    joinPubGroup(pubarr[rng[2]].groupid)
                    setTimeout(() => {
                        window.location.href=`/group/${encodeURIComponent(pubarr[rng[2]].groupname)}`;
                        }, 2000);

                })
            })
            document.getElementById("greyContainer" + arr[3]).addEventListener("click", (event) =>{
                popup.style.display = "block";
                popupoverlay.style.display = "block";
                document.querySelector(".otherTitlesg").innerHTML = `Would you like to join ${pubarr[rng[3]].groupname}?`
                confirmbtn.addEventListener("click", (event) => {

                    joinPubGroup(pubarr[rng[3]].groupid)
                    setTimeout(() => {
                        window.location.href=`/group/${encodeURIComponent(pubarr[rng[3]].groupname)}`;
                        }, 2000);

                })
            })
            document.getElementById("greyContainer" + arr[4]).addEventListener("click", (event) =>{
                popup.style.display = "block";
                popupoverlay.style.display = "block";
                document.querySelector(".otherTitlesg").innerHTML = `Would you like to join ${pubarr[rng[4]].groupname}?`
                confirmbtn.addEventListener("click", (event) => {
                    confirmbtn.addEventListener("click", (event) => {

                    joinPubGroup(pubarr[rng[4]].groupid)
                    setTimeout(() => {
                        window.location.href=`/group/${encodeURIComponent(pubarr[rng[4]].groupname)}`;
                        }, 2000);

                })
                })
            })
            document.getElementById("cancelBtn12").addEventListener("click", (event) =>{
                popup.style.display = "none";
                popupoverlay.style.display = "none";
               
            })
        })
        .catch(error => console.error('Error fetching search results:', error));

   }

    function memberCount(groupid, num){
        const groupID = [1, 2, 3, 4, 5];
        
        fetch(`/groups/:allgroups/${groupid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            groupid: groupid
        })
        })
        .then(response => response.json())
        .then(data => {
            let num2 = document.getElementById(`memberCount${num}`);
            num2.querySelector(".valueText").innerHTML = `${data.count}/50`

        })
    }

    function userGroup(){
        console.log(username)
        fetch(`/groups/:allgroups/userGroupSection?q=${username}`)
        .then(response => {
            if (!response.ok) {
                console.error('Server returned an error:', response.statusText);
                throw new Error('Failed to fetch search results');
            }
            return response.json();
        })
        .then(data => {
            // console.table(data.groups);
            // console.table(data.groupcount.count);
            console.table(data);
            usercount = data.groupcount.count;
            if(data != null){
                const yourgroupstxt = document.getElementById("yourgrouptxt36");
                yourgroupstxt.style.display = "block";
                for(let i=0; i< data.groups.length; i++){
                    let newsection = document.createElement(`Section`)
                    newsection.className = "groupBoxSection3"
                    newsection.innerHTML += `
                        <div class ="greyContainer2 box2" id="useringroup${i}">
                            <div class="inputdivs">
                                <div class="rowInputLeft">
                                    <img src="images/groupicon.png" class="groupicons">
                                    <h2 class="groupText">${data.groups[i].groupname}</h2>
                                </div>
                            </div>
                            <div class="textRight">
                                <h2 class="membersText">Members</h2>
                            </div>
                            <div class="textRight">
                                <h2 class="valueText">${data.memberCount[i]}/50</h2>
                            </div>
                        </div>`
                    yourgroups.appendChild(newsection);
                    
                    const listofgroup = [];
                    listofgroup[i] = document.getElementById(`useringroup${i}`);
                    listofgroup[i].addEventListener("click", (event) => {
                        window.location.href=`/group/${encodeURIComponent(data.groups[i].groupname)}`;
                    }
                    )
                    
                }
                
                yourgroupstxt.textContent = `- Your Groups (${data.groupcount.count}/5) -`

                
                
            }
        })
    }

function createGroup(){
    const randid = Math.floor(Math.random() * 10000000000);
    const groupName = document.getElementById("creategroupinp").value;
    const isPublic = document.getElementById('ispublic').checked;
    fetch("http://localhost:8008/groups/createGroup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            groupid: randid,
            username,
            groupname: groupName,
            ispublic: isPublic
        })
    })
    .then(response => {
    if(response.status == '201'){
       showAlert("Group has been created successfully"); 
    }else{
        showErrorAlert("Group Name already exists, try another");
    }
        response.json()})
    .then(data => {
        console.log("it work yippee")
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

console.table(pubarr);

function joinPubGroup(group){
    const findgroupP = group;
    console.table[findgroupP];
    fetch("http://localhost:8008/groups/joinpublic", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            groupid: findgroupP,
            username: username
        })
    })
    .then(response => {
        if(response.status == '201'){
            showAlert("Group joined successfully!")
            
        }else{
            showErrorAlert("Group could not be found")
        }
        response.json();
    })
    .then(data => {
        console.table(data);
    })
    .catch(error => {
        console.error("Error:", error);
        
    });
}

    document.getElementById("createGroupBtn").addEventListener("click", (event) =>{
        createpopup.style.display = "block";
        createpopupoverlay.style.display = "block";
    })

    document.getElementById("cancelBtn13").addEventListener("click", (event) =>{
        createpopup.style.display = "none";
        createpopupoverlay.style.display = "none";
    })


userGroup();
one();

createbtn.addEventListener("click", (event) => {
    event.preventDefault();
    const groupn = document.getElementById("creategroupinp").value;
    if(groupn.length < 21 && groupn.length !== 0 && usercount < 5){
        createGroup();
        createpopup.style.display = "none";
        createpopupoverlay.style.display = "none";
    }else{
        console.log("Failure: group length too high OR user is in too many groups");
    }
})


function enterGroup(){

}


function showAlert(message) {
    const alertBox = document.getElementById('groupAlert');
    alertBox.textContent = message;
    alertBox.style.display = 'block';
    alertBox.style.background = 'rgba(52, 202, 52, 0.9)'
    setTimeout(() => {
        alertBox.style.animation = "fadeOut 0.7s ease-in-out";
        setTimeout(() => {
            alertBox.style.display = 'none';
            alertBox.style.animation = "fadeIn 0.7s ease-in-out";
        }, 300);
    }, 4000);
}

function showErrorAlert(message) {
    const alertBox = document.getElementById('groupAlert');
    alertBox.textContent = message;
    alertBox.style.display = 'block';
    alertBox.style.background = 'rgba(202, 10, 10, 0.9)'
    setTimeout(() => {
        alertBox.style.animation = "fadeOut 0.7s ease-in-out";
        setTimeout(() => {
            alertBox.style.display = 'none';
            alertBox.style.animation = "fadeIn 0.7s ease-in-out";
        }, 300);
    }, 4000);
}

