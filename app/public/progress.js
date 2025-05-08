window.addEventListener("DOMContentLoaded", () => {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#2C2C2C',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        titleFont: { family: 'Poppins', weight: 'bold' },
        bodyFont: { family: 'Poppins' }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#ffffff', font: { family: 'Poppins' } }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#ffffff', font: { family: 'Poppins' } }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutCubic'
    }
  };

  // Calories Chart
  const caloriesChart = new Chart(document.getElementById('caloriesChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Calories',
        data: [2300, 2100, 2500, 1900, 2400, 2000, 1800], 
        backgroundColor: labels.map((_, i) =>
          i === today ? '#FF5C5C' : '#C33128'
        ),
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      ...commonOptions,
      plugins: {
        ...commonOptions.plugins,
        title: {
          display: true,
          text: 'Weekly Caloric Intake',
          color: '#FFF',
          font: { family: 'Oswald', size: 18 }
        }
      }
    }
  });

  // Activity Chart
  const activityChart = new Chart(document.getElementById('activityChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Minutes Active',
        data: [45, 30, 60, 50, 20, 70, 35], // replace with dynamic data
        backgroundColor: labels.map((_, i) =>
          i === today ? '#FFD700' : '#F8B62D'
        ),
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      ...commonOptions,
      plugins: {
        ...commonOptions.plugins,
        title: {
          display: true,
          text: 'Weekly Activity (minutes)',
          color: '#FFF',
          font: { family: 'Oswald', size: 18 }
        }
      }
    }
  });
});
