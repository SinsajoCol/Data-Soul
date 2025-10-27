export class Cuestionario {
  constructor(nombre) {
    this.nombre = nombre;       // Nombre del cuestionario
    this.preguntas = [];        // Lista de objetos Pregunta
  }

  // Cargar preguntas desde un archivo JSON
  async cargarPreguntas(rutaArchivo) {
    const resp = await fetch(rutaArchivo);
    const datos = await resp.json();

    // Se asume que el JSON tiene [{id, texto, rasgo, invertida}]
    this.preguntas = datos.map(
      p => new Pregunta(p.id, p.texto, p.rasgo, p.invertida)
    );
  }

  // Implementación del patrón Iterator
  [Symbol.iterator]() {
    let index = 0;
    const preguntas = this.preguntas;

    return {
      next() {
        if (index < preguntas.length) {
          return { value: preguntas[index++], done: false };
        } else {
          return { done: true };
        }
      }
    };
  }

  // Obtener una pregunta específica
  obtenerPreguntaPorId(id) {
    return this.preguntas.find(p => p.id === id);
  }

  // Total de preguntas
  cantidadPreguntas() {
    return this.preguntas.length;
  }
}