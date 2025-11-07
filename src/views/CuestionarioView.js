export default class CuestionarioView {
    constructor() {
        // Elementos del DOM (inicialmente nulos)
        this.container = null;
        this.progressBar = null;
        this.progressText = null;
        this.prevButton = null;
        this.nextButton = null;

        // Callbacks (el Controlador los "llenará")
        this.onNextClick = null;
        this.onPrevClick = null;
        this.onRespuestaClick = null;
    }

    /**
     * 1. Busca todos los elementos del DOM.
     * Llamado por el Controlador DESPUÉS de que el HTML existe.
     */
    conectarDOM() {
        this.container = document.getElementById("questions-container");
        this.progressBar = document.getElementById("progress");
        this.progressText = document.getElementById("progress-text");
        this.prevButton = document.getElementById("prev");
        this.nextButton = document.getElementById("next");
    }

    /**
     * 2. Conecta los listeners del DOM a los callbacks.
     * Llamado por el Controlador.
     */
    bindEvents() {
        this.nextButton.addEventListener("click", () => {
            if (this.onNextClick) this.onNextClick();
        });

        this.prevButton.addEventListener("click", () => {
            if (this.onPrevClick) this.onPrevClick();
        });

        // Delegación de eventos para los botones de respuesta
        this.container.addEventListener("click", (e) => {
            const button = e.target.closest('.opcion button');
            if (button) {
                const questionDiv = e.target.closest('.preguntas');
                const id = Number(questionDiv.dataset.id);
                const valor = Number(button.dataset.valor); // Asumiendo que el valor es 1-5

                // Marca el botón seleccionado
                questionDiv.querySelectorAll("button").forEach((b) => b.classList.remove("selected"));
                button.classList.add("selected");

                // Avisa al controlador
                if (this.onRespuestaClick) {
                    this.onRespuestaClick(id, valor);
                }
            }
        });
    }

    /**
     * 3. Dibuja las preguntas (la lógica de tu 'mostrarPreguntas')
     */
    renderPreguntas(preguntas, respuestas) {
        this.container.innerHTML = ""; // Limpiar

        preguntas.forEach((p) => {
            const div = document.createElement("div");
            div.classList.add("preguntas");
            div.dataset.id = p.id; // Guardamos el ID aquí
            div.innerHTML = `<h4> ${p.texto}</h4>`;

            const opciones = document.createElement("div");
            opciones.classList.add("opciones");

            for (let i = 1; i <= 5; i++) {
                const opcion = document.createElement("div");
                opcion.classList.add("opcion");
                const button = document.createElement("button");
                button.dataset.valor = i;

                if (respuestas[p.id] === i) {
                    button.classList.add("selected");
                }
                
                opcion.appendChild(button);
                opciones.appendChild(opcion);
            }

            div.appendChild(opciones);
            this.container.appendChild(div);
        });
    }

    /**
     * 4. Actualiza la UI (lógica de 'actualizarProgreso')
     */
    actualizarProgreso(progreso) {
        const porc = Math.round(progreso);
        this.progressBar.style.width = `${porc}%`;
        this.progressText.textContent = `Progreso: ${porc}% completado`;
    }

    /**
     * 5. Actualiza los botones (lógica del final de 'mostrarPreguntas')
     */
    actualizarBotones(esPrimera, esUltima) {
        this.prevButton.disabled = esPrimera;
        this.nextButton.textContent = esUltima ? "Finalizar" : "Siguiente";
    }
}