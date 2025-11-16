const { jsPDF } = window.jspdf;
/**
 * Estrategia para generar el reporte "Comparativo".
 * (Según el diagrama: "PDF con 2 gráficas fijas: usuario vs modelo")
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
     * @param {ReportContext} context 
     * @returns {Promise<Blob>}
     */
    async generarPDF(context) {
        // Esta estrategia es inteligente:
        if (context.esIndividual) {
            return this.generarPDFIndividual(context);
        } else if (context.esGrupo) {
            return this.generarPDFGrupo(context);
        } else {
            throw new Error("Contexto de reporte comparativo no válido.");
        }
    }

    /**
     * Genera el PDF para un INDIVIDUO vs. el LLM más similar.
     */
    async generarPDFIndividual(context) {
        const { datosUsuario, datosModelos, metadata, procesador } = context;
        const doc = new jsPDF();

        // --- 1. Lógica de Negocio: Encontrar LLM más similar ---
        const comparacion = procesador.compararIndividuo(datosUsuario, datosModelos);
        const masSimilar = comparacion.getModeloMasCercano();
        const modeloSimilar = datosModelos.find(m => m.nombre === masSimilar.nombreModelo);

        if (!modeloSimilar) {
            throw new Error("No se pudo encontrar el modelo LLM más similar.");
        }

        // --- 2. Preparar Datos ---
        const plantilla = metadata.rasgosOrdenados;
        const bigFiveLabels = plantilla.slice(0, 5);
        const darkLabels = plantilla.slice(5, 8);

        const userData = plantilla.map(nombreRasgo => {
            const rasgo = datosUsuario.rasgos.listaRasgos.find(r => r.nombre === nombreRasgo);
            return rasgo ? parseFloat(rasgo.valor.toFixed(2)) : 0;
        });

        const llmData = plantilla.map(nombreRasgo => {
            const stat = modeloSimilar.estadisticas.find(s => s.nombre === nombreRasgo);
            return stat ? parseFloat(stat.media.toFixed(2)) : 0;
        });

        // --- 3. Construir Configs (Usuario vs. LLM) ---
        const radarConfig = this.chartBuilder.buildRadar(
            plantilla, 
            userData,
            llmData,
            modeloSimilar.nombre
        );
        const barBigFiveConfig = this.chartBuilder.buildBar(
            bigFiveLabels, 
            userData.slice(0, 5), 
            llmData.slice(0, 5),
            modeloSimilar.nombre, 
            "Big Five (Usuario vs. LLM)"
        );
        const barDarkConfig = this.chartBuilder.buildBar(
            darkLabels, 
            userData.slice(5, 8), 
            llmData.slice(5, 8),
            modeloSimilar.nombre, 
            "Dark Triad (Usuario vs. LLM)"
        );

        // --- 4. Generar Imágenes ---
        const imgRadar = await this.graficoExporter.generarImagen(radarConfig, 1000, 500);
        const imgBigFive = await this.graficoExporter.generarImagen(barBigFiveConfig, 1000, 500);
        
        // --- 5. Maquetar PDF ---
        doc.setFontSize(18);
        doc.text("Reporte Comparativo (Vista Completa)", 14, 22);
        doc.setFontSize(11);
        doc.text(`Usuario: ${metadata.usuarioId}`, 14, 30);
        doc.text(`Comparado contra: ${modeloSimilar.nombre} (Más similar)`, 14, 36);

        doc.addImage(imgRadar, 'PNG', 14, 45, 180, 90);
        doc.addImage(imgBigFive, 'PNG', 14, 140, 180, 90);
        
        // (Podrías añadir el barDark en otra página)
        // (Aquí también iría la tabla de distancias)

        return doc.output('blob');
    }

    /**
     * Genera el PDF para un GRUPO vs. los LLMs.
     */
    async generarPDFGrupo(context) {
        const { datosGrupo, datosModelos, metadata, procesador } = context;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`Reporte Comparativo de Grupo: ${datosGrupo.nombreGrupo}`, 14, 22);

        // --- 1. Lógica de Negocio: Procesar el grupo ---
        const comparacionGrupo = procesador.compararGrupo(datosGrupo, datosModelos);
        
        // --- 2. Generar Gráficas (Ej. Promedio de Grupo vs. Promedio LLM) ---
        // (Esta lógica se vuelve más compleja, similar a la individual)
        // (Por brevedad, nos enfocaremos en la tabla)
        
        doc.setFontSize(16);
        doc.text("Distribución de Percentiles del Grupo", 14, 40);

        // --- 3. Generar Tabla (Usando jspdf-autotable o manualmente) ---
        // Esta es la parte más compleja.
        // Aquí un ejemplo manual simple:
        let y = 50;
        const plantilla = metadata.rasgosOrdenados;
        const modelo = datosModelos[0]; // (Solo para el primer modelo, para simplificar)

        doc.setFontSize(12);
        doc.text(`Resultados contra: ${modelo.nombre}`, 14, y);
        y += 10;
        
        doc.setFontSize(10);
        doc.text("Rasgo", 14, y);
        doc.text("% Debajo", 60, y);
        doc.text("% Dentro", 100, y);
        doc.text("% Arriba", 140, y);
        y += 7;
        doc.setLineWidth(0.5);
        doc.line(14, y-3, 180, y-3);


        const resultadosModelo = comparacionGrupo.resultadosPorModelo[modelo.nombre];
        
        plantilla.forEach(nombreRasgo => {
            const stat = resultadosModelo.find(s => s.rasgo === nombreRasgo);
            if (stat) {
                doc.text(nombreRasgo, 14, y);
                doc.text(stat.porcentaje.porDebajo, 60, y);
                doc.text(stat.porcentaje.dentro, 100, y);
                doc.text(stat.porcentaje.porArriba, 140, y);
                y += 7;
            }
        });

        // (Repetirías esto para cada modelo LLM, probablemente en páginas nuevas)
        
        return doc.output('blob');
    }
}