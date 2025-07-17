-- Esquema de base de datos para HidalPi Web
-- Database schema for HidalPi Web

CREATE DATABASE IF NOT EXISTS hidalpi_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hidalpi_web;

-- Tabla de usuarios del sistema
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('admin', 'cliente') DEFAULT 'cliente',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de empresas/bufetes
CREATE TABLE IF NOT EXISTS empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    nit VARCHAR(50) UNIQUE,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    ciudad VARCHAR(100),
    departamento VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'Colombia',
    sitio_web VARCHAR(200),
    descripcion TEXT,
    servicios_principales TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de abogados
CREATE TABLE IF NOT EXISTS abogados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    cedula VARCHAR(50) UNIQUE,
    telefono VARCHAR(20),
    email VARCHAR(100),
    especialidades TEXT,
    empresa_id INT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE SET NULL
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    cedula VARCHAR(50) UNIQUE,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    ciudad VARCHAR(100),
    departamento VARCHAR(100),
    fecha_nacimiento DATE,
    genero ENUM('M', 'F', 'Otro'),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de servicios legales
CREATE TABLE IF NOT EXISTS servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    duracion_minutos INT DEFAULT 60,
    precio DECIMAL(10,2),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de citas/agendamientos
CREATE TABLE IF NOT EXISTS citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    abogado_id INT NOT NULL,
    servicio_id INT NOT NULL,
    empresa_id INT NOT NULL,
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
    notas TEXT,
    precio DECIMAL(10,2),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (abogado_id) REFERENCES abogados(id) ON DELETE CASCADE,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
);

-- Tabla de sesiones de usuario
CREATE TABLE IF NOT EXISTS sesiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    fecha_expiracion TIMESTAMP NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Insertar datos iniciales
INSERT INTO usuarios (nombre, email, password, tipo_usuario) VALUES
('Administrador', 'admin@hidalpi.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

INSERT INTO empresas (nombre, nit, telefono, email, direccion, ciudad, departamento, descripcion, servicios_principales) VALUES
('Bufete Hidalgo & Asociados', '900123456-7', '+57 1 234 5678', 'info@hidalgoasociados.com', 'Calle 123 #45-67', 'Bogotá', 'Cundinamarca', 'Firma de abogados especializada en derecho civil, comercial y laboral', 'Derecho Civil, Derecho Comercial, Derecho Laboral'),
('Consultores Legales S.A.S.', '900234567-8', '+57 1 345 6789', 'contacto@consultoreslegales.com', 'Carrera 78 #90-12', 'Medellín', 'Antioquia', 'Consultoría legal integral para empresas y particulares', 'Derecho Empresarial, Derecho Fiscal, Derecho Inmobiliario');

INSERT INTO servicios (nombre, descripcion, duracion_minutos, precio) VALUES
('Consulta General', 'Consulta legal general sobre diversos temas', 45, 150000),
('Derecho Civil', 'Asesoría en derecho civil y contratos', 60, 200000),
('Derecho Comercial', 'Asesoría en derecho comercial y empresarial', 90, 300000),
('Derecho Laboral', 'Asesoría en derecho laboral y relaciones laborales', 60, 250000),
('Derecho Penal', 'Asesoría en derecho penal y defensa criminal', 90, 350000),
('Derecho de Familia', 'Asesoría en derecho de familia y sucesiones', 60, 220000),
('Derecho Fiscal', 'Asesoría en derecho fiscal y tributario', 75, 280000),
('Derecho Inmobiliario', 'Asesoría en derecho inmobiliario y propiedad', 60, 240000);

INSERT INTO abogados (nombre, apellido, cedula, telefono, email, especialidades, empresa_id) VALUES
('Roberto', 'Hidalgo', '12345678', '+57 300 123 4567', 'r.hidalgo@hidalgoasociados.com', 'Derecho Civil, Derecho Comercial', 1),
('Patricia', 'López', '23456789', '+57 301 234 5678', 'p.lopez@hidalgoasociados.com', 'Derecho Laboral', 1),
('Miguel', 'Fernández', '34567890', '+57 302 345 6789', 'm.fernandez@consultoreslegales.com', 'Derecho Penal', 2),
('Carmen', 'Ruiz', '45678901', '+57 303 456 7890', 'c.ruiz@consultoreslegales.com', 'Derecho de Familia', 2),
('Andrés', 'Morales', '56789012', '+57 304 567 8901', 'a.morales@hidalgoasociados.com', 'Derecho Inmobiliario', 1),
('Lucía', 'Vargas', '67890123', '+57 305 678 9012', 'l.vargas@consultoreslegales.com', 'Derecho Fiscal', 2);

INSERT INTO clientes (nombre, apellido, cedula, telefono, email, direccion, ciudad, departamento, fecha_nacimiento, genero) VALUES
('Juan', 'Pérez', '80123456', '+57 310 123 4567', 'juan.perez@email.com', 'Calle 50 #25-30', 'Bogotá', 'Cundinamarca', '1985-03-15', 'M'),
('María', 'González', '80234567', '+57 311 234 5678', 'maria.gonzalez@email.com', 'Carrera 40 #60-80', 'Medellín', 'Antioquia', '1990-07-22', 'F'),
('Carlos', 'Rodríguez', '80345678', '+57 312 345 6789', 'carlos.rodriguez@email.com', 'Avenida 15 #35-45', 'Cali', 'Valle del Cauca', '1982-11-10', 'M'),
('Ana', 'Martínez', '80456789', '+57 313 456 7890', 'ana.martinez@email.com', 'Calle 80 #45-60', 'Barranquilla', 'Atlántico', '1988-05-18', 'F');