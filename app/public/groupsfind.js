let GroupData = [];
// let username = window.sessionStorage.getItem("username");
const joinbtn = document.getElementById("joinGroup");
// const usercount = 0;

console.log("213r2t4rgethrgfh")

function findGroup(){
    const findgroupID = document.getElementById("groupidfinder").value;
    fetch("http://localhost:8008/groups/join", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            groupid: findgroupID,
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
        // console.table(data);
        GroupData = data.groups
    })
    .catch(error => {
        console.error("Error:", error);
        
    });
}


joinbtn.addEventListener("click", (event) => {
    if(usercount < 5){
        findGroup();
    }else{
        console.log("Failure: too many groups joined");
    }
})

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

joinbtn.addEventListener("click", async function (event) {
  event.preventDefault();

  const groupName = GroupData.groupname
  const groupMemberCount = ;

  try {
    const res = await fetch('/joinGroupMail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reason: reason.value,
        feedbackInput: message  
      })
    });

    if (res.ok) {
        console.log("Email sending ok")
    } else {
      alert("Failed to send message.");
    }
  } catch (err) {
    console.error(err);
    alert("An error occurred while sending your message.");
  }
});