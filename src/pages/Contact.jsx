import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, User, MessageSquare, Calendar, AlertCircle } from 'lucide-react';
import { 
  isValidEmail, 
  isValidPhone, 
  validateName, 
  validateSubject, 
  validateMessage, 
  sanitizeString,
  getNetworkErrorMessage
} from '../utils/validation';

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
  const [touchedFields, setTouchedFields] = useState({});

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

  const officeHours = [
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
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let error = '';
    
    switch (fieldName) {
      case 'name':
        const nameValidation = validateName(value);
        if (!nameValidation.isValid) {
          error = nameValidation.message;
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          error = 'El email es requerido';
        } else if (!isValidEmail(value)) {
          error = 'Formato de email inválido';
        }
        break;
        
      case 'phone':
        if (!value.trim()) {
          error = 'El teléfono es requerido';
        } else if (!isValidPhone(value)) {
          error = 'Formato de teléfono inválido para Ecuador';
        }
        break;
        
      case 'subject':
        const subjectValidation = validateSubject(value);
        if (!subjectValidation.isValid) {
          error = subjectValidation.message;
        }
        break;
        
      case 'message':
        const messageValidation = validateMessage(value, 10);
        if (!messageValidation.isValid) {
          error = messageValidation.message;
        }
        break;
    }
    
    setErrors(prev => ({ ...prev, [fieldName]: error }));
    return !error;
  };

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'phone', 'subject', 'message'];
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFields = ['name', 'email', 'phone', 'subject', 'message'];
    setTouchedFields(prev => {
      const newTouched = { ...prev };
      allFields.forEach(field => {
        newTouched[field] = true;
      });
      return newTouched;
    });
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = {
        name: sanitizeString(formData.name),
        email: sanitizeString(formData.email),
        phone: sanitizeString(formData.phone),
        subject: sanitizeString(formData.subject),
        message: sanitizeString(formData.message),
        consultationType: formData.consultationType,
        preferredContact: formData.preferredContact,
        urgency: formData.urgency
      };

      // Simulate API call for now - replace with actual endpoint later
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
      setErrors({});
    } catch (error) {
      console.error('Contact form error:', error);
      setErrors({ submit: getNetworkErrorMessage(error) });
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
    setTouchedFields({});
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
      {/* Hero Section */}
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
          {/* Formulario de Contacto */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíenos un Mensaje</h2>
              
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
                {/* Información Personal */}
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
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        touchedFields.name && errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Su nombre completo"
                    />
                    {touchedFields.name && errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
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
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        touchedFields.email && errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="su.email@ejemplo.com"
                    />
                    {touchedFields.email && errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
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
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        touchedFields.phone && errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0987654321"
                    />
                    {touchedFields.phone && errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
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
                    >
                      {consultationTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Asunto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      touchedFields.subject && errors.subject ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Breve descripción del tema"
                  />
                  {touchedFields.subject && errors.subject && (
                    <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                  )}
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    rows={6}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      touchedFields.message && errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describa detalladamente su consulta o situación legal..."
                  />
                  {touchedFields.message && errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Mínimo 10 caracteres. Actual: {formData.message.length}
                  </p>
                </div>

                {/* Preferencias */}
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
                    >
                      {urgencyLevels.map((level) => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>
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

          {/* Información de Contacto */}
          <div className="lg:col-span-1 space-y-8">
            {/* Información Principal */}
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

            {/* Horarios */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Horarios de Atención</h3>
              <div className="space-y-2">
                {officeHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-700 font-medium">{schedule.day}</span>
                    <span className={`text-sm ${schedule.hours === 'Cerrado' ? 'text-red-500' : 'text-gray-600'}`}>
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-900">Citas de Emergencia</span>
                </div>
                <p className="text-blue-700 text-sm">
                  Disponibles 24/7 para casos urgentes. Contacte al +593 939004849
                </p>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h3>
              <div className="space-y-3">
                <a
                  href="tel:+593939004849"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar Ahora
                </a>
                <a
                  href="https://wa.me/593939004849"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
                <a
                  href="/registration"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  Crear Cuenta
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestra Ubicación
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Visítenos en nuestras oficinas ubicadas en el corazón de la Ciudad de Machala
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Mapa interactivo de Google Maps
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Av. 25 de junio y Juan Montalvo <br />
                  Machala, El Oro, Ecuador
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Transporte Público</h4>
                  <p className="text-sm text-gray-600">
                    Líneas de bus principales<br />
                    Parada cercana disponible
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Estacionamiento</h4>
                  <p className="text-sm text-gray-600">
                    Estacionamiento gratuito<br />
                    Disponible en la calle
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Accesibilidad</h4>
                  <p className="text-sm text-gray-600">
                    Acceso para personas<br />
                    con discapacidad
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;