import React, { useState } from 'react';
import { User, Building, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, Shield, Users } from 'lucide-react';

function Registration() {
  const [accountType, setAccountType] = useState('individual');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Datos personales
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Datos de empresa (si aplica)
    companyName: '',
    companyType: '',
    taxId: '',
    companyPhone: '',
    companyEmail: '',
    
    // Dirección
    street: '',
    city: 'Machala',
    state: 'El Oro',
    zipCode: '',
    country: 'Ecuador',
    
    // Preferencias
    notifications: true,
    newsletter: true,
    terms: false,
    privacy: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const companyTypes = [
    'Compañía Anónima (C.A.)',
    'Compañía de Responsabilidad Limitada (Cía. Ltda.)',
    'Sociedad Anónima (S.A.)',
    'Persona Natural con Actividad Empresarial',
    'Fundación',
    'Corporación',
    'Asociación',
    'Otro'
  ];

  const states = [
    'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro', 'Esmeraldas', 
    'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos', 'Manabí', 'Morona Santiago', 
    'Napo', 'Orellana', 'Pastaza', 'Pichincha', 'Santa Elena', 'Santo Domingo', 'Sucumbíos', 
    'Tungurahua', 'Zamora Chinchipe'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validaciones básicas
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es requerido';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    else if (formData.password.length < 8) newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validaciones para empresa
    if (accountType === 'company') {
      if (!formData.companyName.trim()) newErrors.companyName = 'El nombre de la empresa es requerido';
      if (!formData.companyType) newErrors.companyType = 'El tipo de empresa es requerido';
      if (!formData.taxId.trim()) newErrors.taxId = 'El RUC es requerido';
    }

    // Validaciones de términos
    if (!formData.terms) newErrors.terms = 'Debe aceptar los términos y condiciones';
    if (!formData.privacy) newErrors.privacy = 'Debe aceptar la política de privacidad';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const userData = {
        nombre: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        pais: formData.country,
        provincia: formData.state,
        canton: formData.city
      };

      const response = await fetch('http://localhost:8000/backend/api/auth.php?action=register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();
      
      if (result.success) {
        alert('¡Registro exitoso! Se ha creado su cuenta correctamente.');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          companyName: '',
          companyType: '',
          taxId: '',
          companyPhone: '',
          companyEmail: '',
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Ecuador',
          notifications: true,
          newsletter: true,
          terms: false,
          privacy: false
        });
      } else {
        alert('Error al registrar: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar. Por favor, intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      title: "Área de Cliente Segura",
      description: "Acceso protegido a sus documentos y casos"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Seguimiento de Casos",
      description: "Monitoree el progreso de sus asuntos legales en tiempo real"
    },
    {
      icon: <Mail className="h-6 w-6 text-blue-600" />,
      title: "Comunicación Directa",
      description: "Contacto directo con su equipo legal asignado"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
      title: "Documentos Digitales",
      description: "Acceso a contratos, reportes y documentación legal"
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Crear Cuenta</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Únase a nuestra plataforma y acceda a servicios legales personalizados, 
              seguimiento de casos y comunicación directa con nuestro equipo.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Formulario de Registro */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Selector de Tipo de Cuenta */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tipo de Cuenta</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setAccountType('individual')}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      accountType === 'individual'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <User className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Persona Física</h3>
                    <p className="text-sm text-gray-600">Para individuos y profesionales independientes</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setAccountType('company')}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      accountType === 'company'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Empresa</h3>
                    <p className="text-sm text-gray-600">Para empresas y organizaciones</p>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información Personal */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Información de Empresa (si aplica) */}
                {accountType === 'company' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la Empresa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre de la Empresa *
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.companyName ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Empresa *
                        </label>
                        <select
                          name="companyType"
                          value={formData.companyType}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.companyType ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Seleccionar tipo</option>
                          {companyTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {errors.companyType && <p className="text-red-500 text-xs mt-1">{errors.companyType}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          RUC *
                        </label>
                        <input
                          type="text"
                          name="taxId"
                          value={formData.taxId}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.taxId ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.taxId && <p className="text-red-500 text-xs mt-1">{errors.taxId}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Dirección */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dirección</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Calle y Número
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Provincia
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccionar provincia</option>
                        {states.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Contraseña */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Seguridad</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-10 ${
                            errors.password ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar Contraseña *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-10 ${
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>

                {/* Preferencias */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferencias</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="notifications"
                        checked={formData.notifications}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Recibir notificaciones sobre el estado de mis casos
                      </span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="newsletter"
                        checked={formData.newsletter}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Suscribirse al boletín informativo con actualizaciones legales
                      </span>
                    </label>
                  </div>
                </div>

                {/* Términos y Condiciones */}
                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Acepto los <a href="#" className="text-blue-600 hover:underline">términos y condiciones</a> *
                    </span>
                  </label>
                  {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}
                  
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="privacy"
                      checked={formData.privacy}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Acepto la <a href="#" className="text-blue-600 hover:underline">política de privacidad</a> *
                    </span>
                  </label>
                  {errors.privacy && <p className="text-red-500 text-xs">{errors.privacy}</p>}
                </div>

                {/* Botón de Envío */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear Cuenta'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Beneficios */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-8 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Beneficios de su Cuenta</h3>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">¿Ya tiene una cuenta?</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Inicie sesión para acceder a su área de cliente
                </p>
                <a 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Iniciar Sesión →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;

