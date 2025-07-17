import React, { useState } from 'react';
import { Send, Star, Calendar, Building, X } from 'lucide-react';
import { isValidEmail, isValidPhone, sanitizeString } from '../utils/validation';
import { useNotification } from './ui/notification';

function PersonalizedConsultationForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    consulta: '',
    area_legal: 'General',
    urgencia: 'Normal',
    tipo_servicio: 'asesoria',
    presupuesto_estimado: '',
    fecha_limite: ''
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

  const tiposServicio = [
    { value: 'asesoria', label: 'Asesoría Legal' },
    { value: 'representacion', label: 'Representación Legal' },
    { value: 'redaccion', label: 'Redacción de Documentos' },
    { value: 'revision', label: 'Revisión de Contratos' },
    { value: 'otro', label: 'Otro' }
  ];

  const rangosPresupuesto = [
    'Menos de $500',
    '$500 - $1,000',
    '$1,000 - $2,500',
    '$2,500 - $5,000',
    'Más de $5,000',
    'A convenir'
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
    } else if (formData.consulta.trim().length < 50) {
      newErrors.consulta = 'La consulta personalizada debe tener al menos 50 caracteres';
    }

    if (!formData.tipo_servicio) {
      newErrors.tipo_servicio = 'Debe seleccionar un tipo de servicio';
    }

    // Validar fecha límite si se proporciona
    if (formData.fecha_limite) {
      const fechaLimite = new Date(formData.fecha_limite);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaLimite < hoy) {
        newErrors.fecha_limite = 'La fecha límite no puede ser anterior a hoy';
      }
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
        empresa: sanitizeString(formData.empresa),
        consulta: sanitizeString(formData.consulta),
        area_legal: sanitizeString(formData.area_legal),
        urgencia: sanitizeString(formData.urgencia),
        tipo_servicio: sanitizeString(formData.tipo_servicio),
        presupuesto_estimado: sanitizeString(formData.presupuesto_estimado),
        fecha_limite: formData.fecha_limite || null
      };

      const response = await fetch('http://localhost:8000/backend/api/consultations.php?action=create_personalized', {
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
      empresa: '',
      consulta: '',
      area_legal: 'General',
      urgencia: 'Normal',
      tipo_servicio: 'asesoria',
      presupuesto_estimado: '',
      fecha_limite: ''
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Consulta Personalizada</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">¿Qué incluye la consulta personalizada?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Análisis detallado de su caso específico</li>
              <li>• Estrategia legal personalizada</li>
              <li>• Propuesta de servicios y costos</li>
              <li>• Tiempo de respuesta: 24 horas</li>
              <li>• Atención especializada y prioritaria</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.telefono ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0987654321"
                  />
                  {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa (opcional)
                  </label>
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre de la empresa"
                  />
                </div>
              </div>
            </div>

            {/* Detalles del Servicio */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Servicio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Servicio *
                  </label>
                  <select
                    name="tipo_servicio"
                    value={formData.tipo_servicio}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.tipo_servicio ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    {tiposServicio.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                    ))}
                  </select>
                  {errors.tipo_servicio && <p className="text-red-500 text-xs mt-1">{errors.tipo_servicio}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Área Legal
                  </label>
                  <select
                    name="area_legal"
                    value={formData.area_legal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {areasLegales.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nivel de Urgencia
                  </label>
                  <select
                    name="urgencia"
                    value={formData.urgencia}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {nivelesUrgencia.map((nivel) => (
                      <option key={nivel} value={nivel}>{nivel}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Presupuesto Estimado
                  </label>
                  <select
                    name="presupuesto_estimado"
                    value={formData.presupuesto_estimado}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar rango</option>
                    {rangosPresupuesto.map((rango) => (
                      <option key={rango} value={rango}>{rango}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Fecha Límite */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Límite (opcional)
              </label>
              <input
                type="date"
                name="fecha_limite"
                value={formData.fecha_limite}
                onChange={handleInputChange}
                min={getMinDate()}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.fecha_limite ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fecha_limite && <p className="text-red-500 text-xs mt-1">{errors.fecha_limite}</p>}
            </div>

            {/* Consulta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción Detallada de su Consulta *
              </label>
              <textarea
                name="consulta"
                value={formData.consulta}
                onChange={handleInputChange}
                rows={8}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.consulta ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Proporcione una descripción detallada de su situación legal, objetivos esperados, antecedentes relevantes, documentos disponibles, fechas importantes, y cualquier información que considere relevante para su caso. Mínimo 50 caracteres."
              />
              {errors.consulta && <p className="text-red-500 text-xs mt-1">{errors.consulta}</p>}
              <p className="text-xs text-gray-500 mt-1">
                {formData.consulta.length} caracteres (mínimo 50)
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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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

export default PersonalizedConsultationForm;