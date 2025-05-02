document.addEventListener("DOMContentLoaded", () => {
    const url = window.location.pathname.split("/");
    const groupname = decodeURIComponent(url[url.length - 1]);

    console.log(groupname)


    fetch(`/api/groups/${encodeURIComponent(groupname)}`)
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    })
    .then(data => {
        console.log("Group data:", data);


        document.getElementById("hellthTitle").innerHTML = `${data.groupname}`
    })
    .catch(err => {
        console.error("Error fetching group data:", err);
    });
});

