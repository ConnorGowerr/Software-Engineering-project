const params = new URLSearchParams(window.location.search);
const username = params.get('username');

async function loadTickets() {
    const res = await fetch(`/api/admin/support-requests?username=${username}`);
    if (!res.ok) {
        const err = await res.text();
        alert("Failed to load tickets: " + err);
        return;
    }

    const data = await res.json();
    const tbody = document.querySelector('#ticketTable tbody');
    tbody.innerHTML = '';

    data.forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ticket.username}</td>
            <td>${ticket.email}</td>
            <td>${ticket.reason}</td>
            <td>${ticket.message}</td>
            <td>${new Date(ticket.submitted_at).toLocaleString()}</td>
            <td>${ticket.is_resolved ? 'Resolved' : 'Open'}</td>
            <td>${ticket.is_resolved ? '' : `<button onclick="resolveTicket(${ticket.id})">Resolve</button>`}</td>
        `;
        tbody.appendChild(row);
    });
}

async function resolveTicket(id) {
    const res = await fetch(`/api/admin/resolve-ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: id, username })
    });

    if (res.ok) {
        alert("Ticket resolved.");
        loadTickets();
    } else {
        const err = await res.text();
        alert("Error resolving ticket: " + err);
    }
}

window.addEventListener('DOMContentLoaded', loadTickets);
