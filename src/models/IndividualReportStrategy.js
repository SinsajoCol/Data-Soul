const { jsPDF } = window.jspdf;

/**
 * Estrategia para generar el reporte "Individual".
 * Diseño:
 * Pág 1: Header, Grid de Cards (Descripción + Score), Bar Chart.
 * Pág 2: Header, Radar Chart.
 */
export class IndividualReportStrategy {

    constructor({ chartBuilder, graficoExporter, pdfService }) {
        this.chartBuilder = chartBuilder;
        this.graficoExporter = graficoExporter;
        this.pdfService = pdfService;
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
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 14;

        // --- 1. Preparar Datos ---
        const plantilla = metadata.rasgosOrdenados; // ["Apertura", ...]
        const descripciones = metadata.descripciones;
        const descriptionsScore = metadata.descriptionsScore;

        // Extrae los puntajes del usuario
        const userData = plantilla.map(nombreRasgo => {
            const rasgo = datosUsuario.rasgos.listaRasgos.find(r => r.nombre === nombreRasgo);
            return rasgo ? parseFloat(rasgo.valor.toFixed(2)) : 0;
        });

        // --- 2. Generar Gráficas (Imágenes) ---

        // Config Bar Chart (Todos los rasgos)
        const barConfig = this.chartBuilder.buildBar(
            plantilla,
            userData,
            null, null,
            "" // Sin título en la gráfica, lo ponemos en el PDF
        );
        // Ajustar colores para que coincida con el diseño (Azul)
        barConfig.data.datasets[0].backgroundColor = "rgba(22, 52, 140, 0.8)"; // #16348C

        // Config Radar Chart
        const radarConfig = this.chartBuilder.buildRadar(
            plantilla,
            userData
        );
        radarConfig.data.datasets[0].borderColor = "#16348C";
        radarConfig.data.datasets[0].backgroundColor = "rgba(22, 52, 140, 0.2)";

        const imgBar = await this.graficoExporter.generarImagen(barConfig, 1000, 500);
        const imgRadar = await this.graficoExporter.generarImagen(radarConfig, 1000, 800);

        // --- PÁGINA 1 ---

        // Header
        this.pdfService.drawHeader(doc, "Reporte Psicométrico Personal", "Descripción de sus resultados psicométricos");

        // Grid de Cards
        let y = 60;
        const cardHeight = 35;
        const cardWidth = (pageWidth - (margin * 3)) / 2; // 2 columnas con espacio en medio

        plantilla.forEach((rasgo, index) => {
            const col = index % 2; // 0 o 1
            const row = Math.floor(index / 2);

            const xPos = margin + (col * (cardWidth + margin));
            const yPos = y + (row * (cardHeight + 5)); // 5mm gap vertical

            // Obtener la descripción del puntaje
            const scoreValue = userData[index];
            const nivel = scoreValue <= 2.6 ? "low" : scoreValue <= 3.3 ? "medium" : "high";
            
            // Mapa entre los nombres visibles y los del JSON
            const mapKeys = {
                "Apertura": "openness",
                "Responsabilidad": "conscientiousness",
                "Extraversión": "extraversion",
                "Amabilidad": "agreeableness",
                "Neuroticismo": "neuroticism",
                "Maquiavelismo": "machiavellianism",
                "Narcisismo": "narcissism",
                "Psicopatía": "psychopathy"
            };

            const clave = mapKeys[rasgo];
            const source = clave in descriptionsScore.bigfive
                ? descriptionsScore.bigfive
                : descriptionsScore.darktriad;

            const descripcionFinal = source[clave] && source[clave][nivel] 
                ? source[clave][nivel] 
                : descripciones[rasgo];

            this.pdfService.drawTraitCard(doc, xPos, yPos, cardWidth, cardHeight, {
                nombre: rasgo,
                scoreUser: userData[index],
                descripcion: descripcionFinal
            });
        });

        // Título Gráfica Barras
        y = y + (4 * (cardHeight + 5)) + 10; // Debajo de las cards
        doc.setFontSize(14);
        doc.setTextColor(this.pdfService.colors.primary);
        doc.text("Diagrama de Barras: Rasgos Psicométricos Personales", pageWidth / 2, y, { align: "center" });

        // Imagen Gráfica Barras
        doc.addImage(imgBar, 'PNG', margin, y + 5, pageWidth - (margin * 2), 80);

        // --- PÁGINA 2 ---
        doc.addPage();
        this.pdfService.drawHeader(doc, "Reporte Psicométrico Personal");

        // Título Radar
        doc.setFontSize(14);
        doc.setTextColor(this.pdfService.colors.primary);
        doc.text("Gráfico de Radar: Rasgos Psicométricos Personales", pageWidth / 2, 60, { align: "center" });

        // Imagen Radar
        doc.addImage(imgRadar, 'PNG', margin + 20, 70, pageWidth - (margin * 2) - 40, 120);

        return doc.output('blob');
    }
}