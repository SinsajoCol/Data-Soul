import AlmacenamientoLocal from '../models/AlmacenamientoLocal.js';
import DatosIndividuales from './DatosIndividuales.js';
import DatosPoblacion from './DatosPoblacion.js';

export default class Resultados {
  static instance = null;

  constructor() {
    this.individuales = {};
    this.poblaciones = {};
    this.cargarDeLocalStorage();
  }

  static getInstance() {
    if (!Resultados.instance) {
      Resultados.instance = new Resultados();
    }
    return Resultados.instance;
  }

  agregarResultadoIndividual(individuo) {
    this.individuales[individuo.usuarioId] = individuo;
  }

  agregarResultadosPoblacion(grupo) {
    this.poblaciones[grupo.nombreGrupo] = grupo;
  }

  guardarEnLocalStorage() {
    const data = {
      individuales: Object.values(this.individuales),
      poblaciones: Object.values(this.poblaciones)
    };
    localStorage.setItem("resultados", JSON.stringify(data));
  }

  cargarDeLocalStorage() {
    const datos = AlmacenamientoLocal.cargar("resultados");
    if (datos) {
      this.individuales = {};
      this.poblaciones = {};
      for (const indPojo of datos.individuales || []) {
        const individuo = DatosIndividuales.fromJSON(indPojo);
        this.individuales[individuo.usuarioId] = individuo;
      }
      for (const pobPojo of datos.poblaciones || []) {
        const grupo = DatosPoblacion.fromJSON(pobPojo);
        this.poblaciones[grupo.nombreGrupo] = grupo;
      }
    }
  }

  limpiar() {
    this.individuales = {};
    this.poblaciones = {};
    localStorage.removeItem("resultados");
  }
}
