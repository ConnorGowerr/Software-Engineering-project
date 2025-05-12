    
const popup = document.querySelector(".popupg2")
const popupoverlay = document.querySelector(".popup-overlay")
const createpopup = document.querySelector(".popup3")
const createpopupoverlay = document.querySelector(".popup-overlay2")

rng = [];
arr = [3, 4, 5, 6, 7]
pubarr = [];

function randomiseGroup(d){
    const set = new Set();

    for(i = 0; i < d.length; i++){
        if(d[i].ispublic == true){
            pubarr.push(d[i]);
            console.table(pubarr);
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
            console.table(data)
            
            // groupValues(data);
            console.table(rng);
            
            const box1 = document.getElementById("greyContainer3");
            const box2 = document.getElementById("greyContainer4");
            const box3 = document.getElementById("greyContainer5");
            const box4 = document.getElementById("greyContainer6");
            const box5 = document.getElementById("greyContainer7");

            const num1 = document.getElementById("memberCount1");
            const num3 = document.getElementById("memberCount3");
            const num4 = document.getElementById("memberCount4");
            const num5 = document.getElementById("memberCount5");
            const num6 = document.getElementById("memberCount6");
    
            const data1 = pubarr[rng[0]];
            const data2 = pubarr[rng[1]];
            const data3 = pubarr[rng[2]];
            const data4 = pubarr[rng[3]];
            const data5 = pubarr[rng[4]];

            const member1 = memberCount(data1.groupid);
            console.log(member1);
            const member2 = memberCount(data2.groupid);
            const member3 = memberCount(data3.groupid);
            const member4 = memberCount(data4.groupid);
            const member5 = memberCount(data5.groupid);

    
            box1.querySelector(".groupText").innerHTML = `${data1.groupname}`;
            box2.querySelector(".groupText").innerHTML = `${data2.groupname}`;
            box3.querySelector(".groupText").innerHTML = `${data3.groupname}`;
            box4.querySelector(".groupText").innerHTML = `${data4.groupname}`;
            box5.querySelector(".groupText").innerHTML = `${data5.groupname}`;


            
            // num3.querySelector(".valueText").innerHTML = `${member3}/50`
            // num4.querySelector(".valueText").innerHTML = `${member4}/50`
            // num5.querySelector(".valueText").innerHTML = `${member5}/50`
            // num6.querySelector(".valueText").innerHTML = `${member1}/50`

            console.log(member1);


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

    // function groupValues(d){


    // }

    function memberCount(groupid){
        const groupID = [1, 2, 3, 4, 5];
        let count = 2;
        for(i = 2; i < 7; i++){
            fetch('/groups/:allgroups/:groupid', {
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
                // console.log(data.count);
                
                console.log(i);
                let num2 = document.getElementById(`memberCount${i}`);
                num2.querySelector(".valueText").innerHTML = `${data.count}/50`
                console.log(num2);
                // count++;
                // return data.count;
            })
        }
        


        // console.table(groupnum)

        
            // fetch(`/groups/:allgroups/:${encodeURIComponent(groupid)}`)
            // .then(response => {
            //     if (!response.ok) {
            //         console.error('Server returned an error:', response.statusText);
            //         throw new Error('Failed to fetch search results');
            //     }
            //     return response.json();
            // }).then(data2 => {
            //     console.log(data2)
            // })
 
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

    

one();