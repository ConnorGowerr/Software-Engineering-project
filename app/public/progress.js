window.addEventListener("DOMContentLoaded", () => {
  // Calories Chart
  const caloriesCtx = document.getElementById('caloriesChart');
  const caloriesChart = new Chart(caloriesCtx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Calories Consumed',
        data: [2200, 2100, 2500, 2300, 1800, 1900, 2000],
        backgroundColor: 'rgba(255, 99, 132, 0.6)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  // Activity Chart
  const activityCtx = document.getElementById('activityChart');
  const activityChart = new Chart(activityCtx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Active Minutes',
        data: [30, 45, 60, 50, 40, 35, 55],
        fill: false,
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
});
