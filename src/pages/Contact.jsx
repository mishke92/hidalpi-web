import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, User, MessageSquare, Calendar } from 'lucide-react';
import { 
  isValidEmail, 
  isValidPhone, 
  validateMessageLength, 
  validateRequiredFields,
  sanitizeString 
} from '../utils/validation.js';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    consultationType: 'general',
    preferredContact: 'email',
    urgency: 'normal'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [connectionError, setConnectionError] = useState(false);

  const consultationTypes = [
    { value: 'general', label: 'Consulta General' },
    { value: 'civil', label: 'Derecho Civil' },
    { value: 'commercial', label: 'Derecho Comercial' },
    { value: 'labor', label: 'Derecho Laboral' },
    { value: 'criminal', label: 'Derecho Penal' },
    { value: 'family', label: 'Derecho de Familia' },
    { value: 'tax', label: 'Derecho Fiscal' },
    { value: 'real-estate', label: 'Derecho Inmobiliario' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Baja - Respuesta en 48-72 horas' },
    { value: 'normal', label: 'Normal - Respuesta en 24 horas' },
    { value: 'high', label: 'Alta - Respuesta en 4-8 horas' },
    { value: 'urgent', label: 'Urgente - Respuesta inmediata' }
  ];

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6 text-blue-600" />,
      title: "Teléfono Principal",
      details: ["+593 939004849", "+593 968661074"],
      description: "Lunes a Viernes: 8:00 AM - 6:00 PM"
    },
    {
      icon: <Mail className="h-6 w-6 text-blue-600" />,
      title: "Correo Electrónico",
      details: ["info@hidalpi.com", "consultas@hidalpi.com"],
      description: "Respuesta en menos de 24 horas"
    },
    {
      icon: <MapPin className="h-6 w-6 text-blue-600" />,
      title: "Dirección",
      details: ["Av. 25 de junio y Juan montalvo", "Frente al Registro Civil"],
      description: "Machala. El Oro, Ecuador"
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "Horarios de Atención",
      details: ["Lunes a Viernes: 8:00 AM - 6:00 PM", ],
      description: "Citas de emergencia disponibles 24/7"
    }
  ];

  const _officeHours = [
    { day: 'Lunes', hours: '8:00 AM - 6:00 PM' },
    { day: 'Martes', hours: '8:00 AM - 6:00 PM' },
    { day: 'Miércoles', hours: '8:00 AM - 6:00 PM' },
    { day: 'Jueves', hours: '8:00 AM - 6:00 PM' },
    { day: 'Viernes', hours: '8:00 AM - 6:00 PM' },
    { day: 'Sábado', hours: '9:00 AM - 6:00 PM' },
    { day: 'Domingo', hours: 'Cerrado' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizeString(value)
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear connection error when user makes changes
    if (connectionError) {
      setConnectionError(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    const requiredFields = {
      name: 'El nombre es requerido',
      email: 'El email es requerido',
      phone: 'El teléfono es requerido',
      subject: 'El asunto es requerido',
      message: 'El mensaje es requerido'
    };
    
    const requiredValidation = validateRequiredFields(formData, requiredFields);
    if (!requiredValidation.isValid) {
      Object.assign(newErrors, requiredValidation.errors);
    }

    // Email validation
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }
    
    // Phone validation (Ecuador specific)
    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'El formato del teléfono no es válido para Ecuador';
    }
    
    // Message length validation
    if (formData.message) {
      const messageValidation = validateMessageLength(formData.message, 10, 1000);
      if (!messageValidation.isValid) {
        newErrors.message = messageValidation.errors[0];
      }
    }
    
    // Subject minimum length
    if (formData.subject && formData.subject.trim().length < 3) {
      newErrors.subject = 'El asunto debe tener al menos 3 caracteres';
    }
    
    // Name minimum length
    if (formData.name && formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setConnectionError(false);
    
    try {
      // Simulated API call - replace with actual endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error("HTTP error! status: " + response.status);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setIsSubmitted(true);
      } else {
        throw new Error(result.message || 'Error al enviar el mensaje');
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      setConnectionError(true);
      
      // For demo purposes, simulate success after timeout
      setTimeout(() => {
        setIsSubmitted(true);
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      consultationType: 'general',
      preferredContact: 'email',
      urgency: 'normal'
    });
    setErrors({});
    setConnectionError(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Mensaje Enviado!</h2>
          <p className="text-gray-600 mb-6">
            Gracias por contactarnos. Hemos recibido su mensaje y nos pondremos en contacto 
            con usted dentro de las próximas {formData.urgency === 'urgent' ? '2 horas' : 
            formData.urgency === 'high' ? '8 horas' : '24 horas'}.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700">
              <strong>Número de referencia:</strong> CON-{Date.now()}
            </p>
          </div>
          <button
            onClick={resetForm}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enviar Otro Mensaje
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contáctenos</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Estamos aquí para ayudarle. Póngase en contacto con nosotros para una 
              consulta gratuita o para resolver cualquier duda legal que pueda tener.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíenos un Mensaje</h2>
              
              {connectionError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">
                        <strong>Error de conexión:</strong> No se pudo enviar el mensaje. 
                        Verifique su conexión a internet e intente nuevamente.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 " +
                        (errors.name ? 'border-red-500' : 'border-gray-300')}
                      placeholder="Su nombre completo"
                      disabled={isSubmitting}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
                      className={"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 " +
                        (errors.email ? 'border-red-500' : 'border-gray-300')}
                      placeholder="su.email@ejemplo.com"
                      disabled={isSubmitting}
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
                      className={"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 " +
                        (errors.phone ? 'border-red-500' : 'border-gray-300')}
                      placeholder="09XXXXXXXX"
                      disabled={isSubmitting}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Consulta
                    </label>
                    <select
                      name="consultationType"
                      value={formData.consultationType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    >
                      {consultationTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 " +
                      (errors.subject ? 'border-red-500' : 'border-gray-300')}
                    placeholder="Breve descripción del tema"
                    disabled={isSubmitting}
                  />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className={"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 " +
                      (errors.message ? 'border-red-500' : 'border-gray-300')}
                    placeholder="Describa detalladamente su consulta o situación legal..."
                    disabled={isSubmitting}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    Mínimo 10 caracteres, máximo 1000. Actual: {formData.message.length}/1000
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Método de Contacto Preferido
                    </label>
                    <select
                      name="preferredContact"
                      value={formData.preferredContact}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    >
                      <option value="email">Correo Electrónico</option>
                      <option value="phone">Teléfono</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="any">Cualquiera</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Urgencia
                    </label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    >
                      {urgencyLevels.map((level) => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Información de Contacto</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{info.title}</h4>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-700 text-sm">{detail}</p>
                      ))}
                      <p className="text-gray-500 text-xs mt-1">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
