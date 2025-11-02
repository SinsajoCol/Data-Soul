import { Pregunta } from '../models/Preguntas.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { jest } from '@jest/globals';

// Verifica desde dónde Jest ejecuta el test (útil para depurar rutas)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log('Ejecutando desde:', __dirname);

describe('Clase Pregunta', () => {
  test('Debe devolver el mismo valor si no está invertida', () => {
    const pregunta = new Pregunta(1, 'Soy organizado', 'Responsabilidad', false);
    const resultado = pregunta.obtenerValorAjustado(4);
    expect(resultado).toBe(4); // No invertida
  });

  test('Debe invertir correctamente el valor si es invertida', () => {
    const pregunta = new Pregunta(2, 'Me cuesta concentrarme', 'Responsabilidad', true);
    const resultado = pregunta.obtenerValorAjustado(5);
    expect(resultado).toBe(1); // Invertida: 5 → 1
  });
});

