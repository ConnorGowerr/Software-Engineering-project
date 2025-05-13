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
  function isValidChartData(data) {
    if (typeof data !== 'object' || data === null) {
      console.error("Chart data is not an object:", data);
      return false;
    }

    if (!Array.isArray(data.labels) || data.labels.length === 0) {
      console.error("Chart data must contain a non-empty labels array:", data.labels);
      return false;
    }

    if (!Array.isArray(data.datasets) || data.datasets.length === 0) {
      console.error("Chart data must contain a non-empty datasets array:", data.datasets);
      return false;
    }

    for (const dataset of data.datasets) {
      if (typeof dataset !== 'object' || dataset === null) {
        console.error("Each dataset must be an object:", dataset);
        return false;
      }

      if (typeof dataset.label !== 'string') {
        console.error("Each dataset must have a string 'label' property:", dataset);
        return false;
      }

      if (!Array.isArray(dataset.data)) {
        console.error("Each dataset must have a 'data' array:", dataset);
        return false;
      }

      if (dataset.data.length !== data.labels.length) {
        console.error("Each dataset 'data' array must match labels length:", dataset.data, data.labels);
        return false;
      }

      if (!dataset.data.every(n => typeof n === 'number' && !isNaN(n))) {
        console.error("Each dataset 'data' must be all numbers:", dataset.data);
        return false;
      }
    }

    return true;
  }

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
  console.log("Fetch activity try")
  const activityData = await resActivity.json();
  console.log("fetch data succesfull")
  const activityMinutes = activityData.map(entry => parseInt(entry.total_minutes, 10));
  console.log(activityMinutes)
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
