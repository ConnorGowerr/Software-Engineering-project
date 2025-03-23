//Selecting h2 elements, specifically the 2 choices between "Monthly" and "Single", with an "on click" function
//If statement to check if the clicked element is already selected by checking its class
//remove the class and give it to the clicked element
$("div").click(function () { 
    if($(this).hasClass("selectedBtn"))
        console.log("1")
         $("div").removeClass("selectedBtn").addClass("selectBtn");               
    $(this).addClass("selectBtn");
});

$("img").click(function () { 
    if($(this).hasClass("selectBtnimg"))
        console.log("1")
         $("img").removeClass("selectBtnimg").addClass("selectedBtnimg");               
    $(this).addClass("selectedBtnimg");        
});