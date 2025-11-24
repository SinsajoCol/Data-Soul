const { jsPDF } = window.jspdf;

/**
 * Estrategia para generar el reporte "Comparativo".
 * Diseño:
 * Pág 1: Header, Subtítulo (Más similar), Grid Cards (User vs LLM), Tabla.
 * Pág 2: Header, Gráficas Globales (Barra + Radar).
 */
export class ComparativoLLMStrategy {

    constructor({ chartBuilder, graficoExporter, pdfService }) {
        this.chartBuilder = chartBuilder;
        this.graficoExporter = graficoExporter;
        this.pdfService = pdfService;
    }

    async generarPDF(context) {
        if (context.esIndividual) {
            return this.generarPDFIndividual(context);
        } else if (context.esGrupo) {
            return this.generarPDFGrupo(context);
        } else {
            throw new Error("Contexto de reporte no válido.");
        }
    }

    async generarPDFIndividual(context) {
        const { datosUsuario, datosModelos, metadata } = context;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 14;

        // --- 1. Preparar Datos ---
        const plantilla = metadata.rasgosOrdenados;
        const descripciones = metadata.descripciones;
        const descriptionsScore = metadata.descriptionsScore;

        // Datos Usuario
        const userData = plantilla.map(nombreRasgo => {
            const rasgo = datosUsuario.rasgos.listaRasgos.find(r => r.nombre === nombreRasgo);
            return rasgo ? parseFloat(rasgo.valor.toFixed(2)) : 0;
        });

        // Encontrar LLM más similar
        const { bestMatchName, bestMatchData } = this._findBestMatch(userData, datosModelos, plantilla);

        // --- PÁGINA 1 ---
        this.pdfService.drawHeader(doc, "Reporte Psicométrico Comparativo", `El LLM con los rasgos más similares es: ${bestMatchName}`);

        // Grid de Cards (User vs Best LLM)
        let y = 60;
        const cardHeight = 35;
        const cardWidth = (pageWidth - (margin * 3)) / 2;

        plantilla.forEach((rasgo, index) => {
            const col = index % 2;
            const row = Math.floor(index / 2);
            const xPos = margin + (col * (cardWidth + margin));
            const yPos = y + (row * (cardHeight + 5));

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
                scoreLLM: bestMatchData[index],
                descripcion: descripcionFinal
            });
        });

        // Tabla Comparativa
        y = y + (4 * (cardHeight + 5)) + 10;

        // Preparar datos tabla
        const tableRows = plantilla.map((rasgo, i) => ({
            rasgo,
            user: userData[i],
            llm: bestMatchData[i],
            diff: parseFloat((userData[i] - bestMatchData[i]).toFixed(2))
        }));

        doc.setFontSize(14);
        doc.setTextColor(this.pdfService.colors.primary);
        doc.text("Tabla Comparativa", pageWidth / 2, y, { align: "center" });

        this.pdfService.drawComparisonTable(
            doc,
            y + 5,
            tableRows,
            "Reporte Psicométrico Comparativo",
            "Tabla Comparativa"
        );

        // --- PÁGINA 2 (Gráficas Globales) ---
        doc.addPage();
        this.pdfService.drawHeader(doc, "Reporte Psicométrico", "Comparación Global de los Resultados");

        // Generar Gráficas con TODOS los LLMs
        const imgBar = await this._generateMultiBarChart(plantilla, userData, datosModelos);
        const imgRadar = await this._generateMultiRadarChart(plantilla, userData, datosModelos);

        y = 60;
        doc.setFontSize(14);
        doc.setTextColor(this.pdfService.colors.primary);
        doc.text("Diagrama de Barras: Rasgos Psicométricos", pageWidth / 2, y, { align: "center" });
        doc.addImage(imgBar, 'PNG', margin, y + 5, pageWidth - (margin * 2), 90);

        y = 165;
        doc.text("Gráfico de Radar: Rasgos Psicométricos", pageWidth / 2, y, { align: "center" });
        doc.addImage(imgRadar, 'PNG', margin + 20, y + 5, pageWidth - (margin * 2) - 40, 110);

        return doc.output('blob');
    }

    async generarPDFGrupo(context) {
        // Lógica similar pero usando promedios de grupo
        const { datosGrupo, datosModelos, metadata } = context;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 14;

        const plantilla = metadata.rasgosOrdenados;
        const descripciones = metadata.descripciones;
        const descriptionsScore = metadata.descriptionsScore;

        // Promedios Grupo
        const statsGrupales = datosGrupo.obtenerEstadisticasGrupales();
        const groupData = plantilla.map(nombreRasgo => {
            const stat = statsGrupales.find(s => s.nombre === nombreRasgo);
            return stat ? parseFloat(stat.media.toFixed(2)) : 0;
        });

        const { bestMatchName, bestMatchData } = this._findBestMatch(groupData, datosModelos, plantilla);

        // --- PÁGINA 1 ---
        this.pdfService.drawHeader(doc, "Reporte Psicométrico Comparativo", `El LLM más similar al PROMEDIO DEL GRUPO es: ${bestMatchName}`);

        // Grid Cards
        let y = 60;
        const cardHeight = 35;
        const cardWidth = (pageWidth - (margin * 3)) / 2;

        plantilla.forEach((rasgo, index) => {
            const col = index % 2;
            const row = Math.floor(index / 2);
            const xPos = margin + (col * (cardWidth + margin));
            const yPos = y + (row * (cardHeight + 5));

            // Obtener la descripción del puntaje
            const scoreValue = groupData[index];
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
                scoreUser: groupData[index], // "Usuario" label will be used, maybe change logic in PdfService if needed, but "Usuario" (as Group) is acceptable or I can change PdfService to accept label.
                scoreLLM: bestMatchData[index],
                descripcion: descripcionFinal
            });
        });

        // Tabla
        // --- PÁGINA 2: Tabla Comparativa (Promedios) ---
        doc.addPage();
        this.pdfService.drawHeader(doc, "Reporte Psicométrico Comparativo", "Tabla Comparativa (Promedios)");

        const tableRows = plantilla.map((rasgo, i) => ({
            rasgo,
            user: groupData[i],
            llm: bestMatchData[i],
            diff: parseFloat((groupData[i] - bestMatchData[i]).toFixed(2))
        }));

        doc.setFontSize(14);
        doc.setTextColor(this.pdfService.colors.primary);
        doc.text("Tabla Comparativa (Promedios)", pageWidth / 2, 60, { align: "center" });
        this.pdfService.drawComparisonTable(
            doc,
            65,
            tableRows,
            "Reporte Psicométrico Comparativo",
            "Tabla Comparativa (Promedios)"
        );

        // --- PÁGINA 3: Gráficas Globales ---
        doc.addPage();
        this.pdfService.drawHeader(doc, "Reporte Psicométrico", "Comparación Global (Grupo vs LLMs)");

        const imgBar = await this._generateMultiBarChart(plantilla, groupData, datosModelos);
        const imgRadar = await this._generateMultiRadarChart(plantilla, groupData, datosModelos);

        y = 60;
        doc.text("Diagrama de Barras", pageWidth / 2, y, { align: "center" });
        doc.addImage(imgBar, 'PNG', margin, y + 5, pageWidth - (margin * 2), 90);

        y = 165;
        doc.text("Gráfico de Radar", pageWidth / 2, y, { align: "center" });
        doc.addImage(imgRadar, 'PNG', margin + 20, y + 5, pageWidth - (margin * 2) - 40, 110);

        return doc.output('blob');
    }

    // --- Helpers ---

    _findBestMatch(targetData, modelos, plantilla) {
        let minDistance = Infinity;
        let bestMatchName = "";
        let bestMatchData = [];

        modelos.forEach(modelo => {
            const modelData = plantilla.map(r => {
                const stat = modelo.estadisticas.find(s => s.nombre === r);
                return stat ? stat.media : 0;
            });

            const dist = Math.sqrt(
                targetData.reduce((acc, val, i) => acc + Math.pow(val - modelData[i], 2), 0)
            );

            if (dist < minDistance) {
                minDistance = dist;
                bestMatchName = modelo.nombre;
                bestMatchData = modelData;
            }
        });

        return { bestMatchName, bestMatchData: bestMatchData.map(v => parseFloat(v.toFixed(2))) };
    }

    async _generateMultiBarChart(labels, userData, modelos) {
        // Colores
        const USER_COLOR = '#16348C';
        const LLM_PALETTE = ['#6586E7', '#884FFD', '#B18BFD', '#FFA64D', '#FF8000'];
        const hexToRgba = (hex, alpha) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        const datasets = [
            {
                label: 'Usuario/Grupo',
                data: userData,
                backgroundColor: hexToRgba(USER_COLOR, 0.8)
            },
            ...modelos.map((m, i) => {
                const color = LLM_PALETTE[i % LLM_PALETTE.length];
                const data = labels.map(r => {
                    const s = m.estadisticas.find(stat => stat.nombre === r);
                    return s ? s.media : 0;
                });
                return {
                    label: m.nombre,
                    data: data,
                    backgroundColor: hexToRgba(color, 0.8)
                };
            })
        ];

        const config = {
            type: 'bar',
            data: { labels, datasets },
            options: {
                responsive: false, animation: false,
                scales: { y: { beginAtZero: true, max: 5 } },
                plugins: { legend: { display: true } }
            }
        };

        return await this.graficoExporter.generarImagen(config, 1000, 500);
    }

    async _generateMultiRadarChart(labels, userData, modelos) {
        const USER_COLOR = '#16348C';
        const LLM_PALETTE = ['#6586E7', '#884FFD', '#B18BFD', '#FFA64D', '#FF8000'];
        const hexToRgba = (hex, alpha) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        const datasets = [
            {
                label: 'Usuario/Grupo',
                data: userData,
                backgroundColor: hexToRgba(USER_COLOR, 0.2),
                borderColor: USER_COLOR,
                borderWidth: 2
            },
            ...modelos.map((m, i) => {
                const color = LLM_PALETTE[i % LLM_PALETTE.length];
                const data = labels.map(r => {
                    const s = m.estadisticas.find(stat => stat.nombre === r);
                    return s ? s.media : 0;
                });
                return {
                    label: m.nombre,
                    data: data,
                    backgroundColor: hexToRgba(color, 0.2),
                    borderColor: color,
                    borderWidth: 2
                };
            })
        ];

        const config = {
            type: 'radar',
            data: { labels, datasets },
            options: {
                responsive: false, animation: false,
                scales: { r: { beginAtZero: true, min: 0, max: 5 } },
                plugins: { legend: { display: true } }
            }
        };

        return await this.graficoExporter.generarImagen(config, 1000, 800);
    }
}