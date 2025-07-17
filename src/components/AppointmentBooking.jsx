import React, { useState } from 'react';
import { Calendar, Clock, User, CheckCircle, X } from 'lucide-react';

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
    setAppointmentData({
      ...appointmentData,
      [e.target.name]: e.target.value
    });
  };

  const getAvailableLawyers = () => {
    if (!appointmentData.servicio) return lawyers;
    return lawyers.filter(lawyer => 
      lawyer.specialties.includes(appointmentData.servicio) || 
      lawyer.id === 'any'
    );
  };

  const getNextAvailableDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    // Validar campos requeridos
    if (!appointmentData.nombre || !appointmentData.email || !appointmentData.telefono) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/backend/api/appointments.php?action=create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });

      const result = await response.json();
      
      if (result.success) {
        setStep(5); // Mostrar confirmación
      } else {
        alert('Error al crear la cita: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la solicitud. Por favor, intente nuevamente.');
    }
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
              onClick={onClose}
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
                    }`}
                  >
                    <h4 className="font-semibold text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-600">Duración: {service.duration}</p>
                  </button>
                ))}
              </div>
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
                    }`}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora
                  </label>
                  <select
                    name="hora"
                    value={appointmentData.hora}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar hora</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
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
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre completo"
                  value={appointmentData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={appointmentData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono"
                  value={appointmentData.telefono}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
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
                disabled={
                  (step === 1 && !appointmentData.servicio) ||
                  (step === 2 && !appointmentData.abogado) ||
                  (step === 3 && (!appointmentData.fecha || !appointmentData.hora))
                }
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              >
                Siguiente
              </button>
            ) : step === 4 ? (
              <button
                onClick={handleSubmit}
                disabled={!appointmentData.nombre || !appointmentData.email || !appointmentData.telefono}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              >
                Confirmar Cita
              </button>
            ) : (
              <button
                onClick={onClose}
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

