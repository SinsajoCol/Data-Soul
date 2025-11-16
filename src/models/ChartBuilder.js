
const PDF_USER_COLOR = '#16348C';
const PDF_LLM_COLOR = '#6586E7';

const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Construye configuraciones de Chart.js (ChartConfig)
 * para ser usadas por el GraficoExporter.
 */
export class ChartBuilder {

    /**
     * @param {Array<string>} labels - (ej. ["Apertura", "Neuroticismo"])
     * @param {Array<number>} usuarioData - (ej. [2.5, 4.1])
     * @param {Array<number>} llmData - (ej. [3.1, 2.0]) (Opcional)
     * @param {string} llmNombre - (ej. "Gemma-3") (Opcional)
     */
    buildRadar(labels, usuarioData, llmData = null, llmNombre = null) {
        const datasets = [
            {
                label: 'Usuario',
                data: usuarioData,
                backgroundColor: hexToRgba(PDF_USER_COLOR, 0.2),
                borderColor: PDF_USER_COLOR,
                borderWidth: 2
            }
        ];

        if (llmData && llmNombre) {
            datasets.push({
                label: llmNombre,
                data: llmData,
                backgroundColor: hexToRgba(PDF_LLM_COLOR, 0.2),
                borderColor: PDF_LLM_COLOR,
                borderWidth: 2
            });
        }

        return {
            type: 'radar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: false, // ¡Importante para exportar!
                animation: false,  // ¡Importante para exportar!
                scales: {
                    r: {
                        beginAtZero: true,
                        min: 0,
                        max: 5 // O el máximo que uses (ej. 7)
                    }
                }
            }
        };
    }

    /**
     * @param {Array<string>} labels - (ej. ["Maquiavelismo", "Narcisismo"])
     * @param {Array<number>} usuarioData - (ej. [2.5, 4.1])
     * @param {Array<number>} llmData - (ej. [3.1, 2.0]) (Opcional)
     * @param {string} llmNombre - (ej. "Gemma-3") (Opcional)
     * @param {string} title - Título para la gráfica
     */
    buildBar(labels, usuarioData, llmData = null, llmNombre = null, title = '') {
        const datasets = [
            {
                label: 'Usuario',
                data: usuarioData,
                backgroundColor: hexToRgba(PDF_USER_COLOR, 0.8)
            }
        ];

        if (llmData && llmNombre) {
            datasets.push({
                label: llmNombre,
                data: llmData,
                backgroundColor: hexToRgba(PDF_LLM_COLOR, 0.8)
            });
        }

        return {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: false,
                animation: false,
                plugins: {
                    title: {
                        display: true,
                        text: title
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5 // O el máximo que uses
                    }
                }
            }
        };
    }
}