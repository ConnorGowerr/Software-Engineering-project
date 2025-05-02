    
const popup = document.querySelector(".popup2")
const popupoverlay = document.querySelector(".popup-overlay")
const createpopup = document.querySelector(".popup3")
const createpopupoverlay = document.querySelector(".popup-overlay2")
    
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
            console.table(data)

            groupValues(data);
            
        document.getElementById("greyContainer3").addEventListener("click", (event) =>{
            popup.style.display = "block";
            popupoverlay.style.display = "block";
            document.querySelector(".otherTitles").innerHTML = `Would you like to join ${data[0].groupname}?`
        })
        document.getElementById("greyContainer4").addEventListener("click", (event) =>{
            popup.style.display = "block";
            popupoverlay.style.display = "block";
            document.querySelector(".otherTitles").innerHTML = `Would you like to join ${data[1].groupname}?`
        })
        document.getElementById("greyContainer5").addEventListener("click", (event) =>{
            popup.style.display = "block";
            popupoverlay.style.display = "block";
            document.querySelector(".otherTitles").innerHTML = `Would you like to join ${data[2].groupname}?`
        })

        document.getElementById("confirmBtn2").addEventListener("click", (event) => {
            popup.style.display = "none";
            popupoverlay.style.display = "none";
        
            const name = data[0].groupname;
            if (name) {
                window.location.href = `/group/${encodeURIComponent(name)}`;
            }
        });
        

        document.getElementById("cancelBtn2").addEventListener("click", (event) =>{
            popup.style.display = "none";
            popupoverlay.style.display = "none";
        })
    })
        .catch(error => console.error('Error fetching search results:', error));
    }

    function groupValues(d){
        const box1 = document.getElementById("greyContainer3");
        // const box2 = document.getElementById("greyContainer4");
        // const box3 = document.getElementById("greyContainer5");

        const data1 = d[0];
        // const data2 = d[1];
        // const data3 = d[2];

        box1.querySelector(".groupText").innerHTML = `${d[0].groupname}`;
        // box2.querySelector(".groupText").innerHTML = `${d[1].groupname}`;
        // box3.querySelector(".groupText").innerHTML = `${d[2].groupname}`;
    }

    document.getElementById("createGroupBtn").addEventListener("click", (event) =>{
        createpopup.style.display = "block";
        createpopupoverlay.style.display = "block";
        document.querySelector(".otherTitles").innerHTML = `Would you like to join ${data[0].groupname}?`
    })

    document.getElementById("cancelBtn3").addEventListener("click", (event) =>{
        createpopup.style.display = "none";
        createpopupoverlay.style.display = "none";
    })
    

one();




