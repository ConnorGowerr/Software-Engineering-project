document.addEventListener("DOMContentLoaded", function() {
    const progressBars = document.querySelectorAll(".progress-fill");
    const types = ["type1", "type2", "type3", "type4"];

    progressBars.forEach((bar, index) => {
        let randomValue = Math.floor(Math.random() * 101); // 0-100% progress
        let type = types[index % types.length]; // Cycle through 4 types

        bar.classList.remove("type1", "type2", "type3", "type4"); // Ensure no conflicts
        bar.classList.add(type);  // Assign random color
        bar.style.width = randomValue + "%"; // Random width
    });
});
