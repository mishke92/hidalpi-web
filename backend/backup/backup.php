<?php
/**
 * Sistema de respaldo automático de datos
 * Automatic data backup system
 */

require_once '../auth/AuthService.php';
require_once '../config/database.php';

class BackupService {
    private $pdo;
    private $backupDir;
    private $dbConfig;
    
    public function __construct() {
        $this->pdo = getConnection();
        $this->backupDir = __DIR__ . '/respaldos/';
        $this->dbConfig = [
            'host' => 'localhost',
            'username' => 'root',
            'password' => '',
            'database' => 'hidalpi_web'
        ];
        
        // Crear directorio de respaldos si no existe
        if (!is_dir($this->backupDir)) {
            mkdir($this->backupDir, 0755, true);
        }
    }
    
    /**
     * Generar respaldo completo de la base de datos
     * Generate complete database backup
     */
    public function generarRespaldoCompleto() {
        $filename = 'backup_completo_' . date('Y-m-d_H-i-s') . '.sql';
        $filepath = $this->backupDir . $filename;
        
        try {
            // Usar mysqldump para generar el respaldo
            $command = sprintf(
                'mysqldump --host=%s --user=%s --password=%s --single-transaction --routines --triggers %s > %s',
                escapeshellarg($this->dbConfig['host']),
                escapeshellarg($this->dbConfig['username']),
                escapeshellarg($this->dbConfig['password']),
                escapeshellarg($this->dbConfig['database']),
                escapeshellarg($filepath)
            );
            
            exec($command, $output, $returnVar);
            
            if ($returnVar === 0 && file_exists($filepath)) {
                $this->registrarRespaldo($filename, 'completo', filesize($filepath));
                
                return [
                    'success' => true,
                    'message' => 'Respaldo generado exitosamente',
                    'filename' => $filename,
                    'filepath' => $filepath,
                    'size' => filesize($filepath)
                ];
            } else {
                // Fallback: generar respaldo con PHP
                return $this->generarRespaldoConPHP($filename);
            }
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error al generar respaldo: ' . $e->getMessage()];
        }
    }
    
    /**
     * Generar respaldo usando PHP (fallback)
     */
    private function generarRespaldoConPHP($filename) {
        $filepath = $this->backupDir . $filename;
        
        try {
            $sqlContent = $this->generarSQLCompleto();
            
            file_put_contents($filepath, $sqlContent);
            
            $this->registrarRespaldo($filename, 'completo', filesize($filepath));
            
            return [
                'success' => true,
                'message' => 'Respaldo generado exitosamente (PHP)',
                'filename' => $filename,
                'filepath' => $filepath,
                'size' => filesize($filepath)
            ];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error al generar respaldo: ' . $e->getMessage()];
        }
    }
    
    /**
     * Generar respaldo de solo datos (sin estructura)
     */
    public function generarRespaldoDatos() {
        $filename = 'backup_datos_' . date('Y-m-d_H-i-s') . '.sql';
        $filepath = $this->backupDir . $filename;
        
        try {
            $sqlContent = $this->generarSQLDatos();
            
            file_put_contents($filepath, $sqlContent);
            
            $this->registrarRespaldo($filename, 'datos', filesize($filepath));
            
            return [
                'success' => true,
                'message' => 'Respaldo de datos generado exitosamente',
                'filename' => $filename,
                'filepath' => $filepath,
                'size' => filesize($filepath)
            ];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error al generar respaldo: ' . $e->getMessage()];
        }
    }
    
    /**
     * Generar respaldo de estructura (sin datos)
     */
    public function generarRespaldoEstructura() {
        $filename = 'backup_estructura_' . date('Y-m-d_H-i-s') . '.sql';
        $filepath = $this->backupDir . $filename;
        
        try {
            $sqlContent = $this->generarSQLEstructura();
            
            file_put_contents($filepath, $sqlContent);
            
            $this->registrarRespaldo($filename, 'estructura', filesize($filepath));
            
            return [
                'success' => true,
                'message' => 'Respaldo de estructura generado exitosamente',
                'filename' => $filename,
                'filepath' => $filepath,
                'size' => filesize($filepath)
            ];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error al generar respaldo: ' . $e->getMessage()];
        }
    }
    
    /**
     * Generar SQL completo (estructura + datos)
     */
    private function generarSQLCompleto() {
        $sql = "-- Respaldo completo de HidalPi Web\n";
        $sql .= "-- Generado el: " . date('Y-m-d H:i:s') . "\n\n";
        $sql .= "SET FOREIGN_KEY_CHECKS = 0;\n";
        $sql .= "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n";
        $sql .= "SET AUTOCOMMIT = 0;\n";
        $sql .= "START TRANSACTION;\n";
        $sql .= "SET time_zone = \"+00:00\";\n\n";
        
        // Obtener lista de tablas
        $stmt = $this->pdo->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        foreach ($tables as $table) {
            $sql .= $this->generarSQLTabla($table, true, true);
        }
        
        $sql .= "SET FOREIGN_KEY_CHECKS = 1;\n";
        $sql .= "COMMIT;\n";
        
        return $sql;
    }
    
    /**
     * Generar SQL solo de datos
     */
    private function generarSQLDatos() {
        $sql = "-- Respaldo de datos de HidalPi Web\n";
        $sql .= "-- Generado el: " . date('Y-m-d H:i:s') . "\n\n";
        $sql .= "SET FOREIGN_KEY_CHECKS = 0;\n";
        $sql .= "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n";
        $sql .= "SET AUTOCOMMIT = 0;\n";
        $sql .= "START TRANSACTION;\n";
        $sql .= "SET time_zone = \"+00:00\";\n\n";
        
        // Obtener lista de tablas
        $stmt = $this->pdo->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        foreach ($tables as $table) {
            $sql .= $this->generarSQLTabla($table, false, true);
        }
        
        $sql .= "SET FOREIGN_KEY_CHECKS = 1;\n";
        $sql .= "COMMIT;\n";
        
        return $sql;
    }
    
    /**
     * Generar SQL solo de estructura
     */
    private function generarSQLEstructura() {
        $sql = "-- Respaldo de estructura de HidalPi Web\n";
        $sql .= "-- Generado el: " . date('Y-m-d H:i:s') . "\n\n";
        $sql .= "SET FOREIGN_KEY_CHECKS = 0;\n";
        $sql .= "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n";
        $sql .= "SET AUTOCOMMIT = 0;\n";
        $sql .= "START TRANSACTION;\n";
        $sql .= "SET time_zone = \"+00:00\";\n\n";
        
        // Obtener lista de tablas
        $stmt = $this->pdo->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        foreach ($tables as $table) {
            $sql .= $this->generarSQLTabla($table, true, false);
        }
        
        $sql .= "SET FOREIGN_KEY_CHECKS = 1;\n";
        $sql .= "COMMIT;\n";
        
        return $sql;
    }
    
    /**
     * Generar SQL para una tabla específica
     */
    private function generarSQLTabla($table, $incluirEstructura = true, $incluirDatos = true) {
        $sql = "-- Tabla: $table\n";
        
        if ($incluirEstructura) {
            // Obtener estructura de la tabla
            $stmt = $this->pdo->query("SHOW CREATE TABLE `$table`");
            $createTable = $stmt->fetch();
            
            $sql .= "DROP TABLE IF EXISTS `$table`;\n";
            $sql .= $createTable['Create Table'] . ";\n\n";
        }
        
        if ($incluirDatos) {
            // Obtener datos de la tabla
            $stmt = $this->pdo->query("SELECT * FROM `$table`");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (!empty($rows)) {
                // Obtener nombres de columnas
                $columns = array_keys($rows[0]);
                $columnNames = '`' . implode('`, `', $columns) . '`';
                
                $sql .= "INSERT INTO `$table` ($columnNames) VALUES\n";
                
                $values = [];
                foreach ($rows as $row) {
                    $valueList = [];
                    foreach ($row as $value) {
                        if ($value === null) {
                            $valueList[] = 'NULL';
                        } else {
                            $valueList[] = $this->pdo->quote($value);
                        }
                    }
                    $values[] = '(' . implode(', ', $valueList) . ')';
                }
                
                $sql .= implode(",\n", $values) . ";\n\n";
            } else {
                $sql .= "-- No hay datos en la tabla $table\n\n";
            }
        }
        
        return $sql;
    }
    
    /**
     * Registrar respaldo en la base de datos
     */
    private function registrarRespaldo($filename, $tipo, $tamano) {
        try {
            // Crear tabla de respaldos si no existe
            $this->pdo->exec("
                CREATE TABLE IF NOT EXISTS respaldos (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    filename VARCHAR(255) NOT NULL,
                    tipo ENUM('completo', 'datos', 'estructura') NOT NULL,
                    tamano BIGINT NOT NULL,
                    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ");
            
            $stmt = $this->pdo->prepare("
                INSERT INTO respaldos (filename, tipo, tamano) 
                VALUES (?, ?, ?)
            ");
            $stmt->execute([$filename, $tipo, $tamano]);
            
        } catch (Exception $e) {
            // Si falla, no es crítico
            error_log("Error al registrar respaldo: " . $e->getMessage());
        }
    }
    
    /**
     * Listar respaldos disponibles
     */
    public function listarRespaldos() {
        try {
            $stmt = $this->pdo->query("
                SELECT * FROM respaldos 
                ORDER BY fecha_creacion DESC
            ");
            $respaldos = $stmt->fetchAll();
            
            // Verificar que los archivos existan
            $respaldosValidos = [];
            foreach ($respaldos as $respaldo) {
                $filepath = $this->backupDir . $respaldo['filename'];
                if (file_exists($filepath)) {
                    $respaldo['size_formatted'] = $this->formatearTamano($respaldo['tamano']);
                    $respaldosValidos[] = $respaldo;
                }
            }
            
            return [
                'success' => true,
                'respaldos' => $respaldosValidos
            ];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error al listar respaldos: ' . $e->getMessage()];
        }
    }
    
    /**
     * Eliminar respaldo
     */
    public function eliminarRespaldo($filename) {
        try {
            $filepath = $this->backupDir . $filename;
            
            if (file_exists($filepath)) {
                unlink($filepath);
                
                // Eliminar registro de la base de datos
                $stmt = $this->pdo->prepare("DELETE FROM respaldos WHERE filename = ?");
                $stmt->execute([$filename]);
                
                return ['success' => true, 'message' => 'Respaldo eliminado exitosamente'];
            } else {
                return ['success' => false, 'message' => 'El archivo de respaldo no existe'];
            }
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error al eliminar respaldo: ' . $e->getMessage()];
        }
    }
    
    /**
     * Descargar respaldo
     */
    public function descargarRespaldo($filename) {
        $filepath = $this->backupDir . $filename;
        
        if (file_exists($filepath)) {
            return [
                'success' => true,
                'filepath' => $filepath,
                'filename' => $filename,
                'size' => filesize($filepath)
            ];
        } else {
            return ['success' => false, 'message' => 'El archivo de respaldo no existe'];
        }
    }
    
    /**
     * Limpiar respaldos antiguos (mantener solo los últimos N)
     */
    public function limpiarRespaldosAntiguos($mantener = 10) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT filename FROM respaldos 
                ORDER BY fecha_creacion DESC 
                LIMIT ? OFFSET ?
            ");
            $stmt->execute([$mantener, $mantener]);
            $respaldosAntiguos = $stmt->fetchAll(PDO::FETCH_COLUMN);
            
            $eliminados = 0;
            foreach ($respaldosAntiguos as $filename) {
                $resultado = $this->eliminarRespaldo($filename);
                if ($resultado['success']) {
                    $eliminados++;
                }
            }
            
            return [
                'success' => true,
                'message' => "Se eliminaron $eliminados respaldos antiguos",
                'eliminados' => $eliminados
            ];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error al limpiar respaldos: ' . $e->getMessage()];
        }
    }
    
    /**
     * Formatear tamaño de archivo
     */
    private function formatearTamano($bytes) {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        
        $bytes /= pow(1024, $pow);
        
        return round($bytes, 2) . ' ' . $units[$pow];
    }
}

// Manejar solicitudes HTTP
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $authService = new AuthService();
    $authService->requiereAdministrador();
    
    $backupService = new BackupService();
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';
    
    switch ($action) {
        case 'generar_completo':
            $resultado = $backupService->generarRespaldoCompleto();
            break;
        case 'generar_datos':
            $resultado = $backupService->generarRespaldoDatos();
            break;
        case 'generar_estructura':
            $resultado = $backupService->generarRespaldoEstructura();
            break;
        case 'eliminar':
            $filename = $input['filename'] ?? '';
            $resultado = $backupService->eliminarRespaldo($filename);
            break;
        case 'limpiar_antiguos':
            $mantener = $input['mantener'] ?? 10;
            $resultado = $backupService->limpiarRespaldosAntiguos($mantener);
            break;
        default:
            $resultado = ['success' => false, 'message' => 'Acción no válida'];
            break;
    }
    
    echo json_encode($resultado);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $authService = new AuthService();
    $authService->requiereAdministrador();
    
    $backupService = new BackupService();
    $action = $_GET['action'] ?? '';
    
    switch ($action) {
        case 'listar':
            $resultado = $backupService->listarRespaldos();
            echo json_encode($resultado);
            break;
        case 'descargar':
            $filename = $_GET['filename'] ?? '';
            $resultado = $backupService->descargarRespaldo($filename);
            
            if ($resultado['success']) {
                header('Content-Type: application/octet-stream');
                header('Content-Disposition: attachment; filename="' . $resultado['filename'] . '"');
                header('Content-Length: ' . $resultado['size']);
                readfile($resultado['filepath']);
            } else {
                http_response_code(404);
                echo json_encode($resultado);
            }
            break;
        default:
            echo json_encode(['success' => false, 'message' => 'Acción no válida']);
            break;
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}
?>