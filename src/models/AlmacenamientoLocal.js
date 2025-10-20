class AlmacenamientoLocal {
    static guardar(clave, valor) {
        try {
            localStorage.setItem(clave, JSON.stringify(valor));
        }
        catch (error) {
            console.error("Error al guardar en localStorage:", error);
        }
    }
    static cargar(clave) {
        try {
            const data = localStorage.getItem(clave);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error("Error al cargar desde localStorage:", error);
            return null;
        }
    }
    static eliminar(clave) {
        try {
            localStorage.removeItem(clave);
        } catch (error) {
            console.error("Error al eliminar de localStorage:", error);
        }
    }
    static limpiartodo() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error("Error al limpiar localStorage:", error);
        }
    }
}