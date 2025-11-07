export class ComparacionView {

    constructor() {
        this.container = null;
    }

    getHtmlBase() {
        return `
            <div class="container comparacion-container">
                <h1>Comparación Grupal vs. Modelos LLM</h1>
                <div id="comparacion-content">
                    <p>Cargando datos de comparación...</p>
                </div>
            </div>
        `;
    }

    conectarDOM() {
        this.container = document.getElementById("comparacion-content");
    }

    /**
     * @param {DatosPoblacion} grupo El objeto del grupo humano
     * @param {Array<ModeloLLM>} modelosLLM La lista de modelos LLM
     */
    render(humanDataLabel, humanStats, modelosLLM) {
        if (!this.container) return; // Chequeo de seguridad

        // 1. Genera la tabla HTML para los datos humanos
        const humanTableHtml = `
            <h3>${humanDataLabel} (IC 95%)</h3>
            <table class="tabla-comparacion">
                <thead>
                    <tr>
                        <th>Rasgo</th>
                        <th>Promedio</th>
                        <th>Límite Inferior (95%)</th>
                        <th>Límite Superior (95%)</th>
                    </tr>
                </thead>
                <tbody>
                    ${humanStats.map(stat => `
                        <tr>
                            <td>${this.capitalizar(stat.nombre)}</td>
                            <td>${stat.media.toFixed(2)}</td>
                            <td>${stat.limInf_95.toFixed(2)}</td>
                            <td>${stat.limSup_95.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        // 2. Genera las tablas HTML para cada modelo LLM
        const llmTablesHtml = modelosLLM.map(modelo => `
            <h3>Modelo: ${modelo.nombre} (IC 95%)</h3>
            <table class="tabla-comparacion">
                <thead>
                    <tr>
                        <th>Rasgo</th>
                        <th>Promedio</th>
                        <th>Límite Inferior (95%)</th>
                        <th>Límite Superior (95%)</th>
                    </tr>
                </thead>
                <tbody>
                    ${modelo.estadisticas.map(stat => `
                        <tr>
                            <td>${this.capitalizar(stat.nombre)}</td>
                            <td>${stat.media.toFixed(2)}</td>
                            <td>${stat.limInf_95.toFixed(2)}</td>
                            <td>${stat.limSup_95.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `).join(''); // Une todas las tablas de los LLM

        // 3. Dibuja todo en el contenedor
        this.container.innerHTML = humanTableHtml + llmTablesHtml;
    }


    mostrarError(mensaje) {
        if (this.container) {
            this.container.innerHTML = `
                <p class="error">${mensaje}</p>
                <a href="#inicio" data-page="inicio">Volver al inicio</a>
            `;
        }
    }

    capitalizar(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}