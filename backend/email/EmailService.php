<?php
/**
 * Servicio de notificaciones por email
 * Email notifications service
 */

// Instalación de PHPMailer con Composer (comando para instalar):
// composer require phpmailer/phpmailer

class EmailService {
    private $host = 'smtp.gmail.com';
    private $port = 587;
    private $username = 'tu_email@gmail.com'; // Configurar email
    private $password = 'tu_password'; // Configurar contraseña o App Password
    private $fromEmail = 'noreply@hidalpi.com';
    private $fromName = 'HidalPi Web';
    
    /**
     * Enviar email de confirmación de cita
     * Send appointment confirmation email
     */
    public function enviarConfirmacionCita($datosCliente, $datosCita) {
        $asunto = 'Confirmación de Cita - HidalPi Web';
        $mensaje = $this->plantillaConfirmacionCita($datosCliente, $datosCita);
        
        return $this->enviarEmail($datosCliente['email'], $asunto, $mensaje);
    }
    
    /**
     * Enviar email de recordatorio de cita
     * Send appointment reminder email
     */
    public function enviarRecordatorioCita($datosCliente, $datosCita) {
        $asunto = 'Recordatorio de Cita - HidalPi Web';
        $mensaje = $this->plantillaRecordatorioCita($datosCliente, $datosCita);
        
        return $this->enviarEmail($datosCliente['email'], $asunto, $mensaje);
    }
    
    /**
     * Enviar email de cancelación de cita
     * Send appointment cancellation email
     */
    public function enviarCancelacionCita($datosCliente, $datosCita) {
        $asunto = 'Cancelación de Cita - HidalPi Web';
        $mensaje = $this->plantillaCancelacionCita($datosCliente, $datosCita);
        
        return $this->enviarEmail($datosCliente['email'], $asunto, $mensaje);
    }
    
    /**
     * Plantilla para confirmación de cita
     */
    private function plantillaConfirmacionCita($cliente, $cita) {
        return "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
                .content { background-color: #f9f9f9; padding: 20px; }
                .footer { background-color: #34495e; color: white; padding: 10px; text-align: center; }
                .cita-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
                .btn { background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Confirmación de Cita</h1>
                    <p>HidalPi Web - Servicios Legales</p>
                </div>
                
                <div class='content'>
                    <h2>Estimado/a {$cliente['nombre']} {$cliente['apellido']},</h2>
                    
                    <p>Nos complace confirmar su cita para servicios legales. A continuación los detalles:</p>
                    
                    <div class='cita-details'>
                        <h3>Detalles de la Cita</h3>
                        <p><strong>Fecha:</strong> {$cita['fecha_cita']}</p>
                        <p><strong>Hora:</strong> {$cita['hora_cita']}</p>
                        <p><strong>Servicio:</strong> {$cita['servicio_nombre']}</p>
                        <p><strong>Abogado:</strong> {$cita['abogado_nombre']} {$cita['abogado_apellido']}</p>
                        <p><strong>Duración estimada:</strong> {$cita['duracion_minutos']} minutos</p>
                        <p><strong>Precio:</strong> $" . number_format($cita['precio'], 0, ',', '.') . "</p>
                    </div>
                    
                    <p><strong>Información importante:</strong></p>
                    <ul>
                        <li>Por favor llegue 10 minutos antes de la cita</li>
                        <li>Traiga documentos de identidad válidos</li>
                        <li>Prepare toda la documentación relevante para su consulta</li>
                        <li>Si necesita cancelar o reprogramar, hágalo con al menos 24 horas de anticipación</li>
                    </ul>
                    
                    <p>Si tiene alguna pregunta o necesita reprogramar, no dude en contactarnos.</p>
                    
                    <div style='text-align: center; margin: 20px 0;'>
                        <a href='mailto:info@hidalpi.com' class='btn'>Contactar Soporte</a>
                    </div>
                </div>
                
                <div class='footer'>
                    <p>© 2024 HidalPi Web - Servicios Legales</p>
                    <p>Email: info@hidalpi.com | Teléfono: +57 1 234 5678</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }
    
    /**
     * Plantilla para recordatorio de cita
     */
    private function plantillaRecordatorioCita($cliente, $cita) {
        return "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #e67e22; color: white; padding: 20px; text-align: center; }
                .content { background-color: #f9f9f9; padding: 20px; }
                .footer { background-color: #34495e; color: white; padding: 10px; text-align: center; }
                .cita-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
                .alert { background-color: #f39c12; color: white; padding: 10px; border-radius: 5px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Recordatorio de Cita</h1>
                    <p>HidalPi Web - Servicios Legales</p>
                </div>
                
                <div class='content'>
                    <h2>Estimado/a {$cliente['nombre']} {$cliente['apellido']},</h2>
                    
                    <div class='alert'>
                        <strong>¡Recordatorio!</strong> Su cita está programada para mañana.
                    </div>
                    
                    <div class='cita-details'>
                        <h3>Detalles de la Cita</h3>
                        <p><strong>Fecha:</strong> {$cita['fecha_cita']}</p>
                        <p><strong>Hora:</strong> {$cita['hora_cita']}</p>
                        <p><strong>Servicio:</strong> {$cita['servicio_nombre']}</p>
                        <p><strong>Abogado:</strong> {$cita['abogado_nombre']} {$cita['abogado_apellido']}</p>
                    </div>
                    
                    <p>No olvide traer:</p>
                    <ul>
                        <li>Documento de identidad</li>
                        <li>Documentación relevante para su consulta</li>
                        <li>Cualquier comunicación previa relacionada con su caso</li>
                    </ul>
                    
                    <p>Si necesita cancelar o reprogramar, por favor contáctenos lo antes posible.</p>
                </div>
                
                <div class='footer'>
                    <p>© 2024 HidalPi Web - Servicios Legales</p>
                    <p>Email: info@hidalpi.com | Teléfono: +57 1 234 5678</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }
    
    /**
     * Plantilla para cancelación de cita
     */
    private function plantillaCancelacionCita($cliente, $cita) {
        return "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #e74c3c; color: white; padding: 20px; text-align: center; }
                .content { background-color: #f9f9f9; padding: 20px; }
                .footer { background-color: #34495e; color: white; padding: 10px; text-align: center; }
                .cita-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
                .btn { background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Cancelación de Cita</h1>
                    <p>HidalPi Web - Servicios Legales</p>
                </div>
                
                <div class='content'>
                    <h2>Estimado/a {$cliente['nombre']} {$cliente['apellido']},</h2>
                    
                    <p>Su cita ha sido cancelada exitosamente. A continuación los detalles de la cita cancelada:</p>
                    
                    <div class='cita-details'>
                        <h3>Detalles de la Cita Cancelada</h3>
                        <p><strong>Fecha:</strong> {$cita['fecha_cita']}</p>
                        <p><strong>Hora:</strong> {$cita['hora_cita']}</p>
                        <p><strong>Servicio:</strong> {$cita['servicio_nombre']}</p>
                        <p><strong>Abogado:</strong> {$cita['abogado_nombre']} {$cita['abogado_apellido']}</p>
                    </div>
                    
                    <p>Si desea programar una nueva cita, no dude en contactarnos.</p>
                    
                    <div style='text-align: center; margin: 20px 0;'>
                        <a href='mailto:info@hidalpi.com' class='btn'>Agendar Nueva Cita</a>
                    </div>
                </div>
                
                <div class='footer'>
                    <p>© 2024 HidalPi Web - Servicios Legales</p>
                    <p>Email: info@hidalpi.com | Teléfono: +57 1 234 5678</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }
    
    /**
     * Función principal para enviar emails
     * Main function to send emails
     */
    private function enviarEmail($destinatario, $asunto, $mensaje) {
        // Versión simplificada sin PHPMailer - usar mail() de PHP
        // Para producción, recomendamos usar PHPMailer
        
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: {$this->fromName} <{$this->fromEmail}>" . "\r\n";
        $headers .= "Reply-To: {$this->fromEmail}" . "\r\n";
        
        try {
            $resultado = mail($destinatario, $asunto, $mensaje, $headers);
            
            if ($resultado) {
                return ['success' => true, 'message' => 'Email enviado exitosamente'];
            } else {
                return ['success' => false, 'message' => 'Error al enviar email'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error al enviar email: ' . $e->getMessage()];
        }
    }
    
    /**
     * Versión con PHPMailer (para usar cuando esté instalado)
     */
    private function enviarEmailConPHPMailer($destinatario, $asunto, $mensaje) {
        /*
        use PHPMailer\PHPMailer\PHPMailer;
        use PHPMailer\PHPMailer\SMTP;
        use PHPMailer\PHPMailer\Exception;
        
        require 'vendor/autoload.php';
        
        $mail = new PHPMailer(true);
        
        try {
            // Configuración del servidor
            $mail->isSMTP();
            $mail->Host       = $this->host;
            $mail->SMTPAuth   = true;
            $mail->Username   = $this->username;
            $mail->Password   = $this->password;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = $this->port;
            
            // Configuración del remitente y destinatario
            $mail->setFrom($this->fromEmail, $this->fromName);
            $mail->addAddress($destinatario);
            
            // Contenido del email
            $mail->isHTML(true);
            $mail->Subject = $asunto;
            $mail->Body    = $mensaje;
            
            $mail->send();
            return ['success' => true, 'message' => 'Email enviado exitosamente'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error al enviar email: ' . $mail->ErrorInfo];
        }
        */
    }
}

// Función helper para enviar confirmación de cita
function enviarConfirmacionCita($citaId) {
    require_once '../config/database.php';
    
    $pdo = getConnection();
    
    // Obtener datos completos de la cita
    $stmt = $pdo->prepare("
        SELECT 
            c.id, c.fecha_cita, c.hora_cita, c.precio, c.notas,
            cl.nombre as cliente_nombre, cl.apellido as cliente_apellido, cl.email as cliente_email,
            a.nombre as abogado_nombre, a.apellido as abogado_apellido,
            s.nombre as servicio_nombre, s.duracion_minutos
        FROM citas c
        INNER JOIN clientes cl ON c.cliente_id = cl.id
        INNER JOIN abogados a ON c.abogado_id = a.id
        INNER JOIN servicios s ON c.servicio_id = s.id
        WHERE c.id = ?
    ");
    
    $stmt->execute([$citaId]);
    $cita = $stmt->fetch();
    
    if (!$cita) {
        return ['success' => false, 'message' => 'Cita no encontrada'];
    }
    
    $datosCliente = [
        'nombre' => $cita['cliente_nombre'],
        'apellido' => $cita['cliente_apellido'],
        'email' => $cita['cliente_email']
    ];
    
    $datosCita = [
        'fecha_cita' => $cita['fecha_cita'],
        'hora_cita' => $cita['hora_cita'],
        'servicio_nombre' => $cita['servicio_nombre'],
        'abogado_nombre' => $cita['abogado_nombre'],
        'abogado_apellido' => $cita['abogado_apellido'],
        'duracion_minutos' => $cita['duracion_minutos'],
        'precio' => $cita['precio']
    ];
    
    $emailService = new EmailService();
    return $emailService->enviarConfirmacionCita($datosCliente, $datosCita);
}
?>