<?php
/**
 * Environment configuration loader
 * Loads environment variables from .env file
 */

class Env {
    private static $loaded = false;
    private static $vars = [];
    
    /**
     * Load environment variables from .env file
     */
    public static function load($path = null) {
        if (self::$loaded) {
            return;
        }
        
        if ($path === null) {
            $path = dirname(dirname(__DIR__)) . '/.env';
        }
        
        if (!file_exists($path)) {
            throw new Exception("Environment file not found: $path");
        }
        
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($lines as $line) {
            // Skip comments
            if (strpos(trim($line), '#') === 0) {
                continue;
            }
            
            // Parse KEY=VALUE
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                
                // Store in both class property and $_ENV
                self::$vars[$key] = $value;
                $_ENV[$key] = $value;
                putenv("$key=$value");
            }
        }
        
        self::$loaded = true;
    }
    
    /**
     * Get environment variable
     */
    public static function get($key, $default = null) {
        if (!self::$loaded) {
            self::load();
        }
        
        return self::$vars[$key] ?? getenv($key) ?: $default;
    }
    
    /**
     * Check if environment variable exists
     */
    public static function has($key) {
        if (!self::$loaded) {
            self::load();
        }
        
        return isset(self::$vars[$key]) || getenv($key) !== false;
    }
}
?>
