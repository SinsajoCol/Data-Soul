export default class DatosIndividuales {
  constructor(usuarioId, respuestas) {
    this.usuarioId = usuarioId;
    this.respuestas = respuestas;
  }

  static fromPlantilla(registro) {
    const usuarioId = registro["Correo institucional recomendado"] || registro["ID"] || Math.random().toString(36).slice(2);
    const respuestas = {};
    for (const clave in registro) {
      if (clave !== "Correo institucional recomendado" && clave !== "Marca temporal") {
        respuestas[clave] = parseFloat(registro[clave]) || 0;
      }
    }
    return new DatosIndividuales(usuarioId, respuestas);
  }

  obtenerPuntaje(rasgoNombre) {
    return this.respuestas[rasgoNombre] || 0;
  }

  toJSON() {
    return { usuarioId: this.usuarioId, respuestas: this.respuestas };
  }

  static fromJSON(data) {
    return new DatosIndividuales(data.usuarioId, data.respuestas);
  }
}
