<?php
/**
 * Security configuration and utilities
 */

require_once __DIR__ . '/env.php';

class Security {
    
    /**
     * Initialize secure session
     */
    public static function initSecureSession() {
        if (session_status() === PHP_SESSION_NONE) {
            // Configure secure session settings
            ini_set('session.cookie_httponly', Env::get('SESSION_HTTPONLY', '1'));
            ini_set('session.use_only_cookies', '1');
            ini_set('session.cookie_secure', Env::get('SESSION_SECURE', '0')); // Set to 1 in production with HTTPS
            ini_set('session.cookie_samesite', Env::get('SESSION_SAMESITE', 'Strict'));
            ini_set('session.use_strict_mode', '1');
            
            // Regenerate session ID periodically
            session_start();
            
            // Regenerate session ID to prevent session fixation
            if (!isset($_SESSION['initialized'])) {
                session_regenerate_id(true);
                $_SESSION['initialized'] = true;
                $_SESSION['created_at'] = time();
            }
            
            // Check session timeout (30 minutes)
            if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > 1800)) {
                session_unset();
                session_destroy();
                session_start();
            }
            $_SESSION['last_activity'] = time();
        }
    }
    
    /**
     * Setup CORS headers with validation
     */
    public static function setupCORS() {
        $allowedOrigins = explode(',', Env::get('ALLOWED_ORIGINS', 'http://localhost:5173'));
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        
        if (in_array($origin, $allowedOrigins)) {
            header("Access-Control-Allow-Origin: $origin");
        }
        
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Credentials: true');
    }
    
    /**
     * Generate CSRF token
     */
    public static function generateCSRFToken() {
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }
    
    /**
     * Validate CSRF token
     */
    public static function validateCSRFToken($token) {
        if (!isset($_SESSION['csrf_token'])) {
            return false;
        }
        return hash_equals($_SESSION['csrf_token'], $token);
    }
    
    /**
     * Enforce HTTPS in production
     */
    public static function enforceHTTPS() {
        if (Env::get('APP_ENV', 'development') === 'production') {
            if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
                header('Location: https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'], true, 301);
                exit;
            }
            
            // Add HSTS header
            header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
        }
    }
    
    /**
     * Add security headers
     */
    public static function addSecurityHeaders() {
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('X-XSS-Protection: 1; mode=block');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';");
    }
    
    /**
     * Sanitize input
     */
    public static function sanitizeInput($input) {
        if (is_array($input)) {
            return array_map([self::class, 'sanitizeInput'], $input);
        }
        
        if (is_string($input)) {
            return trim(htmlspecialchars($input, ENT_QUOTES, 'UTF-8'));
        }
        
        return $input;
    }
    
    /**
     * Validate integer input
     */
    public static function validateInt($value, $min = null, $max = null) {
        if (!filter_var($value, FILTER_VALIDATE_INT)) {
            return false;
        }
        
        $intValue = (int)$value;
        
        if ($min !== null && $intValue < $min) {
            return false;
        }
        
        if ($max !== null && $intValue > $max) {
            return false;
        }
        
        return $intValue;
    }
    
    /**
     * Rate limiting check (simple implementation)
     */
    public static function checkRateLimit($key, $maxAttempts = 5, $timeWindow = 300) {
        if (!isset($_SESSION['rate_limit'])) {
            $_SESSION['rate_limit'] = [];
        }
        
        $now = time();
        $limitKey = $key . '_' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
        
        if (!isset($_SESSION['rate_limit'][$limitKey])) {
            $_SESSION['rate_limit'][$limitKey] = ['count' => 0, 'start' => $now];
        }
        
        $limit = &$_SESSION['rate_limit'][$limitKey];
        
        // Reset if time window expired
        if ($now - $limit['start'] > $timeWindow) {
            $limit = ['count' => 0, 'start' => $now];
        }
        
        $limit['count']++;
        
        if ($limit['count'] > $maxAttempts) {
            http_response_code(429);
            echo json_encode(['error' => 'Too many requests. Please try again later.']);
            exit;
        }
    }
}
?>
