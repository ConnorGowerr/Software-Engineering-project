const loadStartTime = Date.now(); 

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

        // if(isAdmin) loadInviteBar();

        document.getElementById("hellthTitle").innerHTML = groupData.groupname;

        const info = document.querySelector(".GI1").children;
        info[0].innerHTML = `<p>ID:  ${groupId}</p>`;
        if (isAdmin) {
            info[1].innerHTML = `<p>Members: ${membersData.length}/50 <button class="add-member-btn">+</button></p>`;
        } else {
            info[1].innerHTML = `<p>Members: ${membersData.length}/50</p>`;
        }
        
        info[2].innerHTML = `<p>Created On:  ${groupData.creationdate.split('T')[0]}</p>`;
        info[3].innerHTML = `<p>Created By:  ${groupData.createdby}</p>`;
        if (isAdmin) {
            info[1].innerHTML = `<p>Members: ${membersData.length}/50 <button class="add-member-btn">+</button></p>`;
        } else {
            info[1].innerHTML = `<p>Members: ${membersData.length}/50</p>`;
        }
        
   
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
                attachAdminPromotionHandler(userItem, user, adminsContainer);
            }

            const isSelf = user.username === activeUser;
            if ((isAdmin && !isSelf) || isSelf) {
                attachRemoveHandler(userItem, user.username, isSelf);
            }

            (user.isadmin ? adminsContainer : usersContainer).appendChild(userItem);
        });

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

function attachAdminPromotionHandler(userItem, user, adminsContainer) {
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

        const handleConfirm = () => {
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
function attachRemoveHandler(userItem, username, isSelf) {
    const removeSection = userItem.querySelector(".userRemove");
    removeSection.innerHTML = `<img src="/images/user-remove.svg" alt="Remove User" style="cursor: pointer;">`;
    const removeBtn = removeSection.querySelector("img");

    removeBtn.addEventListener("click", () => {
        const title = isSelf
            ? "Are you sure you want to leave this group?"
            : `Remove ${username} from this group?`;

        showConfirmationPopup({
            titleText: title,
            onConfirm: () => {
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



//basic popup for confirming to remove user 
function showConfirmationPopup({ titleText, onConfirm }) {
    const popupOverlay = document.querySelector(".popup-overlay");
    const title = document.querySelector("#groupDelTitle");
    const confirmBtn = document.querySelector("#confirmBtn5");
    const cancelBtn = document.querySelector("#cancelBtn5");

    title.textContent = titleText;
    popupOverlay.style.display = "block";

    const confirmHandler = () => {
        popupOverlay.style.display = "none";
        cleanup();
        onConfirm();
    };

    const cancelHandler = () => {
        popupOverlay.style.display = "none";
        cleanup();
    };

    function cleanup() {
        confirmBtn.removeEventListener("click", confirmHandler);
        cancelBtn.removeEventListener("click", cancelHandler);
    }

    confirmBtn.addEventListener("click", confirmHandler);
    cancelBtn.addEventListener("click", cancelHandler);
}

function loadInviteBar(){
    const inviteBar = document.getElementById("invite-bar");
    inviteBar.style.display = "flex"; 
}

function updateStatusButton(groupData, info) {
    const statusButton = document.querySelector('.toggle-status-btn');
    if (statusButton) {
        statusButton.addEventListener('click', function() {
        
            groupData.ispublic = !groupData.ispublic;

            
            const newStatusText = groupData.ispublic ? 'Public' : 'Private';
            const newToggleSymbol = groupData.ispublic ? '–' : '+'; 

        
            info.innerHTML = `<p>Status: ${newStatusText} <button class="toggle-status-btn">${newToggleSymbol}</button></p>`;
            
           
            updateStatusButton(groupData, info);  
        });
    }
}