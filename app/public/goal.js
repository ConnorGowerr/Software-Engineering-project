const loadStartTime = Date.now(); 
let user ={};
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
  const container2 = document.querySelectorAll('.goalscrollableContainer')[1]; 

 
  const mealGoalsnotmet = goals.filter(goal => goal.goaltag === 'meal' && !goal.isgoalmet);
  const activityGoalsnotmet = goals.filter(goal => goal.goaltag === 'exercise' && !goal.isgoalmet);
  const mealGoalsmet = goals.filter(goal => goal.goaltag === 'meal' && goal.isgoalmet);
  const activityGoalsmet = goals.filter(goal => goal.goaltag === 'exercise' && goal.isgoalmet);

  
  mealGoalsnotmet.forEach((goal, index) => {
    const goalDiv = document.createElement('div');
    goalDiv.className = 'goalItem';
    goalDiv.id = `goal-${index}`;

    goalDiv.innerHTML = `
      <div class="goalTitleContainer">
        <h2>${goal.goalname}</h2>
      </div> 
     
      <div class="goalItemTextSection2">
        <p><strong>Started:</strong> <br>${goal.startdate.split('T')[0]}</p>
        <p><strong>End date:</strong>  <br>${goal.enddate.split('T')[0]}</p>
      </div>

      <div class="goalItemTextSection">
        <p><strong>Target Weight:</strong>  <br>${goal.targetweight} kg</p>
      </div>
    `;

    container.appendChild(goalDiv);

    goalDiv.addEventListener('click', () => {
      const overlay = document.getElementById('goalOverlay');
      overlay.innerHTML = '';

      const cloned = goalDiv.cloneNode(true);

    
      const progress = (goal.currentweight - goal.startweight) / (goal.targetweight - goal.startweight) * 100;
      const progressPercentage = Math.min(Math.max(progress, 0), 100);  

      cloned.innerHTML = `
        <div class="goalTitleContainer">
          <h2>${goal.goalname}</h2>
        </div> 
        
        <div class="goalItemTextSection2">
          <p><strong>Started:</strong> <br>${goal.startdate.split('T')[0]}</p>
          <p><strong>End date:</strong>  <br>${goal.enddate.split('T')[0]}</p>
        </div>

        <div class="goalItemTextSection">
          <p><strong>Current Weight:</strong>  <br>${goal.currentweight} kg</p>
          <p><strong>Target Weight:</strong>  <br>${goal.targetweight} kg</p>
        </div>

        <div class="progressBarContainer">
          <div class="progressBar" data-label= "${Math.round(progressPercentage)}%" style="width: ${progressPercentage}%"></div>
        </div>

        <button class ="cancelBtn" id = "cancelBtn333">DELETE</button>
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

      const cancelBtn = cloned.querySelector("#cancelBtn333");

      cancelBtn.addEventListener("click", e => {
          container.removeChild(goalDiv);
          deletemealgoal(goal.goalid)
          closePopup();
      });
    });
  });







  // Render activity goals
  activityGoalsnotmet.forEach((goal, index) => {

    const goalDiv = document.createElement('div');
    goalDiv.className = 'goalItem';
    goalDiv.id = `goal-${index}`;

    goalDiv.innerHTML = `
      <div class="goalTitleContainer">
        <h2>${goal.goalname}</h2>
      </div> 
     
      <div class="goalItemTextSection2">
        <p><strong>Started:</strong> <br>${goal.startdate.split('T')[0]}</p>
        <p><strong>End date:</strong>  <br>${goal.enddate.split('T')[0]}</p>
      </div>

      <div class="goalItemTextSection">
        <p><strong>Target Minutes:</strong> <br>${goal.targetactivity} min</p>
      </div>
    `;

    container.appendChild(goalDiv);

    goalDiv.addEventListener('click', () => {
      const overlay = document.getElementById('goalOverlay');
      overlay.innerHTML = '';

      const progress = (goal.weeklyactivity - 0) / (goal.targetactivity - 0) * 100;
      const progressPercentage = Math.min(Math.max(progress, 0), 100);  
      const cloned = goalDiv.cloneNode(true);

      cloned.innerHTML = `
        <div class="goalTitleContainer">
          <h2>${goal.goalname}</h2>
        </div> 
      
        <div class="goalItemTextSection2">
          <p><strong>Started:</strong> <br>${goal.startdate.split('T')[0]}</p>
          <p><strong>End date:</strong>  <br>${goal.enddate.split('T')[0]}</p>
        </div>

        <div class="goalItemTextSection">
            <p><strong>Weekly Target:</strong>  <br>${goal.targetactivity} min</p>
        </div>

        <div class="progressBarContainer">
          <div class="progressBar2"  data-label= "${Math.round(progressPercentage)}%" style="width: ${progressPercentage}%"></div>
        </div>

        <button class ="cancelBtn" id = "cancelBtn333">DELETE</button>
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


      const cancelBtn = cloned.querySelector("#cancelBtn333");
      cancelBtn.addEventListener("click", e => {
          container.removeChild(goalDiv);
          deletactivitygoal(goal.goalid)
          closePopup();
      });

     
     });
  });


    // console.table(mealGoalsmet)
    // console.table(activityGoalsmet)


    mealGoalsmet.forEach((goal, index) => {
    const goalDiv = document.createElement('div');
    goalDiv.className = 'goalItem';
    goalDiv.id = `goal-${index}`;

    goalDiv.innerHTML = `
      <div class="goalTitleContainer">
        <h2>${goal.goalname}</h2>
      </div> 
     
      <div class="goalItemTextSection2">
        <p><strong>Started:</strong> <br>${goal.startdate.split('T')[0]}</p>
        <p><strong>End date:</strong>  <br>${goal.enddate.split('T')[0]}</p>
      </div>

      <div class="goalItemTextSection">
        <p><strong>Target Weight:</strong>  <br>${goal.targetweight} kg</p>
      </div>
    `;

    container2.appendChild(goalDiv);

    goalDiv.addEventListener('click', () => {
      const overlay = document.getElementById('goalOverlay');
      overlay.innerHTML = '';

      const cloned = goalDiv.cloneNode(true);


      cloned.innerHTML = `
        <div class="goalTitleContainer">
          <h2>${goal.goalname}</h2>
        </div> 
        
        <div class="goalItemTextSection2">
          <p><strong>Started:</strong> <br>${goal.startdate.split('T')[0]}</p>
          <p><strong>End date:</strong>  <br>${goal.enddate.split('T')[0]}</p>
        </div>

        <div class="goalItemTextSection">
          <p><strong>Target Weight:</strong>  <br>${goal.targetweight} kg</p>
        </div>

        <div class="progressBarContainer">
          <div class="progressBar" data-label= "100%"  style="width: 100%"></div>
        </div>

        <button class ="cancelBtn" id = "cancelBtn333">DELETE</button>

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

      const cancelBtn = cloned.querySelector("#cancelBtn333");
      cancelBtn.addEventListener("click", e => {
        container2.removeChild(goalDiv);
        deletemealgoal(goal.goalid)
        closePopup();
      });

      
   });
  });






  // Render activity goals
  activityGoalsmet.forEach((goal, index) => {
    
    const goalDiv = document.createElement('div');
    goalDiv.className = 'goalItem';
    goalDiv.id = `goal-${index}`;


    goalDiv.innerHTML = `
      <div class="goalTitleContainer">
        <h2>${goal.goalname}</h2>
      </div> 
     
      <div class="goalItemTextSection2">
        <p><strong>Started:</strong> <br>${goal.startdate.split('T')[0]}</p>
        <p><strong>End date:</strong>  <br>${goal.enddate.split('T')[0]}</p>
      </div>

      <div class="goalItemTextSection">
        <p><strong>Target Minutes:</strong> <br>${goal.targetactivity} min</p>
      </div>
    `;

    container2.appendChild(goalDiv);

    goalDiv.addEventListener('click', () => {
      const overlay = document.getElementById('goalOverlay');
      overlay.innerHTML = '';


      const progress = (goal.weeklyactivity - 0) / (goal.targetactivity - 0) * 100;
      const progressPercentage = Math.min(Math.max(progress, 0), 100);  
      const cloned = goalDiv.cloneNode(true);

      cloned.innerHTML = `
        <div class="goalTitleContainer">
          <h2>${goal.goalname}</h2>
        </div> 
      
        <div class="goalItemTextSection2">
          <p><strong>Started:</strong> <br>${goal.startdate.split('T')[0]}</p>
          <p><strong>End date:</strong>  <br>${goal.enddate.split('T')[0]}</p>
        </div>

        <div class="goalItemTextSection">
            <p><strong>Weekly Target:</strong>  <br>${goal.targetactivity} min</p>
        </div>

        <div class="progressBarContainer">
          <div class="progressBar2" data-label= "100%"  style="width:100%"></div>
        </div>

        <button class ="cancelBtn" id = "cancelBtn333">DELETE</button>

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

      const cancelBtn = cloned.querySelector("#cancelBtn333");
      cancelBtn.addEventListener("click", e => {
        container2.removeChild(goalDiv);
        deletactivitygoal(goal.goalid)
        closePopup();
      });
    });
  });
 
}
 

document.getElementById("goalContent2").addEventListener("click", e => {
  showMealPopup()
})

document.getElementById("goalContent4").addEventListener("click", e => {
  showActivityPopup()
})

function showMealPopup() {
    console.table(user)
    const overlay = document.querySelector("#addAdminMemberOverlay");
    const popup = document.querySelector(".addMeal");
    const title = document.querySelector("#goalTitle");
    const confirmBtn = document.querySelector("#confirmBtn55");

    title.textContent = 'Add New Goal';
    overlay.style.display = "block";
    popup.style.display = "flex";


    
    const handleConfirm = async (event) => {

      // event.preventDefault();

       const fullDate = new Date();
        const dateOnly = new Date(fullDate.getFullYear(), fullDate.getMonth(), fullDate.getDate(),0,0,0);

        const body = {
          goalname: document.getElementById("goalName").value,
          username: username,
          currentweight: user.weight,
          enddate:  document.getElementById("meal-date").value ,
          startdate: dateOnly,
          target: document.getElementById("Target").value
        }


        const goalMade = await fetch('/api/goal/AddMealGoal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)

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


function showMealPopup() {
    const overlay = document.querySelector("#addAdminMemberOverlay");
    const popup = document.querySelector(".addMeal");
    const title = document.querySelector("#goalTitle");
    const confirmBtn = document.querySelector("#confirmBtn55");

    title.textContent = 'Add New Goal';
    overlay.style.display = "block";
    popup.style.display = "block";


    
    const handleConfirm = async (event) => {

      // console.log(user)
      // event.preventDefault();

       const fullDate = new Date();
        const dateOnly = new Date(fullDate.getFullYear(), fullDate.getMonth(), fullDate.getDate(),0,0,0);

        const body = {
          goalname: document.getElementById("goalName").value,
          username: username,
          currentweight: user.weight,
          enddate:  document.getElementById("meal-date").value ,
          startdate: dateOnly,
          target: document.getElementById("Target").value
        }

         if (body.target <= 0) {
                alert("Invalid target amount");
                closePopup();
                throw new Error("Invalid target amount");
        }

        const start = new Date(body.startdate);
        const end = new Date(body.enddate);

        if (end <= start) {
            alert("Invalid date");
            closePopup();
            throw new Error("End date must be after start date");
        }



        const goalMade = await fetch('/api/goal/AddMealGoal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)

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



function showActivityPopup() {
    const overlay = document.querySelector("#addactivityOverlay");
    const popup = document.querySelector(".addActivity");
    const title = document.querySelector("#goalTitle2");
    const confirmBtn = document.querySelector("#confirmBtn56");

    title.textContent = 'Add New Goal';
    overlay.style.display = "block";
    popup.style.display = "block";


    
    const handleConfirm = async (event) => {

      console.log(user)
      event.preventDefault();

       const fullDate = new Date();
        const dateOnly = new Date(fullDate.getFullYear(), fullDate.getMonth(), fullDate.getDate(),0,0,0);

        const body = {
          goalname: document.getElementById("goalName2").value,
          username: username,
          enddate:  document.getElementById("meal-date2").value ,
          startdate: dateOnly,
          target: document.getElementById("Target2").value
        }

        if (body.target <= 0) {
                alert("Invalid target amount");
                closePopup();
                throw new Error("Invalid target amount");
        }

        const start = new Date(body.startdate);
        const end = new Date(body.enddate);

        if (end <= start) {
            alert("Invalid date");
            closePopup();
            throw new Error("End date must be after start date");
        }


        const goalMade = await fetch('/api/goal/AddActivityGoal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)

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

async function deletemealgoal(goalid) {
  try {
    const goalDel = await fetch(`/api/goal/deleteMealGoal?q=${goalid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!goalDel.ok) {
      const errorRes = await goalDel.json()
      console.error(`Failed: ${goalDel.status}`, errorRes);
      return;
    }

    const goalRes = await goalDel.json();
    console.log('Deleted:', goalRes.message);
  } catch (err) {
    console.error('Request error:', err);
  }
}



async function deletactivitygoal(goalid){
    try {
    const goalDel = await fetch(`/api/goal/deleteActivityGoal?q=${goalid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!goalDel.ok) {
      const errorRes = await goalDel.json()
      console.error(`Failed: ${goalDel.status}`, errorRes);
      return;
    }

    const goalRes = await goalDel.json();
    console.log('Deleted:', goalRes.message);
  } catch (err) {
    console.error('Request error:', err);
  }
}
