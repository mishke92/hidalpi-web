import React, { useState } from 'react';
import { Calendar, Clock, User, CheckCircle, X } from 'lucide-react';
import { isValidEmail, isValidPhone, sanitizeString } from '../utils/validation';
import { useNotification } from './ui/notification';

function AppointmentBooking({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState({
    servicio: '',
    abogado: '',
    fecha: '',
    hora: '',
    nombre: '',
    email: '',
    telefono: '',
    descripcion: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useNotification();

  const services = [
    { id: 'civil', name: 'Derecho Civil', duration: '60 min' },
    { id: 'commercial', name: 'Derecho Comercial', duration: '90 min' },
    { id: 'labor', name: 'Derecho Laboral', duration: '60 min' },
    { id: 'criminal', name: 'Derecho Penal', duration: '90 min' },
    { id: 'family', name: 'Derecho de Familia', duration: '60 min' },
    { id: 'tax', name: 'Derecho Fiscal', duration: '75 min' },
    { id: 'real-estate', name: 'Derecho Inmobiliario', duration: '60 min' },
    { id: 'consultation', name: 'Consulta General', duration: '45 min' }
  ];

  const lawyers = [
    { id: 'hidalgo', name: 'Dr. Roberto Hidalgo', specialties: ['civil', 'commercial'] },
    { id: 'lopez', name: 'Dra. Patricia López', specialties: ['labor'] },
    { id: 'fernandez', name: 'Dr. Miguel Fernández', specialties: ['criminal'] },
    { id: 'ruiz', name: 'Dra. Carmen Ruiz', specialties: ['family'] },
    { id: 'morales', name: 'Dr. Andrés Morales', specialties: ['real-estate'] },
    { id: 'vargas', name: 'Dra. Lucía Vargas', specialties: ['tax'] },
    { id: 'any', name: 'Cualquier abogado disponible', specialties: ['consultation'] }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData({
      ...appointmentData,
      [name]: value
    });
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getAvailableLawyers = () => {
    if (!appointmentData.servicio) return lawyers;
    return lawyers.filter(lawyer => 
      lawyer.specialties.includes(appointmentData.servicio) || 
      lawyer.id === 'any'
    );
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    switch (stepNumber) {
      case 1:
        if (!appointmentData.servicio) {
          newErrors.servicio = 'Debe seleccionar un servicio';
        }
        break;
      case 2:
        if (!appointmentData.abogado) {
          newErrors.abogado = 'Debe seleccionar un abogado';
        }
        break;
      case 3:
        if (!appointmentData.fecha) {
          newErrors.fecha = 'Debe seleccionar una fecha';
        } else {
          const selectedDate = new Date(appointmentData.fecha);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (selectedDate < today) {
            newErrors.fecha = 'La fecha no puede ser anterior a hoy';
          }
        }
        
        if (!appointmentData.hora) {
          newErrors.hora = 'Debe seleccionar una hora';
        }
        break;
      case 4:
        if (!appointmentData.nombre.trim()) {
          newErrors.nombre = 'El nombre es requerido';
        } else if (appointmentData.nombre.trim().length < 2) {
          newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        }
        
        if (!appointmentData.email.trim()) {
          newErrors.email = 'El email es requerido';
        } else if (!isValidEmail(appointmentData.email)) {
          newErrors.email = 'Formato de email inválido';
        }
        
        if (!appointmentData.telefono.trim()) {
          newErrors.telefono = 'El teléfono es requerido';
        } else if (!isValidPhone(appointmentData.telefono)) {
          newErrors.telefono = 'Formato de teléfono inválido. Use formato ecuatoriano (ej: 0987654321)';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getNextAvailableDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    
    try {
      const appointmentPayload = {
        servicio: sanitizeString(appointmentData.servicio),
        abogado: sanitizeString(appointmentData.abogado),
        fecha: sanitizeString(appointmentData.fecha),
        hora: sanitizeString(appointmentData.hora),
        nombre: sanitizeString(appointmentData.nombre),
        email: sanitizeString(appointmentData.email),
        telefono: sanitizeString(appointmentData.telefono),
        descripcion: sanitizeString(appointmentData.descripcion)
      };

      const response = await fetch('http://localhost:8000/backend/api/appointments.php?action=create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentPayload)
      });

      const result = await response.json();
      
      if (result.success) {
        setStep(5); // Mostrar confirmación
        showSuccess('¡Cita agendada exitosamente! Recibirá un email con los detalles.');
      } else {
        showError(result.error || 'Error al crear la cita');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Error de conexión. Por favor, intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form state
    setStep(1);
    setAppointmentData({
      servicio: '',
      abogado: '',
      fecha: '',
      hora: '',
      nombre: '',
      email: '',
      telefono: '',
      descripcion: ''
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Agendar Cita</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((stepNum) => (
                <React.Fragment key={stepNum}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step > stepNum ? <CheckCircle className="h-5 w-5" /> : stepNum}
                  </div>
                  {stepNum < 4 && (
                    <div className={`w-16 h-1 ${step > stepNum ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Seleccione el Servicio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setAppointmentData({...appointmentData, servicio: service.id})}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      appointmentData.servicio === service.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${errors.servicio ? 'border-red-500' : ''}`}
                  >
                    <h4 className="font-semibold text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-600">Duración: {service.duration}</p>
                  </button>
                ))}
              </div>
              {errors.servicio && <p className="text-red-500 text-sm mt-2">{errors.servicio}</p>}
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Seleccione el Abogado</h3>
              <div className="space-y-3">
                {getAvailableLawyers().map((lawyer) => (
                  <button
                    key={lawyer.id}
                    onClick={() => setAppointmentData({...appointmentData, abogado: lawyer.id})}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                      appointmentData.abogado === lawyer.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${errors.abogado ? 'border-red-500' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <User className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{lawyer.name}</h4>
                        <p className="text-sm text-gray-600">
                          Especialista en {lawyer.specialties.join(', ')}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {errors.abogado && <p className="text-red-500 text-sm mt-2">{errors.abogado}</p>}
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Seleccione Fecha y Hora</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    value={appointmentData.fecha}
                    onChange={handleInputChange}
                    min={getNextAvailableDate()}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.fecha ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.fecha && <p className="text-red-500 text-sm mt-1">{errors.fecha}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora
                  </label>
                  <select
                    name="hora"
                    value={appointmentData.hora}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.hora ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar hora</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  {errors.hora && <p className="text-red-500 text-sm mt-1">{errors.hora}</p>}
                </div>
              </div>
              
              {appointmentData.fecha && appointmentData.hora && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-medium">
                    Cita programada para: {new Date(appointmentData.fecha).toLocaleDateString('es-EC')} a las {appointmentData.hora}
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Información de Contacto</h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre completo"
                    value={appointmentData.nombre}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.nombre ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={appointmentData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="Teléfono (ej: 0987654321)"
                    value={appointmentData.telefono}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.telefono ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
                </div>
                <textarea
                  name="descripcion"
                  placeholder="Breve descripción de su consulta (opcional)"
                  value={appointmentData.descripcion}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">¡Cita Agendada!</h3>
              <p className="text-gray-600 mb-6">
                Su cita ha sido confirmada. Recibirá un correo electrónico con los detalles.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <h4 className="font-semibold mb-2">Detalles de la Cita:</h4>
                <p><strong>Servicio:</strong> {services.find(s => s.id === appointmentData.servicio)?.name}</p>
                <p><strong>Abogado:</strong> {lawyers.find(l => l.id === appointmentData.abogado)?.name}</p>
                <p><strong>Fecha:</strong> {new Date(appointmentData.fecha).toLocaleDateString('es-EC')}</p>
                <p><strong>Hora:</strong> {appointmentData.hora}</p>
                <p><strong>Cliente:</strong> {appointmentData.nombre}</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && step < 5 && (
              <button
                onClick={handlePrev}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anterior
              </button>
            )}
            
            {step < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-auto"
              >
                Siguiente
              </button>
            ) : step === 4 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar Cita'}
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentBooking;

