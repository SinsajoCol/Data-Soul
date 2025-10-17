// 
const radarCtx = document.getElementById('radarChart').getContext('2d');
const barCtx = document.getElementById('barChart').getContext('2d');

// Variables globales para las instancias de los gráficos
window.radarChartInstance = null;
window.barChartInstance = null;

function initializeCharts() {
    window.radarChartInstance = new Chart(radarCtx, { 
        // ... (configuración usando USER_COLOR) ...
    });

    window.barChartInstance = new Chart(barCtx, { 
        // ... (configuración usando USER_COLOR) ...
    });
}

function updateCharts() {
    // ... (Tu lógica de updateCharts corregida, que usa llmColors) ...
}

window.radarChartInstance = new Chart(radarCtx, { 
 type: 'radar',
 data: {
 labels: rasgos,
 datasets: [{
   label: 'Usuario',
   data: usuario,
   // USAR USER_COLOR
   backgroundColor: hexToRgba(USER_COLOR, 0.2), 
   borderColor: hexToRgba(USER_COLOR, 1),
   borderWidth: 2
  }]
 },
 options: { responsive: true }
});

window.barChartInstance = new Chart(barCtx, { 
 type: 'bar',
 data: {
 labels: rasgos,
 datasets: [{
 label: 'Usuario',
 data: usuario,
 // USAR USER_COLOR
 backgroundColor: hexToRgba(USER_COLOR, 0.8)
 }]
 },
// ... (resto de opciones)
});
