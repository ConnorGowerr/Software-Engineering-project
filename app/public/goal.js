const loadStartTime = Date.now(); 


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
    const username = window.sessionStorage.username;
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
    console.table (goals);
    renderGoals(goals)
  } catch (error) {
    console.error('Failed to fetch goals:', error);
    return [];
  }


}

function renderGoals(goals) {
  const container = document.querySelectorAll('.goalscrollableContainer')[0]; 

  goals.forEach((goal, index) => {
    const goalDiv = document.createElement('div');
    goalDiv.className = 'goalItem';
    goalDiv.id = `goal-${index}`;

    goalDiv.innerHTML = `
      <div class="goalItemImgSection">
        <img class="goalImg" src="images/activity.png" alt="Goal Icon">
      </div>
      <div class="goalItemTextSection">
        <p><strong>Start Weight:</strong> ${goal.startweight} kg</p>
        <p><strong>Current Weight:</strong> ${goal.currentweight} kg</p>
        <p><strong>Target Weight:</strong> ${goal.targetweight} kg</p>
        <p><strong>Daily Calories:</strong> ${goal.dailycalories}</p>
      </div>
    `;

    container.appendChild(goalDiv);
  });
}
