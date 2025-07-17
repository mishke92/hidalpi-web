<?php
/**
 * Sistema de soporte multiidioma
 * Multi-language support system
 */

class LanguageService {
    private $currentLanguage = 'es';
    private $supportedLanguages = ['es', 'en'];
    private $translations = [];
    private $langDir;
    
    public function __construct($language = 'es') {
        $this->langDir = __DIR__ . '/';
        $this->setLanguage($language);
    }
    
    /**
     * Establecer idioma actual
     * Set current language
     */
    public function setLanguage($language) {
        if (in_array($language, $this->supportedLanguages)) {
            $this->currentLanguage = $language;
            $this->loadTranslations();
        }
    }
    
    /**
     * Obtener idioma actual
     * Get current language
     */
    public function getCurrentLanguage() {
        return $this->currentLanguage;
    }
    
    /**
     * Obtener idiomas soportados
     * Get supported languages
     */
    public function getSupportedLanguages() {
        return $this->supportedLanguages;
    }
    
    /**
     * Cargar traducciones del idioma actual
     * Load translations for current language
     */
    private function loadTranslations() {
        $langFile = $this->langDir . $this->currentLanguage . '/messages.php';
        
        if (file_exists($langFile)) {
            $this->translations = include $langFile;
        } else {
            $this->translations = [];
        }
    }
    
    /**
     * Obtener traducción de una clave
     * Get translation for a key
     */
    public function get($key, $replacements = []) {
        $keys = explode('.', $key);
        $translation = $this->translations;
        
        foreach ($keys as $k) {
            if (isset($translation[$k])) {
                $translation = $translation[$k];
            } else {
                return $key; // Devolver la clave si no se encuentra traducción
            }
        }
        
        // Aplicar reemplazos
        if (!empty($replacements)) {
            foreach ($replacements as $placeholder => $value) {
                $translation = str_replace(':' . $placeholder, $value, $translation);
            }
        }
        
        return $translation;
    }
    
    /**
     * Función helper para traducir
     * Helper function to translate
     */
    public function translate($key, $replacements = []) {
        return $this->get($key, $replacements);
    }
    
    /**
     * Función helper corta
     * Short helper function
     */
    public function t($key, $replacements = []) {
        return $this->get($key, $replacements);
    }
    
    /**
     * Detectar idioma desde header HTTP
     * Detect language from HTTP header
     */
    public function detectLanguageFromHeader() {
        $acceptLanguage = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '';
        
        if (preg_match('/^es/i', $acceptLanguage)) {
            return 'es';
        } elseif (preg_match('/^en/i', $acceptLanguage)) {
            return 'en';
        }
        
        return 'es'; // Idioma por defecto
    }
    
    /**
     * Obtener todas las traducciones para JavaScript
     * Get all translations for JavaScript
     */
    public function getJavaScriptTranslations($keys = []) {
        if (empty($keys)) {
            return json_encode($this->translations);
        }
        
        $jsTranslations = [];
        foreach ($keys as $key) {
            $jsTranslations[$key] = $this->get($key);
        }
        
        return json_encode($jsTranslations);
    }
    
    /**
     * Formatear fecha según idioma
     * Format date according to language
     */
    public function formatDate($date, $format = 'long') {
        $timestamp = is_string($date) ? strtotime($date) : $date;
        
        if ($this->currentLanguage === 'es') {
            $months = [
                1 => 'enero', 2 => 'febrero', 3 => 'marzo', 4 => 'abril',
                5 => 'mayo', 6 => 'junio', 7 => 'julio', 8 => 'agosto',
                9 => 'septiembre', 10 => 'octubre', 11 => 'noviembre', 12 => 'diciembre'
            ];
            
            $days = [
                0 => 'domingo', 1 => 'lunes', 2 => 'martes', 3 => 'miércoles',
                4 => 'jueves', 5 => 'viernes', 6 => 'sábado'
            ];
            
            $day = date('j', $timestamp);
            $month = $months[date('n', $timestamp)];
            $year = date('Y', $timestamp);
            $weekday = $days[date('w', $timestamp)];
            
            switch ($format) {
                case 'long':
                    return "$weekday, $day de $month de $year";
                case 'medium':
                    return "$day de $month de $year";
                case 'short':
                    return "$day/$month/$year";
                default:
                    return date('d/m/Y', $timestamp);
            }
        } else {
            switch ($format) {
                case 'long':
                    return date('l, F j, Y', $timestamp);
                case 'medium':
                    return date('F j, Y', $timestamp);
                case 'short':
                    return date('m/d/Y', $timestamp);
                default:
                    return date('m/d/Y', $timestamp);
            }
        }
    }
    
    /**
     * Formatear número según idioma
     * Format number according to language
     */
    public function formatNumber($number, $decimals = 0) {
        if ($this->currentLanguage === 'es') {
            return number_format($number, $decimals, ',', '.');
        } else {
            return number_format($number, $decimals, '.', ',');
        }
    }
    
    /**
     * Formatear moneda según idioma
     * Format currency according to language
     */
    public function formatCurrency($amount, $currency = 'COP') {
        $formatted = $this->formatNumber($amount, 0);
        
        if ($this->currentLanguage === 'es') {
            return '$' . $formatted . ' ' . $currency;
        } else {
            return $currency . ' $' . $formatted;
        }
    }
}

// Instancia global del servicio de idiomas
$langService = new LanguageService();

// Función helper global
function __($key, $replacements = []) {
    global $langService;
    return $langService->get($key, $replacements);
}

// Función helper para traducir
function trans($key, $replacements = []) {
    global $langService;
    return $langService->translate($key, $replacements);
}

// Función helper corta
function t($key, $replacements = []) {
    global $langService;
    return $langService->t($key, $replacements);
}
?>