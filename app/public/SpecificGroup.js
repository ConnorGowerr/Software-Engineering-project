const loadStartTime = Date.now(); 


//loading screen
window.addEventListener('load', () => {
    const skeleton = document.getElementById('skeleton-screen');
    if (!skeleton) return;

    const elapsed = Date.now() - loadStartTime;
    const remaining = Math.max(0, 1000 - elapsed); 

    setTimeout(() => {
        skeleton.style.transition = 'opacity 0.4s ease';
        skeleton.style.opacity = '0';
        setTimeout(() => skeleton.remove(), 400);
    }, remaining);
});


//loading everything
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const urlParts = window.location.pathname.split("/");
        const groupname = decodeURIComponent(urlParts[urlParts.length - 1]);

        const groupRes = await fetch(`/api/groups/${encodeURIComponent(groupname)}`);
        if (!groupRes.ok) throw new Error(`Group fetch failed: ${groupRes.status}`);
        const groupData = await groupRes.json();

        const groupId = groupData.groupid;
        const membersRes = await fetch(`/api/groupMembers/${groupId}`);
        if (!membersRes.ok) throw new Error(`Members fetch failed: ${membersRes.status}`);
        const membersData = await membersRes.json();

        const activeUser = window.sessionStorage.username;
        const isMember = membersData.some(member => member.username === activeUser);

        if (!isMember && !groupData.ispublic) {
            alert("This acction is not permitted.");
            window.location.href = "/home.html"; 
            return;
        }

        const isAdmin = membersData.some(member => member.username === activeUser && member.isadmin);

        

        document.getElementById("hellthTitle").innerHTML = groupData.groupname;
        document.querySelectorAll(".GroupDivTitles")[0].innerHTML = `${groupData.groupname} Stats`;

        const info = document.querySelector(".GI1").children;
        info[0].innerHTML = `<p>ID:  ${groupId}</p>`;
        if (isAdmin) {
            info[1].innerHTML = `<p>Members: ${membersData.length}/50 <button class="add-member-btn">+</button></p>`;
            document.querySelector(".add-member-btn").addEventListener("click", e =>{
                loadInviteBar(groupId);
            })
        } else {
            info[1].innerHTML = `<p>Members: ${membersData.length}/50</p>`;
        }
        
        info[2].innerHTML = `<p>Created On:  ${groupData.creationdate.split('T')[0]}</p>`;
        info[3].innerHTML = `<p>Created By:  ${groupData.createdby}</p>`;

        
   
        if (isAdmin) {
            const statusText = groupData.ispublic ? 'Public' : 'Private';
            const toggleSymbol = groupData.ispublic ? '–' : '+';  
            info[4].innerHTML = `
                <p>Status: ${statusText} 
                    <button class="toggle-status-btn">${toggleSymbol}</button>
                </p>`;
        } else {
            info[4].innerHTML = `<p>Status: ${groupData.ispublic ? 'Public' : 'Private'}</p>`;
        }
        
        
        updateStatusButton(groupData, info[4]);


        const usersContainer = document.querySelectorAll(".scrollableContainer")[0];
        const adminsContainer = document.querySelectorAll(".scrollableContainer")[1];

        membersData.forEach(user => {
            const userItem = createUserItem(user);
        
            if (isAdmin && !user.isadmin) {
                attachAdminPromotionHandler(userItem, user, adminsContainer, groupId);
            }
        
            const isSelf = user.username === activeUser;
            if ((isAdmin && !isSelf && !user.isadmin) || isSelf) {
                attachRemoveHandler(userItem, user.username, isSelf, groupId);
            }
        
            (user.isadmin ? adminsContainer : usersContainer).appendChild(userItem);
        });


        fetchMealChallenges(groupData)
        fetchActivityChallenges(groupData)

    } catch (err) {
        console.error("Error during fetch operations:", err);
    }
});

//function to create the base template for all user items
function createUserItem(user) {
    const userItem = document.createElement("div");
    userItem.className = "userItem";

    const imgSrc = user.isadmin ? "/images/adminGroup.svg" : "/images/user-empty.svg";
    userItem.innerHTML = `
        <div class="userImgSection">
            <img src="${imgSrc}" alt="User">
        </div>
        <div class="userTextSection">
            <p>${user.username}</p>
        </div>
        <div class="userRemove"></div>
    `;

    return userItem;
}


//Making a currrent user an admin, this function can only be called by an admin.
//Remove current UserItem from user container, then add a new Admin item

function attachAdminPromotionHandler(userItem, user, adminsContainer, groupid) {
    const imgElement = userItem.querySelector(".userImgSection img");
    const overlay = document.querySelector("#addAdminMemberOverlay");
    const popup = document.querySelector(".addAdmin");
    const title = document.querySelector("#groupAdminTitle");
    const confirmBtn = document.querySelector("#confirmBtn6");
    const cancelBtn = document.querySelector("#cancelBtn6");

    imgElement.addEventListener("click", () => {
        overlay.style.display = "block";
        popup.style.display = "block";
        title.textContent = `Do you want to make ${user.username} an admin?`;

        const handleConfirm = async () => {

            const adminMade = await fetch('/api/group/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: user.username,  
                    groupId: groupid 
                })
            });
            
            if (!adminMade.ok) {
                throw new Error(`adminMade failed: ${adminMade.status}`);
            }
            
            const adminInfo = await adminMade.json();

            userItem.remove();
            const newAdminItem = createUserItem({ ...user, isadmin: true });
            adminsContainer.appendChild(newAdminItem);
            overlay.style.display = "none";
            popup.style.display = "none";
            confirmBtn.removeEventListener("click", handleConfirm);
            cancelBtn.removeEventListener("click", closePopup);
        };

        const closePopup = () => {
            overlay.style.display = "none";
            popup.style.display = "none";
        };

        confirmBtn.addEventListener("click", handleConfirm);
        cancelBtn.addEventListener("click", closePopup);
    });
}

//removing users/admins from group.
//scenarios -
// 1- you are an admin, you can remove any user and yourself, but not other admins
// 2 - You are a user, you can remove only yourself.
function attachRemoveHandler(userItem, username, isSelf, groupId) {
    const removeSection = userItem.querySelector(".userRemove");
    removeSection.innerHTML = `<img src="/images/user-remove.svg" alt="Remove User" style="cursor: pointer;">`;
    const removeBtn = removeSection.querySelector("img");

    removeBtn.addEventListener("click", () => {
        const title = isSelf
            ? "Are you sure you want to leave this group?"
            : `Remove ${username} from this group?`;

        showConfirmationPopup({
            titleText: title,
            onConfirm: async () => {
                const remnoved = await fetch('/api/group/removeUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,  
                        groupId: groupId 
                    })
                });
                
                if (!remnoved.ok) {
                    throw new Error(`remnoved failed: ${remnoved.status}`);
                }
                userItem.remove();
                if (isSelf) {
                    window.location.href = "/home.html";
                }
            }
        });
    });
}

//basic popup for confirming to add admin
function showConfirmationPopup({ titleText, onConfirm }) {
    const overlay = document.querySelector("#addAdminMemberOverlay");
    const popup = document.querySelector(".addAdmin");
    const title = document.querySelector("#groupAdminTitle");
    const confirmBtn = document.querySelector("#confirmBtn6");
    const cancelBtn = document.querySelector("#cancelBtn6");

    title.textContent = titleText;
    overlay.style.display = "block";
    popup.style.display = "block";

    const handleConfirm = () => {
        onConfirm();
        closePopup();
    };

    const closePopup = () => {
        overlay.style.display = "none";
        popup.style.display = "none";
        confirmBtn.removeEventListener("click", handleConfirm);
        cancelBtn.removeEventListener("click", closePopup);
    };

    confirmBtn.addEventListener("click", handleConfirm);
    cancelBtn.addEventListener("click", closePopup);
}


//send post request to user email if they receieve a invite.
function loadInviteBar(groupId){
    const popupOverlay = document.querySelector("#addMemberOverlay");
    const popup = document.querySelector(".addMember");
    const confirmBtn = document.querySelector("#confirmBtn7");
    const cancelBtn = document.querySelector("#cancelBtn7");
    popupOverlay.style.display = "block";
    popup.style.display = "block";

    const confirmHandler = () => {

        const username = document.querySelector("#search-bar-users").value;

        console.log(username)
        console.log(groupId)


        if (!username || !groupId) {
            alert('Please enter a username and group ID.');
            return;
        }

    
       
        fetch(`/api/groups/${groupId}/invite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Invitation sent!');
                popupOverlay.style.display = "none";
                popup.style.display = "none";

                cleanup();
            } else {
                alert('Failed to send invitation: ' + data.error);
                popupOverlay.style.display = "none";
                popup.style.display = "none";

        cleanup();
            }
        })
        .catch(error => {
            console.error('Error sending invite:', error);
            alert('An error occurred while sending the invite.');
        });
        
       
    };

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
}


//changes status from public to private and vise versa.
function updateStatusButton(groupData, info) {
    const statusButton = document.querySelector('.toggle-status-btn');
    if (statusButton) {
        statusButton.addEventListener('click', function handleClick() {
          
            statusButton.disabled = true;

           
            groupData.ispublic = !groupData.ispublic;

            
            fetch(`/api/groups/${groupData.groupid}/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isPublic: groupData.ispublic })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

           
                const newStatusText = groupData.ispublic ? 'Public' : 'Private';
                const newToggleSymbol = groupData.ispublic ? '–' : '+';
                info.innerHTML = `<p>Status: ${newStatusText} <button class="toggle-status-btn">${newToggleSymbol}</button></p>`;

               
                setTimeout(() => {
                    updateStatusButton(groupData, info);
                }, 1000);
            })
            .catch(error => {
                console.error('Error updating status:', error);
                statusButton.disabled = false;
            });
        });
    }
}

function fetchMealChallenges(groupData) {
  const groupId = groupData.groupid
  const mealChallengesList = document.querySelector('.scrollableContainer2');

    
    fetch(`/mealchallenges?id=${groupId}`)
    .then((response) => response.json())
    .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
        
        data.forEach((challenge) => {
            const listItem = document.createElement('div');
            listItem.classList.add('challenge-item');
            listItem.innerHTML = `
                <div class="goalTitleContainer">
                    <h2>${challenge.goalname}</h2>
                </div>
                  <div class="goalItemTextSection2">
                    <p><strong>Total Calories Tracked:</strong>  <br> ${challenge.currentcalories}</p>
               
                </div>
                <div class="goalItemTextSection">
                    <p><strong>Target:</strong>  <br> ${challenge.calorietarget}</p>
                </div>

              
            
                <div class="progressBarContainer">
                    <div class="progressBar" style="width: ${(challenge.currentcalories / challenge.calorietarget) * 100}%"></div>
                </div>
            `;


        
            mealChallengesList.appendChild(listItem);
        });
        } else {
        errorMessageElement.textContent = 'No meal challenges found for this group.';
        }
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
        errorMessageElement.textContent = 'Error fetching meal challenges.';
    });
}



function fetchActivityChallenges(groupData) {
  const groupId = groupData.groupid
  const mealChallengesList = document.querySelector('.scrollableContainer2');

    
    fetch(`/activitychallenges?id=${groupId}`)
    .then((response) => response.json())
    .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
        
        data.forEach((challenge) => {
            const listItem = document.createElement('div');
            listItem.classList.add('challenge-item');
            listItem.innerHTML = `
                <div class="goalTitleContainer">
                    <h2>${challenge.goalname}</h2>
                </div>
                  <div class="goalItemTextSection2">
                    <p><strong>Total Calories Burnt:</strong>  <br> ${challenge.caloriesburnt}</p>
               
                </div>
                <div class="goalItemTextSection">
                    <p><strong>Target:</strong>  <br> ${challenge.targetcaloriesburnt}</p>
                </div>
       
                <div class="progressBarContainer">
                    <div class="progressBar2" style="width: ${(challenge.caloriesburnt / challenge.targetcaloriesburnt) * 100}%"></div>
                </div>
            `;


        
            mealChallengesList.appendChild(listItem);
        });
        } else {
        errorMessageElement.textContent = 'No meal challenges found for this group.';
        }
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
        errorMessageElement.textContent = 'Error fetching meal challenges.';
    });
}
