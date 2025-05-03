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

        if (!isMember) {
            alert("You are not a member of this group.");
            window.location.href = "/home.html"; 
            return;
        }

        document.getElementById("hellthTitle").innerHTML = groupData.groupname;

        const info = document.querySelector(".GI1").children;
        info[0].innerHTML = `<p>ID:  ${groupId}</p>`;
        info[1].innerHTML = `<p>Members:  ${membersData.length}/50</p>`;
        info[2].innerHTML = `<p>Created On:  ${groupData.creationdate.split('T')[0]}</p>`;
        info[3].innerHTML = `<p>Created By:  ${groupData.createdby}</p>`;
        info[4].innerHTML = `<p>Status:  ${groupData.ispublic ? 'Public' : 'Private'}</p>`;

        const usersContainer = document.querySelectorAll(".scrollableContainer")[0];
        const adminsContainer = document.querySelectorAll(".scrollableContainer")[1];

        const isAdmin = membersData.some(member => member.username === activeUser && member.isadmin);

        for (const user of membersData) {

            
            const userItem = document.createElement("div");
            userItem.className = "userItem";


            if(user.username == activeUser){
                userItem.innerHTML = `
                <div class="userImgSection">
                    <img src="/images/user-empty.svg" alt="User">
                </div>
                <div class="userTextSection">
                    <p>${user.username}</p>
                </div>
                <div class="userRemove">
                    
                </div>
            `;

            }
            else{
            userItem.innerHTML = `
                <div class="userImgSection">
                    <img src="/images/user-empty.svg" alt="User">
                </div>
                <div class="userTextSection">
                    <p>${user.username}</p>
                </div>
                <div class="userRemove">
                    <img src="/images/user-remove.svg" alt="Remove User" style="cursor: pointer;">
                </div>
            `;

            const removeBtn = userItem.querySelector(".userRemove img");
            removeBtn.addEventListener("click", () => {
                if (!isAdmin) return alert("Only admins can remove users.");
                
                showConfirmationPopup({
                    titleText: `Remove ${user.username} from this group?`,
                    onConfirm: () => {
                        userItem.remove();
                    
                    }
                });
            });
            }

            if (user.isadmin) {
                adminsContainer.appendChild(userItem);
            } else {
                usersContainer.appendChild(userItem);
            }
        }
    } catch (err) {
        console.error("Error during fetch operations:", err);
    }
});


function showConfirmationPopup({ titleText, onConfirm }) {
    const popupOverlay = document.querySelector(".popup-overlay");
    const title = document.querySelector(".groupDelTitle");
    const confirmBtn = document.querySelector(".confirmBtn");
    const cancelBtn = document.querySelector(".cancelBtn");

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
