const dateArray = [];
const weightArray = [];
const bodyFatArray = [];
const muscleMassArray = [];

function addData() {
    const date = document.getElementById('date').value;
    const weight = document.getElementById('weight').value;
    const bodyFat = document.getElementById('bodyFat').value;
    const muscleMass = document.getElementById('muscleMass').value;

    if(date && weight && bodyFat && muscleMass) {
        dateArray.push(date);
        weightArray.push(weight);
        bodyFatArray.push(bodyFat);
        muscleMassArray.push(muscleMass);

        myChart.update();
    } else {
        alert('모든 필드를 입력해주세요.');
    }
}

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: dateArray,
        datasets: [
            {
                label: '몸무게 (kg)',
                data: weightArray,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1,
                fill: false
            },
            {
                label: '체지방량 (%)',
                data: bodyFatArray,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 1,
                fill: false
            },
            {
                label: '근육량 (kg)',
                data: muscleMassArray,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                fill: false
            }
        ]
    },
    options: {
        scales: {
            x: {
                beginAtZero: true
            },
            y: {
                beginAtZero: true
            }
        }
    }
});
