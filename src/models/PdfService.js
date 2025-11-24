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
     * Limpia el HTML de la descripción para que se muestre como texto plano en el PDF.
     * @param {string} html 
     * @returns {string} Texto limpio sin etiquetas HTML
     */
    cleanHTML(html) {
        if (!html) return '';
        // Reemplazar <strong> con nada (solo sacamos la etiqueta)
        let texto = html.replace(/<strong>/g, '').replace(/<\/strong>/g, '');
        // Reemplazar </br> y <br> con saltos de línea
        texto = texto.replace(/<\/?br\s*\/?>/g, '\n');
        // Eliminar cualquier otra etiqueta HTML
        texto = texto.replace(/<[^>]*>/g, '');
        // Limpiar espacios excesivos
        texto = texto.replace(/\s+/g, ' ').trim();
        return texto;
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

            // Limpiar HTML de la descripción
            const descripcionLimpia = this.cleanHTML(data.descripcion);

            // Ajuste de texto multilinea
            const textWidth = width - 10;
            const splitText = doc.splitTextToSize(descripcionLimpia, textWidth);
            doc.text(splitText, x + 5, y + 26);
        }
    }

    /**
     * Dibuja la tabla comparativa simple con manejo automático de paginación.
     * @param {jsPDF} doc 
     * @param {number} startY 
     * @param {Array} rows - Array de objetos { rasgo, user, llm, diff }
     * @param {string} pageHeaderTitle - Título para redibujar en nuevas páginas (opcional)
     * @param {string} pageHeaderSubtitle - Subtítulo para redibujar en nuevas páginas (opcional)
     */
    drawComparisonTable(doc, startY, rows, pageHeaderTitle, pageHeaderSubtitle) {
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 14;
        const tableWidth = pageWidth - (margin * 2);
        const colWidth = tableWidth / 4;
        const pageHeight = doc.internal.pageSize.getHeight();
        const headerHeight = 10;
        const rowHeight = 8;

        let y = startY;

        const drawHeaderRow = (yPos) => {
            doc.setFillColor(this.colors.primary);
            doc.rect(margin, yPos, tableWidth, headerHeight, 'F');
            doc.setTextColor(this.colors.white);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text("Rasgo", margin + 5, yPos + 7);
            doc.text("Usuario", margin + colWidth + 5, yPos + 7);
            doc.text("LLM", margin + (colWidth * 2) + 5, yPos + 7);
            doc.text("Diferencia", margin + (colWidth * 3) + 5, yPos + 7);
        };

        drawHeaderRow(y);
        y += headerHeight;
        doc.setTextColor(this.colors.text);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        rows.forEach((row, index) => {
            if (y + rowHeight + margin > pageHeight) {
                doc.addPage();
                if (pageHeaderTitle) {
                    this.drawHeader(doc, pageHeaderTitle, pageHeaderSubtitle || "");
                    y = 60;
                } else {
                    y = margin;
                }
                drawHeaderRow(y);
                y += headerHeight;
            }

            if (index % 2 === 0) {
                doc.setFillColor(245, 247, 250);
                doc.rect(margin, y, tableWidth, rowHeight, 'F');
            }

            doc.setTextColor(this.colors.text);
            doc.text(row.rasgo, margin + 5, y + 6);
            doc.text(String(row.user), margin + colWidth + 5, y + 6);
            doc.text(String(row.llm), margin + (colWidth * 2) + 5, y + 6);

            if (row.diff > 0) doc.setTextColor(0, 150, 0);
            else if (row.diff < 0) doc.setTextColor(200, 0, 0);
            else doc.setTextColor(this.colors.text);

            doc.text(String(row.diff), margin + (colWidth * 3) + 5, y + 6);
            doc.setTextColor(this.colors.text);
            y += rowHeight;
        });
    }

    /**
     * Dibuja la tabla comparativa detallada para GRUPOS (LLM vs Rasgos con porcentajes).
     * Maneja paginación automática cuando la tabla es muy grande.
     * @param {jsPDF} doc 
     * @param {number} startY 
     * @param {Object} comparacion - Devuelto por ProcesadorComparacion.compararGrupo
     * @param {Array<string>} plantilla - Array con nombres de rasgos en orden
     * @param {string} pageHeaderTitle - Título del reporte (para redibujar en nuevas páginas)
     * @param {string} pageHeaderSubtitle - Subtítulo del reporte
     */
    drawGroupComparisonTable(doc, startY, comparacion, plantilla, pageHeaderTitle, pageHeaderSubtitle) {
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 14;
        const tableWidth = pageWidth - (margin * 2);
        const pageHeight = doc.internal.pageSize.getHeight();
        const headerHeight = 12;
        const rowHeight = 18;
        const colCount = 1 + plantilla.length;
        const colWidth = tableWidth / colCount;

        let y = startY;

        const drawHeaderRow = (yPos) => {
            doc.setFillColor(this.colors.primary);
            doc.rect(margin, yPos, tableWidth, headerHeight, 'F');
            doc.setTextColor(this.colors.white);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);

            doc.text('LLM', margin + 4, yPos + 8);
            plantilla.forEach((r, i) => {
                const x = margin + ((i + 1) * colWidth) + 2;
                doc.text(r, x, yPos + 8);
            });
        };

        // Dibujar primera cabecera
        drawHeaderRow(y);
        y += headerHeight;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(this.colors.text);

        const resultados = comparacion.resultadosPorModelo || {};

        Object.keys(resultados).forEach((llmName, rowIndex) => {
            // Si no hay espacio suficiente, crear nueva página
            if (y + rowHeight + margin > pageHeight) {
                doc.addPage();
                if (pageHeaderTitle) {
                    this.drawHeader(doc, pageHeaderTitle, pageHeaderSubtitle || "");
                    y = 60;
                } else {
                    y = margin;
                }
                drawHeaderRow(y);
                y += headerHeight;
            }

            // Alternar color de fondo
            if (rowIndex % 2 === 0) {
                doc.setFillColor(245, 247, 250);
                doc.rect(margin, y, tableWidth, rowHeight, 'F');
            }

            // Columna LLM
            doc.setTextColor(this.colors.text);
            doc.setFont('helvetica', 'bold');
            doc.text(String(llmName), margin + 4, y + 7);

            const stats = resultados[llmName];
            doc.setFont('helvetica', 'normal');

            // Para cada rasgo imprimimos los tres valores en vertical
            plantilla.forEach((rasgo, i) => {
                const x = margin + ((i + 1) * colWidth) + 2;
                const stat = stats.find(s => s.rasgo === rasgo) || null;

                if (stat && stat.porcentaje) {
                    const porDebajo = parseFloat(stat.porcentaje.porDebajo).toFixed(1) + '%';
                    const dentro = parseFloat(stat.porcentaje.dentro).toFixed(1) + '%';
                    const porArriba = parseFloat(stat.porcentaje.porArriba).toFixed(1) + '%';

                    doc.text(porDebajo, x, y + 4);
                    doc.setTextColor(this.colors.secondary);
                    doc.text(dentro, x, y + 9);
                    doc.setTextColor(this.colors.text);
                    doc.text(porArriba, x, y + 14);
                } else {
                    doc.text('N/A', x, y + 9);
                }
                doc.setTextColor(this.colors.text);
            });

            y += rowHeight;
        });
    }
}
