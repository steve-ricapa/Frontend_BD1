/**
 * Configuración de Base de Datos
 * Esta configuración está destinada para uso en backend o herramientas de conectividad.
 * La conexión directa desde el navegador no es segura ni soportada nativamente.
 */

export const DB_CONFIG = {
    host: "localhost",
    port: 5433,
    user: "postgres",
    password: "postgres",
    database: "proyecto_bd",
};

// Implementación interna para mantener la funcionalidad vía API (Backend local)
const db = {
    query: async (sql, params = []) => {
        try {
            const response = await fetch('http://localhost:3000/api/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: sql, params }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Throw error with backend message
                throw new Error(data.error || 'Error en la consulta');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};

export async function query(sql, params) {
    try {
        // Invocamos la implementación interna (que conecta al backend)
        const result = await db.query(sql, params);
        return result;
    } catch (error) {
        console.error("Error ejecutando consulta:", error);
        throw error;
    }
}

// Exportamos db para mantener compatibilidad con el código existente
export { db };
