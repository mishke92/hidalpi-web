<?php
/**
 * Servicio de integración con calendario - Generación de archivos .ics
 * Calendar integration service - .ics file generation
 */

require_once '../auth/AuthService.php';
require_once '../config/database.php';

class CalendarService {
    private $pdo;
    
    public function __construct() {
        $this->pdo = getConnection();
    }
    
    /**
     * Generar archivo .ics para una cita específica
     * Generate .ics file for a specific appointment
     */
    public function generarEventoCita($citaId) {
        $cita = $this->obtenerDatosCita($citaId);
        
        if (!$cita) {
            return ['success' => false, 'message' => 'Cita no encontrada'];
        }
        
        $icsContent = $this->generarICS($cita);
        
        return [
            'success' => true,
            'content' => $icsContent,
            'filename' => 'cita_' . $citaId . '_' . date('Y-m-d') . '.ics'
        ];
    }
    
    /**
     * Generar archivo .ics para todas las citas de un cliente
     * Generate .ics file for all appointments of a client
     */
    public function generarEventosCliente($clienteId) {
        $citas = $this->obtenerCitasCliente($clienteId);
        
        if (empty($citas)) {
            return ['success' => false, 'message' => 'No se encontraron citas para el cliente'];
        }
        
        $icsContent = $this->generarICSMultiple($citas);
        
        return [
            'success' => true,
            'content' => $icsContent,
            'filename' => 'citas_cliente_' . $clienteId . '_' . date('Y-m-d') . '.ics'
        ];
    }
    
    /**
     * Generar archivo .ics para todas las citas de un abogado
     * Generate .ics file for all appointments of a lawyer
     */
    public function generarEventosAbogado($abogadoId) {
        $citas = $this->obtenerCitasAbogado($abogadoId);
        
        if (empty($citas)) {
            return ['success' => false, 'message' => 'No se encontraron citas para el abogado'];
        }
        
        $icsContent = $this->generarICSMultiple($citas);
        
        return [
            'success' => true,
            'content' => $icsContent,
            'filename' => 'citas_abogado_' . $abogadoId . '_' . date('Y-m-d') . '.ics'
        ];
    }
    
    /**
     * Obtener datos completos de una cita
     */
    private function obtenerDatosCita($citaId) {
        $stmt = $this->pdo->prepare("
            SELECT 
                c.id,
                c.fecha_cita,
                c.hora_cita,
                c.estado,
                c.notas,
                cl.nombre as cliente_nombre,
                cl.apellido as cliente_apellido,
                cl.email as cliente_email,
                cl.telefono as cliente_telefono,
                a.nombre as abogado_nombre,
                a.apellido as abogado_apellido,
                a.email as abogado_email,
                s.nombre as servicio_nombre,
                s.descripcion as servicio_descripcion,
                s.duracion_minutos,
                e.nombre as empresa_nombre,
                e.direccion as empresa_direccion,
                e.telefono as empresa_telefono
            FROM citas c
            INNER JOIN clientes cl ON c.cliente_id = cl.id
            INNER JOIN abogados a ON c.abogado_id = a.id
            INNER JOIN servicios s ON c.servicio_id = s.id
            INNER JOIN empresas e ON c.empresa_id = e.id
            WHERE c.id = ?
        ");
        
        $stmt->execute([$citaId]);
        return $stmt->fetch();
    }
    
    /**
     * Obtener todas las citas de un cliente
     */
    private function obtenerCitasCliente($clienteId) {
        $stmt = $this->pdo->prepare("
            SELECT 
                c.id,
                c.fecha_cita,
                c.hora_cita,
                c.estado,
                c.notas,
                cl.nombre as cliente_nombre,
                cl.apellido as cliente_apellido,
                cl.email as cliente_email,
                cl.telefono as cliente_telefono,
                a.nombre as abogado_nombre,
                a.apellido as abogado_apellido,
                a.email as abogado_email,
                s.nombre as servicio_nombre,
                s.descripcion as servicio_descripcion,
                s.duracion_minutos,
                e.nombre as empresa_nombre,
                e.direccion as empresa_direccion,
                e.telefono as empresa_telefono
            FROM citas c
            INNER JOIN clientes cl ON c.cliente_id = cl.id
            INNER JOIN abogados a ON c.abogado_id = a.id
            INNER JOIN servicios s ON c.servicio_id = s.id
            INNER JOIN empresas e ON c.empresa_id = e.id
            WHERE c.cliente_id = ?
            ORDER BY c.fecha_cita, c.hora_cita
        ");
        
        $stmt->execute([$clienteId]);
        return $stmt->fetchAll();
    }
    
    /**
     * Obtener todas las citas de un abogado
     */
    private function obtenerCitasAbogado($abogadoId) {
        $stmt = $this->pdo->prepare("
            SELECT 
                c.id,
                c.fecha_cita,
                c.hora_cita,
                c.estado,
                c.notas,
                cl.nombre as cliente_nombre,
                cl.apellido as cliente_apellido,
                cl.email as cliente_email,
                cl.telefono as cliente_telefono,
                a.nombre as abogado_nombre,
                a.apellido as abogado_apellido,
                a.email as abogado_email,
                s.nombre as servicio_nombre,
                s.descripcion as servicio_descripcion,
                s.duracion_minutos,
                e.nombre as empresa_nombre,
                e.direccion as empresa_direccion,
                e.telefono as empresa_telefono
            FROM citas c
            INNER JOIN clientes cl ON c.cliente_id = cl.id
            INNER JOIN abogados a ON c.abogado_id = a.id
            INNER JOIN servicios s ON c.servicio_id = s.id
            INNER JOIN empresas e ON c.empresa_id = e.id
            WHERE c.abogado_id = ?
            ORDER BY c.fecha_cita, c.hora_cita
        ");
        
        $stmt->execute([$abogadoId]);
        return $stmt->fetchAll();
    }
    
    /**
     * Generar contenido ICS para una sola cita
     */
    private function generarICS($cita) {
        $fechaInicio = $this->formatearFechaICS($cita['fecha_cita'], $cita['hora_cita']);
        $fechaFin = $this->calcularFechaFin($cita['fecha_cita'], $cita['hora_cita'], $cita['duracion_minutos']);
        $uid = 'cita-' . $cita['id'] . '@hidalpi.com';
        $fechaCreacion = $this->formatearFechaICS(date('Y-m-d'), date('H:i:s'));
        
        $resumen = 'Cita Legal - ' . $cita['servicio_nombre'];
        $descripcion = $this->generarDescripcion($cita);
        $ubicacion = $this->generarUbicacion($cita);
        
        $icsContent = "BEGIN:VCALENDAR\r\n";
        $icsContent .= "VERSION:2.0\r\n";
        $icsContent .= "PRODID:-//HidalPi Web//Calendar//ES\r\n";
        $icsContent .= "CALSCALE:GREGORIAN\r\n";
        $icsContent .= "METHOD:PUBLISH\r\n";
        $icsContent .= "BEGIN:VEVENT\r\n";
        $icsContent .= "UID:" . $uid . "\r\n";
        $icsContent .= "DTSTART:" . $fechaInicio . "\r\n";
        $icsContent .= "DTEND:" . $fechaFin . "\r\n";
        $icsContent .= "DTSTAMP:" . $fechaCreacion . "\r\n";
        $icsContent .= "SUMMARY:" . $this->escaparTextoICS($resumen) . "\r\n";
        $icsContent .= "DESCRIPTION:" . $this->escaparTextoICS($descripcion) . "\r\n";
        $icsContent .= "LOCATION:" . $this->escaparTextoICS($ubicacion) . "\r\n";
        $icsContent .= "STATUS:CONFIRMED\r\n";
        $icsContent .= "SEQUENCE:0\r\n";
        $icsContent .= "BEGIN:VALARM\r\n";
        $icsContent .= "TRIGGER:-PT15M\r\n";
        $icsContent .= "ACTION:DISPLAY\r\n";
        $icsContent .= "DESCRIPTION:Recordatorio: Cita en 15 minutos\r\n";
        $icsContent .= "END:VALARM\r\n";
        $icsContent .= "END:VEVENT\r\n";
        $icsContent .= "END:VCALENDAR\r\n";
        
        return $icsContent;
    }
    
    /**
     * Generar contenido ICS para múltiples citas
     */
    private function generarICSMultiple($citas) {
        $icsContent = "BEGIN:VCALENDAR\r\n";
        $icsContent .= "VERSION:2.0\r\n";
        $icsContent .= "PRODID:-//HidalPi Web//Calendar//ES\r\n";
        $icsContent .= "CALSCALE:GREGORIAN\r\n";
        $icsContent .= "METHOD:PUBLISH\r\n";
        
        foreach ($citas as $cita) {
            $fechaInicio = $this->formatearFechaICS($cita['fecha_cita'], $cita['hora_cita']);
            $fechaFin = $this->calcularFechaFin($cita['fecha_cita'], $cita['hora_cita'], $cita['duracion_minutos']);
            $uid = 'cita-' . $cita['id'] . '@hidalpi.com';
            $fechaCreacion = $this->formatearFechaICS(date('Y-m-d'), date('H:i:s'));
            
            $resumen = 'Cita Legal - ' . $cita['servicio_nombre'];
            $descripcion = $this->generarDescripcion($cita);
            $ubicacion = $this->generarUbicacion($cita);
            
            $icsContent .= "BEGIN:VEVENT\r\n";
            $icsContent .= "UID:" . $uid . "\r\n";
            $icsContent .= "DTSTART:" . $fechaInicio . "\r\n";
            $icsContent .= "DTEND:" . $fechaFin . "\r\n";
            $icsContent .= "DTSTAMP:" . $fechaCreacion . "\r\n";
            $icsContent .= "SUMMARY:" . $this->escaparTextoICS($resumen) . "\r\n";
            $icsContent .= "DESCRIPTION:" . $this->escaparTextoICS($descripcion) . "\r\n";
            $icsContent .= "LOCATION:" . $this->escaparTextoICS($ubicacion) . "\r\n";
            $icsContent .= "STATUS:CONFIRMED\r\n";
            $icsContent .= "SEQUENCE:0\r\n";
            $icsContent .= "BEGIN:VALARM\r\n";
            $icsContent .= "TRIGGER:-PT15M\r\n";
            $icsContent .= "ACTION:DISPLAY\r\n";
            $icsContent .= "DESCRIPTION:Recordatorio: Cita en 15 minutos\r\n";
            $icsContent .= "END:VALARM\r\n";
            $icsContent .= "END:VEVENT\r\n";
        }
        
        $icsContent .= "END:VCALENDAR\r\n";
        
        return $icsContent;
    }
    
    /**
     * Formatear fecha y hora para formato ICS
     */
    private function formatearFechaICS($fecha, $hora) {
        $datetime = new DateTime($fecha . ' ' . $hora);
        return $datetime->format('Ymd\THis\Z');
    }
    
    /**
     * Calcular fecha y hora de fin basada en duración
     */
    private function calcularFechaFin($fecha, $hora, $duracionMinutos) {
        $datetime = new DateTime($fecha . ' ' . $hora);
        $datetime->add(new DateInterval('PT' . $duracionMinutos . 'M'));
        return $datetime->format('Ymd\THis\Z');
    }
    
    /**
     * Generar descripción del evento
     */
    private function generarDescripcion($cita) {
        $descripcion = "Cita de " . $cita['servicio_nombre'] . "\n";
        $descripcion .= "Cliente: " . $cita['cliente_nombre'] . " " . $cita['cliente_apellido'] . "\n";
        $descripcion .= "Abogado: " . $cita['abogado_nombre'] . " " . $cita['abogado_apellido'] . "\n";
        $descripcion .= "Empresa: " . $cita['empresa_nombre'] . "\n";
        $descripcion .= "Duración: " . $cita['duracion_minutos'] . " minutos\n";
        $descripcion .= "Teléfono empresa: " . $cita['empresa_telefono'] . "\n";
        
        if (!empty($cita['notas'])) {
            $descripcion .= "Notas: " . $cita['notas'] . "\n";
        }
        
        return $descripcion;
    }
    
    /**
     * Generar ubicación del evento
     */
    private function generarUbicacion($cita) {
        $ubicacion = $cita['empresa_nombre'];
        
        if (!empty($cita['empresa_direccion'])) {
            $ubicacion .= " - " . $cita['empresa_direccion'];
        }
        
        return $ubicacion;
    }
    
    /**
     * Escapar texto para formato ICS
     */
    private function escaparTextoICS($texto) {
        $texto = str_replace(['\\', "\n", "\r", ',', ';'], ['\\\\', '\\n', '\\r', '\\,', '\\;'], $texto);
        return $texto;
    }
}

// Manejar solicitudes HTTP
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $authService = new AuthService();
    $authService->requiereAutenticacion();
    
    $calendarService = new CalendarService();
    $action = $_GET['action'] ?? '';
    
    switch ($action) {
        case 'cita':
            $citaId = $_GET['cita_id'] ?? '';
            if (empty($citaId)) {
                http_response_code(400);
                echo json_encode(['error' => 'ID de cita requerido']);
                exit;
            }
            
            $resultado = $calendarService->generarEventoCita($citaId);
            
            if ($resultado['success']) {
                header('Content-Type: text/calendar; charset=utf-8');
                header('Content-Disposition: attachment; filename="' . $resultado['filename'] . '"');
                echo $resultado['content'];
            } else {
                http_response_code(404);
                echo json_encode(['error' => $resultado['message']]);
            }
            break;
            
        case 'cliente':
            $clienteId = $_GET['cliente_id'] ?? '';
            if (empty($clienteId)) {
                http_response_code(400);
                echo json_encode(['error' => 'ID de cliente requerido']);
                exit;
            }
            
            $resultado = $calendarService->generarEventosCliente($clienteId);
            
            if ($resultado['success']) {
                header('Content-Type: text/calendar; charset=utf-8');
                header('Content-Disposition: attachment; filename="' . $resultado['filename'] . '"');
                echo $resultado['content'];
            } else {
                http_response_code(404);
                echo json_encode(['error' => $resultado['message']]);
            }
            break;
            
        case 'abogado':
            $abogadoId = $_GET['abogado_id'] ?? '';
            if (empty($abogadoId)) {
                http_response_code(400);
                echo json_encode(['error' => 'ID de abogado requerido']);
                exit;
            }
            
            $resultado = $calendarService->generarEventosAbogado($abogadoId);
            
            if ($resultado['success']) {
                header('Content-Type: text/calendar; charset=utf-8');
                header('Content-Disposition: attachment; filename="' . $resultado['filename'] . '"');
                echo $resultado['content'];
            } else {
                http_response_code(404);
                echo json_encode(['error' => $resultado['message']]);
            }
            break;
            
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Acción no válida']);
            break;
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}
?>