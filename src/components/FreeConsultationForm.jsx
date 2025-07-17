import React, { useState } from 'react';
import { Send, CheckCircle, HelpCircle, X } from 'lucide-react';
import { isValidEmail, isValidPhone, sanitizeString } from '../utils/validation';
import { useNotification } from './ui/notification';

function FreeConsultationForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    consulta: '',
    area_legal: 'General',
    urgencia: 'Normal'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useNotification();

  const areasLegales = [
    'General',
    'Derecho Civil',
    'Derecho Comercial',
    'Derecho Laboral',
    'Derecho Penal',
    'Derecho de Familia',
    'Derecho Fiscal',
    'Derecho Inmobiliario'
  ];

  const nivelesUrgencia = [
    'Normal',
    'Urgente',
    'Muy Urgente'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!isValidPhone(formData.telefono)) {
      newErrors.telefono = 'Formato de teléfono inválido. Use formato ecuatoriano (ej: 0987654321)';
    }

    if (!formData.consulta.trim()) {
      newErrors.consulta = 'La consulta es requerida';
    } else if (formData.consulta.trim().length < 20) {
      newErrors.consulta = 'La consulta debe tener al menos 20 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const consultationData = {
        nombre: sanitizeString(formData.nombre),
        email: sanitizeString(formData.email),
        telefono: sanitizeString(formData.telefono),
        consulta: sanitizeString(formData.consulta),
        area_legal: sanitizeString(formData.area_legal),
        urgencia: sanitizeString(formData.urgencia)
      };

      const response = await fetch('http://localhost:8000/backend/api/consultations.php?action=create_free', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultationData)
      });

      const result = await response.json();
      
      if (result.success) {
        showSuccess(result.message);
        resetForm();
        onClose();
      } else {
        showError(result.error || 'Error al enviar la consulta');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Error de conexión. Por favor, intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      consulta: '',
      area_legal: 'General',
      urgencia: 'Normal'
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Consulta Gratuita</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">¿Qué incluye la consulta gratuita?</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Análisis inicial de su situación legal</li>
              <li>• Orientación sobre los pasos a seguir</li>
              <li>• Tiempo de respuesta: 48 horas</li>
              <li>• Una consulta gratuita por persona cada 30 días</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Información Personal */}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingrese su nombre completo"
                />
                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ejemplo@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    errors.telefono ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0987654321"
                />
                {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Área Legal
                </label>
                <select
                  name="area_legal"
                  value={formData.area_legal}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  {areasLegales.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Urgencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel de Urgencia
              </label>
              <select
                name="urgencia"
                value={formData.urgencia}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {nivelesUrgencia.map((nivel) => (
                  <option key={nivel} value={nivel}>{nivel}</option>
                ))}
              </select>
            </div>

            {/* Consulta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Su Consulta *
              </label>
              <textarea
                name="consulta"
                value={formData.consulta}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  errors.consulta ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describa su situación legal con el mayor detalle posible. Incluya fechas, documentos disponibles, y cualquier información relevante. Mínimo 20 caracteres."
              />
              {errors.consulta && <p className="text-red-500 text-xs mt-1">{errors.consulta}</p>}
              <p className="text-xs text-gray-500 mt-1">
                {formData.consulta.length} caracteres (mínimo 20)
              </p>
            </div>

            {/* Botón de envío */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Enviar Consulta</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FreeConsultationForm;