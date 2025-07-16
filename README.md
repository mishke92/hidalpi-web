# HidalPi Web - Sistema de Registro y Agendamiento

Sistema completo de registro de empresas, clientes y agendamiento de citas con backend PHP para XAMPP.

## 🚀 Características

- **Registro de Empresas**: Permite registrar empresas con validación de RUC
- **Registro de Clientes**: Gestión de clientes con validación de documentos (DNI, CE, Pasaporte)
- **Sistema de Agendamiento**: Programación de citas con múltiples estados y prioridades
- **Panel de Administración**: Interfaz web para gestión completa
- **API RESTful**: Endpoints PHP para todas las operaciones CRUD
- **Base de Datos MySQL**: Estructura completa con relaciones y índices
- **Validaciones Robustas**: Validación tanto en frontend como backend
- **Responsive Design**: Interfaz adaptable a dispositivos móviles

## 📋 Requisitos del Sistema

- **XAMPP** (Apache + MySQL + PHP 7.4 o superior)
- **PHP** 7.4 o superior con extensiones:
  - mysqli
  - json
  - filter
- **MySQL** 5.7 o superior / MariaDB 10.2 o superior
- **Navegador Web** moderno (Chrome, Firefox, Safari, Edge)

## 🛠️ Instalación en XAMPP

### Paso 1: Descargar e Instalar XAMPP

1. Descargar XAMPP desde [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. Instalar XAMPP en tu sistema operativo
3. Iniciar el Panel de Control de XAMPP

### Paso 2: Configurar el Proyecto

1. **Copiar archivos del proyecto**:
   ```bash
   # Copiar todo el contenido del proyecto a la carpeta htdocs de XAMPP
   cp -r hidalpi-web/* C:/xampp/htdocs/hidalpi-web/
   ```

2. **Iniciar servicios XAMPP**:
   - Abrir el Panel de Control de XAMPP
   - Iniciar **Apache**
   - Iniciar **MySQL**

### Paso 3: Configurar la Base de Datos

1. **Acceder a phpMyAdmin**:
   - Abrir navegador web
   - Ir a `http://localhost/phpmyadmin`

2. **Crear base de datos**:
   - Importar el archivo `backend/estructura.sql`
   - O ejecutar manualmente:
     ```sql
     CREATE DATABASE hidalpi_web;
     ```
   - Seleccionar la base de datos `hidalpi_web`
   - Ir a la pestaña "Importar"
   - Seleccionar el archivo `backend/estructura.sql`
   - Hacer clic en "Continuar"

### Paso 4: Configurar Conexión a Base de Datos

El archivo `backend/db.php` ya está configurado para XAMPP con valores predeterminados:

```php
$servidor = "localhost";
$usuario = "root";
$password = "";
$base_datos = "hidalpi_web";
```

Si necesitas cambiar estos valores, edita el archivo `backend/db.php`.

### Paso 5: Probar el Sistema

1. **Acceder a la aplicación**:
   - Abrir navegador web
   - Ir a `http://localhost/hidalpi-web/`

2. **Probar formularios de ejemplo**:
   - Ir a `http://localhost/hidalpi-web/public/ejemplo_formularios.html`

## 📁 Estructura del Proyecto

```
hidalpi-web/
├── backend/
│   ├── db.php                    # Configuración de base de datos
│   ├── registrar_empresa.php     # Endpoint para registro de empresas
│   ├── registrar_cliente.php     # Endpoint para registro de clientes
│   ├── agendar.php              # Endpoint para agendamientos
│   └── estructura.sql           # Estructura de base de datos
├── public/
│   ├── ejemplo_formularios.html  # Formularios de ejemplo
│   └── favicon.ico
├── src/                         # Código fuente React (opcional)
├── dist/                        # Build de producción React
└── README.md                    # Este archivo
```

## 🔧 API Endpoints

### Registro de Empresas

**POST** `/backend/registrar_empresa.php`

```json
{
  "nombre": "Estudio Jurídico Ejemplo",
  "ruc": "20123456789",
  "representante_legal": "Dr. Juan Pérez",
  "direccion": "Av. Principal 123",
  "telefono": "01-2345678",
  "email": "info@estudio.com",
  "sector": "Servicios Legales",
  "descripcion": "Estudio jurídico especializado..."
}
```

### Registro de Clientes

**POST** `/backend/registrar_cliente.php`

```json
{
  "nombre": "Ana",
  "apellido": "García",
  "documento": "12345678",
  "tipo_documento": "DNI",
  "direccion": "Jr. Lima 456",
  "telefono": "987654321",
  "email": "ana.garcia@email.com",
  "fecha_nacimiento": "1990-05-15"
}
```

### Gestión de Agendamientos

**POST** `/backend/agendar.php` - Crear agendamiento
```json
{
  "cliente_id": 1,
  "empresa_id": 1,
  "servicio": "Consulta Legal General",
  "fecha_cita": "2024-07-25 10:00:00",
  "estado": "pendiente",
  "prioridad": "media",
  "creado_por_bot": false,
  "observaciones": "Primera consulta"
}
```

**GET** `/backend/agendar.php` - Obtener agendamientos
- Parámetros opcionales: `cliente_id`, `empresa_id`, `estado`, `fecha_desde`, `fecha_hasta`, `limit`, `offset`

**PUT** `/backend/agendar.php?id={id}` - Actualizar agendamiento

**DELETE** `/backend/agendar.php?id={id}` - Eliminar agendamiento

## 🗄️ Estructura de Base de Datos

### Tabla `empresas`
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `nombre` (VARCHAR(255), NOT NULL)
- `ruc` (VARCHAR(20), UNIQUE, NOT NULL)
- `direccion` (TEXT)
- `telefono` (VARCHAR(20))
- `email` (VARCHAR(100))
- `representante_legal` (VARCHAR(255))
- `sector` (VARCHAR(100))
- `descripcion` (TEXT)
- `fecha_registro` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- `estado` (ENUM: 'activa', 'inactiva', DEFAULT 'activa')

### Tabla `clientes`
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `nombre` (VARCHAR(255), NOT NULL)
- `apellido` (VARCHAR(255), NOT NULL)
- `documento` (VARCHAR(20), UNIQUE, NOT NULL)
- `tipo_documento` (ENUM: 'DNI', 'CE', 'pasaporte', DEFAULT 'DNI')
- `direccion` (TEXT)
- `telefono` (VARCHAR(20))
- `email` (VARCHAR(100))
- `fecha_nacimiento` (DATE)
- `fecha_registro` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- `estado` (ENUM: 'activo', 'inactivo', DEFAULT 'activo')

### Tabla `agendamientos`
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `cliente_id` (INT, FOREIGN KEY → clientes.id)
- `empresa_id` (INT, FOREIGN KEY → empresas.id)
- `servicio` (VARCHAR(255), NOT NULL)
- `fecha_cita` (DATETIME, NOT NULL)
- `estado` (ENUM: 'pendiente', 'confirmada', 'cancelada', 'completada', DEFAULT 'pendiente')
- `observaciones` (TEXT)
- `creado_por_bot` (BOOLEAN, DEFAULT FALSE)
- `prioridad` (ENUM: 'baja', 'media', 'alta', DEFAULT 'media')
- `fecha_creacion` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- `fecha_actualizacion` (DATETIME, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)

## 🧪 Pruebas del Sistema

### Pruebas Manuales

1. **Probar Registro de Empresa**:
   ```bash
   curl -X POST http://localhost/hidalpi-web/backend/registrar_empresa.php \
   -H "Content-Type: application/json" \
   -d '{
     "nombre": "Test Empresa",
     "ruc": "20123456789",
     "representante_legal": "Test Representante"
   }'
   ```

2. **Probar Registro de Cliente**:
   ```bash
   curl -X POST http://localhost/hidalpi-web/backend/registrar_cliente.php \
   -H "Content-Type: application/json" \
   -d '{
     "nombre": "Test",
     "apellido": "Cliente",
     "documento": "12345678"
   }'
   ```

3. **Probar Agendamiento**:
   ```bash
   curl -X POST http://localhost/hidalpi-web/backend/agendar.php \
   -H "Content-Type: application/json" \
   -d '{
     "cliente_id": 1,
     "empresa_id": 1,
     "servicio": "Consulta Legal",
     "fecha_cita": "2024-07-25 10:00:00"
   }'
   ```

### Usando la Interfaz Web

1. Ir a `http://localhost/hidalpi-web/public/ejemplo_formularios.html`
2. Completar los formularios de registro
3. Crear agendamientos de prueba
4. Verificar la tabla de agendamientos

## 🔒 Seguridad

- **Validación de entrada**: Todos los datos son validados y sanitizados
- **Prevención de SQL Injection**: Uso de prepared statements
- **CORS habilitado**: Para permitir peticiones desde el frontend
- **Validación de tipos de datos**: Verificación estricta de formatos
- **Logging de errores**: Los errores se registran en el log de PHP

## 🚨 Solución de Problemas

### Error: "No se puede conectar a la base de datos"
1. Verificar que MySQL esté corriendo en XAMPP
2. Verificar que la base de datos `hidalpi_web` existe
3. Verificar credenciales en `backend/db.php`

### Error: "Archivo no encontrado"
1. Verificar que los archivos estén en `C:/xampp/htdocs/hidalpi-web/`
2. Verificar que Apache esté corriendo
3. Verificar la URL en el navegador

### Error: "CORS"
1. Los headers CORS ya están configurados en `backend/db.php`
2. Verificar que esté accediendo desde `http://localhost`

### Error: "Datos no se guardan"
1. Verificar los logs de PHP en `C:/xampp/php/logs/php_error_log`
2. Verificar la consola del navegador para errores JavaScript
3. Verificar que los datos JSON estén bien formateados

## 📞 Datos de Prueba

El sistema incluye datos de ejemplo:

**Empresas**:
- Estudio Jurídico Hidalgo (ID: 1)
- Consultora Legal Perú (ID: 2)

**Clientes**:
- Ana Pérez (ID: 1, DNI: 12345678)
- Carlos Rodríguez (ID: 2, DNI: 87654321)

**Servicios Disponibles**:
- Consulta Legal General
- Asesoría Empresarial
- Redacción de Contratos
- Representación Legal
- Consulta Tributaria

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para la funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📧 Contacto

Para soporte o consultas:
- Email: info@hidalpi.com
- GitHub: [mishke92/hidalpi-web](https://github.com/mishke92/hidalpi-web)

## 🎯 Próximas Funcionalidades

- [ ] Autenticación de usuarios
- [ ] Panel de administración avanzado
- [ ] Notificaciones por email
- [ ] Reportes y estadísticas
- [ ] Integración con calendario
- [ ] API para chatbots
- [ ] Backup automático de datos
- [ ] Soporte multiidioma