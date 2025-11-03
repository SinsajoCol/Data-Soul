export class ResultadosView {

    constructor() {
        // Inicialmente nulos, se conectan en conectarDOM
        this.pageContainer = null;
        this.listContainer = null;
    }

    /**
     * Devuelve el HTML "esqueleto" que pide PaginaResultados
     */
    getHtmlBase() {
        return `
            <div class="container resultados-container" id="resultados-page-container">
                <h1>Tus Resultados</h1>
                <p>Estos son los puntajes calculados de tus rasgos:</p>
                
                <ul id="lista-rasgos-container" class="lista-rasgos">
                    </ul>

                <a href="#cuestionario" data-page="cuestionario" class="btn-primary">
                    Volver a tomar el Test
                </a>
            </div>
        `;
    }

    /**
     * Busca los elementos del DOM (llamado por el Controlador)
     */
    conectarDOM() {
        this.pageContainer = document.getElementById("resultados-page-container");
        this.listContainer = document.getElementById("lista-rasgos-container");
    }

    /**
     * Renderiza los rasgos (llamado por el Controlador)
     * @param {Rasgos} rasgos El objeto 'Rasgos' con la 'listaRasgos'
     */
    render(rasgos) {
        if (!this.listContainer) return; // Seguridad

        const listaHtml = rasgos.listaRasgos
            .map(rasgo => `
                <li>
                    <strong>${this.capitalizar(rasgo.nombre)}:</strong> 
                    <span>${rasgo.valor}</span>
                </li>
            `)
            .join('');
        
        this.listContainer.innerHTML = listaHtml;
    }

    /**
     * Muestra un error (llamado por el Controlador)
     * @param {string} mensaje El mensaje de error
     */
    renderError(mensaje) {
        if (!this.pageContainer) return; // Seguridad

        this.pageContainer.innerHTML = `
            <h1>Error</h1>
            <p>${mensaje}</p>
            <a href="#cuestionario" data-page="cuestionario">Volver a tomar el test</a>
        `;
    }

    // Función de utilidad
    capitalizar(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}