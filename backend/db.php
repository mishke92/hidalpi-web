<?php
/**
 * Configuración de conexión a base de datos MySQL para XAMPP
 * 
 * Este archivo maneja la conexión a la base de datos MySQL
 * con configuración predeterminada para XAMPP.
 */

// Configuración de base de datos para XAMPP
$servidor = "localhost";
$usuario = "root";
$password = "";
$base_datos = "hidalpi_web";

// Configuración de headers para CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Manejar solicitudes OPTIONS para CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Función para obtener conexión a la base de datos
 * 
 * @return mysqli|null Conexión a la base de datos o null si falla
 */
function obtenerConexion() {
    global $servidor, $usuario, $password, $base_datos;
    
    // Crear conexión
    $conexion = new mysqli($servidor, $usuario, $password, $base_datos);
    
    // Verificar conexión
    if ($conexion->connect_error) {
        error_log("Error de conexión: " . $conexion->connect_error);
        return null;
    }
    
    // Configurar charset
    $conexion->set_charset("utf8");
    
    return $conexion;
}

/**
 * Función para cerrar la conexión a la base de datos
 * 
 * @param mysqli $conexion Conexión a cerrar
 */
function cerrarConexion($conexion) {
    if ($conexion) {
        $conexion->close();
    }
}

/**
 * Función para enviar respuesta JSON
 * 
 * @param array $datos Datos a enviar
 * @param int $codigo_http Código HTTP de respuesta
 */
function enviarRespuesta($datos, $codigo_http = 200) {
    http_response_code($codigo_http);
    echo json_encode($datos);
    exit();
}

/**
 * Función para validar campos requeridos
 * 
 * @param array $datos Datos a validar
 * @param array $campos_requeridos Campos que deben estar presentes
 * @return bool True si todos los campos están presentes
 */
function validarCamposRequeridos($datos, $campos_requeridos) {
    foreach ($campos_requeridos as $campo) {
        if (!isset($datos[$campo]) || empty(trim($datos[$campo]))) {
            return false;
        }
    }
    return true;
}

/**
 * Función para limpiar datos de entrada
 * 
 * @param string $dato Dato a limpiar
 * @return string Dato limpio
 */
function limpiarDato($dato) {
    return htmlspecialchars(trim($dato), ENT_QUOTES, 'UTF-8');
}
?>