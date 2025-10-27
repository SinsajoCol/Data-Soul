import { AlmacenamientoLocal } from './AlmacenamientoLocal.js';

export class ComparisonStore {
  static instance = null;

  static getInstance() {
    if (!ComparisonStore.instance) {
      ComparisonStore.instance = new ComparisonStore();
    }
    return ComparisonStore.instance;
  }

  constructor() {
    this.comparacionesIndividuales = new Map();
    this.comparacionesMasivas = new Map();
    this.almacenamiento = new AlmacenamientoLocal();
  }

  setComparisonIndividual(key, resultado) {
    this.comparacionesIndividuales.set(key, resultado);
    this.almacenamiento.guardar('comparaciones', {
      individuales: Object.fromEntries(this.comparacionesIndividuales),
      masivas: Object.fromEntries(this.comparacionesMasivas)
    });
  }

  getComparisonIndividual(key) {
    return this.comparacionesIndividuales.get(key);
  }

  setComparisonMasiva(key, resultado) {
    this.comparacionesMasivas.set(key, resultado);
    this.almacenamiento.guardar('comparaciones', {
      individuales: Object.fromEntries(this.comparacionesIndividuales),
      masivas: Object.fromEntries(this.comparacionesMasivas)
    });
  }

  getComparisonMasiva(key) {
    return this.comparacionesMasivas.get(key);
  }
}