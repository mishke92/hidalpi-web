-- Base de datos para el sistema de agendamiento de Hidalpi & Asociados
-- Importar este archivo en phpMyAdmin para crear la estructura de la base de datos

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS hidalpi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hidalpi_db;

-- Tabla de empresas
CREATE TABLE IF NOT EXISTS empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    ruc VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    contacto_principal VARCHAR(255),
    sector VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activa', 'inactiva', 'suspendida') DEFAULT 'activa',
    INDEX idx_ruc (ruc),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    dni VARCHAR(20) UNIQUE,
    direccion TEXT,
    fecha_nacimiento DATE,
    genero ENUM('masculino', 'femenino', 'otro'),
    empresa_id INT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_dni (dni),
    INDEX idx_empresa (empresa_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de agendamientos
CREATE TABLE IF NOT EXISTS agendamientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    empresa_id INT,
    fecha_cita DATETIME NOT NULL,
    duracion_minutos INT DEFAULT 60,
    servicio VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
    prioridad ENUM('baja', 'media', 'alta') DEFAULT 'media',
    modalidad ENUM('presencial', 'virtual', 'telefonica') DEFAULT 'presencial',
    ubicacion VARCHAR(255),
    url_reunion VARCHAR(500),
    creado_por_bot BOOLEAN DEFAULT FALSE,
    sitio_origen VARCHAR(100),
    notas_adicionales TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    recordatorio_enviado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    INDEX idx_fecha_cita (fecha_cita),
    INDEX idx_cliente (cliente_id),
    INDEX idx_empresa (empresa_id),
    INDEX idx_estado (estado),
    INDEX idx_creado_por_bot (creado_por_bot)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de historial de cambios (opcional, para auditoría)
CREATE TABLE IF NOT EXISTS historial_cambios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tabla_afectada VARCHAR(50) NOT NULL,
    registro_id INT NOT NULL,
    accion ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    datos_anteriores JSON,
    datos_nuevos JSON,
    usuario VARCHAR(255),
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tabla_registro (tabla_afectada, registro_id),
    INDEX idx_fecha (fecha_cambio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo
INSERT INTO empresas (nombre, ruc, email, telefono, direccion, contacto_principal, sector) VALUES
('Hidalpi & Asociados', '20123456789', 'info@hidalpi.com', '+51-1-234-5678', 'Av. Principal 123, Lima, Perú', 'Dr. Juan Hidalpi', 'Servicios Legales'),
('Empresa Demo S.A.C.', '20987654321', 'demo@empresa.com', '+51-1-987-6543', 'Calle Secundaria 456, Lima, Perú', 'María González', 'Comercial');

INSERT INTO clientes (nombre, apellido, email, telefono, dni, direccion, fecha_nacimiento, genero, empresa_id) VALUES
('Carlos', 'Mendoza', 'carlos.mendoza@email.com', '+51-999-123-456', '12345678', 'Jr. Los Olivos 789, Lima', '1985-03-15', 'masculino', 2),
('Ana', 'Rodriguez', 'ana.rodriguez@email.com', '+51-999-987-654', '87654321', 'Av. Las Flores 321, Lima', '1990-07-22', 'femenino', NULL);

INSERT INTO agendamientos (cliente_id, empresa_id, fecha_cita, servicio, descripcion, estado, modalidad, creado_por_bot, sitio_origen) VALUES
(1, 1, '2024-02-15 10:00:00', 'Consulta Legal', 'Consulta sobre contratos comerciales', 'pendiente', 'presencial', FALSE, 'web'),
(2, 1, '2024-02-16 14:30:00', 'Asesoría Tributaria', 'Revisión de declaración anual', 'confirmada', 'virtual', TRUE, 'chatbot');