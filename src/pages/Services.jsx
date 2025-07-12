import React from 'react';
import { Scale, Building, Users, Shield, Home, Calculator, FileText, Briefcase, CheckCircle } from 'lucide-react';
import serviciosImage from '../assets/servicios_legales_2.jpg';

function Services() {
  const services = [
    {
      icon: <Scale className="h-12 w-12 text-blue-600" />,
      title: "Derecho Civil",
      description: "Asesoría integral en todas las ramas del derecho civil",
      features: [
        "Contratos civiles y comerciales",
        "Responsabilidad civil",
        "Derecho de obligaciones",
        "Derecho de bienes",
        "Sucesiones y testamentos"
      ],
      benefits: [
        "Protección legal completa",
        "Prevención de conflictos",
        "Asesoría personalizada"
      ]
    },
    {
      icon: <Building className="h-12 w-12 text-blue-600" />,
      title: "Derecho Comercial",
      description: "Servicios especializados para empresas y emprendedores",
      features: [
        "Constitución de sociedades",
        "Fusiones y adquisiciones",
        "Contratos comerciales",
        "Derecho societario",
        "Reestructuraciones empresariales"
      ],
      benefits: [
        "Crecimiento empresarial seguro",
        "Cumplimiento normativo",
        "Optimización de estructuras"
      ]
    },
    {
      icon: <Users className="h-12 w-12 text-blue-600" />,
      title: "Derecho Laboral",
      description: "Protección de derechos laborales para empleados y empleadores",
      features: [
        "Contratos de trabajo",
        "Despidos y liquidaciones",
        "Negociación colectiva",
        "Seguridad social",
        "Acoso laboral"
      ],
      benefits: [
        "Relaciones laborales armoniosas",
        "Cumplimiento de normativas",
        "Resolución de conflictos"
      ]
    },
    {
      icon: <Shield className="h-12 w-12 text-blue-600" />,
      title: "Derecho Penal",
      description: "Defensa penal especializada y asesoría en investigaciones",
      features: [
        "Defensa en procesos penales",
        "Asesoría en investigaciones",
        "Recursos y apelaciones",
        "Derecho penal económico",
        "Medidas cautelares"
      ],
      benefits: [
        "Defensa efectiva",
        "Protección de derechos",
        "Estrategia personalizada"
      ]
    },
    {
      icon: <Home className="h-12 w-12 text-blue-600" />,
      title: "Derecho de Familia",
      description: "Asesoría sensible en asuntos familiares y personales",
      features: [
        "Divorcios y separaciones",
        "Custodia de menores",
        "Pensiones alimentarias",
        "Adopciones",
        "Violencia doméstica"
      ],
      benefits: [
        "Protección familiar",
        "Resolución pacífica",
        "Bienestar de menores"
      ]
    },
    {
      icon: <Calculator className="h-12 w-12 text-blue-600" />,
      title: "Derecho Tributario",
      description: "Planificación fiscal y resolución de conflictos tributarios",
      features: [
        "Planificación fiscal",
        "Procedimientos tributarios",
        "Recursos ante el SAT",
        "Auditorías fiscales",
        "Reestructuración de deudas"
      ],
      benefits: [
        "Optimización fiscal",
        "Cumplimiento normativo",
        "Reducción de riesgos"
      ]
    },
    {
      icon: <FileText className="h-12 w-12 text-blue-600" />,
      title: "Derecho Inmobiliario",
      description: "Transacciones inmobiliarias seguras y eficientes",
      features: [
        "Compraventa de inmuebles",
        "Arrendamientos",
        "Desarrollo inmobiliario",
        "Regularización de propiedades",
        "Conflictos de propiedad"
      ],
      benefits: [
        "Transacciones seguras",
        "Títulos de propiedad claros",
        "Inversiones protegidas"
      ]
    },
    {
      icon: <Briefcase className="h-12 w-12 text-blue-600" />,
      title: "Derecho Administrativo",
      description: "Relaciones con la administración pública y procedimientos",
      features: [
        "Procedimientos administrativos",
        "Recursos contra actos administrativos",
        "Contratación pública",
        "Licencias y permisos",
        "Responsabilidad patrimonial"
      ],
      benefits: [
        "Relación eficaz con autoridades",
        "Protección ante arbitrariedades",
        "Cumplimiento regulatorio"
      ]
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Consulta Inicial",
      description: "Evaluamos su caso y definimos la estrategia legal más adecuada."
    },
    {
      step: "2",
      title: "Análisis Detallado",
      description: "Realizamos un análisis exhaustivo de todos los aspectos legales involucrados."
    },
    {
      step: "3",
      title: "Estrategia Personalizada",
      description: "Desarrollamos una estrategia específica para su situación particular."
    },
    {
      step: "4",
      title: "Ejecución",
      description: "Implementamos la estrategia con seguimiento constante y comunicación transparente."
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nuestros Servicios</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Ofrecemos una amplia gama de servicios legales especializados para satisfacer 
              todas sus necesidades jurídicas con la máxima profesionalidad y experiencia.
            </p>
          </div>
        </div>
      </section>

      {/* Servicios Principales */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Áreas de Especialización
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestro equipo multidisciplinario está preparado para atender sus necesidades 
              legales en las siguientes áreas especializadas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {service.icon}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-700 mb-4">{service.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Servicios incluidos:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Beneficios:</h4>
                      <ul className="space-y-1">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center text-blue-600">
                            <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso de Trabajo */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestro Proceso de Trabajo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seguimos un proceso estructurado y transparente para garantizar los mejores resultados
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Imagen y Garantías */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={serviciosImage} 
                alt="Servicios Legales Hidalpi" 
                className="rounded-lg shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                ¿Por Qué Elegir Hidalpi?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Experiencia Comprobada</h3>
                    <p className="text-gray-600">Más de 20 años de experiencia en el sector legal</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Equipo Multidisciplinario</h3>
                    <p className="text-gray-600">15 abogados especializados en diferentes áreas</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Atención Personalizada</h3>
                    <p className="text-gray-600">Cada caso recibe atención individual y dedicada</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Comunicación Transparente</h3>
                    <p className="text-gray-600">Mantenemos informado al cliente en todo momento</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Resultados Exitosos</h3>
                    <p className="text-gray-600">98% de satisfacción del cliente y casos exitosos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Necesita Asesoría Legal Especializada?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Contáctenos hoy mismo para una consulta gratuita. Nuestro equipo de expertos 
            está listo para ayudarle a resolver sus asuntos legales de manera eficiente y profesional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              Consulta Gratuita
            </a>
            <a 
              href="tel:+593939004849" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              Llamar Ahora
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;

