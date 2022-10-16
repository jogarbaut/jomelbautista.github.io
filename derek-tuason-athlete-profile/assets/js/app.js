window.addEventListener('load', displayChart(0));

window.onscroll = function() {
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0 ) {
        document.getElementById('navbar').classList.add('scrolled');
    } else {
        document.getElementById('navbar').classList.remove('scrolled');
    }
}

// Animate On Scroll
AOS.init({
    duration: 750
});

// Stats Chart 
let statsChart = document.getElementById('stats-chart')

function displayChart(catIndex) {
    const url = 'https://docs.google.com/spreadsheets/d/'
    const ssid = '1cWHZTlFdr5W7EEcML5ZPwyPj2504u8S3ZbW62GRGV7Y'
    const query = `/gviz/tq?`
    const endPoint = `${url}${ssid}${query}`

    fetch(endPoint)
    .then(res => res.text())
    .then(data => {
        const temp = data.substring(47).slice(0, -2);
        const json = JSON.parse(temp);

        const cols = json.table.cols;
        const rows = json.table.rows;

        const dates = [];
        for (let i = 1; i < cols.length; i++) {
            dates.push(cols[i]['label'])
        }

        const dateData = [];
        for (let i = catIndex; i == catIndex; i++) {
            for (let j = 1; j < cols.length; j++) {
                dateData.push(rows[i].c[j].f)
            }
        }

        const chartData = {
            labels: dates,
            datasets: [{
                label: rows[catIndex].c[0].v,
                backgroundColor: 'rgb(196, 179, 94)',
                borderColor: 'rgb(196, 179, 94)',
                data: dateData
            }]
        }

        const config = {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        text: 'Date',
                        ticks: {
                            callback: function(val, index) {
                                return index % 3 === 0? this.getLabelForValue(val) : '';
                            },
                            minRotation: 90,
                            maxRotation: 90,
                        }
                    }
                }
            }
        }
        
        renderChart(config)
    });
}

function renderChart(config) {
    statsChart = new Chart(document.getElementById('stats-chart'), config)
}

function reRenderChart(catIndex) {
    statsChart.destroy();
    displayChart(catIndex);
}