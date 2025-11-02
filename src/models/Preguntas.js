export class Pregunta {
  constructor(id, texto, rasgoAsociado, invertida = false) {
    this.id = id;                    // Identificador único
    this.texto = texto;              // Texto de la pregunta
    this.rasgoAsociado = rasgoAsociado; // Rasgo al que pertenece
    this.invertida = invertida;
  }

  // Método para obtener el valor ajustado si es invertida
  obtenerValorAjustado(respuesta) {
    return this.invertida ? 6 - respuesta : respuesta;  // Ej: 5→1, 4→2, etc.
  }
}