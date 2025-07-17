<?php
/**
 * Test básico de funcionalidad
 * Basic functionality test
 */

header('Content-Type: text/html; charset=UTF-8');

echo "<h1>Test de Funcionalidad HidalPi Ecuador</h1>";

// Test 1: Verificar conexión a base de datos
echo "<h2>1. Conexión a Base de Datos</h2>";
try {
    require_once 'backend/config/database.php';
    $pdo = getConnection();
    echo "✅ Conexión exitosa a la base de datos<br>";
} catch (Exception $e) {
    echo "❌ Error de conexión: " . $e->getMessage() . "<br>";
}

// Test 2: Verificar AuthService
echo "<h2>2. Servicio de Autenticación</h2>";
try {
    require_once 'backend/auth/AuthService.php';
    $authService = new AuthService();
    echo "✅ AuthService cargado correctamente<br>";
} catch (Exception $e) {
    echo "❌ Error en AuthService: " . $e->getMessage() . "<br>";
}

// Test 3: Verificar APIs
echo "<h2>3. APIs Disponibles</h2>";
$apis = [
    'auth.php' => 'Autenticación',
    'companies.php' => 'Empresas',
    'appointments.php' => 'Citas'
];

foreach ($apis as $file => $desc) {
    if (file_exists("backend/api/$file")) {
        echo "✅ API $desc ($file) - Disponible<br>";
    } else {
        echo "❌ API $desc ($file) - No encontrada<br>";
    }
}

// Test 4: Verificar estructura de datos Ecuador
echo "<h2>4. Datos de Ecuador</h2>";
if (file_exists('src/data/countriesLatam.json')) {
    $countries = json_decode(file_get_contents('src/data/countriesLatam.json'), true);
    if (isset($countries['Ecuador'])) {
        echo "✅ Datos de Ecuador disponibles<br>";
        if (isset($countries['Ecuador']['El Oro'])) {
            echo "✅ Provincia El Oro configurada<br>";
            if (in_array('Machala', $countries['Ecuador']['El Oro'])) {
                echo "✅ Ciudad Machala configurada<br>";
            }
        }
    }
} else {
    echo "❌ Archivo de países no encontrado<br>";
}

// Test 5: Verificar frontend
echo "<h2>5. Frontend</h2>";
if (file_exists('src/pages/Registration.jsx')) {
    echo "✅ Página de registro disponible<br>";
}
if (file_exists('src/components/AppointmentBooking.jsx')) {
    echo "✅ Componente de citas disponible<br>";
}
if (file_exists('src/components/RegisterForm.jsx')) {
    echo "✅ Formulario de registro disponible<br>";
}

echo "<h2>✅ Test completado</h2>";
echo "<p>El sistema está configurado para Ecuador con la empresa matriz en El Oro, Machala.</p>";
?>