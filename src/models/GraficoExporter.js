/**
 * Renderiza una configuración de Chart.js en un canvas
 * fuera de pantalla (off-screen) y la exporta como imagen.
 */
export class GraficoExporter {

    /**
     * @param {ChartConfig} chartConfig - La configuración de la gráfica
     * @param {number} width - Ancho de la imagen final
     * @param {number} height - Alto de la imagen final
     * @returns {Promise<string>} Una DataURL (base64) de la imagen
     */
    generarImagen(chartConfig, width = 1000, height = 500) {
        
        return new Promise((resolve, reject) => {
            try {
                // 1. Crear canvas temporal
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                
                // (No lo añadimos al DOM)
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    throw new Error("No se pudo obtener el contexto 2D del canvas");
                }

                // 2. Fusionar config con opciones de exportación
                const configFinal = {
                    ...chartConfig,
                    options: {
                        ...chartConfig.options,
                        responsive: false, // Doble seguro
                        animation: {
                            // Usamos onComplete para saber cuándo ha terminado de dibujar
                            onComplete: (animation) => {
                                // 3. Exportar y resolver
                                const dataURL = animation.chart.toBase64Image();
                                resolve(dataURL);
                                
                                // 4. Limpiar (destruir el chart)
                                // (Añadido para evitar memory leaks)
                                setTimeout(() => {
                                   animation.chart.destroy();
                                }, 0);
                            },
                            // Si 'animation' estaba en false, onComplete no se dispara.
                            // Lo forzamos a 'false' en el builder, así que usamos un hack.
                            // PERO, Chart.js v3+ puede necesitar un frame.
                            // Vamos a quitar 'animation: false' del builder y 
                            // depender solo de onComplete.
                        }
                    }
                };
                
                // Si la config original *deshabilitaba* la animación,
                // onComplete no se dispara. Usamos un pequeño delay.
                if (chartConfig.options.animation === false) {
                     const chart = new Chart(ctx, chartConfig);
                     // Hack: esperar un ciclo de renderizado
                     setTimeout(() => {
                        const dataURL = chart.toBase64Image();
                        chart.destroy();
                        resolve(dataURL);
                     }, 100); // 100ms (ajustar si es necesario)

                } else {
                    // Ruta preferida (si la animación está habilitada o por defecto)
                     new Chart(ctx, configFinal);
                }
                
            } catch (error) {
                reject(error);
            }
        });
    }
}