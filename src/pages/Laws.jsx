import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Scale, Globe, FileText, Users, Building, Shield } from 'lucide-react';

const Laws = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [showLatinAmerica, setShowLatinAmerica] = useState(false);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const ecuadorianLaws = [
    {
      id: 'constitution',
      title: 'Constitución de la República del Ecuador (2008)',
      icon: <Scale className="w-6 h-6" />,
      description: 'Norma jurídica suprema que establece los derechos fundamentales, la organización del Estado y los principios de convivencia social.',
      articles: [
        'Art. 1: Ecuador como Estado constitucional de derechos y justicia',
        'Art. 11: Principios de aplicación de los derechos',
        'Art. 66: Derechos de libertad',
        'Art. 75: Derecho al acceso gratuito a la justicia'
      ],
      link: 'https://www.oas.org/juridico/PDFs/mesicic5_ecu_ane_cons.pdf'
    },
    {
      id: 'civil',
      title: 'Código Civil',
      icon: <FileText className="w-6 h-6" />,
      description: 'Regula las relaciones jurídicas civiles entre personas físicas y jurídicas, compuesto por 2,424 artículos.',
      articles: [
        'Libro I: De las personas',
        'Libro II: De los bienes y de su dominio, posesión, uso y goce',
        'Libro III: De la sucesión por causa de muerte',
        'Libro IV: De las obligaciones en general y de los contratos'
      ],
      link: 'https://docs.ecuador.justia.com/nacionales/codigos/codigo-civil.pdf'
    },
    {
      id: 'labor',
      title: 'Código del Trabajo',
      icon: <Users className="w-6 h-6" />,
      description: 'Regula las relaciones entre empleadores y trabajadores en todas las modalidades y condiciones de trabajo.',
      articles: [
        'Art. 1: Ámbito de aplicación del Código',
        'Art. 8: Contrato individual de trabajo',
        'Art. 42: Obligaciones del empleador',
        'Art. 45: Obligaciones del trabajador'
      ],
      link: 'https://www.ces.gob.ec/lotaip/2020/Junio/Literal_a2/C%C3%B3digo%20del%20Trabajo.pdf'
    },
    {
      id: 'penal',
      title: 'Código Orgánico Integral Penal (COIP)',
      icon: <Shield className="w-6 h-6" />,
      description: 'Unifica la legislación punitiva estableciendo delitos, penas y procedimientos penales en Ecuador.',
      articles: [
        'Libro I: La infracción penal',
        'Libro II: El procedimiento',
        'Libro III: La ejecución',
        'Art. 5: Principios procesales'
      ],
      link: 'https://www.defensa.gob.ec/wp-content/uploads/downloads/2021/03/COIP_act_feb-2021.pdf'
    },
    {
      id: 'tax',
      title: 'Código Tributario',
      icon: <Building className="w-6 h-6" />,
      description: 'Establece los principios generales, instituciones, procedimientos y normas que rigen el sistema tributario ecuatoriano.',
      articles: [
        'Art. 1: Ámbito de aplicación',
        'Art. 6: Fines de los tributos',
        'Art. 23: Sujeto activo',
        'Art. 24: Sujeto pasivo'
      ],
      link: 'https://www.quito.gob.ec/documents/Portal_tributario/Normativa/Ley/CODIGO_TRIBUTARIO_ACT.pdf'
    },
    {
      id: 'lrti',
      title: 'Ley de Régimen Tributario Interno',
      icon: <Building className="w-6 h-6" />,
      description: 'Regula el impuesto a la renta, al valor agregado y a los consumos especiales en Ecuador.',
      articles: [
        'Art. 1: Objeto del impuesto',
        'Art. 4: Sujetos pasivos del impuesto a la renta',
        'Art. 52: Hecho generador del IVA',
        'Art. 75: Impuesto a los consumos especiales'
      ],
      link: 'https://www.sri.gob.ec/o/sri-portlet-biblioteca-alfresco-internet/descargar/ae967a73-d972-40a6-a7e6-b99a64a08d7c/LEY+DE+R%C9GIMEN+TRIBUTARIO+INTERNO_abril+2017.pdf'
    }
  ];

  const latinAmericaLaws = [
    {
      country: 'Colombia',
      laws: [
        'Constitución Política de Colombia (1991)',
        'Código Civil Colombiano',
        'Código Sustantivo del Trabajo',
        'Código Penal (Ley 599 de 2000)'
      ]
    },
    {
      country: 'Perú',
      laws: [
        'Constitución Política del Perú (1993)',
        'Código Civil Peruano',
        'Ley de Productividad y Competitividad Laboral',
        'Código Penal Peruano'
      ]
    },
    {
      country: 'Chile',
      laws: [
        'Constitución Política de Chile',
        'Código Civil de Chile (Código de Bello)',
        'Código del Trabajo',
        'Código Penal Chileno'
      ]
    },
    {
      country: 'Argentina',
      laws: [
        'Constitución Nacional Argentina',
        'Código Civil y Comercial de la Nación',
        'Ley de Contrato de Trabajo',
        'Código Penal Argentino'
      ]
    },
    {
      country: 'México',
      laws: [
        'Constitución Política de los Estados Unidos Mexicanos',
        'Código Civil Federal',
        'Ley Federal del Trabajo',
        'Código Penal Federal'
      ]
    },
    {
      country: 'Brasil',
      laws: [
        'Constituição Federal do Brasil (1988)',
        'Código Civil Brasileiro',
        'Consolidação das Leis do Trabalho (CLT)',
        'Código Penal Brasileiro'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Scale className="w-16 h-16 mx-auto mb-4 text-blue-200" />
            <h1 className="text-4xl font-bold mb-4">Marco Legal Ecuatoriano</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Información completa sobre las principales leyes y regulaciones vigentes en Ecuador, 
              así como recursos legales para ciudadanos y empresas.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introducción */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sistema Jurídico Ecuatoriano
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            El sistema jurídico ecuatoriano se basa en el derecho civil continental, con influencias 
            del derecho romano-germánico. La Constitución de 2008 establece a Ecuador como un Estado 
            constitucional de derechos y justicia, garantizando la supremacía constitucional y el 
            respeto a los derechos humanos.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Nuestro bufete se especializa en la interpretación y aplicación de estas leyes para 
            brindar asesoría legal integral a nuestros clientes, asegurando el cumplimiento normativo 
            y la protección de sus derechos e intereses.
          </p>
        </div>

        {/* Principales Leyes de Ecuador */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Principales Leyes de Ecuador
          </h2>
          
          <div className="space-y-4">
            {ecuadorianLaws.map((law) => (
              <div key={law.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection(law.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-blue-600">
                        {law.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {law.title}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {law.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-blue-600">
                      {expandedSection === law.id ? (
                        <ChevronUp className="w-6 h-6" />
                      ) : (
                        <ChevronDown className="w-6 h-6" />
                      )}
                    </div>
                  </div>
                </div>
                
                {expandedSection === law.id && (
                  <div className="px-6 pb-6 border-t border-gray-200">
                    <div className="pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Principales disposiciones:
                      </h4>
                      <ul className="space-y-2 mb-4">
                        {law.articles.map((article, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{article}</span>
                          </li>
                        ))}
                      </ul>
                      <a 
                        href={law.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Ver texto completo</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Campo de Expansión para Latinoamérica */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div 
            className="p-6 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 border-green-500"
            onClick={() => setShowLatinAmerica(!showLatinAmerica)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-green-600">
                  <Globe className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Leyes de Latinoamérica
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Explore las principales leyes y códigos de otros países latinoamericanos 
                    para análisis comparativo y referencia legal.
                  </p>
                </div>
              </div>
              <div className="text-green-600">
                {showLatinAmerica ? (
                  <ChevronUp className="w-8 h-8" />
                ) : (
                  <ChevronDown className="w-8 h-8" />
                )}
              </div>
            </div>
          </div>
          
          {showLatinAmerica && (
            <div className="px-6 pb-6 border-t border-gray-200">
              <div className="pt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {latinAmericaLaws.map((country, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">
                        {country.country}
                      </h4>
                      <ul className="space-y-2">
                        {country.laws.map((law, lawIndex) => (
                          <li key={lawIndex} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 text-sm">{law}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Derecho Comparado Latinoamericano
                  </h4>
                  <p className="text-blue-800 text-sm">
                    En Hidalpi ofrecemos servicios de análisis de derecho comparado para clientes 
                    con operaciones internacionales en la región. Nuestro equipo puede asesorar 
                    sobre las diferencias y similitudes entre los sistemas jurídicos latinoamericanos.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recursos Adicionales */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              ¿Necesita Asesoría Legal Especializada?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Nuestro equipo de abogados especializados puede ayudarle a entender y aplicar 
              estas leyes en su situación específica. Ofrecemos consultas gratuitas para 
              evaluar su caso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Consulta Gratuita
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Contactar Especialista
              </button>
            </div>
          </div>
        </div>

        {/* Enlaces Útiles */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Enlaces Oficiales
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a 
              href="https://www.asambleanacional.gob.ec/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Asamblea Nacional del Ecuador</span>
            </a>
            <a 
              href="https://www.corteconstitucional.gob.ec/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Corte Constitucional</span>
            </a>
            <a 
              href="https://www.funcionjudicial.gob.ec/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Función Judicial</span>
            </a>
            <a 
              href="https://www.sri.gob.ec/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Servicio de Rentas Internas</span>
            </a>
            <a 
              href="https://www.trabajo.gob.ec/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ministerio del Trabajo</span>
            </a>
            <a 
              href="https://www.registrocivil.gob.ec/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Registro Civil</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Laws;

