-- Estructura de base de datos para el sistema HidalPi Web
-- Compatible con MySQL 5.7+ y MariaDB 10.2+

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS hidalpi_web;
USE hidalpi_web;

-- Configurar charset
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Tabla para empresas
CREATE TABLE IF NOT EXISTS empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    ruc VARCHAR(20) UNIQUE NOT NULL,
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100),
    representante_legal VARCHAR(255),
    sector VARCHAR(100),
    descripcion TEXT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activa', 'inactiva') DEFAULT 'activa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    documento VARCHAR(20) UNIQUE NOT NULL,
    tipo_documento ENUM('DNI', 'CE', 'pasaporte') DEFAULT 'DNI',
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100),
    fecha_nacimiento DATE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para agendamientos
CREATE TABLE IF NOT EXISTS agendamientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    empresa_id INT,
    servicio VARCHAR(255) NOT NULL,
    fecha_cita DATETIME NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
    observaciones TEXT,
    creado_por_bot BOOLEAN DEFAULT FALSE,
    prioridad ENUM('baja', 'media', 'alta') DEFAULT 'media',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    
    INDEX idx_fecha_cita (fecha_cita),
    INDEX idx_estado (estado),
    INDEX idx_cliente (cliente_id),
    INDEX idx_empresa (empresa_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para servicios (opcional, para normalizar servicios)
CREATE TABLE IF NOT EXISTS servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    duracion_minutos INT DEFAULT 60,
    precio DECIMAL(10,2),
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para historial de cambios en agendamientos
CREATE TABLE IF NOT EXISTS historial_agendamientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    agendamiento_id INT,
    estado_anterior ENUM('pendiente', 'confirmada', 'cancelada', 'completada'),
    estado_nuevo ENUM('pendiente', 'confirmada', 'cancelada', 'completada'),
    observaciones TEXT,
    fecha_cambio DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (agendamiento_id) REFERENCES agendamientos(id) ON DELETE CASCADE,
    INDEX idx_agendamiento (agendamiento_id),
    INDEX idx_fecha_cambio (fecha_cambio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo para empresas
INSERT INTO empresas (nombre, ruc, direccion, telefono, email, representante_legal, sector, descripcion) VALUES
('Estudio Jurídico Hidalgo', '20123456789', 'Av. Arequipa 123, Lima', '01-2345678', 'info@hidalgolegal.com', 'Dr. Juan Hidalgo', 'Servicios Legales', 'Estudio jurídico especializado en derecho corporativo y civil'),
('Consultora Legal Perú', '20987654321', 'Jr. Cusco 456, Lima', '01-8765432', 'contacto@consultoralperu.com', 'Dra. María García', 'Consultoría Legal', 'Consultoría especializada en derecho laboral y tributario');

-- Insertar datos de ejemplo para servicios
INSERT INTO servicios (nombre, descripcion, duracion_minutos, precio) VALUES
('Consulta Legal General', 'Consulta general sobre temas legales', 60, 150.00),
('Asesoría Empresarial', 'Asesoría especializada para empresas', 90, 250.00),
('Redacción de Contratos', 'Redacción y revisión de contratos', 120, 300.00),
('Representación Legal', 'Representación en procesos legales', 180, 500.00),
('Consulta Tributaria', 'Asesoría en temas tributarios', 75, 200.00);

-- Insertar datos de ejemplo para clientes
INSERT INTO clientes (nombre, apellido, documento, tipo_documento, direccion, telefono, email, fecha_nacimiento) VALUES
('Ana', 'Pérez', '12345678', 'DNI', 'Av. Javier Prado 789, Lima', '987654321', 'ana.perez@email.com', '1990-05-15'),
('Carlos', 'Rodríguez', '87654321', 'DNI', 'Jr. Amazonas 321, Lima', '987123456', 'carlos.rodriguez@email.com', '1985-08-22');

-- Insertar datos de ejemplo para agendamientos
INSERT INTO agendamientos (cliente_id, empresa_id, servicio, fecha_cita, estado, observaciones, creado_por_bot, prioridad) VALUES
(1, 1, 'Consulta Legal General', '2024-07-20 10:00:00', 'pendiente', 'Primera consulta del cliente', FALSE, 'media'),
(2, 1, 'Asesoría Empresarial', '2024-07-21 14:30:00', 'confirmada', 'Asesoría para constitución de empresa', FALSE, 'alta'),
(1, 2, 'Consulta Tributaria', '2024-07-22 09:00:00', 'pendiente', 'Consulta sobre declaración de impuestos', TRUE, 'baja');

-- Activar las restricciones de clave foránea
SET FOREIGN_KEY_CHECKS = 1;

-- Crear índices adicionales para mejorar rendimiento
CREATE INDEX idx_empresas_ruc ON empresas(ruc);
CREATE INDEX idx_clientes_documento ON clientes(documento);
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_empresas_email ON empresas(email);

-- Crear vista para consultas complejas de agendamientos
CREATE VIEW vista_agendamientos AS
SELECT 
    a.id,
    a.fecha_cita,
    a.servicio,
    a.estado,
    a.observaciones,
    a.creado_por_bot,
    a.prioridad,
    CONCAT(c.nombre, ' ', c.apellido) as cliente_nombre,
    c.documento as cliente_documento,
    c.telefono as cliente_telefono,
    c.email as cliente_email,
    e.nombre as empresa_nombre,
    e.telefono as empresa_telefono,
    e.email as empresa_email
FROM agendamientos a
JOIN clientes c ON a.cliente_id = c.id
JOIN empresas e ON a.empresa_id = e.id;

-- Mensaje de confirmación
SELECT 'Base de datos hidalpi_web creada correctamente con datos de ejemplo' as mensaje;