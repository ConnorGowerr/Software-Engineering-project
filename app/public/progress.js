window.addEventListener("DOMContentLoaded", () => {
  const today = new Date().getDay();
  const chartInstances = new Map();

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

  function formatLabels(scope, data) {
  return data.map(entry => {
    const date = new Date(entry.date);
    if (scope === 'year') {
      return date.toLocaleDateString(undefined, { month: 'short' }); 
    }
    if (scope === 'month') {
      return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }); 
    }
    return date.toLocaleDateString(undefined, { weekday: 'short' }); 
  });
}


  async function loadChart({ scope, type, endpoint, label, color, elementId }) {
  try {
    const username = sessionStorage.getItem("username");
    if (!username) {
      window.location.href = "/";
      return;
    }

    const res = await fetch(`/api/chart/${endpoint}?scope=${scope}&username=${encodeURIComponent(username)}`);
    const raw = await res.json();
    const labels = formatLabels(scope, raw);
    const values = raw.map(e => parseInt(
      e[type === 'calories' ? 'total_calories' : 'total_minutes'], 10
    ));

    const chartData = {
      labels,
      datasets: [{
        label,
        data: values,
        backgroundColor: labels.map((_, i) =>
          i === today ? color.highlight : color.default
        ),
        borderRadius: 8,
        borderSkipped: false
      }]
    };

    const config = {
      type: 'bar',
      data: chartData,
      options: {
        ...commonOptions,
        plugins: {
          ...commonOptions.plugins,
          title: {
            display: true,
            text: `${label} – ${scope.charAt(0).toUpperCase() + scope.slice(1)}`,
            color: '#FFF',
            font: { family: 'Oswald', size: 18 }
          }
        }
      }
    };

    if (chartInstances.has(elementId)) chartInstances.get(elementId).destroy();
    const instance = new Chart(document.getElementById(elementId), config);
    chartInstances.set(elementId, instance);

  } catch (err) {
    console.error(`Failed to load ${type} chart (${scope}):`, err);
  }
}

  // Chart configs
  const chartConfigs = [
    {
      type: 'calories',
      endpoint: 'calories',
      label: 'Calories',
      elementId: 'caloriesChart',
      color: { default: '#C33128', highlight: '#FF5C5C' },
      buttons: [
        { id: 'dailyBtnCalories', scope: 'week' },
        { id: 'weeklyBtnCalories', scope: 'month' },
        { id: 'monthlyBtnCalories', scope: 'year' }
      ]
    },
    {
      type: 'activity',
      endpoint: 'activity',
      label: 'Minutes Active',
      elementId: 'activityChart',
      color: { default: '#F8B62D', highlight: '#FFD700' },
      buttons: [
        { id: 'dailyBtnActivity', scope: 'week' },
        { id: 'weeklyBtnActivity', scope: 'month' },
        { id: 'monthlyBtnActivity', scope: 'year' }
      ]
    }
  ];

  for (const config of chartConfigs) {
    config.buttons.forEach(({ id, scope }) => {
      document.getElementById(id)?.addEventListener('click', () => loadChart({ ...config, scope }));
    });
    loadChart({ ...config, scope: 'week' }); 
  }
});
