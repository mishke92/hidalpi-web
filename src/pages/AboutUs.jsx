import React from 'react';
import { Users, Target, Heart, Award, Scale, Shield } from 'lucide-react';
import bufeteImage from '../assets/bufete_abogados_2.jpg';

function AboutUs() {
  const teamMembers = [
    {
      name: "Dr. Roberto Hidalgo",
      position: "Socio Fundador",
      specialization: "Derecho Civil y Comercial",
      experience: "25 años",
      description: "Especialista en derecho civil y comercial con amplia experiencia en litigios complejos."
    },
    {
      name: "Dra. Patricia López",
      position: "Socia Directora",
      specialization: "Derecho Laboral",
      experience: "20 años",
      description: "Experta en relaciones laborales y derecho de la seguridad social."
    },
    {
      name: "Dr. Miguel Fernández",
      position: "Socio Senior",
      specialization: "Derecho Penal",
      experience: "18 años",
      description: "Especialista en derecho penal con destacada trayectoria en defensa criminal."
    },
    {
      name: "Dra. Carmen Ruiz",
      position: "Asociada Senior",
      specialization: "Derecho de Familia",
      experience: "15 años",
      description: "Experta en derecho de familia, divorcios y custodia de menores."
    },
    {
      name: "Dr. Andrés Morales",
      position: "Asociado",
      specialization: "Derecho Inmobiliario",
      experience: "12 años",
      description: "Especialista en transacciones inmobiliarias y derecho urbanístico."
    },
    {
      name: "Dra. Lucía Vargas",
      position: "Asociada",
      specialization: "Derecho Tributario",
      experience: "10 años",
      description: "Experta en planificación fiscal y procedimientos tributarios."
    }
  ];

  const values = [
    {
      icon: <Scale className="h-8 w-8 text-blue-600" />,
      title: "Justicia",
      description: "Defendemos la justicia con integridad y compromiso inquebrantable."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Confianza",
      description: "Construimos relaciones duraderas basadas en la confianza mutua."
    },
    {
      icon: <Heart className="h-8 w-8 text-blue-600" />,
      title: "Compromiso",
      description: "Nos comprometemos plenamente con cada caso y cada cliente."
    },
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      title: "Excelencia",
      description: "Buscamos la excelencia en cada servicio que brindamos."
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Sobre Nosotros</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Conoce la historia, misión y valores que nos han convertido en uno de los 
              bufetes de abogados más respetados de la región.
            </p>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Nuestra Historia
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Hidalpi fue fundado en 2004 por el Dr. Roberto Hidalgo con la visión de crear 
                un bufete de abogados que combinara la excelencia jurídica con un trato 
                personalizado y humano hacia cada cliente.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Durante más de dos décadas, hemos crecido hasta convertirnos en un equipo 
                multidisciplinario de 15 abogados especializados, manteniendo siempre nuestro 
                compromiso con la calidad y la ética profesional.
              </p>
              <p className="text-lg text-gray-700">
                Hemos representado exitosamente a más de 500 clientes en casos que van desde 
                asuntos familiares hasta complejas transacciones comerciales, siempre con el 
                mismo nivel de dedicación y profesionalismo.
              </p>
            </div>
            <div>
              <img 
                src={bufeteImage} 
                alt="Oficinas de Hidalpi" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-6">
                <Target className="h-10 w-10 text-blue-600 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">Nuestra Misión</h3>
              </div>
              <p className="text-gray-700 text-lg">
                Brindar servicios legales de la más alta calidad, defendiendo los derechos 
                e intereses de nuestros clientes con integridad, profesionalismo y compromiso. 
                Nos esforzamos por ser el socio legal de confianza que nuestros clientes 
                necesitan para alcanzar sus objetivos.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-6">
                <Users className="h-10 w-10 text-blue-600 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">Nuestra Visión</h3>
              </div>
              <p className="text-gray-700 text-lg">
                Ser reconocidos como el bufete de abogados líder en la región, destacando 
                por nuestra excelencia jurídica, innovación en servicios legales y compromiso 
                con la justicia. Aspiramos a ser la primera opción para individuos y empresas 
                que buscan asesoría legal de primer nivel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestros Valores
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Los principios que guían cada una de nuestras acciones y decisiones
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profesionales altamente calificados con amplia experiencia en diversas áreas del derecho
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 font-medium">{member.position}</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold text-gray-700">Especialización: </span>
                    <span className="text-gray-600">{member.specialization}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Experiencia: </span>
                    <span className="text-gray-600">{member.experience}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-3">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filosofía */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Nuestra Filosofía
          </h2>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto mb-8">
            Creemos que cada cliente merece una representación legal excepcional. Nuestro enfoque 
            se basa en la comunicación transparente, la estrategia personalizada y el compromiso 
            inquebrantable con los resultados. No solo somos sus abogados, somos sus aliados 
            en la búsqueda de la justicia.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Casos Exitosos</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">20+</div>
              <div className="text-blue-200">Años de Experiencia</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-blue-200">Satisfacción del Cliente</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;

