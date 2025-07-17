<?php
/**
 * Script de prueba para verificar todas las funcionalidades
 * Test script to verify all functionalities
 */

// Función para mostrar resultados
function showResult($test, $result, $details = '') {
    $status = $result ? '✅ PASS' : '❌ FAIL';
    echo "<div style='margin: 10px 0; padding: 10px; border-left: 4px solid " . ($result ? '#28a745' : '#dc3545') . ";'>";
    echo "<strong>$status</strong> - $test<br>";
    if ($details) {
        echo "<small style='color: #666;'>$details</small>";
    }
    echo "</div>";
}

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pruebas del Sistema - HidalPi Web</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #f8f9fa; }
        .container { margin: 20px auto; max-width: 900px; }
        .card { margin-bottom: 20px; }
        .test-result { margin: 10px 0; padding: 10px; border-radius: 5px; }
        .test-pass { background-color: #d4edda; border-left: 4px solid #28a745; }
        .test-fail { background-color: #f8d7da; border-left: 4px solid #dc3545; }
        .test-info { background-color: #d1ecf1; border-left: 4px solid #17a2b8; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="text-center mb-4">🧪 Pruebas del Sistema HidalPi Web</h1>
        
        <div class="card">
            <div class="card-header">
                <h5>📁 Estructura de Archivos</h5>
            </div>
            <div class="card-body">
                <?php
                $requiredFiles = [
                    'backend/config/database.php' => 'Configuración de base de datos',
                    'backend/auth/AuthService.php' => 'Servicio de autenticación',
                    'backend/admin/index.php' => 'Panel de administración',
                    'backend/email/EmailService.php' => 'Servicio de email',
                    'backend/api/reports.php' => 'API de reportes',
                    'backend/calendar/calendar.php' => 'Integración con calendario',
                    'backend/api/chatbot.php' => 'API de chatbot',
                    'backend/backup/backup.php' => 'Sistema de backup',
                    'backend/lang/LanguageService.php' => 'Soporte multiidioma',
                    'backend/database/schema.sql' => 'Esquema de base de datos',
                    'README.md' => 'Documentación principal'
                ];
                
                foreach ($requiredFiles as $file => $description) {
                    $exists = file_exists($file);
                    $details = $exists ? "Tamaño: " . number_format(filesize($file)) . " bytes" : "Archivo no encontrado";
                    showResult($description, $exists, $details);
                }
                ?>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h5>🔧 Configuración PHP</h5>
            </div>
            <div class="card-body">
                <?php
                showResult('PHP Version >= 7.4', version_compare(PHP_VERSION, '7.4.0', '>='), 'Versión actual: ' . PHP_VERSION);
                showResult('PDO Extension', extension_loaded('pdo'), 'Requerido para base de datos');
                showResult('MySQL Extension', extension_loaded('pdo_mysql'), 'Requerido para MySQL');
                showResult('Session Support', function_exists('session_start'), 'Requerido para autenticación');
                showResult('Mail Support', function_exists('mail'), 'Requerido para notificaciones');
                showResult('JSON Support', function_exists('json_encode'), 'Requerido para APIs');
                ?>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h5>🗄️ Base de Datos</h5>
            </div>
            <div class="card-body">
                <?php
                try {
                    require_once 'backend/config/database.php';
                    $pdo = getConnection();
                    showResult('Conexión a la base de datos', true, 'Conectado exitosamente');
                    
                    // Verificar tablas
                    $tables = ['usuarios', 'empresas', 'clientes', 'abogados', 'servicios', 'citas', 'sesiones'];
                    foreach ($tables as $table) {
                        try {
                            $stmt = $pdo->query("SELECT COUNT(*) FROM $table");
                            $count = $stmt->fetchColumn();
                            showResult("Tabla '$table'", true, "Registros: $count");
                        } catch (Exception $e) {
                            showResult("Tabla '$table'", false, "Error: " . $e->getMessage());
                        }
                    }
                    
                } catch (Exception $e) {
                    showResult('Conexión a la base de datos', false, 'Error: ' . $e->getMessage());
                }
                ?>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h5>🔐 Sistema de Autenticación</h5>
            </div>
            <div class="card-body">
                <?php
                try {
                    require_once 'backend/auth/AuthService.php';
                    $authService = new AuthService();
                    showResult('Clase AuthService', true, 'Instanciada correctamente');
                    
                    // Test de funciones
                    showResult('Método estaAutenticado()', method_exists($authService, 'estaAutenticado'), 'Método disponible');
                    showResult('Método esAdministrador()', method_exists($authService, 'esAdministrador'), 'Método disponible');
                    showResult('Método registrar()', method_exists($authService, 'registrar'), 'Método disponible');
                    showResult('Método iniciarSesion()', method_exists($authService, 'iniciarSesion'), 'Método disponible');
                    
                } catch (Exception $e) {
                    showResult('Sistema de Autenticación', false, 'Error: ' . $e->getMessage());
                }
                ?>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h5>📧 Sistema de Email</h5>
            </div>
            <div class="card-body">
                <?php
                try {
                    require_once 'backend/email/EmailService.php';
                    $emailService = new EmailService();
                    showResult('Clase EmailService', true, 'Instanciada correctamente');
                    
                    showResult('Método enviarConfirmacionCita()', method_exists($emailService, 'enviarConfirmacionCita'), 'Método disponible');
                    showResult('Método enviarRecordatorioCita()', method_exists($emailService, 'enviarRecordatorioCita'), 'Método disponible');
                    showResult('Método enviarCancelacionCita()', method_exists($emailService, 'enviarCancelacionCita'), 'Método disponible');
                    
                } catch (Exception $e) {
                    showResult('Sistema de Email', false, 'Error: ' . $e->getMessage());
                }
                ?>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h5>📊 Sistema de Reportes</h5>
            </div>
            <div class="card-body">
                <?php
                showResult('Archivo de reportes', file_exists('backend/api/reports.php'), 'API de reportes CSV');
                showResult('Permisos de escritura', is_writable('.'), 'Requerido para generar archivos CSV');
                ?>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h5>📅 Integración con Calendario</h5>
            </div>
            <div class="card-body">
                <?php
                try {
                    require_once 'backend/calendar/calendar.php';
                    $calendarService = new CalendarService();
                    showResult('Clase CalendarService', true, 'Instanciada correctamente');
                    
                    showResult('Método generarEventoCita()', method_exists($calendarService, 'generarEventoCita'), 'Método disponible');
                    showResult('Método generarEventosCliente()', method_exists($calendarService, 'generarEventosCliente'), 'Método disponible');
                    showResult('Método generarEventosAbogado()', method_exists($calendarService, 'generarEventosAbogado'), 'Método disponible');
                    
                } catch (Exception $e) {
                    showResult('Integración con Calendario', false, 'Error: ' . $e->getMessage());
                }
                ?>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h5>🤖 API de Chatbot</h5>
            </div>
            <div class="card-body">
                <?php
                try {
                    require_once 'backend/api/chatbot.php';
                    $chatbotAPI = new ChatbotAPI();
                    showResult('Clase ChatbotAPI', true, 'Instanciada correctamente');
                    
                    showResult('Método procesarConsulta()', method_exists($chatbotAPI, 'procesarConsulta'), 'Método disponible');
                    showResult('Método buscarInformacion()', method_exists($chatbotAPI, 'buscarInformacion'), 'Método disponible');
                    
                } catch (Exception $e) {
                    showResult('API de Chatbot', false, 'Error: ' . $e->getMessage());
                }
                ?>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h5>💾 Sistema de Backup</h5>
            </div>
            <div class="card-body">
                <?php
                try {
                    require_once 'backend/backup/backup.php';
                    $backupService = new BackupService();
                    showResult('Clase BackupService', true, 'Instanciada correctamente');
                    
                    showResult('Método generarRespaldoCompleto()', method_exists($backupService, 'generarRespaldoCompleto'), 'Método disponible');
                    showResult('Método listarRespaldos()', method_exists($backupService, 'listarRespaldos'), 'Método disponible');
                    showResult('Directorio de backup', is_dir('backend/backup/respaldos') || is_writable('backend/backup'), 'Permisos de escritura');
                    
                } catch (Exception $e) {
                    showResult('Sistema de Backup', false, 'Error: ' . $e->getMessage());
                }
                ?>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h5>🌐 Soporte Multiidioma</h5>
            </div>
            <div class="card-body">
                <?php
                try {
                    require_once 'backend/lang/LanguageService.php';
                    $langService = new LanguageService();
                    showResult('Clase LanguageService', true, 'Instanciada correctamente');
                    
                    showResult('Idioma español', file_exists('backend/lang/es/messages.php'), 'Archivo de traducciones');
                    showResult('Idioma inglés', file_exists('backend/lang/en/messages.php'), 'Archivo de traducciones');
                    showResult('Método setLanguage()', method_exists($langService, 'setLanguage'), 'Método disponible');
                    showResult('Método translate()', method_exists($langService, 'translate'), 'Método disponible');
                    
                } catch (Exception $e) {
                    showResult('Soporte Multiidioma', false, 'Error: ' . $e->getMessage());
                }
                ?>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h5>🎯 Resumen de Funcionalidades</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <h6>✅ Funcionalidades Completadas:</h6>
                        <ul>
                            <li>Autenticación de usuarios con sesiones PHP</li>
                            <li>Panel de administración con Bootstrap</li>
                            <li>Notificaciones por email con plantillas HTML</li>
                            <li>Reportes CSV para todas las entidades</li>
                            <li>Integración con calendario (.ics)</li>
                            <li>API para chatbots con respuestas inteligentes</li>
                            <li>Backup automático de base de datos</li>
                            <li>Soporte multiidioma (ES/EN)</li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h6>📋 Instrucciones de Uso:</h6>
                        <ol>
                            <li>Configurar base de datos en <code>backend/config/database.php</code></li>
                            <li>Ejecutar schema: <code>mysql -u root -p < backend/database/schema.sql</code></li>
                            <li>Acceder al admin: <code>backend/admin/index.php</code></li>
                            <li>Login: <code>backend/auth/login.html</code></li>
                            <li>Registro: <code>backend/auth/register.html</code></li>
                            <li>Credenciales por defecto: admin@hidalpi.com / secret</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h5>🔗 Enlaces Útiles</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4">
                        <h6>Autenticación:</h6>
                        <ul>
                            <li><a href="backend/auth/login.html" target="_blank">Página de Login</a></li>
                            <li><a href="backend/auth/register.html" target="_blank">Página de Registro</a></li>
                        </ul>
                    </div>
                    <div class="col-md-4">
                        <h6>Administración:</h6>
                        <ul>
                            <li><a href="backend/admin/index.php" target="_blank">Panel de Admin</a></li>
                            <li><a href="backend/api/reports.php?type=empresas" target="_blank">Reporte Empresas</a></li>
                        </ul>
                    </div>
                    <div class="col-md-4">
                        <h6>APIs:</h6>
                        <ul>
                            <li><a href="backend/api/chatbot.php?action=info" target="_blank">Info Chatbot</a></li>
                            <li><a href="backend/backup/backup.php?action=listar" target="_blank">Listar Backups</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>