# 04 Arquitectura del Sistema

### Descripción general

El sistema sigue una **arquitectura monolítica enfocada a cliente,** basada en el patrón arquitectónico **MVC (Modelo-Vista-Controlador)**.

### Tecnologías

* Frontend: HTML, CSS, JavaScript.
* Backend: JavaScript (Full JS).
* Herramientas: Git & GitHub para control de versiones.

### Estructura del repositorio

📂 proyecto-psicometria-llm\
├── 📂 docs/ # Documentación\
├── 📂 LLM-Evaluate-TRAIT/ # Pruebas LLM\
├── 📂 src/ # Código fuente\
│ ├── 📂 assets/ # Recursos\
│ ├── 📂 data/ # Datos y resultados\
│ ├── 📂 controllers/ # Lógica JS\
│ ├── 📂 models/ # Modelos\
│ ├── 📂 views/ # Vistas\
│ └── 📂 pages/ # Páginas\
├── 📂 test/ # Pruebas\
├── 📂 templates/ # Plantillas Excel\
├── .gitignore\
├── README.md\
└── LICENSE

### Componentes clave

* **Frontend**: Maneja la UI y carga de archivos.
* **Backend**: Procesa datos y genera PDF.
* **Integración LLM**: Evalúa modelos en /test/.

(Añade diagramas: Usa herramientas como Draw.io y sube imágenes de los diagramas del README, como "Flujo de Ramas - Git Flow").
