import { calcularRasgosDePlantilla } from "../models/ProcesadorPsicometrico.js";
import Resultados from "../models/Resultados.js";
import { DatosPoblacion } from "../models/DatosPoblacion.js";
import { DatosIndividuales } from "../models/DatosIndividuales.js";

const likertMap = {
  "totalmente en desacuerdo": 1,
  "en desacuerdo": 2,
  "neutral": 3,
  "de acuerdo": 4,
  "totalmente de acuerdo": 5
};

const BigFiveMap = {
  "Extraversión": { items: [1, 6, 11, 16, 21, 26, 31, 36], invertir: [6, 21, 31] },
  "Amabilidad": { items: [2, 7, 12, 17, 22, 27, 32, 37, 42], invertir: [2, 12, 27, 37] },
  "Responsabilidad": { items: [3, 8, 13, 18, 23, 28, 33, 38, 43], invertir: [8, 18, 23, 43] },
  "Neuroticismo": { items: [4, 9, 14, 19, 24, 29, 34, 39], invertir: [9, 24, 34] },
  "Apertura": { items: [5, 10, 15, 20, 25, 30, 35, 40, 41, 44], invertir: [35, 41] }
};

const DarkTriadMap = {
  "Narcisismo": { items: range(45, 56), invertir: [52, 53] },
  "Maquiavelismo": { items: range(57, 68), invertir: [64, 68] },
  "Psicopatía": { items: range(69, 80), invertir: [72, 76] },
  "Sadismo": { items: range(81, 92), invertir: [88] }
};

function range(start, end) {
  return Array.from({ length: (end - start + 1) }, (_, i) => i + start);
}

function obtenerDimensionPorPregunta(idx) {
  for (const [dim, info] of Object.entries(BigFiveMap)) {
    if (info.items.includes(idx)) return dim;
  }
  for (const [dim, info] of Object.entries(DarkTriadMap)) {
    if (info.items.includes(idx)) return dim;
  }
  return null;
}

export default class CargaMasivaController {
  constructor() {
    this.resultados = Resultados.getInstance();
  }

  async manejarArchivoSubido(file) {
    if (!file) return alert("Selecciona un archivo válido");
    const ext = file.name.split('.').pop().toLowerCase();
    let datosRaw = [];

    if (ext === "xlsx" || ext === "xls") {
      datosRaw = await this._leerExcel(file);
    } else if (ext === "csv") {
      datosRaw = await this._leerCSV(file);
    } else {
      alert("Solo se admiten archivos XLSX o CSV");
      return;
    }
    if (!Array.isArray(datosRaw) || datosRaw.length === 0) return;

    const grupo = this._procesarRespuestasGrupo(datosRaw);

    if (!grupo || grupo.nombreGrupo === "Archivo no compatible") {
      alert("El archivo no es compatible con el formato esperado.");
      return;
    }

    this.resultados.agregarResultadosPoblacion(grupo);
    this.resultados.guardarEnLocalStorage();

    return grupo;
  }

  async _leerExcel(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(e.target.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        resolve(data);
      };
      reader.readAsBinaryString(file);
    });
  }

  async _leerCSV(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target.result;
        const rows = csv.split("\n").map(line => line.split(";").map(val => val.trim()));
        resolve(rows);
      };
      reader.readAsText(file);
    });
  }

  _procesarRespuestasGrupo(data) {
    const encabezadoEsperado = "Soy una persona conversadora.";
    const [headers, ...respuestas] = data;
    const idxInicio = headers.findIndex(h => typeof h === 'string' && h.trim().startsWith(encabezadoEsperado));
    if (idxInicio === -1) {
      return new DatosPoblacion("Archivo no compatible");
    }
    const correoIdx = headers.findIndex(h => typeof h === 'string' && h.toLowerCase().includes("correo"));
    const nombreGrupo = "Grupo_" + new Date().toISOString().slice(0, 10);
    const grupo = new DatosPoblacion(nombreGrupo);

    const allInvertidos = new Set();
    Object.values(BigFiveMap).forEach(m => m.invertir.forEach(i => allInvertidos.add(i)));
    Object.values(DarkTriadMap).forEach(m => m.invertir.forEach(i => allInvertidos.add(i)));

    for (let i = 0; i < respuestas.length; i++) {
      const fila = respuestas[i];
      if (fila.length < idxInicio + 1) continue;

      let respuestasUsuario = fila.slice(idxInicio).map((valor, idx) => {
        const preguntaIndex = idx + 1;
        const dimension = obtenerDimensionPorPregunta(preguntaIndex);
        const invertida = allInvertidos.has(preguntaIndex);
        let respNum = valor;
        if (typeof valor === 'string') respNum = likertMap[valor.toLowerCase()] || null;
        return {
          id: String(preguntaIndex),
          texto: headers[idxInicio + idx],
          dimension,
          respuesta: respNum,
          invertida,
        };
      }).filter(p => p.dimension !== null);

      const rasgosInstancia = calcularRasgosDePlantilla(respuestasUsuario);

      console.log(`\n======= Persona #${i + 1} =======`);
      for (const rasgo of rasgosInstancia.listaRasgos) {
        console.log(`Rasgo: ${rasgo.nombre} - Valor: ${rasgo.valor}`);
      }
    }
    return grupo;
  }
}
