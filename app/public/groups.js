    
const popup = document.querySelector(".popupg2")
const popupoverlay = document.querySelector(".popup-overlay")
const createpopup = document.querySelector(".popup3")
const createpopupoverlay = document.querySelector(".popup-overlay2")
const yourgroups = document.getElementById("yourgroups");
const yourgroupstxt = document.getElementById("yourgroupstxt");

let username = window.sessionStorage.getItem("username");

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
            })
            document.getElementById("greyContainer" + arr[1]).addEventListener("click", (event) =>{
                popup.style.display = "block";
                popupoverlay.style.display = "block";
                document.querySelector(".otherTitlesg").innerHTML = `Would you like to join ${pubarr[rng[1]].groupname}?`
            })
            document.getElementById("greyContainer" + arr[2]).addEventListener("click", (event) =>{
                popup.style.display = "block";
                popupoverlay.style.display = "block";
                document.querySelector(".otherTitlesg").innerHTML = `Would you like to join ${pubarr[rng[2]].groupname}?`
            })
            document.getElementById("greyContainer" + arr[3]).addEventListener("click", (event) =>{
                popup.style.display = "block";
                popupoverlay.style.display = "block";
                document.querySelector(".otherTitlesg").innerHTML = `Would you like to join ${pubarr[rng[3]].groupname}?`
            })
            document.getElementById("greyContainer" + arr[4]).addEventListener("click", (event) =>{
                popup.style.display = "block";
                popupoverlay.style.display = "block";
                document.querySelector(".otherTitlesg").innerHTML = `Would you like to join ${pubarr[rng[4]].groupname}?`
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
            // yourgrouptxt.style.display = "none";
            let newsection = document.createElement(`Section`)
            newsection.className = "groupBoxSection3"
            newsection.innerHTML = `
            <div class ="greyContainer2 box2">
                <div class="inputdivs">
                    <div class="rowInputLeft">
                        <img src="images/groupicon.png" class="groupicons">
                        <h2 class="groupText">${data.groupname}</h2>
                    </div>
                </div>
                <div class="textRight">
                    <h2 class="membersText">Members</h2>
                </div>
                <div class="textRight">
                    <h2 class="valueText">47/50</h2>
                </div>
            </div>`
        yourgroups.appendChild(newsection);
        // yourgroups.appendChild(newsection);
            console.table(data);
        })
    }
    

    document.getElementById("createGroupBtn").addEventListener("click", (event) =>{
        createpopup.style.display = "block";
        createpopupoverlay.style.display = "block";
        document.querySelector(".otherTitles").innerHTML = `Would you like to join ${data[0].groupname}?`
    })

    document.getElementById("cancelBtn13").addEventListener("click", (event) =>{
        createpopup.style.display = "none";
        createpopupoverlay.style.display = "none";
    })

    
userGroup();
one();
