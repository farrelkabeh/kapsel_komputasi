// Initial data for the lollipop chart
const data = {
    labels: ['LU', 'Cholesky', 'Determinant', 'SoLE'],
    datasets: [
        {
            label: 'Amount of Calculations', // Label for the sticks
            data: [21, 8, 19, 30], // Data values for the sticks
            backgroundColor: ['#000000', '#000000', '#000000'],
            borderColor: '#000000',
            type: 'bar',
            borderWidth: 3,
            borderSkipped: false, // Ensures the "stick" extends fully
            barThickness: 4 // Makes the "stick" thin like a lollipop stick
        },
        {
            label: 'Amount of Calculations', // Label for the dots
            data: [21, 8, 19, 30], // Data values for the dots
            backgroundColor: ['#000000', '#000000', '#000000'], // Colors for the dots
            borderColor: '#000000',
            pointStyle: 'circle', // Ensure dots appear as circles
            type: 'line', // Use a line chart type for simpler integration
            borderWidth: 0, // No lines between dots
            pointRadius: 9, // Size of the lollipop dots
            fill: false // No fill for the line
        }
    ]
};

// Configuration for the lollipop chart
const config = {
    type: 'bar', // Base type as bar
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false // Show the legend with the proper label
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    display: false // Hides the gridlines
                }
            },
            y: {
                beginAtZero: true
            }
        }
    }
};

// Render the lollipop chart
const myChart = new Chart(
    document.getElementById('myChart'),
    config
);

// Function to increment the value of a category
function incrementCategory(index) {
    // Increment the value for both sticks and dots
    data.datasets[0].data[index] += 1; // Increment stick height
    data.datasets[1].data[index] += 1; // Increment dot position
    myChart.update(); // Update the chart to reflect changes
}
