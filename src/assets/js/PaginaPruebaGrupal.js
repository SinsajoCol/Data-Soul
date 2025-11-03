import { PaginaTemplate } from "./PaginaTemplate.js";
import CargaMasivaController from "../../controllers/CargaMasivaController.js";

export class PaginaPruebaGrupal extends PaginaTemplate {

  async mostrarContenido() {
    const response = await fetch("/src/pages/PruebaGrupal.html");
    if (!response.ok) {
      console.error("❌ No se pudo cargar PruebaGrupal.html:", response.status);
      return "<p>Error cargando la página.</p>";
    }
    const html = await response.text();
    return html;
  }

  despuesDeCargar() {
    console.log("📄 PaginaPruebaGrupal inicializada.");

    const botonImportar = document.querySelector(".boton-importar");
    if (!botonImportar) {
      console.error("❌ No se encontró el botón .boton-importar en el DOM.");
      return;
    }

    // Crear input oculto
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = ".xlsx,.csv";
    inputFile.style.display = "none";
    botonImportar.parentNode.appendChild(inputFile);

    // Crear instancia del controlador
    const controller = new CargaMasivaController();

    // Evento: abrir explorador
    botonImportar.addEventListener("click", () => {
      console.log("📁 Botón Importar presionado");
      inputFile.value = "";
      inputFile.click();
    });

    // Evento: archivo seleccionado
    inputFile.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) {
        console.warn("⚠️ No se seleccionó ningún archivo.");
        return;
      }

      console.log("📄 Archivo seleccionado:", file.name);
      if (controller.manejarArchivoSubido) {
        const grupo = await controller.manejarArchivoSubido(file);
        if (grupo) alert("✅ Archivo procesado correctamente: " + grupo.nombreGrupo);
      } else if (controller.procesarArchivo) {
        await controller.procesarArchivo(file);
      } else {
        alert("⚠️ El controlador no tiene un método de carga definido.");
      }
    });
  }
}
