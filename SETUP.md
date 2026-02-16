# Guía de Configuración Segura - HidalPi Web

## 🚀 Inicio Rápido

### Requisitos Previos
- PHP 7.4 o superior
- MySQL 5.7 o superior  
- Node.js 16+
- Apache/Nginx
- Composer (opcional, para PHPMailer)

---

## 📝 Configuración Paso a Paso

### 1. Clonar el Repositorio
```bash
git clone https://github.com/mishke92/hidalpi-web.git
cd hidalpi-web
```

### 2. Configurar Variables de Entorno

#### Backend (.env)
```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

Editar `.env` con tus credenciales:
```env
# Database Configuration
DB_HOST=localhost
DB_NAME=hidalpi_web
DB_USER=root
DB_PASSWORD=tu_contraseña_segura

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password
SMTP_FROM_EMAIL=noreply@hidalpi.com
SMTP_FROM_NAME="HidalPi Web"

# Application Configuration
APP_ENV=development
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# Security
SESSION_SECURE=false  # Cambiar a true en producción con HTTPS
SESSION_HTTPONLY=true
SESSION_SAMESITE=Strict

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8000
```

#### Frontend (.env.local)
```bash
# Copiar el archivo de ejemplo
cp .env.example.frontend .env.local
```

Editar `.env.local`:
```env
VITE_API_URL=http://localhost:8000/backend
```

**⚠️ IMPORTANTE**: Nunca comitear los archivos `.env` o `.env.local` al repositorio.

---

### 3. Configurar Base de Datos

```bash
# Crear la base de datos e importar el schema
mysql -u root -p < backend/database/schema.sql
```

Esto creará:
- Base de datos `hidalpi_web`
- Todas las tablas necesarias
- Datos de prueba
- Usuario administrador por defecto

**Credenciales por defecto**:
- Email: `admin@hidalpi.com`
- Password: `password` (⚠️ Cambiar inmediatamente)

---

### 4. Instalar Dependencias del Frontend

```bash
npm install
```

---

### 5. Iniciar la Aplicación

#### Opción A: Desarrollo Local

**Frontend** (Terminal 1):
```bash
npm run dev
# Se abre en http://localhost:5173
```

**Backend** (Terminal 2):
```bash
# Si tienes PHP instalado
php -S localhost:8000

# O usar tu servidor web (Apache/Nginx)
```

#### Opción B: Build de Producción

```bash
# Compilar frontend
npm run build

# Los archivos compilados estarán en dist/
# Configurar tu servidor web para servir desde dist/
```

---

## 🔒 Configuración de Seguridad

### Para Desarrollo
Ya está configurado con valores seguros. Solo asegúrate de:
- ✅ No compartir tu archivo `.env`
- ✅ Usar contraseñas fuertes en la base de datos
- ✅ Mantener actualizado el archivo `.gitignore`

### Para Producción

#### 1. Actualizar Variables de Entorno
```env
APP_ENV=production
SESSION_SECURE=true  # Requiere HTTPS
ALLOWED_ORIGINS=https://tudominio.com
```

#### 2. Habilitar HTTPS
En Apache, configurar VirtualHost:
```apache
<VirtualHost *:443>
    ServerName tudominio.com
    DocumentRoot /var/www/hidalpi-web
    
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
    
    # Redirigir todo el tráfico HTTP a HTTPS
</VirtualHost>

<VirtualHost *:80>
    ServerName tudominio.com
    Redirect permanent / https://tudominio.com/
</VirtualHost>
```

#### 3. Permisos de Archivos
```bash
# Permisos recomendados
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;

# Solo backend/backup/respaldos necesita escritura
chmod 755 backend/backup/respaldos
```

#### 4. Configurar MySQL Seguro
```sql
-- Crear usuario con privilegios limitados
CREATE USER 'hidalpi_user'@'localhost' IDENTIFIED BY 'contraseña_segura';
GRANT SELECT, INSERT, UPDATE, DELETE ON hidalpi_web.* TO 'hidalpi_user'@'localhost';
FLUSH PRIVILEGES;
```

Actualizar `.env`:
```env
DB_USER=hidalpi_user
DB_PASSWORD=contraseña_segura
```

---

## 🧪 Testing

### Linting
```bash
npm run lint
```

### Build
```bash
npm run build
```

### Vista Previa de Producción
```bash
npm run preview
```

---

## 🔍 Verificación de Seguridad

### Checklist Post-Configuración

#### Backend
- [ ] `.env` no está en el repositorio
- [ ] Credenciales de BD son seguras y únicas
- [ ] SMTP configurado con App Password (no contraseña real)
- [ ] `SESSION_SECURE=true` en producción
- [ ] HTTPS habilitado en producción

#### Frontend
- [ ] `.env.local` no está en el repositorio
- [ ] `VITE_API_URL` apunta a la URL correcta
- [ ] Build de producción funciona (`npm run build`)

#### Base de Datos
- [ ] Usuario administrador con contraseña cambiada
- [ ] Usuario de BD con privilegios limitados
- [ ] Backups configurados

### Pruebas de Seguridad

1. **Verificar CORS**:
```bash
curl -H "Origin: http://sitio-malicioso.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS http://localhost:8000/backend/api/auth.php
```
Debería rechazar el origen no autorizado.

2. **Verificar Path Traversal**:
```bash
curl "http://localhost:8000/backend/backup/backup.php?action=descargar&filename=../../etc/passwd"
```
Debería retornar error "Nombre de archivo inválido".

3. **Verificar Rate Limiting**:
Intentar login 6 veces consecutivas con credenciales incorrectas.
La sexta solicitud debería retornar error 429.

---

## 📚 Estructura del Proyecto

```
hidalpi-web/
├── backend/
│   ├── admin/              # Panel de administración
│   ├── api/                # Endpoints API REST
│   ├── auth/               # Sistema de autenticación
│   ├── backup/             # Sistema de respaldos
│   ├── calendar/           # Integración con calendario
│   ├── config/             # Configuración (DB, Security, Env)
│   ├── database/           # Schemas SQL
│   ├── email/              # Servicio de email
│   └── lang/               # Soporte multiidioma
├── src/
│   ├── components/         # Componentes React
│   ├── pages/              # Páginas de la aplicación
│   ├── utils/              # Utilidades (API, validación)
│   ├── hooks/              # Custom hooks
│   └── lib/                # Librerías y configuración
├── public/                 # Archivos estáticos
├── .env                    # Variables de entorno backend (NO COMITEAR)
├── .env.local              # Variables de entorno frontend (NO COMITEAR)
├── .env.example            # Plantilla de variables backend
├── .env.example.frontend   # Plantilla de variables frontend
├── SECURITY_FIXES.md       # Detalles técnicos de correcciones
├── PROBLEMS_REPORT.md      # Reporte completo de problemas
└── SETUP.md                # Este archivo
```

---

## 🆘 Solución de Problemas

### Error: "Cannot connect to database"
- Verificar que MySQL esté corriendo
- Verificar credenciales en `.env`
- Verificar que la base de datos existe

### Error: "CORS error" en el navegador
- Verificar que `ALLOWED_ORIGINS` incluye el origen del frontend
- Verificar que ambos servidores están corriendo

### Error: "Module not found" en Node
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Session not working"
- Verificar que PHP tiene permisos de escritura en directorio de sesiones
- Verificar que las cookies no están siendo bloqueadas

---

## 📄 Documentación Adicional

- **[README.md](./README.md)**: Descripción general del proyecto
- **[SECURITY_FIXES.md](./SECURITY_FIXES.md)**: Correcciones de seguridad implementadas
- **[PROBLEMS_REPORT.md](./PROBLEMS_REPORT.md)**: Reporte detallado de problemas

---

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

---

## 📞 Soporte

- **Email**: info@hidalpi.com
- **Issues**: [GitHub Issues](https://github.com/mishke92/hidalpi-web/issues)

---

**Última Actualización**: 2026-02-16  
**Versión**: 1.0
