import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Star, Users, Award, ArrowRight } from 'lucide-react';
import bufeteImage from '../assets/bufete_abogados_1.jpg';
import serviciosImage from '../assets/servicios_legales_1.jpg';
import justiciaImage from '../assets/justicia_1.jpg';

function Home({ onOpenAppointment }) {
  const testimonials = [
    {
      name: "María González",
      role: "Empresaria",
      content: "Hidalpi me ayudó a resolver un caso complejo de derecho comercial. Su profesionalismo y dedicación fueron excepcionales.",
      rating: 5
    },
    {
      name: "Carlos Rodríguez",
      role: "Propietario",
      content: "Excelente servicio en temas de derecho inmobiliario. Muy recomendados por su experiencia y trato personalizado.",
      rating: 5
    },
    {
      name: "Ana Martínez",
      role: "Directora de RRHH",
      content: "Nos han asesorado en múltiples temas laborales. Siempre disponibles y con soluciones efectivas.",
      rating: 5
    }
  ];

  const services = [
    {
      title: "Derecho Civil",
      description: "Asesoría integral en contratos, responsabilidad civil y derecho de familia.",
      icon: "⚖️"
    },
    {
      title: "Derecho Comercial",
      description: "Constitución de empresas, fusiones, adquisiciones y derecho societario.",
      icon: "🏢"
    },
    {
      title: "Derecho Laboral",
      description: "Relaciones laborales, despidos, negociación colectiva y seguridad social.",
      icon: "👥"
    },
    {
      title: "Derecho Penal",
      description: "Defensa penal, procedimientos judiciales y asesoría en investigaciones.",
      icon: "🛡️"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 mt-16">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Bienvenido a <span className="text-blue-300">Hidalpi & Asociados</span>
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Bufete de abogados especializado en brindar servicios legales de alta calidad 
                con más de 20 años de experiencia defendiendo sus derechos e intereses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onOpenAppointment}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Agendar Cita
                </button>
                <Link 
                  to="/services" 
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  Ver Servicios
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src={bufeteImage} 
                alt="Bufete de Abogados Hidalpi" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Destacados */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestros Servicios Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ofrecemos una amplia gama de servicios legales especializados para satisfacer 
              todas sus necesidades jurídicas con la máxima profesionalidad.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/services" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
            >
              Ver Todos los Servicios
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">20+</div>
              <div className="text-blue-200">Años de Experiencia</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Casos Exitosos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15</div>
              <div className="text-blue-200">Abogados Especialistas</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-200">Satisfacción del Cliente</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lo que Dicen Nuestros Clientes
            </h2>
            <p className="text-xl text-gray-600">
              La satisfacción de nuestros clientes es nuestra mayor recompensa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Necesita Asesoría Legal?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Contáctenos hoy mismo para una consulta gratuita y descubra cómo podemos ayudarle
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onOpenAppointment}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Agendar Consulta Gratuita
            </button>
            <Link 
              to="/registration" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              <Users className="mr-2 h-5 w-5" />
              Crear Cuenta
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

