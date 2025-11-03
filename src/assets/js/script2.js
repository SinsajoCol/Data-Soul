const rasgos = ["Apertura","Responsabilidad","Extraversión","Amabilidad","Neuroticismo","Machiavellismo","Narcisismo","Psicopatía"];

const rasgosData = {
    "Apertura": {
        descripcion: "La apertura a la experiencia (Openness) es el grado en que una persona es imaginativa, curiosa, creativa y abierta a nuevas ideas, experiencias y perspectivas no convencionales.",
        usuario: 75,
        llm: 65
    },
    "Responsabilidad": {
        descripcion: "La responsabilidad (Conscientiousness) se refiere a la autodisciplina, la planificación, la fiabilidad y la orientación a objetivos. Las personas responsables son organizadas y diligentes.",
        usuario: 60,
        llm: 70
    },
    // ... Añadir datos para todos los demás rasgos aquí ...
};

const usuario = [75, 60, 55, 80, 40, 30, 45, 20];

const llms = {
  "ChatGPT": [65, 70, 50, 75, 35, 40, 50, 25],
  "Mistral": [70, 65, 55, 70, 40, 35, 45, 30],
  "LLama": [60, 75, 45, 80, 30, 45, 55, 20],
  "DeepSeek": [12, 24, 35, 100, 50, 20, 55, 55],
  "Gemini": [68, 72, 52, 78, 38, 42, 48, 28]
};

// Radar Chart
const radarCtx = document.getElementById('radarChart').getContext('2d');
const barCtx = document.getElementById('barChart').getContext('2d');
const modal = document.getElementById("rasgoModal");
const closeBtn = document.querySelector(".close-btn");
const cards = document.querySelectorAll(".card[data-rasgo]");
// Función auxiliar para convertir Hex a RGBA
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const USER_COLOR = '#16348C'; // Primer color de la lista para el Usuario
// Paleta con 5 colores para los 5 LLMs: ChatGPT, Mistral, LLama, DeepSeek, Gemini
const LLM_PALETTE = ['#6586E7', '#884FFD', '#B18BFD', '#FFA64D', '#FF8000']; 

// Definir colores consistentes usando la paleta Hex
const llmColors = {
    "ChatGPT": { 
        hex: LLM_PALETTE[0], 
        fill: hexToRgba(LLM_PALETTE[0], 0.2), 
        border: hexToRgba(LLM_PALETTE[0], 1), 
        bar: hexToRgba(LLM_PALETTE[0], 0.8) 
    }, 
    "Mistral": { 
        hex: LLM_PALETTE[1], 
        fill: hexToRgba(LLM_PALETTE[1], 0.2), 
        border: hexToRgba(LLM_PALETTE[1], 1), 
        bar: hexToRgba(LLM_PALETTE[1], 0.8) 
    }, 
    "LLama": { 
        hex: LLM_PALETTE[2], 
        fill: hexToRgba(LLM_PALETTE[2], 0.2), 
        border: hexToRgba(LLM_PALETTE[2], 1), 
        bar: hexToRgba(LLM_PALETTE[2], 0.8) 
    }, 
    "DeepSeek": { 
        hex: LLM_PALETTE[3], 
        fill: hexToRgba(LLM_PALETTE[3], 0.2), 
        border: hexToRgba(LLM_PALETTE[3], 1), 
        bar: hexToRgba(LLM_PALETTE[3], 0.8) 
    },
    "Gemini": { 
        hex: LLM_PALETTE[4], 
        fill: hexToRgba(LLM_PALETTE[4], 0.2), 
        border: hexToRgba(LLM_PALETTE[4], 1), 
        bar: hexToRgba(LLM_PALETTE[4], 0.8) 
    }
};

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

// Función para actualizar gráficos según LLMs seleccionados
function updateCharts() {
 const checkedLLMs = Array.from(document.querySelectorAll('.llm-card input:checked'))
 .map(input => input.value);
    
    // **¡IMPORTANTE!:** ELIMINAR ESTAS LÍNEAS DE CÓDIGO INCORRECTAS:
    // const colors = llmColors[llmName]; // <-- 'llmName' no está definido aquí
    // window.radarChartInstance = new Chart(radarCtx, { ... });
    // window.barChartInstance = new Chart(barCtx, { ... });


  // Datasets para Radar Chart: Reiniciar a solo el Usuario (con los colores correctos)
  window.radarChartInstance.data.datasets = [{ 
 label: 'Usuario',
 data: usuario,
 backgroundColor: hexToRgba(USER_COLOR, 0.2), 
    borderColor: hexToRgba(USER_COLOR, 1),
    borderWidth: 2
  }];

  // Datasets para Bar Chart: Reiniciar a solo el Usuario (con los colores correctos)
  window.barChartInstance.data.datasets = [{
    label: 'Usuario',
 data: usuario,
 backgroundColor: hexToRgba(USER_COLOR, 0.8)
 }];

 // Añadir los datasets de los LLMs seleccionados usando la paleta llmColors
 checkedLLMs.forEach((llmName) => { // <-- Se eliminó el 'index' ya que usamos el nombre
  const colors = llmColors[llmName]; // <-- Ahora sí accedemos al color por nombre
  // Radar
  window.radarChartInstance.data.datasets.push({
 label: llmName,
 data: llms[llmName],
 // USAR PALETA LLM
 backgroundColor: colors.fill,
 borderColor: colors.border,
 borderWidth: 2
 });

 // Bar
 window.barChartInstance.data.datasets.push({
 label: llmName,
 data: llms[llmName],
 // USAR PALETA LLM
 backgroundColor: colors.bar
 });
 });

 window.radarChartInstance.update();
 window.barChartInstance.update();
}

function openModal(rasgo) {
  const data = rasgosData[rasgo];
  if (!data) return;
  document.getElementById("modalRasgoTitulo").textContent = rasgo;
  document.getElementById("modalUsuarioScore").textContent = data.usuario ?? '';
  document.getElementById("modalLLMScore").textContent = data.llm ?? '';
  document.getElementById("modalDescripcion").textContent = data.descripcion ?? '';
  // mostrar modal añadiendo clase
  modal.classList.add('show');
}

// Cerrar modal
function closeModal() {
  modal.classList.remove('show');
}

// Obtener el botón para solo el usuario
const downloadUserPDFBtn = document.getElementById('downloadUserPDF');

downloadUserPDFBtn.addEventListener('click', async () => {
    // Verificar si las instancias de Chart.js están definidas (asumiendo que fueron creadas en script2.js)
    if (!window.radarChartInstance || !window.barChartInstance) {
        alert("Error: Las instancias de gráficos no están cargadas. Asegúrate de que Chart.js haya inicializado correctamente.");
        return;
    }

    const pdf = new jspdf.jsPDF();
    let y_position = 20;

    // GUARDAR DATOS ORIGINALES
    const originalRadarDatasets = JSON.parse(JSON.stringify(window.radarChartInstance.data.datasets));
    const originalBarDatasets = JSON.parse(JSON.stringify(window.barChartInstance.data.datasets));

    // --- 1. PREPARAR GRÁFICAS (Solo Usuario) ---

    // La data del usuario es el PRIMER dataset en ambos gráficos según la convención típica.
    // Mantenemos solo el primer dataset (Usuario) y removemos los demás (LLMs).

    try {
        // RADAR CHART: Mantener solo el primer dataset (Usuario)
        window.radarChartInstance.data.datasets = [originalRadarDatasets[0]];
        window.radarChartInstance.update();

        // BAR CHART: Mantener solo el primer dataset (Usuario)
        window.barChartInstance.data.datasets = [originalBarDatasets[0]];
        window.barChartInstance.update();
        
        // Esperar un breve momento para que Chart.js renderice el DOM
        await new Promise(resolve => setTimeout(resolve, 200)); 

    } catch (error) {
        console.error("Error al actualizar los datos de Chart.js:", error);
        // Asegurarse de restaurar los datos incluso si hay un error
        window.radarChartInstance.data.datasets = originalRadarDatasets;
        window.barChartInstance.data.datasets = originalBarDatasets;
        window.radarChartInstance.update();
        window.barChartInstance.update();
        return; 
    }

    // --- 2. GENERAR CONTENIDO DEL PDF ---

    pdf.setFontSize(24);
    pdf.text("Reporte Psicométrico Personalizado", 105, y_position, { align: 'center' });
    y_position += 20;

    // Obtener los elementos canvas
    const radarCanvas = document.getElementById('radarChart');
    const barCanvas = document.getElementById('barChart');

    // Título de la sección de gráficas
    pdf.setFontSize(16);
    pdf.text("Visualización de Perfil del Usuario", 105, y_position, { align: 'center' });
    y_position += 10;

    // A. Gráfico Radar (Perfil del Usuario)
    if (radarCanvas) {
        pdf.setFontSize(12);
        pdf.text("Perfil de Rasgos (Radar)", 105, y_position, { align: 'center' });
        y_position += 5;

        const radarImgData = radarCanvas.toDataURL('image/png');
        const radarWidth = 100;
        const radarHeight = radarCanvas.height * radarWidth / radarCanvas.width;

        pdf.addImage(radarImgData, 'PNG', 55, y_position, radarWidth, radarHeight); 
        y_position += radarHeight + 15; 
    }

    // B. Gráfico de Barras (Valores Absolutos)
    if (barCanvas) {
        if (y_position > 260) {
            pdf.addPage();
            y_position = 20;
        }

        pdf.setFontSize(12);
        pdf.text("Puntuaciones de Rasgos (Barras)", 105, y_position, { align: 'center' });
        y_position += 5;

        const barImgData = barCanvas.toDataURL('image/png');
        const barWidth = 180;
        const barHeight = barCanvas.height * barWidth / barCanvas.width;

        pdf.addImage(barImgData, 'PNG', 15, y_position, barWidth, barHeight); 
        y_position += barHeight + 15;
    }
    
    // --- 3. DATOS ESTRUCTURADOS Y DESCRIPCIONES (continúa igual) ---
    
    // ... (El código de generación de las descripciones va aquí, es el mismo que el anterior) ...
    // Añade página nueva si es necesario antes de los detalles
    if (y_position > 260) {
        pdf.addPage();
        y_position = 20;
    }

    pdf.text("Detalle de Puntuaciones y Descripciones", 105, y_position, { align: 'center' });
    y_position += 10;
    
    pdf.setFontSize(12);
    
    for (const rasgo in rasgosData) {
        if (rasgosData.hasOwnProperty(rasgo)) {
            const data = rasgosData[rasgo];
            
            if (y_position > 260) { 
                pdf.addPage();
                y_position = 20;
            }

            pdf.text(`${rasgo}: ${data.usuario} / 100`, 20, y_position);
            y_position += 5;
            
            pdf.setFontSize(10);
            const descriptionLines = pdf.splitTextToSize(data.descripcion, 170); 
            pdf.text(descriptionLines, 25, y_position);
            
            y_position += descriptionLines.length * 4.5 + 5;
            pdf.setFontSize(12);
        }
    }
    
    // --- 4. RESTAURAR GRÁFICAS ---
    window.radarChartInstance.data.datasets = originalRadarDatasets;
    window.barChartInstance.data.datasets = originalBarDatasets;
    window.radarChartInstance.update();
    window.barChartInstance.update();

    // --- 5. DESCARGAR ---
    pdf.save('Reporte_Usuario_Individual.pdf');
});

// Obtener el botón para la vista completa
const downloadFullPDFBtn = document.getElementById('downloadFullPDF');

downloadFullPDFBtn.addEventListener('click', () => {
    // Seleccionamos el contenedor principal que queremos capturar
    const input = document.querySelector('.dashboard'); 

    html2canvas(input, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF({
            orientation: 'p', // 'p' para retrato, 'l' para apaisado
            unit: 'mm',
            format: 'a4'
        });
        
        // Calcular dimensiones para que la imagen ocupe todo el ancho del PDF
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // Añadir la primera página
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Si la imagen es más larga que una página, añade páginas adicionales
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save('Reporte_Dashboard_Completo.pdf');
    });
});

// listeners para las tarjetas
cards.forEach(card => {
  card.addEventListener('click', () => {
    const rasgo = card.getAttribute('data-rasgo');
    if (rasgo) openModal(rasgo);
  });
});

// cerrar con X
if (closeBtn) {
  closeBtn.addEventListener('click', closeModal);
}

// cerrar al hacer clic fuera del contenido (backdrop)
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// cerrar con tecla Esc
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

// Evento para todos los checkboxes de LLMs
document.querySelectorAll('.llm-card input').forEach(input => {
  input.addEventListener('change', updateCharts);
});

// Inicializar gráficos con LLMs seleccionados por defecto
updateCharts();
