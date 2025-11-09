# 05 Funcionamiento del sistema

### Flujo de datos

1. **Usuario no técnico**: El usuario selecciona “Prueba Individual” → responde el cuestionario → se ejecuta el cálculo del puntaje en el navegador → se compara con los perfiles de LLM → se muestra el dashboard de resultados → opción de descarga en PDF.
2. **Investigador**: El investigador carga archivo Excel/CSV → el sistema valida y procesa el archivo (hasta \~50 personas) → calcula puntajes promedio del grupo → compara con los perfiles de LLM → genera visualización grupal → descarga en PDF.

### Módulos principales

* **Modelo :**
* **Controlador:**
* **Vista:**







### Reglas de negocio importantes

* No se almacena datos personales en servidores externos; todo se maneja en el navegador.
* El procesamiento del cuestionario individual debe completarse en ≤ 3 s.
* El procesamiento grupal (hasta \~50 personas) debe completarse en ≤ 10 s.
* El archivo de carga Excel/CSV no debe superar 5 MB y debe respetar la plantilla oficial.
* Los PDFs generados no deben exceder 5 MB y cumplen con estándares de portabilidad.
