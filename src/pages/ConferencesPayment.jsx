import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, CreditCard, CheckCircle, Star, ArrowRight } from 'lucide-react';

function ConferencesPayment() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [paymentStep, setPaymentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const upcomingEvents = [
    {
      id: 1,
      title: "Nuevas Reformas en Derecho Laboral 2024",
      date: "2024-02-15",
      time: "09:00 - 17:00",
      location: "Hotel Marriott, Sala de Conferencias A",
      price: 2500,
      capacity: 100,
      registered: 75,
      speaker: "Dra. Patricia López",
      description: "Análisis detallado de las últimas reformas en materia laboral y su impacto en las relaciones empleado-empleador.",
      topics: [
        "Nuevas modalidades de contratación",
        "Derechos de los trabajadores remotos",
        "Cambios en la Ley Federal del Trabajo",
        "Casos prácticos y jurisprudencia"
      ],
      includes: [
        "Material didáctico",
        "Certificado de participación",
        "Coffee breaks",
        "Almuerzo"
      ]
    },
    {
      id: 2,
      title: "Derecho Digital y Protección de Datos",
      date: "2024-03-10",
      time: "14:00 - 18:00",
      location: "Centro de Convenciones, Auditorio Principal",
      price: 1800,
      capacity: 150,
      registered: 45,
      speaker: "Dr. Miguel Fernández",
      description: "Seminario especializado en las nuevas regulaciones de protección de datos y comercio electrónico.",
      topics: [
        "LGPDPPSO y su aplicación práctica",
        "Comercio electrónico y contratos digitales",
        "Ciberseguridad jurídica",
        "Derechos ARCO"
      ],
      includes: [
        "Material digital",
        "Certificado digital",
        "Acceso a grabación",
        "Plantillas legales"
      ]
    },
    {
      id: 3,
      title: "Estrategias en Derecho Corporativo",
      date: "2024-04-20",
      time: "09:00 - 16:00",
      location: "Hidalpi Offices, Sala de Juntas Principal",
      price: 3200,
      capacity: 50,
      registered: 30,
      speaker: "Dr. Roberto Hidalgo",
      description: "Masterclass exclusiva sobre estructuración corporativa y optimización fiscal para empresas.",
      topics: [
        "Estructuras corporativas eficientes",
        "Fusiones y adquisiciones",
        "Planificación fiscal corporativa",
        "Gobierno corporativo"
      ],
      includes: [
        "Material premium",
        "Consulta personalizada",
        "Networking lunch",
        "Seguimiento post-evento"
      ]
    }
  ];

  const pastEvents = [
    {
      title: "Derecho de Familia en la Era Digital",
      date: "2023-11-15",
      attendees: 120,
      rating: 4.8,
      feedback: "Excelente contenido y casos prácticos muy útiles"
    },
    {
      title: "Compliance y Prevención de Lavado de Dinero",
      date: "2023-10-08",
      attendees: 95,
      rating: 4.9,
      feedback: "Información actualizada y muy relevante para el sector"
    },
    {
      title: "Nuevas Tendencias en Derecho Inmobiliario",
      date: "2023-09-12",
      attendees: 80,
      rating: 4.7,
      feedback: "Ponentes expertos y networking valioso"
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setPaymentStep(1);
  };

  const handleNextStep = () => {
    if (paymentStep < 3) {
      setPaymentStep(paymentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (paymentStep > 1) {
      setPaymentStep(paymentStep - 1);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Conferencias y Eventos</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Manténgase actualizado con las últimas tendencias legales a través de nuestros 
              seminarios, conferencias y eventos especializados.
            </p>
          </div>
        </div>
      </section>

      {/* Próximos Eventos */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Próximos Eventos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Inscríbase en nuestros próximos eventos y manténgase al día con los 
              desarrollos más importantes del mundo jurídico.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {event.capacity - event.registered} cupos disponibles
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(event.price)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{event.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(event.date).toLocaleDateString('es-MX', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Ponente: {event.speaker}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">{event.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Incluye:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {event.includes.map((item, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {event.registered}/{event.capacity} inscritos
                    </div>
                    <button
                      onClick={() => handleEventSelect(event)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      Inscribirse
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eventos Pasados */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Eventos Anteriores
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Vea el éxito de nuestros eventos pasados y las valoraciones de los asistentes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pastEvents.map((event, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{new Date(event.date).toLocaleDateString('es-MX')}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-600">{event.attendees} asistentes</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{event.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 italic">"{event.feedback}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de Registro y Pago */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Registro para Evento</h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Información del Evento */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{selectedEvent.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>Fecha: {new Date(selectedEvent.date).toLocaleDateString('es-MX')}</div>
                  <div>Hora: {selectedEvent.time}</div>
                  <div>Lugar: {selectedEvent.location}</div>
                  <div>Precio: {formatPrice(selectedEvent.price)}</div>
                </div>
              </div>

              {/* Pasos del Proceso */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    paymentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  <div className={`w-16 h-1 ${paymentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    paymentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                  <div className={`w-16 h-1 ${paymentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    paymentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    3
                  </div>
                </div>
              </div>

              {/* Paso 1: Información Personal */}
              {paymentStep === 1 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Nombre completo"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Correo electrónico"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Teléfono"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="company"
                      placeholder="Empresa (opcional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              {/* Paso 2: Información de Pago */}
              {paymentStep === 2 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Información de Pago</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Número de tarjeta"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="cardName"
                      placeholder="Nombre en la tarjeta"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.cardName}
                      onChange={handleInputChange}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/AA"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                      />
                      <input
                        type="text"
                        name="cvv"
                        placeholder="CVV"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={formData.cvv}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mt-6">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-900">Pago seguro con SSL</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Sus datos de pago están protegidos con encriptación de nivel bancario
                    </p>
                  </div>
                </div>
              )}

              {/* Paso 3: Confirmación */}
              {paymentStep === 3 && (
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">¡Registro Exitoso!</h3>
                  <p className="text-gray-600 mb-6">
                    Su registro para "{selectedEvent.title}" ha sido confirmado. 
                    Recibirá un correo electrónico con los detalles del evento.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      Número de confirmación: <strong>EVT-{selectedEvent.id}-{Date.now()}</strong>
                    </p>
                  </div>
                </div>
              )}

              {/* Botones de Navegación */}
              <div className="flex justify-between mt-8">
                {paymentStep > 1 && paymentStep < 3 && (
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Anterior
                  </button>
                )}
                
                {paymentStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-auto"
                  >
                    {paymentStep === 2 ? 'Procesar Pago' : 'Siguiente'}
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                  >
                    Cerrar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Interesado en Eventos Corporativos?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Organizamos eventos y capacitaciones personalizadas para empresas. 
            Contáctenos para conocer nuestros programas corporativos.
          </p>
          <a 
            href="/contact" 
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
          >
            Solicitar Información
          </a>
        </div>
      </section>
    </div>
  );
}

export default ConferencesPayment;

