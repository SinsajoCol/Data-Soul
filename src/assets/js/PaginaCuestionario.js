import { PaginaTemplate } from "./PaginaTemplate.js";

export class PaginaCuestionario extends PaginaTemplate {
  async mostrarContenido() {
    const response = await fetch("/src/pages/PruebaIndividual.html");
    const html = await response.text();
    return html;
  }

  async despuesDeCargar() {
    inicializarCuestionario();
  }
}

function inicializarCuestionario() {
  
  const preguntas = [
  { id: 1, texto: "Soy una persona conversadora." },
  { id: 2, texto: "Soy una persona que tiende a encontrar defectos en los demás." },
  { id: 3, texto: "Soy alguien que hace un trabajo minucioso." },
  { id: 4, texto: "Soy una persona que está deprimida y triste." },
  { id: 5, texto: "Soy una persona original que aporta ideas nuevas." },
  { id: 6, texto: "Soy una persona reservada." },
  { id: 7, texto: "Soy una persona servicial y desinteresada con los demás." },
  { id: 8, texto: "Soy una persona que puede ser algo descuidada." },
  { id: 9, texto: "Soy una persona relajada y que maneja bien el estrés." },
  { id: 10, texto: "Soy una persona curiosa que siente curiosidad por muchas cosas diferentes." },
  { id: 11, texto: "Soy una persona llena de energía." },
  { id: 12, texto: "Soy alguien que inicia peleas con los demás." },
  { id: 13, texto: "Soy una persona trabajadora y confiable." },
  { id: 14, texto: "Soy una persona que puede estar tensa." },
  { id: 15, texto: "Soy una persona ingeniosa y de pensamiento profundo." },
  { id: 16, texto: "Soy alguien que genera mucho entusiasmo." },
  { id: 17, texto: "Soy una persona que tiene una naturaleza perdonadora." },
  { id: 18, texto: "Soy una persona que tiende a ser desorganizada." },
  { id: 19, texto: "Soy una persona que se preocupa mucho." },
  { id: 20, texto: "Soy alguien que tiene una imaginación activa." },
  { id: 21, texto: "Soy una persona que tiende a ser tranquila." },
  { id: 22, texto: "Soy una persona generalmente confiada." },
  { id: 23, texto: "Soy una persona que tiende a ser perezosa." },
  { id: 24, texto: "Soy una persona emocionalmente estable y no me altero fácilmente." },
  { id: 25, texto: "Soy una persona inventiva." },
  { id: 26, texto: "Soy una persona que tiene una personalidad asertiva." },
  { id: 27, texto: "Soy alguien que puede ser frío y distante." },
  { id: 28, texto: "Soy alguien que persevera hasta terminar la tarea." },
  { id: 29, texto: "Soy una persona que puede estar de mal humor." },
  { id: 30, texto: "Soy alguien que valora las experiencias artísticas y estéticas." },
  { id: 31, texto: "Soy una persona a veces tímida, inhibida." },
  { id: 32, texto: "Soy una persona considerada y amable con casi todo el mundo." },
  { id: 33, texto: "Soy alguien que hace las cosas eficientemente." },
  { id: 34, texto: "Soy una persona que mantiene la calma en situaciones tensas." },
  { id: 35, texto: "Soy alguien que prefiere el trabajo que sea rutinario." },
  { id: 36, texto: "Soy una persona extrovertida y sociable." },
  { id: 37, texto: "Soy una persona que a veces es grosera con los demás." },
  { id: 38, texto: "Soy alguien que hace planes y los lleva a cabo." },
  { id: 39, texto: "Soy una persona que se pone nerviosa fácilmente." },
  { id: 40, texto: "Soy alguien a quien le gusta reflexionar, jugar con las ideas." },
  { id: 41, texto: "Soy alguien que tiene pocos intereses artísticos." },
  { id: 42, texto: "Soy alguien a quien le gusta cooperar con los demás." },
  { id: 43, texto: "Soy una persona que se distrae fácilmente." },
  { id: 44, texto: "Soy alguien sofisticado en el arte, la música o la literatura." },
  { id: 45, texto: "La gente me ve como un líder natural." },
  { id: 46, texto: "Tengo un talento natural para persuadir a la gente." },
  { id: 47, texto: "Entretengo a la gente con mis chistes e historias." },
  { id: 48, texto: "Las actividades de grupo tienden a ser aburridas sin mí." },
  { id: 49, texto: "Sé que soy especial porque la gente me lo sigue diciendo." },
  { id: 50, texto: "Tengo una serie de cualidades excepcionales." },
  { id: 51, texto: "Me gusta presumir de vez en cuando." },
  { id: 52, texto: "Odio ser el centro de atención." },
  { id: 53, texto: "Soy solo una persona promedio." },
  { id: 54, texto: "Probablemente me convertiré en una futura estrella en algún área." },
  { id: 55, texto: "Si alguien me falta el respeto, lo critico inmediatamente." },
  { id: 56, texto: "Me aburro fácilmente cuando otras personas hablan." },
  { id: 57, texto: "No es prudente dejar que la gente conozca tus secretos." },
  { id: 58, texto: "Me gusta usar la manipulación inteligente para lograr lo que quiero." },
  { id: 59, texto: "Cueste lo que cueste, debes conseguir que la gente importante esté de tu lado." },
  { id: 60, texto: "Evite los conflictos con los demás porque pueden ser útiles en el futuro." },
  { id: 61, texto: "Es aconsejable recopilar información que luego pueda utilizarse contra las personas." },
  { id: 62, texto: "Deberías esperar el momento adecuado para vengarte de la gente." },
  { id: 63, texto: "El secreto para manipular a la gente es una planificación cuidadosa." },
  { id: 64, texto: "Debes ser completamente honesto con todas las personas que conozcas." },
  { id: 65, texto: "Mantén un perfil bajo (permanece encubierto) si quieres salirte con la tuya." },
  { id: 66, texto: "La adulación es una buena forma de conseguir que la gente esté de tu lado." },
  { id: 67, texto: "Me encanta cuando un plan complicado tiene éxito." },
  { id: 68, texto: "La mayoría de las personas no pueden ser engañadas con palabras inteligentes." },
  { id: 69, texto: "Es probable que lastime a las personas que se interpongan en mi camino." },
  { id: 70, texto: "Tengo tendencia a rebelarme contra las autoridades y sus reglas." },
  { id: 71, texto: "El sexo casual (sin compromiso) suena divertido." },
  { id: 72, texto: "Evito situaciones peligrosas." },
  { id: 73, texto: "La venganza debe ser rápida y desagradable." },
  { id: 74, texto: "La gente suele decir que estoy fuera de control." },
  { id: 75, texto: "La gente que se mete conmigo siempre se arrepiente." },
  { id: 76, texto: "Nunca he tenido problemas con la ley." },
  { id: 77, texto: "Después de tener sexo con alguien, no es necesario seguir en contacto." },
  { id: 78, texto: "Diré cualquier cosa para conseguir lo que quiero." },
  { id: 79, texto: "Si puedo conseguir algo sin esfuerzo lo tomo." },
  { id: 80, texto: "He estado en más peleas físicas que la mayoría de la gente." },
  { id: 81, texto: "Es cierto que puedo ser malo con los demás." },
  { id: 82, texto: "Disfruto mucho de las películas y los videojuegos violentos." },
  { id: 83, texto: "Me gusta trollear a la gente en los sitios de Internet." },
  { id: 84, texto: "Me gusta hacerle bromas desagradables a la gente." },
  { id: 85, texto: "Es divertido burlarse de alguien y ver cómo se enoja." },
  { id: 86, texto: "Es gracioso cuando los perdedores caen de bruces." },
  { id: 87, texto: "Ver una pelea a puñetazos me emociona." },
  { id: 88, texto: "No quisiera herir los sentimientos de nadie a propósito." },
  { id: 89, texto: "Disfruto viendo deportes violentos." },
  { id: 90, texto: "Ser malo con los demás puede ser divertido." },
  { id: 91, texto: "Robar la pareja romántica de otra persona sería divertido." },
  { id: 92, texto: "Sé cómo herir a alguien sólo con palabras." }
];
// Configuración de paginación
const preguntasPorPagina = 5;
let paginaActual = 0;

// ✅ Cargar respuestas guardadas o inicializar objeto vacío

let respuestas = JSON.parse(localStorage.getItem("respuestas")) || {};

const contenedor = document.getElementById("questions-container");
const progress = document.getElementById("progress");
const boton_prev = document.getElementById("prev");
const boton_Next = document.getElementById("next");


function mostrarPreguntas() {
  // Limpiar contenedor
  contenedor.innerHTML = "";
  const inicio = paginaActual * preguntasPorPagina;
  const fin = inicio + preguntasPorPagina;
  const grupo = preguntas.slice(inicio, fin);

  grupo.forEach((p) => {

    // crear un div para cada pregunta
    const div = document.createElement("div");
    //agregar clase preguntas
    div.classList.add("preguntas");
    //insertar el texto en h3 de la pregunta "id. texto"
    div.innerHTML = `<h4>${p.id}. ${p.texto}</h4>`;
    //crea el div para las opciones
    const opciones = document.createElement("div");
    opciones.classList.add("opciones");
    //crear botones del 1 al 5
    for (let i = 1; i <= 5; i++) {
      //crea el div de la opcion
      const opcion = document.createElement("div");
      opcion.classList.add("opcion");
      //crea el boton
      const button = document.createElement("button");

      //Si ya hay respuesta guardada local, marcarla
      if (respuestas[p.id] === i) {
        button.classList.add("selected");
      }

      //si se da click en el boton, guardar la respuesta y marcar el boton
      button.onclick = () => {
        guardarRespuesta(p.id, i);
        opciones.querySelectorAll("button").forEach((b) => b.classList.remove("selected"));
        button.classList.add("selected");
      };

      opcion.appendChild(button);
      opciones.appendChild(opcion);
    }

    div.appendChild(opciones);
    contenedor.appendChild(div);
  });

  actualizarProgreso();
  boton_prev.disabled = paginaActual === 0;
  boton_Next.textContent = fin >= preguntas.length ? "Finalizar" : "Siguiente";
}

function guardarRespuesta(id, valor) {
  respuestas[id] = valor;
  localStorage.setItem("respuestas", JSON.stringify(respuestas));
}

function actualizarProgreso() {

  const progreso = (Object.keys(respuestas).length / preguntas.length) * 100;
  progress.style.width = `${progreso}%`;
  document.getElementById("progress-text").textContent = `Progreso: ${Math.round(progreso)}% completado`;

}


boton_Next.addEventListener("click", () => {
  const fin = (paginaActual + 1) * preguntasPorPagina;
  if (fin >= preguntas.length) {
    alert("¡Test completado! Los resultados se han guardado.");
    window.location.href = "resultados.html";
  } else {
    paginaActual++;
    mostrarPreguntas();
  }
});

boton_prev.addEventListener("click", () => {
  paginaActual--;
  mostrarPreguntas();
});

mostrarPreguntas();
}