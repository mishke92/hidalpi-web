# HidalPi Web - Sistema de Gestión Legal

Sistema integral de gestión para servicios legales que combina un frontend moderno en React con un backend robusto en PHP.

## 🚀 Características Principales

### Frontend (React + Vite)
- **Interfaz moderna** con React 19 y Vite
- **Componentes UI** con Radix UI y Tailwind CSS
- **Routing** con React Router DOM
- **Sistema de citas** interactivo
- **Chatbot integrado** para consultas
- **Área de cliente** personalizada
- **Diseño responsivo** para todos los dispositivos

### Backend (PHP + MySQL)
- **API REST** completa en PHP
- **Base de datos MySQL** con esquema optimizado
- **Sistema de autenticación** con sesiones PHP
- **Panel de administración** avanzado
- **Notificaciones por email** automatizadas
- **Reportes CSV** exportables
- **Integración con calendario** (.ics)
- **API para chatbots** con respuestas inteligentes
- **Backup automático** de datos
- **Soporte multiidioma** (Español/Inglés)

## 📋 Funcionalidades Implementadas

### 1. Autenticación de Usuarios
**Ubicación:** `backend/auth/`
- **Registro de usuarios** con validación de datos
- **Inicio de sesión** con credenciales encriptadas
- **Gestión de sesiones** PHP seguras
- **Middleware de autenticación** para proteger rutas
- **Roles de usuario** (admin/cliente)

**Endpoints:**
- `POST /backend/api/auth.php?action=register` - Registro de usuario
- `POST /backend/api/auth.php?action=login` - Inicio de sesión
- `POST /backend/api/auth.php?action=logout` - Cerrar sesión
- `GET /backend/api/auth.php?action=status` - Estado de sesión

### 2. Panel de Administración Avanzado
**Ubicación:** `backend/admin/`
- **Dashboard interactivo** con estadísticas en tiempo real
- **Gestión de empresas** - Listado, edición y filtrado
- **Gestión de clientes** - Información completa de contactos
- **Gestión de citas** - Estado, programación y seguimiento
- **Gestión de abogados** - Especialidades y disponibilidad
- **Interfaz Bootstrap** responsive y moderna

**Características:**
- Estadísticas en tiempo real
- Tablas interactivas con paginación
- Filtros avanzados
- Navegación por pestañas
- Badges de estado personalizados

### 3. Notificaciones por Email
**Ubicación:** `backend/email/`
- **Confirmación de citas** con plantillas HTML elegantes
- **Recordatorios automáticos** 24 horas antes
- **Notificaciones de cancelación** con información detallada
- **Plantillas responsive** para todos los dispositivos
- **Integración con PHPMailer** (preparada para producción)

**Plantillas incluidas:**
- Confirmación de cita
- Recordatorio de cita
- Cancelación de cita
- Diseño HTML responsive
- Branding personalizado

### 4. Reportes y Estadísticas
**Ubicación:** `backend/api/reports.php`
- **Exportación CSV** de todas las entidades
- **Reporte de empresas** con información completa
- **Reporte de clientes** con datos de contacto
- **Reporte de citas** con estado y detalles
- **Reporte de abogados** con especialidades
- **Reporte de servicios** con estadísticas de uso

**Formatos disponibles:**
- CSV con separador de punto y coma
- Codificación UTF-8
- Headers personalizados
- Nombres de archivo con timestamp

### 5. Integración con Calendario
**Ubicación:** `backend/calendar/`
- **Generación de archivos .ics** compatibles con Google Calendar y Outlook
- **Eventos individuales** por cita
- **Calendarios completos** por cliente o abogado
- **Recordatorios automáticos** 15 minutos antes
- **Información detallada** en cada evento

**Características:**
- Formato iCalendar estándar
- Compatibilidad multiplataforma
- Información de ubicación
- Recordatorios configurables
- Zona horaria local

### 6. API para Chatbots
**Ubicación:** `backend/api/chatbot.php`
- **Procesamiento de lenguaje natural** básico
- **Respuestas inteligentes** sobre empresas, servicios y horarios
- **Información de contacto** automática
- **Búsqueda avanzada** por filtros
- **Formato JSON** estructurado

**Consultas soportadas:**
- Información de empresas
- Servicios disponibles
- Horarios de atención
- Datos de abogados
- Precios y tarifas
- Información de contacto
- Proceso de citas

### 7. Backup Automático de Datos
**Ubicación:** `backend/backup/`
- **Respaldo completo** (estructura + datos)
- **Respaldo de datos** solamente
- **Respaldo de estructura** sin datos
- **Generación automática** con mysqldump
- **Fallback en PHP** si mysqldump no está disponible
- **Gestión de archivos** con limpieza automática

**Funcionalidades:**
- Archivos SQL comprimidos
- Registro de respaldos en BD
- Descarga directa desde admin
- Limpieza automática de antiguos
- Formato de nombres con timestamp

### 8. Soporte Multiidioma
**Ubicación:** `backend/lang/`
- **Español e Inglés** completamente implementados
- **Sistema de traducciones** con archivos PHP
- **Detección automática** del idioma del navegador
- **Formateo de fechas** según idioma
- **Formateo de números** y monedas
- **API para JavaScript** con traducciones

**Características:**
- Archivos organizados por idioma
- Función helper global `__()`
- Placeholders dinámicos
- Formateo localizado
- Fácil extensión a nuevos idiomas

## 🗄️ Estructura de Base de Datos

### Tablas Principales
- **usuarios** - Gestión de usuarios del sistema
- **empresas** - Información de bufetes y firmas
- **abogados** - Datos de profesionales
- **clientes** - Información de contactos
- **servicios** - Catálogo de servicios legales
- **citas** - Agendamiento y seguimiento
- **sesiones** - Gestión de sesiones activas
- **respaldos** - Registro de backups

### Relaciones
- Clientes ↔ Citas (1:N)
- Abogados ↔ Citas (1:N)
- Empresas ↔ Abogados (1:N)
- Servicios ↔ Citas (1:N)
- Usuarios ↔ Sesiones (1:N)

## 🔧 Instalación y Configuración

### Requisitos Previos
- PHP 7.4 o superior
- MySQL 5.7 o superior
- Apache/Nginx
- Node.js 16+ (para frontend)

### Configuración del Backend
1. **Configurar base de datos:**
   ```bash
   mysql -u root -p < backend/database/schema.sql
   ```

2. **Configurar conexión:**
   Editar `backend/config/database.php` con tus credenciales

3. **Configurar email:**
   Editar `backend/email/EmailService.php` con tus datos SMTP

### Configuración del Frontend
1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

3. **Compilar para producción:**
   ```bash
   npm run build
   ```

## 🔐 Seguridad

- **Autenticación basada en sesiones** PHP
- **Contraseñas encriptadas** con bcrypt
- **Validación de datos** en todos los endpoints
- **Protección CSRF** con tokens
- **Sanitización de SQL** con prepared statements
- **Validación de permisos** en rutas protegidas

## 📊 Monitoreo y Logs

- **Registro de errores** en logs PHP
- **Seguimiento de sesiones** en base de datos
- **Métricas de uso** en dashboard
- **Respaldos automáticos** programados
- **Alertas de sistema** por email

## 🚀 Próximas Funcionalidades

- [ ] Notificaciones push en tiempo real
- [ ] Integración con redes sociales
- [ ] Sistema de facturación
- [ ] Chat en vivo
- [ ] Aplicación móvil
- [ ] Integración con firmas digitales
- [ ] Sistema de comentarios
- [ ] Métricas avanzadas

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama para nueva funcionalidad
3. Commit de cambios
4. Push a la rama
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Soporte

Para soporte técnico o consultas:
- Email: info@hidalpi.com
- Teléfono: +57 1 234 5678
- GitHub Issues: [Crear issue](https://github.com/mishke92/hidalpi-web/issues)

## 📈 Versión

**Versión actual:** 1.0.0
- ✅ Sistema completo de gestión legal
- ✅ Frontend React moderno
- ✅ Backend PHP robusto
- ✅ Base de datos MySQL optimizada
- ✅ Sistema de autenticación
- ✅ Panel de administración
- ✅ Notificaciones por email
- ✅ Reportes CSV
- ✅ Integración con calendario
- ✅ API para chatbots
- ✅ Backup automático
- ✅ Soporte multiidioma

---

**Desarrollado con ❤️ para HidalPi Web**