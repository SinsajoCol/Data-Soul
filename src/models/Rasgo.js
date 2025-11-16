export class Rasgo {
    constructor(nombre, valor = 0) {
        if (typeof valor !== 'number' || isNaN(valor)) {
            throw new Error(`El valor para el rasgo '${nombre}' debe ser numérico. Se recibió: ${valor} (tipo: ${typeof valor})`);
        }
        if (valor < 1 || valor > 5) {
            throw new Error(`El valor para el rasgo '${nombre}' debe ser un número entero entre 1 y 5. Se recibió: ${valor}`);
        }
        this.nombre = nombre;
        this.valor = valor;
    }
}