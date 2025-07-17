<?php
/**
 * Sistema de autenticación de usuarios
 * User authentication system
 */

session_start();
require_once '../config/database.php';

class AuthService {
    private $pdo;
    
    public function __construct() {
        $this->pdo = getConnection();
    }
    
    /**
     * Registrar un nuevo usuario
     * Register a new user
     */
    public function registrar($nombre, $email, $password, $tipo_usuario, $pais, $provincia, $canton) {
        try {
            // Verificar si el email ya existe
            $stmt = $this->pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
            $stmt->execute([$email]);
            
            if ($stmt->fetch()) {
                return ['success' => false, 'message' => 'El email ya está registrado'];
            }
            
            // Encriptar contraseña
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            
            // Insertar nuevo usuario
            $query = "INSERT INTO usuarios (nombre, email, password, tipo_usuario, pais, provincia, canton) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $this->pdo->prepare($query);
            if ($stmt->execute([$nombre, $email, $passwordHash, $tipo_usuario, $pais, $provincia, $canton])) {
                return ['success' => true, 'message' => 'Usuario registrado correctamente'];
            } else {
                return ['success' => false, 'message' => 'Error al registrar usuario'];
            }
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error al registrar usuario: ' . $e->getMessage()];
        }
    }
    
    /**
     * Iniciar sesión
     * Login user
     */
    public function iniciarSesion($email, $password) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT id, nombre, email, password, tipo_usuario 
                FROM usuarios 
                WHERE email = ? AND activo = TRUE
            ");
            $stmt->execute([$email]);
            $usuario = $stmt->fetch();
            
            if ($usuario && password_verify($password, $usuario['password'])) {
                // Crear sesión
                $_SESSION['usuario_id'] = $usuario['id'];
                $_SESSION['usuario_nombre'] = $usuario['nombre'];
                $_SESSION['usuario_email'] = $usuario['email'];
                $_SESSION['usuario_tipo'] = $usuario['tipo_usuario'];
                $_SESSION['sesion_activa'] = true;
                
                // Guardar sesión en base de datos
                $token = bin2hex(random_bytes(32));
                $expiracion = date('Y-m-d H:i:s', strtotime('+24 hours'));
                
                $stmt = $this->pdo->prepare("
                    INSERT INTO sesiones (usuario_id, token, fecha_expiracion) 
                    VALUES (?, ?, ?)
                ");
                $stmt->execute([$usuario['id'], $token, $expiracion]);
                
                return ['success' => true, 'message' => 'Sesión iniciada exitosamente', 'usuario' => $usuario];
            } else {
                return ['success' => false, 'message' => 'Credenciales inválidas'];
            }
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error al iniciar sesión: ' . $e->getMessage()];
        }
    }
    
    /**
     * Cerrar sesión
     * Logout user
     */
    public function cerrarSesion() {
        try {
            if (isset($_SESSION['usuario_id'])) {
                // Desactivar sesiones en base de datos
                $stmt = $this->pdo->prepare("
                    UPDATE sesiones 
                    SET activo = FALSE 
                    WHERE usuario_id = ? AND activo = TRUE
                ");
                $stmt->execute([$_SESSION['usuario_id']]);
            }
            
            // Destruir sesión PHP
            session_destroy();
            
            return ['success' => true, 'message' => 'Sesión cerrada exitosamente'];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error al cerrar sesión: ' . $e->getMessage()];
        }
    }
    
    /**
     * Verificar si el usuario está autenticado
     * Check if user is authenticated
     */
    public function estaAutenticado() {
        return isset($_SESSION['sesion_activa']) && $_SESSION['sesion_activa'] === true;
    }
    
    /**
     * Verificar si el usuario es administrador
     * Check if user is admin
     */
    public function esAdministrador() {
        return $this->estaAutenticado() && $_SESSION['usuario_tipo'] === 'admin';
    }
    
    /**
     * Obtener información del usuario actual
     * Get current user information
     */
    public function obtenerUsuarioActual() {
        if ($this->estaAutenticado()) {
            return [
                'id' => $_SESSION['usuario_id'],
                'nombre' => $_SESSION['usuario_nombre'],
                'email' => $_SESSION['usuario_email'],
                'tipo' => $_SESSION['usuario_tipo']
            ];
        }
        return null;
    }
    
    /**
     * Middleware para proteger rutas de administrador
     * Middleware to protect admin routes
     */
    public function requiereAdministrador() {
        if (!$this->esAdministrador()) {
            http_response_code(403);
            echo json_encode(['error' => 'Acceso denegado. Se requieren permisos de administrador.']);
            exit;
        }
    }
    
    /**
     * Middleware para proteger rutas autenticadas
     * Middleware to protect authenticated routes
     */
    public function requiereAutenticacion() {
        if (!$this->estaAutenticado()) {
            http_response_code(401);
            echo json_encode(['error' => 'Acceso denegado. Se requiere autenticación.']);
            exit;
        }
    }
}

// Instancia global del servicio de autenticación
$authService = new AuthService();
?>