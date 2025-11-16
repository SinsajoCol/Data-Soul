const { jsPDF } = window.jspdf;

/**
 * Estrategia para generar el reporte "Individual".
 * (Según el diagrama: "PDF con 2 gráficas fijas del usuario")
 */
export class IndividualReportStrategy {
    
    constructor({ chartBuilder, graficoExporter }) {
        this.chartBuilder = chartBuilder;
        this.graficoExporter = graficoExporter;
    }

    /**
     * @param {ReportContext} context 
     * @returns {Promise<Blob>}
     */
    async generarPDF(context) {
        const { datosUsuario, metadata } = context;

        if (!datosUsuario) {
            throw new Error("Reporte Individual: No se encontraron datos de usuario.");
        }

        const doc = new jsPDF();

        // --- Títulos ---
        doc.setFontSize(18);
        doc.text("Reporte de Rasgos Individual", 14, 22);
        doc.setFontSize(11);
        doc.text(`Usuario: ${metadata.usuarioId}`, 14, 30);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 36);

        // --- 1. Preparar Datos ---
        const plantilla = metadata.rasgosOrdenados; // ["Apertura", ...]
        const bigFiveLabels = plantilla.slice(0, 5);
        const darkLabels = plantilla.slice(5, 8);

        // Extrae los puntajes del usuario en el orden de la plantilla
        const userData = plantilla.map(nombreRasgo => {
            const rasgo = datosUsuario.rasgos.listaRasgos.find(r => r.nombre === nombreRasgo);
            return rasgo ? parseFloat(rasgo.valor.toFixed(2)) : 0;
        });
        
        const userDataBigFive = userData.slice(0, 5);
        const userDataDark = userData.slice(5, 8);

        // --- 2. Construir Configs de Gráficas (SOLO USUARIO) ---
        const radarConfig = this.chartBuilder.buildRadar(
            plantilla, 
            userData
        );
        const barBigFiveConfig = this.chartBuilder.buildBar(
            bigFiveLabels, 
            userDataBigFive, 
            null, null, 
            "Big Five (Usuario)"
        );
        const barDarkConfig = this.chartBuilder.buildBar(
            darkLabels, 
            userDataDark, 
            null, null, 
            "Dark Triad (Usuario)"
        );

        // --- 3. Generar Imágenes ---
        const imgRadar = await this.graficoExporter.generarImagen(radarConfig, 1000, 500);
        const imgBigFive = await this.graficoExporter.generarImagen(barBigFiveConfig, 1000, 500);
        const imgDark = await this.graficoExporter.generarImagen(barDarkConfig, 600, 500);

        // --- 4. Maquetar PDF ---
        doc.addImage(imgRadar, 'PNG', 14, 45, 180, 90);
        
        doc.addPage();
        doc.setFontSize(16);
        doc.text("Desglose de Rasgos", 14, 22);
        doc.addImage(imgBigFive, 'PNG', 14, 30, 180, 90);
        doc.addImage(imgDark, 'PNG', 14, 130, 180, 90);

        // (Aquí podrías añadir las descripciones de texto)

        return doc.output('blob');
    }
}