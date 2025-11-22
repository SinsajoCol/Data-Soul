export class PruebaGrupalView {
    constructor() {
        this.botonImportar = null;
        this.inputFile = null;
        this.resultsContainer = null;
        this.onFileSelected = null; // Callback para el Controlador
        this.onImportClick = null;
    }

    conectarDOM() {
        this.botonImportar = document.querySelector(".boton-importar");
        this.inputFile = document.getElementById("inputArchivo");
        this.resultsContainer = document.querySelector(".prueba-grupal-container"); // Contenedor para mostrar msjs
        
        if (!this.botonImportar || !this.inputFile) {
            console.error("❌ No se encontraron los botones .boton-importar o #inputArchivo.");
        }
    }

    bindEvents() {
        // Evento: clic en el botón "Importar"
        this.botonImportar.addEventListener("click", (e) => {
            e.preventDefault();
            
            // 2a. Llama al callback del controlador PRIMERO
            if (this.onImportClick) {
                this.onImportClick();
            }

            // 2b. LUEGO abre el explorador de archivos
            console.log("📁 Botón Importar presionado, abriendo explorador...");
            this.inputFile.value = ""; 
            this.inputFile.click(); 
        });

        // Evento: el usuario selecciona un archivo
        this.inputFile.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file && this.onFileSelected) {
                console.log("📄 Archivo seleccionado:", file.name);
                this.onFileSelected(file); // Llama al handler del Controlador
            }
        });
    }

    mostrarResultados(totalParticipantes) {
        alert(`¡Procesamiento Exitoso! Se procesaron ${totalParticipantes} respuestas.`);
    }

    mostrarError(mensaje) {
        this.mostrarMensaje(mensaje, "error");
        alert(mensaje); // También muestra un alert para mayor visibilidad
    }
    
    mostrarMensaje(mensaje, tipo = "exito") {
        let msgElement = this.resultsContainer.querySelector(".mensaje-procesamiento");
        if (!msgElement) {
            msgElement = document.createElement("p");
            msgElement.className = "mensaje-procesamiento";
            this.resultsContainer.appendChild(msgElement);
        }
        msgElement.className = `mensaje-procesamiento ${tipo}`;
        msgElement.textContent = mensaje;
    }
}