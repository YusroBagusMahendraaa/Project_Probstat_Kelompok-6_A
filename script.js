let data = [];

function addData() {
    const tasks = parseFloat(document.getElementById('tasks').value);
    const studyTime = parseFloat(document.getElementById('studyTime').value);

    if (!isNaN(tasks) && !isNaN(studyTime)) {
        data.push({ x: tasks, y: studyTime });
        displayData();
        document.getElementById('tasks').value = '';
        document.getElementById('studyTime').value = '';
    }
}

function displayData() {
    const dataPoints = document.getElementById('dataPoints');
    dataPoints.innerHTML = '<h3>Data Points:</h3>';
    data.forEach((point, index) => {
        dataPoints.innerHTML += `(${point.x}, ${point.y})<br>`;
    });
}

function calculateRegression() {
    if (data.length < 2) {
        window.alert('Tambahkan minimal dua data untuk menghitung regresi.');
        return;
    }

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    const n = data.length;

    data.forEach(point => {
        sumX += point.x;
        sumY += point.y;
        sumXY += point.x * point.y;
        sumX2 += point.x * point.x;
    });

    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    displayRegression(m, b);
}

function displayRegression(m, b) {
    const output = document.getElementById('output');
    output.innerHTML = `<h3>Persamaan Regresi: y = ${m.toFixed(2)}x + ${b.toFixed(2)}</h3>`;
    drawChart(m, b);
}

function drawChart(m, b) {
    const svg = document.getElementById('chart');
    svg.innerHTML = '';

    const padding = 30; // Ruang tepi SVG
    const width = svg.clientWidth - padding * 2; // Lebar area gambar
    const height = svg.clientHeight - padding * 2; // Tinggi area gambar

    const xMax = Math.max(...data.map(point => point.x)) + 1; // Nilai maksimum dari data titik di sumbu X
    const yMax = Math.max(...data.map(point => point.y)) + 1; // Nilai maksimum dari data titik di sumbu Y

    // Titik data
    data.forEach(point => {
        const cx = padding + (point.x / xMax) * width; // Menghitung posisi horizontal
        const cy = svg.clientHeight - padding - (point.y / yMax) * height; // Menghitung posisi vertikal
        svg.innerHTML += `<circle cx="${cx}" cy="${cy}" r="5" fill="white" />`; // Menggambar setiap titik data
    });

    // Koordinat garis linear y = mx + b
    const x1 = 0; // Titik awal di sumbu X (sumbu y)
    const y1 = b; // Menghitung y berdasarkan x awal
    const x2 = xMax; // Titik akhir adalah x maksimum dari data
    const y2 = m * x2 + b; // Menghitung y berdasarkan x akhir

    const x1SVG = padding + (x1 / xMax) * width; // Posisi horizontal untuk titik awal (sumbu y)
    const y1SVG = svg.clientHeight - padding - (y1 / yMax) * height; // Posisi vertikal untuk titik awal (sumbu y)
    const x2SVG = padding + (x2 / xMax) * width; // Posisi horizontal untuk titik akhir
    const y2SVG = svg.clientHeight - padding - (y2 / yMax) * height; // Posisi vertikal untuk titik akhir

    svg.innerHTML += `<line x1="${x1SVG}" y1="${y1SVG}" x2="${x2SVG}" y2="${y2SVG}" stroke="red" stroke-width="2" />`; // Menggambar garis linear

    // Sumbu x dan y
    svg.innerHTML += `<line x1="${padding}" y1="${svg.clientHeight - padding}" x2="${svg.clientWidth - padding}" y2="${svg.clientHeight - padding}" stroke="white" stroke-width="2" />`; // Sumbu X
    svg.innerHTML += `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${svg.clientHeight - padding}" stroke="white" stroke-width="2" />`; // Sumbu Y

    // Interval label
    const xInterval = Math.ceil(xMax / 30) * 2; // Interval sumbu X
    const yInterval = Math.ceil(yMax / 30) * 2; // Interval sumbu Y

    // Label sumbu X
    for (let i = 0; i <= xMax; i += xInterval) {
        const x = padding + (i / xMax) * width; // Posisi horizontal label sumbu X
        const y = svg.clientHeight - padding + 20; // Posisi vertikal untuk label sumbu X, sedikit di bawah sumbu X
        svg.innerHTML += `<text x="${x}" y="${y}" fill="white">${i}</text>`; // Menggambar label sumbu X
    }

    // Label sumbu Y
    for (let i = 0; i <= yMax; i += yInterval) {
        const x = padding - 25; // Posisi horizontal untuk setiap label sumbu Y, sedikit ke kiri dari sumbu Y
        const y = svg.clientHeight - padding - (i / yMax) * height + 5; // Menghitung posisi vertikal untuk setiap label sumbu Y, sedikit di atas sumbu Y
        svg.innerHTML += `<text x="${x}" y="${y}" fill="white">${i}</text>`; // Menggambar label sumbu Y
    }
}
