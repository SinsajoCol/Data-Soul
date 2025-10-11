const rasgos = [
  "Apertura",
  "Responsabilidad",
  "Extraversión",
  "Amabilidad",
  "Neuroticismo",
  "Machiavellismo",
  "Narcisismo",
  "Psicopatía"
];

const usuario = [75, 60, 55, 80, 40, 30, 45, 20];

const llms = {
  "ChatGPT": [65, 70, 50, 75, 35, 40, 50, 25],
  "Mistral": [70, 65, 55, 70, 40, 35, 45, 30],
  "LLama": [60, 75, 45, 80, 30, 45, 55, 20],
  "DeepSeek": [12, 24, 35, 100, 50, 20, 55, 55]
};

// Radar Chart
const radarCtx = document.getElementById('radarChart').getContext('2d');

let radarChart = new Chart(radarCtx, {
  type: 'radar',
  data: {
    labels: rasgos,
    datasets: [{
      label: 'Usuario',
      data: usuario,
      backgroundColor: 'rgba(75, 123, 236, 0.2)',
      borderColor: 'rgba(75, 123, 236, 1)',
      borderWidth: 2
    }]
  },
  options: { responsive: true }
});

// Bar Chart
const barCtx = document.getElementById('barChart').getContext('2d');
let barChart = new Chart(barCtx, {
  type: 'bar',
  data: {
    labels: rasgos,
    datasets: [{
      label: 'Usuario',
      data: usuario,
      backgroundColor: 'rgba(75, 123, 236, 0.7)'
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { position: 'top' }, tooltip: { enabled: true } },
    scales: { y: { beginAtZero: true, max: 100 } }
  }
});

// Función para actualizar gráficos según LLMs seleccionados
function updateCharts() {
  const checkedLLMs = Array.from(document.querySelectorAll('.llm-card input:checked'))
    .map(input => input.value);

  // Datasets para Radar Chart
  radarChart.data.datasets = [{
    label: 'Usuario',
    data: usuario,
    backgroundColor: 'rgba(75, 123, 236, 0.2)',
    borderColor: 'rgba(75, 123, 236, 1)',
    borderWidth: 2
  }];

  // Datasets para Bar Chart
  barChart.data.datasets = [{
    label: 'Usuario',
    data: usuario,
    backgroundColor: 'rgba(75, 123, 236, 0.7)'
  }];

  checkedLLMs.forEach((llmName, index) => {
    const colorRadar = `rgba(${255 - index*50}, ${99 + index*30}, ${132 + index*20}, 0.2)`;
    const borderRadar = `rgba(${255 - index*50}, ${99 + index*30}, ${132 + index*20}, 1)`;
    const colorBar = `rgba(${255 - index*50}, ${99 + index*30}, ${132 + index*20}, 0.7)`;

    // Radar
    radarChart.data.datasets.push({
      label: llmName,
      data: llms[llmName],
      backgroundColor: colorRadar,
      borderColor: borderRadar,
      borderWidth: 2
    });

    // Bar
    barChart.data.datasets.push({
      label: llmName,
      data: llms[llmName],
      backgroundColor: colorBar
    });
  });

  radarChart.update();
  barChart.update();
}

// Evento para todos los checkboxes de LLMs
document.querySelectorAll('.llm-card input').forEach(input => {
  input.addEventListener('change', updateCharts);
});

// Inicializar gráficos con LLMs seleccionados por defecto
updateCharts();
