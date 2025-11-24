const { jsPDF } = window.jspdf;

/**
 * Servicio de utilidades para dibujar elementos comunes en el PDF.
 * Encapsula estilos, colores y maquetación repetitiva.
 */
export class PdfService {

    constructor() {
        this.colors = {
            primary: '#16348C', // Azul oscuro (Header)
            secondary: '#6586E7', // Azul claro
            text: '#333333',
            lightText: '#666666',
            white: '#FFFFFF',
            background: '#F5F7FA',
            cardBorder: '#E0E0E0'
        };
        this.logoBase64 = null;
    }

    /**
     * Carga el logo desde la URL para usarlo en el PDF.
     * @param {string} url 
     */
    async loadLogo(url) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    this.logoBase64 = reader.result;
                    resolve(reader.result);
                };
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.warn("No se pudo cargar el logo:", error);
            return null;
        }
    }

    /**
     * Dibuja el encabezado estándar en la página actual.
     * @param {jsPDF} doc 
     * @param {string} title 
     * @param {string} subtitle 
     */
    drawHeader(doc, title, subtitle = "") {
        const pageWidth = doc.internal.pageSize.getWidth();

        // Logo (Izquierda)
        if (this.logoBase64) {
            doc.addImage(this.logoBase64, 'PNG', 14, 10, 20, 20); // Ajustar tamaño/pos
        }

        // Título (Derecha, alineado con "Data Soul" en la imagen)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(this.colors.primary);
        doc.text("Data Soul", pageWidth - 14, 20, { align: "right" });

        // Título del Reporte (Centrado o Izquierda abajo)
        doc.setFontSize(22);
        doc.setTextColor(this.colors.primary);
        doc.text(title, pageWidth / 2, 40, { align: "center" });

        // Subtítulo
        if (subtitle) {
            doc.setFontSize(12);
            doc.setTextColor(this.colors.secondary);
            doc.text(subtitle, pageWidth / 2, 48, { align: "center" });
        }
    }

    /**
     * Dibuja una tarjeta de rasgo (Grid).
     * @param {jsPDF} doc 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {Object} data { nombre, scoreUser, scoreLLM, descripcion }
     */
    drawTraitCard(doc, x, y, width, height, data) {
        // Fondo tarjeta
        doc.setDrawColor(this.colors.cardBorder);
        doc.setFillColor(this.colors.white);
        doc.roundedRect(x, y, width, height, 3, 3, 'FD');

        // Título Rasgo
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(this.colors.text);
        doc.text(data.nombre, x + (width / 2), y + 10, { align: "center" });

        // Scores
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");

        let scoreText = `Usuario: [${data.scoreUser}]`;
        if (data.scoreLLM !== undefined) {
            scoreText += `    LLM: [${data.scoreLLM}]`;
        }
        doc.text(scoreText, x + (width / 2), y + 18, { align: "center" });

        // Descripción
        if (data.descripcion) {
            doc.setFontSize(8);
            doc.setTextColor(this.colors.lightText);

            // Ajuste de texto multilinea
            const textWidth = width - 10;
            const splitText = doc.splitTextToSize(data.descripcion, textWidth);
            doc.text(splitText, x + 5, y + 26);
        }
    }

    /**
     * Dibuja la tabla comparativa simple.
     * @param {jsPDF} doc 
     * @param {number} startY 
     * @param {Array} rows - Array de objetos { rasgo, user, llm, diff }
     */
    drawComparisonTable(doc, startY, rows) {
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 14;
        const tableWidth = pageWidth - (margin * 2);
        const colWidth = tableWidth / 4;

        let y = startY;

        // Header
        doc.setFillColor(this.colors.primary);
        doc.rect(margin, y, tableWidth, 10, 'F');

        doc.setTextColor(this.colors.white);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);

        doc.text("Rasgo", margin + 5, y + 7);
        doc.text("Usuario", margin + colWidth + 5, y + 7);
        doc.text("LLM", margin + (colWidth * 2) + 5, y + 7);
        doc.text("Diferencia", margin + (colWidth * 3) + 5, y + 7);

        y += 10;

        // Rows
        doc.setTextColor(this.colors.text);
        doc.setFont("helvetica", "normal");

        rows.forEach((row, index) => {
            // Alternar color de fondo
            if (index % 2 === 0) {
                doc.setFillColor(245, 247, 250); // Gris muy claro
                doc.rect(margin, y, tableWidth, 8, 'F');
            }

            doc.text(row.rasgo, margin + 5, y + 6);
            doc.text(String(row.user), margin + colWidth + 5, y + 6);
            doc.text(String(row.llm), margin + (colWidth * 2) + 5, y + 6);

            // Color diferencia
            if (row.diff > 0) doc.setTextColor(0, 150, 0); // Verde
            else if (row.diff < 0) doc.setTextColor(200, 0, 0); // Rojo
            else doc.setTextColor(this.colors.text);

            doc.text(String(row.diff), margin + (colWidth * 3) + 5, y + 6);

            doc.setTextColor(this.colors.text); // Reset
            y += 8;
        });
    }
}
