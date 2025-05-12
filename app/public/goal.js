const loadStartTime = Date.now(); 
let user ="";
let username = window.sessionStorage.getItem("username")

//loading screen
window.addEventListener('load', () => {
    const skeleton = document.getElementById('skeleton-screen');
    if (!skeleton) return;

    const elapsed = Date.now() - loadStartTime;
    const remaining = Math.max(0, 1000 - elapsed); 

    setTimeout(() => {
        skeleton.style.transition = 'opacity 0.4s ease';
        skeleton.style.opacity = '0';
        setTimeout(() => {
            skeleton.remove()
            fetchGoals()}, 400);
    }, remaining);
});

async function fetchGoals() {
  try {
    const userResponse = await fetch(`/api/return-user?q=${username}`);
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user');
    }
    const userData = await userResponse.json();
    user = userData[0];
    

    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const goals = await response.json();
    console.table(goals);
    renderGoals(goals);
  } catch (error) {
    console.error('Failed to fetch goals:', error);
    return [];
  }
}

function renderGoals(goals) {
  const container = document.querySelectorAll('.goalscrollableContainer')[0]; 


  //weight meal goals
  goals.forEach((goal, index) => {
    const goalDiv = document.createElement('div');
    goalDiv.className = 'goalItem';
    goalDiv.id = `goal-${index}`;

    goalDiv.innerHTML = `
      <div class="goalTitleContainer">
        <h2 >${goal.goalname}</h2>
      </div> 
     
      
      <div class="goalItemTextSection2">
        <p><strong>Started:</strong> <br>${goal.startdate.split('T')[0]}</p>
        <p><strong>End date:</strong>  <br>${goal.enddate.split('T')[0]}</p>
    
      </div>

      <div class="goalItemTextSection">
          <p><strong>Target Weight:</strong> ${goal.targetweight} kg</p>
      </div>
      
    `;

    container.appendChild(goalDiv);

        
    goalDiv.addEventListener('click', () => {
      const overlay = document.getElementById('goalOverlay');
      overlay.innerHTML = '';

      const cloned = goalDiv.cloneNode(true);

      cloned.innerHTML = `
        <div class="goalTitleContainer">
          <h2 >${goal.goalname}</h2>
        </div> 
      
        
        <div class="goalItemTextSection2">
          <p><strong>Started:</strong> <br>${goal.startdate.split('T')[0]}</p>
          <p><strong>End date:</strong>  <br>${goal.enddate.split('T')[0]}</p>
        </div>

        <div class="goalItemTextSection">
            <p><strong>Target Weight:</strong> ${goal.targetweight} kg</p>
        </div>
        
      `;

      const handleOutsideClick = (event) => {
        if (!cloned.contains(event.target)) {
            closePopup();
        }
      };

      const closePopup = () => {
          overlay.classList.add('hidden');
      };

      overlay.appendChild(cloned);
      overlay.classList.remove('hidden');
      overlay.addEventListener("click", handleOutsideClick);

});
  });
}


document.getElementById("goalContent2").addEventListener("click", e => {
  console.table(user)
  showMealPopup()
})

function showMealPopup() {
    console.table(user)
    const overlay = document.querySelector("#addAdminMemberOverlay");
    const popup = document.querySelector(".addMeal");
    const title = document.querySelector("#goalTitle");
    const confirmBtn = document.querySelector("#confirmBtn55");

    title.textContent = 'Add New Goal';
    overlay.style.display = "block";
    popup.style.display = "block";


    
    const handleConfirm = async (event) => {

      console.log(user)
      event.preventDefault();

       const fullDate = new Date();
        const dateOnly = new Date(fullDate.getFullYear(), fullDate.getMonth(), fullDate.getDate(),0,0,0);

        const body = {
          goalname: document.getElementById("goalName").value,
          username: username = window.sessionStorage.getItem("username"),
          currentWeight: user.weight,
          enddate:  document.getElementById("meal-date").value ,
          startdate: dateOnly,
          targetWeight: document.getElementById("Target").value
        }


        const goalMade = await fetch('/api/goal/AddMealGoal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ body })
        });
        
        if (!goalMade.ok) {
            throw new Error(`goalMade failed: ${goalMade.status}`);
        }
        
        const goalRes = await goalMade.json();
        console.table(goalRes)

        closePopup();
    };

    const handleOutsideClick = (event) => {
        if (!popup.contains(event.target)) {
            closePopup();
        }
    };

    const closePopup = () => {
        overlay.style.display = "none";
        popup.style.display = "none";
        confirmBtn.removeEventListener("click", handleConfirm);
        overlay.removeEventListener("click", handleOutsideClick);
    };

    confirmBtn.addEventListener("click", handleConfirm);
    overlay.addEventListener("click", handleOutsideClick);
}

