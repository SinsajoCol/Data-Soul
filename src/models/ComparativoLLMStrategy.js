const { jsPDF } = window.jspdf;
/**
 * Estrategia para generar el reporte "Comparativo".
 * (Según el diagrama: "PDF con 2 gráficas fijas: usuario vs modelo")
 *
 * Esta estrategia decide si es un reporte GRUPAL o INDIVIDUAL
 * basado en el contexto.
 */
const PDF_USER_COLOR = '#16348C';
// Paleta de colores para los LLMs en el PDF
const LLM_PALETTE = ['#6586E7', '#884FFD', '#B18BFD', '#FFA64D', '#FF8000', '#FFC300', '#E76565'];

// Función helper para colores (copiada de ChartBuilder)
const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
/**
 * Estrategia para generar el reporte "Comparativo".
 *
 * Esta estrategia decide si es un reporte GRUPAL o INDIVIDUAL
 * basado en el contexto.
 */
export class ComparativoLLMStrategy {
    
    constructor({ chartBuilder, graficoExporter }) {
        this.chartBuilder = chartBuilder;
        this.graficoExporter = graficoExporter;
    }

    /**
     * Punto de entrada: Decide qué tipo de PDF generar.
     */
    async generarPDF(context) {
        if (context.esIndividual) {
            // Caso 1: Es un individuo
            return this.generarPDFIndividual(context);
        } else if (context.esGrupo) {
            // Caso 2: Es un grupo
            return this.generarPDFGrupo(context);
        } else {
            throw new Error("Contexto de reporte no válido. No es ni individual ni grupal.");
        }
    }

    /**
     * Genera el PDF para un INDIVIDUO vs. TODOS los LLMs.
     */
    async generarPDFIndividual(context) {
        const { datosUsuario, datosModelos, metadata } = context;
        const doc = new jsPDF();

        // --- 1. Preparar Datos (Plantillas) ---
        const plantilla = metadata.rasgosOrdenados;
        const bigFiveLabels = plantilla.slice(0, 5);
        const darkLabels = plantilla.slice(5, 8);

        // --- 2. Preparar Datos de Usuario ---
        const userData = plantilla.map(nombreRasgo => {
            const rasgo = datosUsuario.rasgos.listaRasgos.find(r => r.nombre === nombreRasgo);
            return rasgo ? parseFloat(rasgo.valor.toFixed(2)) : 0;
        });

        // --- 3. Preparar Datos de TODOS los LLMs ---
        const llmDatasets = datosModelos.map((modelo, index) => {
            // Extraer los datos (scores)
            const llmData = plantilla.map(nombreRasgo => {
                const stat = modelo.estadisticas.find(s => s.nombre === nombreRasgo);
                const media = (stat && typeof stat.media === 'number') ? stat.media : 0;
                return parseFloat(media.toFixed(2));
            });
            
            // Asignar color de la paleta
            const color = LLM_PALETTE[index % LLM_PALETTE.length];
            
            return {
                label: modelo.nombre,
                data: llmData,
                // Colores para Radar
                backgroundColor: hexToRgba(color, 0.2),
                borderColor: color,
                borderWidth: 2,
                // Colores para Barras
                backgroundColorBar: hexToRgba(color, 0.8)
            };
        });

        // --- 4. Construir Configs (Usuario vs. TODOS los LLMs) ---
        // (Bypass ChartBuilder, ya que no soporta múltiples datasets)

        // Configuración del Radar
        const radarConfig = {
            type: 'radar',
            data: {
                labels: plantilla,
                datasets: [
                    {
                        label: 'Usuario',
                        data: userData,
                        backgroundColor: hexToRgba(PDF_USER_COLOR, 0.2),
                        borderColor: PDF_USER_COLOR,
                        borderWidth: 2
                    },
                    // Añadir todos los LLMs
                    ...llmDatasets.map(ds => ({
                        label: ds.label,
                        data: ds.data,
                        backgroundColor: ds.backgroundColor,
                        borderColor: ds.borderColor,
                        borderWidth: ds.borderWidth
                    }))
                ]
            },
            options: {
                responsive: false, animation: false,
                scales: { r: { beginAtZero: true, min: 0, max: 5 } }
            }
        };

        // Configuración de Bar Big Five
        const barBigFiveConfig = {
            type: 'bar',
            data: {
                labels: bigFiveLabels,
                datasets: [
                    {
                        label: 'Usuario',
                        data: userData.slice(0, 5), // Solo 5 rasgos
                        backgroundColor: hexToRgba(PDF_USER_COLOR, 0.8)
                    },
                    ...llmDatasets.map(ds => ({
                        label: ds.label,
                        data: ds.data.slice(0, 5), // Solo 5 rasgos
                        backgroundColor: ds.backgroundColorBar
                    }))
                ]
            },
            options: {
                responsive: false, animation: false,
                plugins: { title: { display: true, text: "Big Five (Usuario vs. LLMs)" } },
                scales: { y: { beginAtZero: true, max: 5 } }
            }
        };

        // Configuración de Bar Dark Triad
        const barDarkConfig = {
            type: 'bar',
            data: {
                labels: darkLabels,
                datasets: [
                    {
                        label: 'Usuario',
                        data: userData.slice(5, 8), // Solo 3 rasgos
                        backgroundColor: hexToRgba(PDF_USER_COLOR, 0.8)
                    },
                    ...llmDatasets.map(ds => ({
                        label: ds.label,
                        data: ds.data.slice(5, 8), // Solo 3 rasgos
                        backgroundColor: ds.backgroundColorBar
                    }))
                ]
            },
            options: {
                responsive: false, animation: false,
                plugins: { title: { display: true, text: "Dark Triad (Usuario vs. LLMs)" } },
                scales: { y: { beginAtZero: true, max: 5 } }
            }
        };

        // --- 5. Generar Imágenes ---
        const imgRadar = await this.graficoExporter.generarImagen(radarConfig, 1000, 600); // Radar más alto
        const imgBigFive = await this.graficoExporter.generarImagen(barBigFiveConfig, 1000, 500);
        const imgDark = await this.graficoExporter.generarImagen(barDarkConfig, 1000, 500);

        
        // --- 6. Maquetar PDF ---
        doc.setFontSize(18);
        doc.text("Reporte Comparativo (Vista Completa)", 14, 22);
        doc.setFontSize(11);
        doc.text(`Usuario: ${metadata.usuarioId}`, 14, 30);
        doc.text(`Comparado contra: Todos los Modelos LLM`, 14, 36);

        doc.addImage(imgRadar, 'PNG', 14, 45, 180, 108); // Radar más alto
        
        doc.addPage();
        doc.setFontSize(16);
        doc.text("Desglose de Rasgos Comparativo", 14, 22);
        doc.addImage(imgBigFive, 'PNG', 14, 30, 180, 90);
        doc.addImage(imgDark, 'PNG', 14, 130, 180, 90);
        
        // (Aquí también iría la tabla de distancias, si la quieres mantener)

        return doc.output('blob');
    }

    /**
     * Genera el PDF para un GRUPO vs. TODOS los LLMs (en gráficas)
     * Y luego las tablas de percentiles.
     */
    async generarPDFGrupo(context) {
        const { datosGrupo, datosModelos, metadata, procesador } = context;
        const doc = new jsPDF();
        
        const plantilla = metadata.rasgosOrdenados;
        const bigFiveLabels = plantilla.slice(0, 5);
        const darkLabels = plantilla.slice(5, 8);

        doc.setFontSize(18);
        doc.text(`Reporte Comparativo de Grupo: ${datosGrupo.nombreGrupo}`, 14, 22);
        doc.setFontSize(11);
        doc.text(`Comparado contra: Todos los Modelos LLM`, 14, 30);

        // --- 1. Obtener los promedios del grupo ---
        const statsGrupales = datosGrupo.obtenerEstadisticasGrupales();
        const groupAvgData = plantilla.map(nombreRasgo => {
            const stat = statsGrupales.find(s => s.nombre === nombreRasgo);
            const media = (stat && typeof stat.media === 'number') ? stat.media : 0;
            return parseFloat(media.toFixed(2));
        });

        // --- 2. Preparar Datos de TODOS los LLMs (igual que en individual) ---
        const llmDatasets = datosModelos.map((modelo, index) => {
            const llmData = plantilla.map(nombreRasgo => {
                const stat = modelo.estadisticas.find(s => s.nombre === nombreRasgo);
                const media = (stat && typeof stat.media === 'number') ? stat.media : 0;
                return parseFloat(media.toFixed(2));
            });
            const color = LLM_PALETTE[index % LLM_PALETTE.length];
            return {
                label: modelo.nombre,
                data: llmData,
                backgroundColor: hexToRgba(color, 0.2),
                borderColor: color,
                borderWidth: 2,
                backgroundColorBar: hexToRgba(color, 0.8)
            };
        });

        // --- 3. Construir Configs (Grupo vs. TODOS los LLMs) ---
        
        // Configuración del Radar
        const radarConfig = {
            type: 'radar',
            data: {
                labels: plantilla,
                datasets: [
                    {
                        label: 'Promedio Grupo', // Etiqueta cambiada
                        data: groupAvgData,
                        backgroundColor: hexToRgba(PDF_USER_COLOR, 0.2),
                        borderColor: PDF_USER_COLOR,
                        borderWidth: 2
                    },
                    ...llmDatasets.map(ds => ({
                        label: ds.label,
                        data: ds.data,
                        backgroundColor: ds.backgroundColor,
                        borderColor: ds.borderColor,
                        borderWidth: ds.borderWidth
                    }))
                ]
            },
            options: {
                responsive: false, animation: false,
                scales: { r: { beginAtZero: true, min: 0, max: 5 } }
            }
        };

        // Configuración de Bar Big Five
        const barBigFiveConfig = {
            type: 'bar',
            data: {
                labels: bigFiveLabels,
                datasets: [
                    {
                        label: 'Promedio Grupo', // Etiqueta cambiada
                        data: groupAvgData.slice(0, 5),
                        backgroundColor: hexToRgba(PDF_USER_COLOR, 0.8)
                    },
                    ...llmDatasets.map(ds => ({
                        label: ds.label,
                        data: ds.data.slice(0, 5),
                        backgroundColor: ds.backgroundColorBar
                    }))
                ]
            },
            options: {
                responsive: false, animation: false,
                plugins: { title: { display: true, text: "Big Five (Grupo vs. LLMs)" } },
                scales: { y: { beginAtZero: true, max: 5 } }
            }
        };

        // Configuración de Bar Dark Triad
        const barDarkConfig = {
            type: 'bar',
            data: {
                labels: darkLabels,
                datasets: [
                    {
                        label: 'Promedio Grupo', // Etiqueta cambiada
                        data: groupAvgData.slice(5, 8),
                        backgroundColor: hexToRgba(PDF_USER_COLOR, 0.8)
                    },
                    ...llmDatasets.map(ds => ({
                        label: ds.label,
                        data: ds.data.slice(5, 8),
                        backgroundColor: ds.backgroundColorBar
                    }))
                ]
            },
            options: {
                responsive: false, animation: false,
                plugins: { title: { display: true, text: "Dark Triad (Grupo vs. LLMs)" } },
                scales: { y: { beginAtZero: true, max: 5 } }
            }
        };

        // --- 4. Generar Imágenes ---
        const imgRadar = await this.graficoExporter.generarImagen(radarConfig, 1000, 600);
        const imgBigFive = await this.graficoExporter.generarImagen(barBigFiveConfig, 1000, 500);
        const imgDark = await this.graficoExporter.generarImagen(barDarkConfig, 1000, 500);

        // --- 5. Maquetar Gráficas en PDF ---
        doc.addImage(imgRadar, 'PNG', 14, 45, 180, 108);
        
        doc.addPage();
        doc.setFontSize(16);
        doc.text("Desglose de Rasgos Comparativo (Promedios)", 14, 22);
        doc.addImage(imgBigFive, 'PNG', 14, 30, 180, 90);
        doc.addImage(imgDark, 'PNG', 14, 130, 180, 90);

        // --- 6. Añadir Tabla de Percentiles (en página siguiente) ---
        // (Modificado para mostrar UNA tabla consolidada)
        doc.addPage();
        doc.setFontSize(18);
        doc.text("Análisis de Distribución de Percentiles (Consolidado)", 14, 22);

        // Lógica de Negocio: Procesar el grupo (para la tabla)
        const comparacionGrupo = procesador.compararGrupo(datosGrupo, datosModelos);

        // --- Definir Columnas (Ajustadas para A4 Portrait) ---
        // Col 0: LLM (Ancho 35)
        // Col 1-8: Rasgos (Ancho ~19 cada uno)
        const colWidths = [35, 19, 19, 19, 19, 19, 19, 19, 19];
        const colStarts = [14];
        for (let i = 1; i < colWidths.length; i++) {
            colStarts[i] = colStarts[i - 1] + colWidths[i - 1];
        }

        let y = 35; // Posición 'y' inicial

        // --- Imprimir Encabezados ---
        doc.setFontSize(8); // Fuente pequeña para que quepa
        doc.setFont(undefined, 'bold');
        
        // Header 1: "LLM"
        doc.text("LLM", colStarts[0], y);
        
        // Headers 2-9: Rasgos (con nombres cortos)
        plantilla.forEach((rasgo, i) => {
            let shortName = rasgo;
            if (rasgo === "Responsabilidad") shortName = "Resp.";
            if (rasgo === "Extraversión") shortName = "Extra.";
            if (rasgo === "Amabilidad") shortName = "Amab.";
            if (rasgo === "Neuroticismo") shortName = "Neuro.";
            if (rasgo === "Maquiavelismo") shortName = "Maquia.";
            if (rasgo === "Narcisismo") shortName = "Narcis.";
            if (rasgo === "Psicopatía") shortName = "Psico.";
            
            doc.text(shortName, colStarts[i + 1], y);
        });

        y += 7;
        doc.setLineWidth(0.5);
        doc.line(14, y - 3, 200, y - 3); // 200mm (casi el borde de A4)
        doc.setFont(undefined, 'normal');

        // --- Imprimir Filas (una por LLM) ---
        for (const modelo of datosModelos) {
            
            // Definir alturas de fila y espaciado
            const lineSpacing = 4; // Espacio entre líneas (mm)
            const rowHeight = lineSpacing * 3; // 3 líneas
            const rowMargin = 4; // Margen *después* de la fila
            let cellStartY = y; // Y-start para esta fila

            if (y > 270) { // Salto de página
                 doc.addPage();
                 y = 20;
                 cellStartY = y; // Resetear Y-start
                 
                 // (Opcional: re-imprimir headers)
                 doc.setFontSize(18);
                 doc.text("Análisis de Distribución (Continuación)", 14, y);
                 y += 15;
                 cellStartY = y;
            }

            // Imprimir el nombre del LLM, centrado verticalmente
            doc.setFontSize(8);
            doc.setFont(undefined, 'bold');
            doc.text(modelo.nombre, colStarts[0], cellStartY + lineSpacing); // Centrado en la 2da línea
            doc.setFont(undefined, 'normal');
            
            const resultadosModelo = comparacionGrupo.resultadosPorModelo[modelo.nombre];

            if (resultadosModelo) {
                plantilla.forEach((nombreRasgo, i) => {
                    const stat = resultadosModelo.find(s => s.rasgo === nombreRasgo);
                    let colX = colStarts[i + 1]; // Posición X de la columna

                    if (stat) {
                        // Formato: XX.X% Etiqueta (como en la imagen)
                        const pD_val = `${parseFloat(stat.porcentaje.porDebajo).toFixed(1)}%`;
                        const pI_val = `${parseFloat(stat.porcentaje.dentro).toFixed(1)}%`;
                        const pA_val = `${parseFloat(stat.porcentaje.porArriba).toFixed(1)}%`;
                        
                        doc.setFontSize(6); // Fuente muy pequeña
                        
                        // Valor (Bold)
                        doc.setFont(undefined, 'bold');
                        doc.text(pD_val, colX, cellStartY);
                        doc.text(pI_val, colX, cellStartY + lineSpacing);
                        doc.text(pA_val, colX, cellStartY + (2 * lineSpacing));

                        // Etiqueta (Normal)
                        doc.setFont(undefined, 'normal');
                        let labelX = colX + 8; // Ajustar X para la etiqueta
                        doc.text("Debajo", labelX, cellStartY);
                        doc.text("Dentro", labelX, cellStartY + lineSpacing);
                        doc.text("Arriba", labelX, cellStartY + (2 * lineSpacing));
                    } else {
                        doc.setFontSize(7);
                        doc.text("N/A", colX, cellStartY + lineSpacing); // Centrar "N/A"
                    }
                });
            }
            
            // Incrementar Y para la siguiente fila
            y += rowHeight + rowMargin; 
            doc.setLineWidth(0.2);
            doc.line(14, y - (rowMargin / 2), 200, y - (rowMargin / 2)); // Línea separadora
        }
        
        // --- Añadir Leyenda ---
        y += 10;
        doc.setFontSize(8);
        doc.text("Valores: % de participantes del grupo (Debajo, Dentro, Arriba) del rango del LLM.", 14, y);
        
        return doc.output('blob');
    }
}