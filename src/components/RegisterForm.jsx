import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, MapPin, Phone, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import countriesLatam from '../data/countriesLatam.json';
import { 
  isValidEmail, 
  isValidPhone, 
  isValidCedula, 
  validatePassword, 
  validateName, 
  validatePasswordMatch, 
  sanitizeString, 
  getNetworkErrorMessage,
  debounce
} from '../utils/validation';

function RegisterForm() {
  // Form data state
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    cedula: '',
    password: '',
    confirmPassword: '',
    pais: 'Ecuador',
    provincia: 'El Oro',
    canton: 'Machala',
    tipo_usuario: 'cliente'
  });

  // Location state
  const [provinces, setProvinces] = useState(Object.keys(countriesLatam['Ecuador'] || {}));
  const [cantons, setCantons] = useState(countriesLatam['Ecuador']['El Oro'] || []);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Debounced validation functions
  const debouncedValidateEmail = debounce(async (email) => {
    if (email && isValidEmail(email)) {
      try {
        // Check if email already exists
        const response = await fetch(`http://localhost:8000/backend/api/auth.php?action=check_email&email=${encodeURIComponent(email)}`);
        const result = await response.json();
        
        if (result.exists) {
          setErrors(prev => ({ ...prev, email: 'Este email ya está registrado' }));
        } else {
          setErrors(prev => ({ ...prev, email: '' }));
        }
      } catch (error) {
        // Ignore network errors for email check
      }
    }
  }, 500);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Real-time validation for email
    if (name === 'email' && value) {
      debouncedValidateEmail(value);
    }
  };

  // Handle field blur for validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  // Validate individual field
  const validateField = (fieldName, value) => {
    let error = '';
    
    switch (fieldName) {
      case 'nombre':
        const nameValidation = validateName(value);
        if (!nameValidation.isValid) {
          error = nameValidation.message;
        }
        break;
        
      case 'email':
        if (!value) {
          error = 'El email es requerido';
        } else if (!isValidEmail(value)) {
          error = 'Formato de email inválido';
        }
        break;
        
      case 'telefono':
        if (!value) {
          error = 'El teléfono es requerido';
        } else if (!isValidPhone(value)) {
          error = 'Formato de teléfono inválido para Ecuador';
        }
        break;
        
      case 'cedula':
        if (value && !isValidCedula(value)) {
          error = 'Número de cédula inválido';
        }
        break;
        
      case 'password':
        if (!value) {
          error = 'La contraseña es requerida';
        } else {
          const passwordValidation = validatePassword(value);
          if (!passwordValidation.isValid) {
            error = passwordValidation.errors[0];
          }
        }
        break;
        
      case 'confirmPassword':
        if (!value) {
          error = 'Confirme su contraseña';
        } else {
          const matchValidation = validatePasswordMatch(formData.password, value);
          if (!matchValidation.isValid) {
            error = matchValidation.message;
          }
        }
        break;
        
      case 'pais':
        if (!value) {
          error = 'Seleccione un país';
        }
        break;
        
      case 'provincia':
        if (!value) {
          error = 'Seleccione una provincia';
        }
        break;
        
      case 'canton':
        if (!value) {
          error = 'Seleccione un cantón';
        }
        break;
    }
    
    setErrors(prev => ({ ...prev, [fieldName]: error }));
    return !error;
  };

  // Handle location changes
  const handleCountryChange = (e) => {
    const country = e.target.value;
    setFormData(prev => ({ ...prev, pais: country, provincia: '', canton: '' }));
    setProvinces(Object.keys(countriesLatam[country] || {}));
    setCantons([]);
    setTouchedFields(prev => ({ ...prev, pais: true }));
  };

  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setFormData(prev => ({ ...prev, provincia: province, canton: '' }));
    setCantons(countriesLatam[formData.pais][province] || []);
    setTouchedFields(prev => ({ ...prev, provincia: true }));
  };

  const handleCantonChange = (e) => {
    const canton = e.target.value;
    setFormData(prev => ({ ...prev, canton }));
    setTouchedFields(prev => ({ ...prev, canton: true }));
  };

  // Validate entire form
  const validateForm = () => {
    const requiredFields = ['nombre', 'email', 'telefono', 'password', 'confirmPassword', 'pais', 'provincia', 'canton'];
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });
    
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submitData = {
        nombre: sanitizeString(formData.nombre),
        email: sanitizeString(formData.email),
        telefono: sanitizeString(formData.telefono),
        cedula: sanitizeString(formData.cedula),
        password: formData.password,
        pais: sanitizeString(formData.pais),
        provincia: sanitizeString(formData.provincia),
        canton: sanitizeString(formData.canton),
        tipo_usuario: formData.tipo_usuario
      };
      
      const response = await fetch('http://localhost:8000/backend/api/auth.php?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setIsSuccess(true);
        setErrors({});
        // Reset form
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          cedula: '',
          password: '',
          confirmPassword: '',
          pais: 'Ecuador',
          provincia: 'El Oro',
          canton: 'Machala',
          tipo_usuario: 'cliente'
        });
        setTouchedFields({});
      } else {
        setErrors({ submit: result.error || 'Error al registrar usuario' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: getNetworkErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update location dropdowns when country changes
  useEffect(() => {
    if (formData.pais) {
      setProvinces(Object.keys(countriesLatam[formData.pais] || {}));
    }
  }, [formData.pais]);

  useEffect(() => {
    if (formData.pais && formData.provincia) {
      setCantons(countriesLatam[formData.pais][formData.provincia] || []);
    }
  }, [formData.pais, formData.provincia]);

  // Success state
  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Registro Exitoso!</h2>
          <p className="text-gray-600 mb-6">
            Su cuenta ha sido creada correctamente. Ahora puede iniciar sesión con sus credenciales.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Registrar Otro Usuario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Crear Cuenta</h2>
        <p className="text-gray-600">Complete el formulario para registrarse</p>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{errors.submit}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
          
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="h-4 w-4 inline mr-1" />
              Nombre Completo *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                touchedFields.nombre && errors.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ingrese su nombre completo"
            />
            {touchedFields.nombre && errors.nombre && (
              <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="h-4 w-4 inline mr-1" />
              Correo Electrónico *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                touchedFields.email && errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="correo@ejemplo.com"
            />
            {touchedFields.email && errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone className="h-4 w-4 inline mr-1" />
              Teléfono *
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                touchedFields.telefono && errors.telefono ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0987654321"
            />
            {touchedFields.telefono && errors.telefono && (
              <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
            )}
          </div>

          {/* Cedula */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <CreditCard className="h-4 w-4 inline mr-1" />
              Cédula de Identidad
            </label>
            <input
              type="text"
              name="cedula"
              value={formData.cedula}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                touchedFields.cedula && errors.cedula ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="1234567890"
            />
            {touchedFields.cedula && errors.cedula && (
              <p className="text-red-500 text-xs mt-1">{errors.cedula}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Opcional</p>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Ubicación</h3>
          
          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="h-4 w-4 inline mr-1" />
              País *
            </label>
            <select
              name="pais"
              value={formData.pais}
              onChange={handleCountryChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                touchedFields.pais && errors.pais ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccione un país</option>
              {Object.keys(countriesLatam).map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            {touchedFields.pais && errors.pais && (
              <p className="text-red-500 text-xs mt-1">{errors.pais}</p>
            )}
          </div>

          {/* Province */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provincia/Estado *
            </label>
            <select
              name="provincia"
              value={formData.provincia}
              onChange={handleProvinceChange}
              onBlur={handleBlur}
              disabled={!provinces.length}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                touchedFields.provincia && errors.provincia ? 'border-red-500' : 'border-gray-300'
              } ${!provinces.length ? 'bg-gray-100' : ''}`}
            >
              <option value="">Seleccione una provincia/estado</option>
              {provinces.map((province) => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
            {touchedFields.provincia && errors.provincia && (
              <p className="text-red-500 text-xs mt-1">{errors.provincia}</p>
            )}
          </div>

          {/* Canton */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantón *
            </label>
            <select
              name="canton"
              value={formData.canton}
              onChange={handleCantonChange}
              onBlur={handleBlur}
              disabled={!cantons.length}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                touchedFields.canton && errors.canton ? 'border-red-500' : 'border-gray-300'
              } ${!cantons.length ? 'bg-gray-100' : ''}`}
            >
              <option value="">Seleccione un cantón</option>
              {cantons.map((canton) => (
                <option key={canton} value={canton}>{canton}</option>
              ))}
            </select>
            {touchedFields.canton && errors.canton && (
              <p className="text-red-500 text-xs mt-1">{errors.canton}</p>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Seguridad</h3>
          
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Lock className="h-4 w-4 inline mr-1" />
              Contraseña *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-10 ${
                  touchedFields.password && errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ingrese su contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {touchedFields.password && errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Lock className="h-4 w-4 inline mr-1" />
              Confirmar Contraseña *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-10 ${
                  touchedFields.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirme su contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {touchedFields.confirmPassword && errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

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
            <>
              <User className="h-4 w-4 mr-2" />
              Registrar
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;