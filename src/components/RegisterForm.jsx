import React, { useState, useEffect } from 'react';
import countriesLatam from '../data/countriesLatam.json';
import { 
  validateFormData, 
  validateLocation, 
  validatePasswordConfirmation, 
  validateTermsAcceptance,
  isValidEmail,
  validatePassword,
  sanitizeString
} from '../utils/validation.js';

function RegisterForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
    pais: 'Ecuador',
    provincia: 'El Oro',
    canton: 'Machala',
    telefono: '',
    cedula: '',
    direccion: '',
    termsAccepted: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [provinces, setProvinces] = useState(Object.keys(countriesLatam['Ecuador'] || {}));
  const [cantons, setCantons] = useState(countriesLatam['Ecuador']['El Oro'] || []);

  // Update provinces when country changes
  useEffect(() => {
    if (formData.pais && countriesLatam[formData.pais]) {
      const countryProvinces = Object.keys(countriesLatam[formData.pais]);
      setProvinces(countryProvinces);
      
      // Reset province and canton if current selections are invalid
      if (!countryProvinces.includes(formData.provincia)) {
        setFormData(prev => ({
          ...prev,
          provincia: '',
          canton: ''
        }));
        setCantons([]);
      }
    }
  }, [formData.pais, formData.provincia]);

  // Update cantons when province changes
  useEffect(() => {
    if (formData.pais && formData.provincia && countriesLatam[formData.pais] && countriesLatam[formData.pais][formData.provincia]) {
      const provinceCantons = countriesLatam[formData.pais][formData.provincia];
      setCantons(provinceCantons);
      
      // Reset canton if current selection is invalid
      if (!provinceCantons.includes(formData.canton)) {
        setFormData(prev => ({
          ...prev,
          canton: ''
        }));
      }
    }
  }, [formData.pais, formData.provincia, formData.canton]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : sanitizeString(value)
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear submit message when user makes changes
    if (submitMessage) {
      setSubmitMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = {
      nombre: 'El nombre es requerido',
      email: 'El email es requerido',
      password: 'La contraseña es requerida',
      confirmPassword: 'La confirmación de contraseña es requerida',
      userType: 'El tipo de usuario es requerido',
      pais: 'El país es requerido',
      provincia: 'La provincia es requerida',
      canton: 'El cantón es requerido'
    };
    
    const requiredValidation = validateFormData(formData, { required: requiredFields });
    if (!requiredValidation.isValid) {
      Object.assign(newErrors, requiredValidation.errors);
    }
    
    // Email validation
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }
    
    // Password validation
    if (formData.password) {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0]; // Show first error
      }
    }
    
    // Password confirmation validation
    if (formData.password && formData.confirmPassword) {
      const confirmValidation = validatePasswordConfirmation(formData.password, formData.confirmPassword);
      if (!confirmValidation.isValid) {
        newErrors.confirmPassword = confirmValidation.error;
      }
    }
    
    // Location validation
    const locationValidation = validateLocation(formData.pais, formData.provincia, formData.canton, countriesLatam);
    if (!locationValidation.isValid) {
      Object.assign(newErrors, locationValidation.errors);
    }
    
    // Terms acceptance validation
    const termsValidation = validateTermsAcceptance(formData.termsAccepted);
    if (!termsValidation.isValid) {
      newErrors.termsAccepted = termsValidation.error;
    }
    
    // User type validation
    if (formData.userType && !['cliente', 'admin', 'abogado'].includes(formData.userType)) {
      newErrors.userType = 'Tipo de usuario no válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitMessage('Por favor, corrija los errores antes de continuar');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      const dataToSubmit = {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        tipo_usuario: formData.userType,
        pais: formData.pais,
        provincia: formData.provincia,
        canton: formData.canton,
        telefono: formData.telefono,
        cedula: formData.cedula,
        direccion: formData.direccion
      };
      
      const response = await fetch('http://localhost:8000/backend/api/auth.php?action=register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSubmit)
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitMessage('¡Registro exitoso! Puede iniciar sesión ahora.');
        // Reset form
        setFormData({
          nombre: '',
          email: '',
          password: '',
          confirmPassword: '',
          userType: '',
          pais: 'Ecuador',
          provincia: 'El Oro',
          canton: 'Machala',
          telefono: '',
          cedula: '',
          direccion: '',
          termsAccepted: false
        });
        setErrors({});
      } else {
        setSubmitMessage(result.error || 'Error al registrar usuario');
      }
      
    } catch (error) {
      console.error('Error:', error);
      setSubmitMessage('Error de conexión. Verifique su conexión a internet e intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Registro de Usuario</h2>
      
      {submitMessage && (
        <div className={`mb-4 p-3 rounded-lg ${
          submitMessage.includes('exitoso') 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {submitMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ingrese su nombre completo"
              disabled={isSubmitting}
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
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
              placeholder="ejemplo@correo.com"
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Mínimo 8 caracteres"
              disabled={isSubmitting}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirme su contraseña"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* User Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Usuario *
          </label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.userType ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          >
            <option value="">Seleccione un tipo de usuario</option>
            <option value="cliente">Cliente</option>
            <option value="abogado">Abogado</option>
            <option value="admin">Administrador</option>
          </select>
          {errors.userType && <p className="text-red-500 text-sm mt-1">{errors.userType}</p>}
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              País *
            </label>
            <select
              name="pais"
              value={formData.pais}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.pais ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            >
              <option value="">Seleccione un país</option>
              {Object.keys(countriesLatam).map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            {errors.pais && <p className="text-red-500 text-sm mt-1">{errors.pais}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provincia/Estado *
            </label>
            <select
              name="provincia"
              value={formData.provincia}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.provincia ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting || !provinces.length}
            >
              <option value="">Seleccione una provincia/estado</option>
              {provinces.map((province) => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
            {errors.provincia && <p className="text-red-500 text-sm mt-1">{errors.provincia}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantón *
            </label>
            <select
              name="canton"
              value={formData.canton}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.canton ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting || !cantons.length}
            >
              <option value="">Seleccione un cantón</option>
              {cantons.map((canton) => (
                <option key={canton} value={canton}>{canton}</option>
              ))}
            </select>
            {errors.canton && <p className="text-red-500 text-sm mt-1">{errors.canton}</p>}
          </div>
        </div>

        {/* Optional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.telefono ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="09XXXXXXXX"
              disabled={isSubmitting}
            />
            {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cédula
            </label>
            <input
              type="text"
              name="cedula"
              value={formData.cedula}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.cedula ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="1234567890"
              disabled={isSubmitting}
            />
            {errors.cedula && <p className="text-red-500 text-sm mt-1">{errors.cedula}</p>}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <textarea
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.direccion ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Dirección completa (opcional)"
            disabled={isSubmitting}
          />
          {errors.direccion && <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>}
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleInputChange}
            className="mt-1"
            disabled={isSubmitting}
          />
          <label className="text-sm text-gray-700">
            Acepto los <a href="#" className="text-blue-600 hover:text-blue-800">términos y condiciones</a> 
            y las <a href="#" className="text-blue-600 hover:text-blue-800">políticas de privacidad</a>
          </label>
        </div>
        {errors.termsAccepted && <p className="text-red-500 text-sm mt-1">{errors.termsAccepted}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Registrando...
            </>
          ) : (
            'Registrar Usuario'
          )}
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;