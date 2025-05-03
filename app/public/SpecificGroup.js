document.addEventListener("DOMContentLoaded", async () => {
    try {
        const urlParts = window.location.pathname.split("/");
        const groupname = decodeURIComponent(urlParts[urlParts.length - 1]);

        console.log("Group name:", groupname);

        const groupRes = await fetch(`/api/groups/${encodeURIComponent(groupname)}`);
        if (!groupRes.ok) throw new Error(`Group fetch failed: ${groupRes.status}`);
        const groupData = await groupRes.json();

        console.log("Group data:", groupData);

        const groupId = groupData.groupid;
        const membersRes = await fetch(`/api/groupMembers/${groupId}`);
        if (!membersRes.ok) throw new Error(`Members fetch failed: ${membersRes.status}`);
        const membersData = await membersRes.json();

        console.log("Group member data:", membersData);

        document.getElementById("hellthTitle").innerHTML = groupData.groupname;

        const info = document.querySelector(".GI1").children;

        info[0].innerHTML = `<p>ID: <br> ${groupId}</p>`;
        info[1].innerHTML = `<p>Members: <br> ${membersData.length}</p>`;
        info[2].innerHTML = `<p>Created On: <br> ${groupData.creationdate.split('T')[0]}</p>`;
        info[3].innerHTML = `<p>Created By: <br> ${groupData.createdby}</p>`;
        info[4].innerHTML = `<p>Status: <br> ${groupData.ispublic}</p>`;
    } catch (err) {
        console.error("Error during fetch operations:", err);
    }
});
