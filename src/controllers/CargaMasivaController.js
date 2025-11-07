// Importa los Modelos que SÍ necesita
import { DatosIndividuales } from "../models/DatosIndividuales.js";
import { DatosPoblacion } from "../models/DatosPoblacion.js";
import Resultados from "../models/Resultados.js"; // El Singleton
import ProcesadorPsicometrico from "../models/ProcesadorPsicometrico.js";
import CuestionarioModel from "../models/Cuestionario.js";

const ruta = "src/data/cuestionario.json";


// Tu mapa de Likert sí es útil aquí para parsear
const likertMap = {
    "totalmente en desacuerdo": 1,
    "en desacuerdo": 2,
    "neutral": 3,
    "de acuerdo": 4,
    "totalmente de acuerdo": 5
};

export class CargaMasivaController {

    constructor(view) {
        this.view = view;
        this.model = new CuestionarioModel();
        this.resultados = Resultados.getInstance();
        this.procesador = new ProcesadorPsicometrico();
        
        // Aquí guardaremos las definiciones de preguntas (del JSON)
        this.definicionesPreguntas = []; 
    }

    async iniciar() {
        this.view.conectarDOM();
        this.view.onImportClick = this._limpiarDatosAntiguos.bind(this);
        this.view.onFileSelected = this.manejarArchivoSubido.bind(this);
        this.view.bindEvents();

        // Carga el 'cuestionario.json' para mapear las cabeceras del CSV
        try {
            await this.cargarDefinicionesPreguntas(ruta);
            console.log("Controlador de Carga Masiva iniciado correctamente.");
        } catch (error) {
            this.view.mostrarError("Error fatal: No se pudieron cargar las definiciones de preguntas.");
        }
    }

    async cargarDefinicionesPreguntas(url) {
        try {
            // 1. Llama al método del modelo y ESPERA a que termine.
            // (Este método hace el fetch y rellena 'this.model.preguntas')
          await this.model.cargarPreguntas(url); 

            // 2. Ahora que el modelo está cargado, copia el array de preguntas
            //    a la propiedad de ESTE controlador.
          this.definicionesPreguntas = this.model.preguntas;
          console.log("Preguntas cargadas desde el modelo:", this.definicionesPreguntas);
          console.log("Definiciones de preguntas cargadas para mapeo.");

        } catch (error) {
            console.error("Error en cargarDefinicionesPreguntas:", error);
            throw error; // Lanza el error para que 'iniciar' lo atrape
        }
    }

    /**
     * Se llama cuando la Vista confirma que un archivo fue seleccionado
     * @param {File} file El archivo .csv o .xlsx
     */
    async manejarArchivoSubido(file) {
        if (!file) {
            this.view.mostrarError("No se seleccionó ningún archivo.");
            return;
        }
        
        const ext = file.name.split('.').pop().toLowerCase();
        let datosRaw = []; // Esto será un array de arrays, ej: [ [...headers], [...row1], [...row2] ]

        try {
            if (ext === "xlsx" || ext === "xls") {
                datosRaw = await this._leerExcel(file);
            } else if (ext === "csv") {
                datosRaw = await this._leerCSV(file);
            } else {
                throw new Error("Solo se admiten archivos XLSX o CSV");
            }

            if (!Array.isArray(datosRaw) || datosRaw.length < 2) {
                throw new Error("El archivo está vacío o no tiene datos. La poblacion minima debe ser de 30 participantes.");
            }

            const grupo = this._procesarDatos(datosRaw);
            // 1. Guarda el grupo en el Singleton
            this.resultados.agregarResultadosPoblacion(grupo);
            
            console.log("Grupo poblacional procesado:", grupo);

            // 2. Muestra solo el mensaje de éxito en la vista actual
            this.view.mostrarResultados(grupo.lista.length);

            // 3. ¡NUEVO! Navega a la página de comparación
            // Pasa el nombre del grupo en el hash para que la otra
            // página sepa qué grupo cargar.
            //window.location.hash = `comparacion/${grupo.nombreGrupo}`;

        } catch (error) {
            console.error("Error al procesar el archivo:", error);
            this.view.mostrarError(`Error: ${error.message}`);
        }
    }

    /**
     * Parsea los datos crudos, calcula rasgos y retorna un DatosPoblacion
     * @param {Array<Array<string>>} data - Array de filas (incluyendo cabecera)
     */
    _procesarDatos(data) {
      const [headers, ...respuestasFilas] = data;

      const normalizeText = (str) => {
          if (typeof str !== 'string') return '';
          return str.trim().replace(/\.$/, '').toLowerCase();
      };

      // Normaliza las cabeceras del CSV UNA SOLA VEZ
      const normalizedHeaders = headers.map(h => normalizeText(h));

      const mapeoColumnas = [];
      
      // --- DEBUG ---
      const preguntasNoEncontradas = []; // Array para guardar las fallas

      this.definicionesPreguntas.forEach(preguntaJSON => {
          const textoJSONNormalizado = normalizeText(preguntaJSON.texto);
          
          // Busca el índice de esta pregunta en las cabeceras normalizadas
          const csvIndex = normalizedHeaders.indexOf(textoJSONNormalizado);

          if (csvIndex !== -1) {
              // ¡Encontrado!
              mapeoColumnas.push({ csvIndex: csvIndex, pregunta: preguntaJSON });
          } else {
              // ¡NO ENCONTRADO!
              preguntasNoEncontradas.push(preguntaJSON.texto);
          }
      });
      // --- FIN DEL DEBUG ---
      if (mapeoColumnas.length <= 92) { // O un número mínimo que esperes
          console.warn("Mapeo parcial: ", mapeoColumnas.length, "de", this.definicionesPreguntas.length, "preguntas mapeadas.");
      }

      if (mapeoColumnas.length === 0) {
          throw new Error("No se pudo mapear ninguna columna. Asegúrate de que las cabeceras del archivo coincidan con la plantilla.");
      }

      // 2. Procesar cada fila (cada usuario)
      const grupoPoblacion = new DatosPoblacion('grupo_' + Date.now());
      
      respuestasFilas.forEach((fila, rowIndex) => {
        if (fila.length === 0) return; // Ignorar filas vacías
        
        const respuestasUsuario = {}; // {id: valor}

        // Construye el objeto de respuestas para este usuario
        mapeoColumnas.forEach(map => {
            const id = map.pregunta.id;
            let valor = fila[map.csvIndex]; // Valor de la celda

            if (typeof valor === 'string') {
                // Intenta convertir texto (ej. "de acuerdo") a número
                valor = likertMap[valor.toLowerCase().trim()] || Number(valor);
            }
            
            if (typeof valor === 'number' && !isNaN(valor)) {
                respuestasUsuario[id] = valor;
            }
        });
          // 3. Calcular rasgos
          const rasgosObjeto = this.procesador.calcularRasgos(this.definicionesPreguntas, respuestasUsuario);

          // 4. Crear 'DatosIndividuales'
          const usuarioId = `usuario_${rowIndex + 1}`;
          const individuo = new DatosIndividuales(usuarioId, rasgosObjeto);
          
          // 5. Añadir al grupo
          grupoPoblacion.agregar(individuo);
      });

      if (grupoPoblacion.lista.length === 0) {
          throw new Error("Se leyó el archivo, pero no se pudo procesar ningún participante.");
      }

      return grupoPoblacion;
    }

    // --- Métodos para leer archivos ---
    // (Estos métodos dependen de librerías externas)

    async _leerExcel(file) {
        if (typeof XLSX === 'undefined') {
            this.view.mostrarError("La librería de Excel (XLSX) no está cargada.");
            throw new Error("Librería XLSX no encontrada.");
        }
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const wb = XLSX.read(e.target.result, { type: 'binary' });
                    const ws = wb.Sheets[wb.SheetNames[0]];
                    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                    resolve(data);
                } catch (err) { reject(err); }
            };
            reader.onerror = (err) => reject(err);
            reader.readAsBinaryString(file);
        });
    }

    async _leerCSV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const csv = e.target.result;
                    // Un parser de CSV simple (esto puede fallar con comas dentro de comillas)
                    const rows = csv.split("\n").map(line => line.split(",").map(val => val.trim().replace(/^"|"$/g, '')));
                    resolve(rows);
                } catch (err) { reject(err); }
            };
            reader.onerror = (err) => reject(err);
            reader.readAsText(file, 'UTF-8'); // Especificar encoding
        });
    }

    _limpiarDatosAntiguos() {
      this.resultados.limpiarResultadosPoblacion();
    }
}