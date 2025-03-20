document.addEventListener("DOMContentLoaded", function() {
    const progressBars = document.querySelectorAll(".progress-fill");
    const types = ["type1", "type2", "type3", "type4"];

    progressBars.forEach((bar, index) => {
        let randomValue = Math.floor(Math.random() * 101); 
        let type = types[index % types.length]; 

        bar.classList.remove("type1", "type2", "type3", "type4"); 
        bar.classList.add(type);  
        bar.style.width = randomValue + "%"; h
    });
});
