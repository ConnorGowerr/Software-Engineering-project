document.getElementById("contactForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const reason = document.querySelector('input[name="reason"]:checked');
  const message = document.querySelector('textarea[name="feedbackInput"]').value;

  if (!reason) {
    alert("Please select a request type");
    return;
  }

  if (message.length === 0) {
    alert("Please enter a message");
    return;
  }

  try {
    const res = await fetch('/submitContact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reason: reason.value,
        feedbackInput: message  // ✅ match backend key
      })
    });

    if (res.ok) {
      document.getElementById("feedbackPopupOverlay").style.display = "flex";
      document.getElementById("contactForm").reset();
    } else {
      alert("Failed to send message.");
    }
  } catch (err) {
    console.error(err);
    alert("An error occurred while sending your message.");
  }
});

window.closeFeedbackPopup = function () {
  document.getElementById("feedbackPopupOverlay").style.display = "none";
};
