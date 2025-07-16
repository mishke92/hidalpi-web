# Hidalpi & Asociados - Sistema Web

Sistema web integral para el buffet de abogados Hidalpi & Asociados, que incluye frontend en React y backend en PHP para gestión de empresas, clientes y agendamientos.

## Características

- **Frontend**: Aplicación React con Vite, componentes modernos y diseño responsivo
- **Backend**: API REST en PHP para gestión de datos
- **Base de datos**: MySQL con estructura optimizada
- **Agendamientos**: Sistema completo con soporte para bots
- **Formularios**: Ejemplos de integración con AJAX

## Instalación y Configuración

### Requisitos Previos

- [XAMPP](https://www.apachefriends.org/es/index.html) (Apache, MySQL, PHP)
- [Node.js](https://nodejs.org/) (v16 o superior)
- [npm](https://www.npmjs.com/) o [pnpm](https://pnpm.io/)

### 1. Configuración del Backend (XAMPP)

1. **Instalar y ejecutar XAMPP**
   ```bash
   # Descargar XAMPP e instalar
   # Iniciar Apache y MySQL desde el panel de control
   ```

2. **Crear la base de datos**
   - Abrir phpMyAdmin en `http://localhost/phpmyadmin`
   - Crear una nueva base de datos llamada `hidalpi_db`
   - Importar el archivo `backend/estructura.sql` en la base de datos

3. **Configurar el directorio web**
   ```bash
   # Copiar el proyecto al directorio htdocs de XAMPP
   cp -r /ruta/del/proyecto /xampp/htdocs/hidalpi-web
   ```

4. **Verificar la configuración**
   - Editar `backend/db.php` si es necesario para ajustar la configuración de la base de datos
   - Por defecto está configurado para XAMPP:
     - Host: `localhost`
     - Usuario: `root`
     - Contraseña: `` (vacía)
     - Base de datos: `hidalpi_db`

### 2. Configuración del Frontend

1. **Instalar dependencias**
   ```bash
   cd /ruta/del/proyecto
   npm install
   # o si usas pnpm
   pnpm install
   ```

2. **Ejecutar el servidor de desarrollo**
   ```bash
   npm run dev
   # o
   pnpm dev
   ```

3. **Compilar para producción**
   ```bash
   npm run build
   # o
   pnpm build
   ```

## Estructura del Proyecto

```
hidalpi-web/
├── backend/                    # Backend PHP
│   ├── db.php                 # Conexión a base de datos
│   ├── registrar_empresa.php  # Endpoint para registrar empresas
│   ├── registrar_cliente.php  # Endpoint para registrar clientes
│   ├── agendar.php           # Endpoint para crear agendamientos
│   └── estructura.sql        # Estructura de la base de datos
├── public/                    # Archivos públicos
│   ├── ejemplo_formularios.html # Formularios de prueba
│   └── favicon.ico
├── src/                       # Código fuente React
│   ├── components/           # Componentes reutilizables
│   ├── pages/               # Páginas principales
│   ├── hooks/               # Hooks personalizados
│   ├── lib/                 # Utilidades
│   └── assets/              # Imágenes y recursos
├── dist/                     # Compilado de producción
├── package.json
├── vite.config.js
└── README.md
```

## Uso de la API Backend

### Endpoints Disponibles

#### 1. Registrar Empresa
```
POST /backend/registrar_empresa.php
Content-Type: application/json

{
  "nombre": "Empresa Ejemplo S.A.C.",
  "ruc": "20123456789",
  "email": "empresa@ejemplo.com",
  "telefono": "+51-1-234-5678",
  "direccion": "Av. Ejemplo 123, Lima",
  "contacto_principal": "Juan Pérez",
  "sector": "Comercial"
}
```

#### 2. Registrar Cliente
```
POST /backend/registrar_cliente.php
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan.perez@ejemplo.com",
  "telefono": "+51-999-123-456",
  "dni": "12345678",
  "direccion": "Calle Ejemplo 456, Lima",
  "fecha_nacimiento": "1990-01-15",
  "genero": "masculino",
  "empresa_id": 1
}
```

#### 3. Crear Agendamiento
```
POST /backend/agendar.php
Content-Type: application/json

{
  "cliente_id": 1,
  "empresa_id": 1,
  "fecha_cita": "2024-02-15 10:00:00",
  "duracion_minutos": 60,
  "servicio": "Consulta Legal",
  "descripcion": "Consulta sobre contratos",
  "prioridad": "media",
  "modalidad": "presencial",
  "ubicacion": "Oficina principal",
  "creado_por_bot": false,
  "sitio_origen": "web",
  "notas_adicionales": "Cliente preferente"
}
```

### Respuestas de la API

Todas las respuestas tienen el formato:
```json
{
  "success": true/false,
  "message": "Mensaje descriptivo",
  "data": { /* datos adicionales si aplica */ }
}
```

## Pruebas

### Formularios de Prueba

1. **Acceder a los formularios**
   ```
   http://localhost/hidalpi-web/public/ejemplo_formularios.html
   ```

2. **Probar los endpoints**
   - Registrar una empresa
   - Registrar un cliente
   - Crear un agendamiento

### Verificación de la Base de Datos

1. Abrir phpMyAdmin: `http://localhost/phpmyadmin`
2. Seleccionar la base de datos `hidalpi_db`
3. Verificar que los datos se insertan correctamente en las tablas

## Integración con Bots

El sistema está preparado para recibir agendamientos de bots:

1. **Campo `creado_por_bot`**: Marcar como `true` cuando un bot crea la cita
2. **Campo `sitio_origen`**: Especificar el origen (web, chatbot, app_movil, telefono)
3. **Validaciones**: El sistema valida horarios disponibles y datos requeridos

### Ejemplo de petición de bot:

```javascript
fetch('http://localhost/hidalpi-web/backend/agendar.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    cliente_id: 1,
    fecha_cita: '2024-02-15 14:00:00',
    servicio: 'Consulta Legal',
    descripcion: 'Consulta solicitada via chatbot',
    modalidad: 'virtual',
    url_reunion: 'https://meet.google.com/abc-def-ghi',
    creado_por_bot: true,
    sitio_origen: 'chatbot'
  })
})
```

## Desarrollo

### Comandos Útiles

```bash
# Desarrollo del frontend
npm run dev

# Linting
npm run lint

# Compilación
npm run build

# Vista previa de producción
npm run preview
```

### Configuración de CORS

El archivo `backend/db.php` incluye configuración CORS para permitir peticiones desde el frontend React en desarrollo.

## Troubleshooting

### Problemas Comunes

1. **Error de conexión a la base de datos**
   - Verificar que MySQL esté ejecutándose en XAMPP
   - Revisar configuración en `backend/db.php`

2. **Error 404 al acceder a la API**
   - Verificar que Apache esté ejecutándose
   - Comprobar que el proyecto esté en el directorio correcto de htdocs

3. **Problemas de CORS**
   - Verificar que las cabeceras CORS estén configuradas en `backend/db.php`
   - Usar el dominio correcto en las peticiones

4. **Errores de validación**
   - Revisar que los datos enviados cumplan con los formatos requeridos
   - Consultar las respuestas de error de la API

## Licencia

Este proyecto es privado y pertenece a Hidalpi & Asociados.