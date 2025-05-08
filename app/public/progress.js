window.addEventListener("DOMContentLoaded", async () => {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();

  // Common styling options
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
        ticks: { color: '#ffffff', font: { family: 'Poppins' } },
        beginAtZero: true
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutCubic'
    }
  };

  // Fetch dynamic calorie data
  const response = await fetch('/api/chart/week-calories');
  const data = await response.json();

  const caloriesData = data.map(entry => parseInt(entry.total_calories, 10));
  const chartLabels = data.map(entry => {
    const date = new Date(entry.date);
    return labels[date.getDay()];
  });

  new Chart(document.getElementById('caloriesChart'), {
    type: 'bar',
    data: {
      labels: chartLabels,
      datasets: [{
        label: 'Calories',
        data: caloriesData,
        backgroundColor: chartLabels.map((_, i) =>
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
  // Fetch dynamic activity data
const resActivity = await fetch('/api/chart/week-activity');
const activityData = await resActivity.json();

const activityMinutes = activityData.map(entry => parseInt(entry.total_minutes, 10));
const activityLabels = activityData.map(entry => {
  const date = new Date(entry.date);
  return labels[date.getDay()];
});

new Chart(document.getElementById('activityChart'), {
  type: 'bar',
  data: {
    labels: activityLabels,
    datasets: [{
      label: 'Minutes Active',
      data: activityMinutes,
      backgroundColor: activityLabels.map((_, i) =>
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
