window.addEventListener('load', displayChart(0));
window.addEventListener('load', displayShotingSplitPolarData());
window.addEventListener('load', generateTableData());

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

// Gamelog Table
function generateTableData() {
    const url = 'https://docs.google.com/spreadsheets/d/'
    const ssid = '1cWHZTlFdr5W7EEcML5ZPwyPj2504u8S3ZbW62GRGV7Y'
    const query = `/gviz/tq?`
    const querySheet = 'sheet=Web-Gamelog'
    const endPoint = `${url}${ssid}${query}${querySheet}`

    fetch(endPoint)
    .then(res => res.text())
    .then(data => {
        const temp = data.substring(47).slice(0, -2);
        const json = JSON.parse(temp);

        const cols = json.table.cols;
        const rows = json.table.rows;

        const tableData = []
        for (i = 0; i < rows.length; i ++) {
            tableData.push([])
            for (j = 0; j < cols.length; j ++) {
                if (rows[i].c[j].v == null) {
                    tableData[i].push('0')
                } else {
                    tableData[i].push(rows[i].c[j].v)
                }
            }
        }

        generateTable(tableData)
    });
}

function generateTable(tableData) {
    let table = "<table>"

    let tableHeader = "<thead><tr>"
    for (i = 0; i < tableData.length; i ++) {
        tableHeader += "<th scope='col'>" + tableData[i][0]+ "</th>"
    }
    tableHeader += "</tr>" + "</thead>"

    console.log(tableData)

    let tableBody = "<tbody>"
    for (i = 1; i < tableData[0].length; i++) {
        tableBody += "<tr>"
        for (j = 0; j < tableData.length; j++) {
            tableBody += "<td>" + tableData[j][i] + "</td>"
        }
        tableBody += "</tr>"
    }
    tableBody += "</tbody>"

    table += tableHeader + tableBody + "</table>"
    document.getElementById('gamelog-table').innerHTML = table;
    makeTableScroll()
}

function makeTableScroll() {
    // Constant retrieved from server-side via JSP
    var maxRows = 8;

    var table = document.getElementById('gamelog-table');
    var wrapper = table.parentNode;
    var rowsInTable = table.rows.length;
    var height = 0;
    if (rowsInTable > maxRows) {
        for (var i = 0; i < maxRows; i++) {
            height += table.rows[i].clientHeight;
        }
        wrapper.style.height = height + "px";
    }
    console.log(height)
}

// Stats Line Chart 
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

        const oppData = [];
        for (let i = 1; i == 1; i++) {
            for (let j = 1; j < cols.length; j++) {
                oppData.push(rows[i].c[j].f)
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
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    x: {
                        display: true,
                        text: 'Date',
                        ticks: {
                            font: function(context) {
                                var width = context.chart.width;
                                var size = Math.round(width/32);
                                if ( width >= 400 ) {
                                    return {
                                        weight: 'normal',
                                        size: 10
                                    }
                                } else {
                                    return {
                                        weight: 'normal',
                                        size: size
                                    };
                                }
                            },
                            callback: function(val, index) {
                                return index % 2 === 0? this.getLabelForValue(val) : '';
                            },
                            minRotation: 75,
                            maxRotation: 75,
                        }
                    },
                    y: {
                        display: true,
                        text: 'Stat Game Value',
                        ticks: {
                            font: function(context) {
                                var width = context.chart.width;
                                var size = Math.round(width/32);
                                if ( width >= 400 ) {
                                    return {
                                        weight: 'normal',
                                        size: 10
                                    }
                                } else {
                                    return {
                                        weight: 'normal',
                                        size: size
                                    }
                                }
                            },
                        }
                    }
                }
            }
        }
        
        renderChart(config)
    })
}

function renderChart(config) {
    statsChart = new Chart(document.getElementById('stats-chart'), config)
}

function reRenderChart(catIndex) {
    statsChart.destroy()
    displayChart(catIndex)
}

// Shooting Splits Polar Chart
function displayShotingSplitPolarData() {
    const data = {
        labels: [
            ['50.23%','2-Point Shooting'],
            ['59.10%','Effective FG', 'Shooting'],
            ['58.90%','True FG', 'Shooting'],
            ['41.43%','3-Point Shooting']
        ],
        datasets: [{
            data: [50.23, 59.10, 58.90, 41.43],
            backgroundColor: [
            'rgba(196, 179, 94, .5)',
            'rgba(196, 179, 94, .5)',
            'rgba(196, 179, 94, .5)',
            'rgba(196, 179, 94, .5)'
            ],
            borderColor: [
                'rgba(196, 179, 94, 1)',
                'rgba(196, 179, 94, 1)',
                'rgba(196, 179, 94, 1)',
                'rgba(196, 179, 94, 1)'
            ]
        }]
    }
    
    const config = {
        type: 'polarArea',
        data: data,
        options: {
            responsive: true,
            hoverBackgroundColor: 'red',
            hoverBorderColor: 'red',
            scales: {
                r: {
                    pointLabels: {
                        display: true,
                        centerPointLabels: true,
                        arc: true,
                        font: {
                            weight: 'bold',
                            size: function(context) {
                                var width = context.chart.width;
                                var size = Math.round(width/45);
                                if ( width >= 400 ) {
                                    return 16
                                } else {
                                    return size
                                }
                            }
                        }
                    },
                    ticks: {
                        callback: function(value, index, ticks) {
                            return value + '%'
                        },
                        z: 1,
                        font: {
                            size: function(context) {
                                var width = context.chart.width;
                                var size = Math.round(width/45);
                                if ( width >= 400 ) {
                                    return 12
                                } else {
                                    return size
                                }
                            }
                        }
                    },
                    min: 0,
                    max: 90
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            label = [("Derek has a " + context.label[1]), (" percentage of " + context.label[0])]
                            return label
                        }
                    }
                }
            }
        }
    };
    
    // renderPolarChart(config);
    const myChart = new Chart(
        document.getElementById('shooting-split-chart'),
        config
    );
}

// function renderPolarChart(config) {
//     statsChart = new Chart(document.getElementById('shooting-split-chart'), config)
// }