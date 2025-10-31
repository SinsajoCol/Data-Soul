import AlmacenamientoLocal from "../models/AlmacenamientoLocal.js";
import { Pregunta } from "../models/Preguntas.js";

export default class Cuestionario {
  constructor() { 
    this.preguntas = [];        // Lista de objetos Pregunta
    this.respuestas = {};       // Objeto para almacenar respuestas 
    this.preguntasPorPagina = 5
    this.storageKey = "respuestas"
    this.paginaActual = 0;
  }

  // Cargar preguntas desde un archivo JSON
  async cargarPreguntas(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const rawPreguntas = await res.json(); // Carga el JSON crudo
        // 4. Convierte los datos crudos en instancias de Pregunta
        this.preguntas = rawPreguntas.map(p => 
            new Pregunta(p.id, p.texto, p.rasgo, p.invertida)
        );

    } catch (error) {
        console.error("No se pudieron cargar las preguntas:", error);
    }
  }

  cargarRespuestas() {
        this.respuestas = AlmacenamientoLocal.cargar(this.storageKey) || {};
  }

  guardarRespuesta(id, valor) {
      this.respuestas[id] = valor;
      AlmacenamientoLocal.guardar(this.storageKey, this.respuestas);
  }

  getProgreso() {
      // ... (código idéntico de antes) ...
      if (this.preguntas.length === 0) return 0;
      return (Object.keys(this.respuestas).length / this.preguntas.length) * 100;
  }

  // --- Métodos del Iterador/Paginación ---
  getRespuestas() {
        return this.respuestas;
    }

  currentGroup() {
      const inicio = this.paginaActual * this.preguntasPorPagina;
      const fin = inicio + this.preguntasPorPagina;
      return this.preguntas.slice(inicio, fin); // Devuelve 5 objetos Pregunta
  }
  
  nextGroup() {
      if (!this.esPaginaFinal()) {
          this.paginaActual++;
      }
  }
  
  prevGroup() {
      if (!this.esPaginaInicial()) {
          this.paginaActual--;
      }
  }

  esPaginaInicial() {
      return this.paginaActual === 0;
  }

  esPaginaFinal() {
      const totalPaginas = Math.ceil(this.preguntas.length / this.preguntasPorPagina);
      return this.paginaActual >= totalPaginas - 1;
  }
}