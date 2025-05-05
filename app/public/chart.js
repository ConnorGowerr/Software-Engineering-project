let calorieChart, activityChart;

async function fetchChartData(chartType, timeRange) {
    const res = await fetch(`/api/data/${chartType}?range=${timeRange}`);
    const data = await res.json();
    return {
        labels: data.labels,
        values: data.values
    };
}

async function updateChart(chart, chartType, timeRange) {
    const { labels, values } = await fetchChartData(chartType, timeRange);
    chart.data.labels = labels;
    chart.data.datasets[0].data = values;
    chart.update();
}

function initCharts() {
    const ctx1 = document.getElementById('caloriesChart').getContext('2d');
    const ctx2 = document.getElementById('activityChart').getContext('2d');

    calorieChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Calories',
                data: [],
                borderColor: '#FF5733',
                fill: false
            }]
        },
        options: { responsive: true }
    });

    activityChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Activity',
                data: [],
                borderColor: '#1DE44F',
                fill: false
            }]
        },
        options: { responsive: true }
    });

    updateChart(calorieChart, 'calories', 'week');
    updateChart(activityChart, 'activity', 'week');
}

document.addEventListener('DOMContentLoaded', () => {
    initCharts();

    document.querySelectorAll('.view-buttons .btn').forEach(button => {
        button.addEventListener('click', () => {
            const chartType = button.dataset.chart;
            const timeRange = button.dataset.range;
            const chart = chartType === 'calories' ? calorieChart : activityChart;
            updateChart(chart, chartType, timeRange);
        });
    });
});
