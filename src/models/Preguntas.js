export class Pregunta {
  constructor(id, texto, rasgoAsociado, invertida = false) {
    this.id = id;                    // Identificador único
    this.texto = texto;              // Texto de la pregunta
    this.rasgoAsociado = rasgoAsociado; // Rasgo al que pertenece
    this.invertida = invertida;      // Si la escala debe invertirse
  }

  // Método para obtener el valor ajustado si es invertida
  obtenerValorAjustado(valor) {
    return this.invertida ? 6 - valor : valor;  // Ej: 5→1, 4→2, etc.
  }
}