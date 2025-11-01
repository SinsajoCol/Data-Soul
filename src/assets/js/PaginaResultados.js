import { PaginaTemplate } from "./PaginaTemplate.js";


export class PaginaResultados extends PaginaTemplate {

    /**
     * Implementa el método abstracto para devolver el HTML
     * de la página de resultados.
     */
    async mostrarContenido() {
        console.log("Cargando página de resultados...");

        // 2. Obtiene los resultados del Singleton
        const resultadosMap = Resultados.obtenerResultadosIndividuales();
        
        // Asumimos que guardaste los resultados del usuario 'default_user'
        const misResultados = resultadosMap.get('default_user');

        // Si por alguna razón no hay resultados (ej. recargó la pág)
        if (!misResultados) {
            return `
                <div class="container">
                    <h1>Error</h1>
                    <p>No se encontraron resultados para mostrar.</p>
                    <a href="#cuestionario" data-page="cuestionario">Volver a tomar el test</a>
                </div>
            `;
        }

        // 3. Genera el HTML para la lista de rasgos
        // 'misResultados' es un objeto 'Rasgos', usamos su '.listaRasgos'
        const listaHtml = misResultados.listaRasgos
            .map(rasgo => `
                <li>
                    <strong>${this.capitalizar(rasgo.nombre)}:</strong> 
                    <span>${rasgo.valor}</span>
                </li>
            `)
            .join('');

        return `
            <div class="container resultados-container">
                <h1>Tus Resultados</h1>
                <p>Estos son los puntajes calculados de tus rasgos:</p>
                
                <ul class="lista-rasgos">
                    ${listaHtml}
                </ul>

                <a href="#cuestionario" data-page="cuestionario" class="btn-primary">
                    Volver a tomar el Test
                </a>
            </div>
        `;
    }

    /**
     * Lógica después de que el HTML de resultados se carga.
     */
    async despuesDeCargar() {
        // Esta página es simple, no necesita lógica post-carga.
        // El router en main.js ya maneja el clic en el botón 'Volver'.
        console.log("Página de resultados cargada y activada.");
    }

    // Pequeña función de utilidad
    capitalizar(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}