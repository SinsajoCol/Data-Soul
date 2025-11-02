import { jest } from '@jest/globals';
import Cuestionario from '../models/Cuestionario.js';
import { Pregunta } from '../models/Preguntas.js';

describe('Integración Cuestionario-Pregunta', () => {
  test('Debe convertir correctamente los datos JSON a instancias de Pregunta', async () => {
    const fakeJson = [
      { id: 1, texto: 'Soy sociable', rasgo: 'Extroversión', invertida: false },
      { id: 2, texto: 'Me cuesta hablar con otros', rasgo: 'Extroversión', invertida: true }
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fakeJson)
      })
    );

    const cuestionario = new Cuestionario();
    await cuestionario.cargarPreguntas('fake-url.json');

    expect(cuestionario.preguntas[0]).toBeInstanceOf(Pregunta);
    expect(cuestionario.preguntas.length).toBe(2);
    expect(cuestionario.preguntas[1].invertida).toBe(true);
  });
});

