# Sistema de Banca por Internet

Aplicación web de banca por internet construida con React, Vite, TailwindCSS y PostgreSQL.

## 📋 Requisitos Previos

- **Node.js** (versión 16 o superior)
- **PostgreSQL** instalado y corriendo
- **npm** (viene con Node.js)

## 🗄️ Configuración de la Base de Datos

1. Asegúrate de que PostgreSQL esté corriendo en tu máquina
2. Crea la base de datos `proyecto_bd`
3. Configura las credenciales en el archivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=proyecto_bd
```

**Nota:** Ajusta estos valores según tu configuración de PostgreSQL.

## 🚀 Instalación

1. **Instalar dependencias:**
```bash
npm install
```

## ▶️ Cómo Levantar la Aplicación

### Opción 1: Usando dos terminales (Recomendado)

**Terminal 1 - Backend:**
```bash
node server.js
```
Deberías ver:
```
Backend server running at http://localhost:3000
Connected to PostgreSQL database
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Deberías ver:
```
VITE v6.4.1  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Opción 2: Instrucciones paso a paso

1. **Inicia el servidor backend:**
   - Abre una terminal en la carpeta del proyecto
   - Ejecuta: `node server.js`
   - ✅ Debe mostrar "Connected to PostgreSQL database"

2. **Inicia el servidor frontend:**
   - Abre OTRA terminal en la misma carpeta
   - Ejecuta: `npm run dev`
   - ✅ Debe mostrar la URL local (http://localhost:5173/)

3. **Abre el navegador:**
   - Ve a: `http://localhost:5173/`

## 🛑 Cómo Detener la Aplicación

- **En cada terminal:** Presiona `Ctrl + C`
- O simplemente cierra las terminales

## 📱 Uso de la Aplicación

### Portal de Cliente

1. Ve a la página principal
2. Click en "Cliente"
3. Ingresa un DNI (puedes usar los DNIs sugeridos)
4. Navega por:
   - **Portal**: Dashboard con cuentas y últimos movimientos
   - **Transferencias**: Realiza transferencias entre cuentas
   - **Movimientos**: Historial completo de transacciones
   - **Cuentas**: Detalle de tus cuentas
   - **Préstamos**: Tus préstamos activos

### Portal Administrativo

1. Ve a la página principal
2. Click en "Administrador"
3. Funciones disponibles:
   - Ver todas las transacciones (con paginación)
   - Buscar transacciones por ID de cliente
   - Ver top cuentas por sucursal
   - Filtrar por sucursal

## 🔧 Estructura del Proyecto

```
frontend_BD/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/         # Páginas de la aplicación
│   ├── lib/           # Utilidades (db.js)
│   └── main.jsx       # Punto de entrada
├── server.js          # Servidor backend de Node.js
├── .env               # Configuración de base de datos
└── package.json       # Dependencias
```

## ⚠️ Importante

- **El backend DEBE estar corriendo** para que el frontend funcione
- Si ves errores de conexión, asegúrate de que:
  1. PostgreSQL esté corriendo
  2. Las credenciales en `.env` sean correctas
  3. La base de datos `proyecto_bd` exista
  4. El backend (`node server.js`) esté activo

## 🔐 Seguridad

**ADVERTENCIA:** El endpoint `/api/query` es genérico y solo debe usarse en desarrollo. Para producción, implementa rutas API específicas y validación de entrada.

## 📊 Funcionalidades

✅ Login de clientes con DNI  
✅ Dashboard con resumen de cuentas  
✅ Transferencias entre cuentas  
✅ Historial de movimientos  
✅ Gestión de préstamos  
✅ Portal administrativo con paginación  
✅ Búsqueda de transacciones  
✅ Visualización de top cuentas  
✅ Datos en tiempo real desde PostgreSQL  

## 📝 Notas Adicionales

- Todas las fechas se muestran en formato español (dd/mm/aaaa)
- Las transferencias se detectan automáticamente como entrada o salida
- Los montos se formatean con 2 decimales
- La paginación en admin muestra 20 registros por página

---

Para cualquier problema, verifica los logs en las terminales del backend y frontend.
