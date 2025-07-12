import React, { useState } from 'react';
import { Search, Download, ExternalLink, Calendar, User, Tag, FileText, BookOpen, Link as LinkIcon, Filter } from 'lucide-react';

function Resources() {
  const [activeTab, setActiveTab] = useState('blog');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts = [
    {
      id: 1,
      title: "Nuevas Reformas en Derecho Laboral: Lo que Necesita Saber",
      excerpt: "Análisis detallado de las últimas modificaciones a la Ley Federal del Trabajo y su impacto en empleadores y trabajadores.",
      author: "Dra. Patricia López",
      date: "2024-01-15",
      category: "Derecho Laboral",
      readTime: "8 min",
      image: "/api/placeholder/400/250"
    },
    {
      id: 2,
      title: "Protección de Datos Personales: Guía Práctica para Empresas",
      excerpt: "Todo lo que su empresa necesita saber sobre la Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados.",
      author: "Dr. Miguel Fernández",
      date: "2024-01-10",
      category: "Derecho Digital",
      readTime: "12 min",
      image: "/api/placeholder/400/250"
    },
    {
      id: 3,
      title: "Constitución de Sociedades: Pasos y Consideraciones Legales",
      excerpt: "Guía completa para la constitución de sociedades mercantiles en México, incluyendo requisitos y mejores prácticas.",
      author: "Dr. Roberto Hidalgo",
      date: "2024-01-05",
      category: "Derecho Corporativo",
      readTime: "15 min",
      image: "/api/placeholder/400/250"
    },
    {
      id: 4,
      title: "Derechos del Consumidor en Compras en Línea",
      excerpt: "Conozca sus derechos como consumidor en el comercio electrónico y cómo protegerse de fraudes y malas prácticas.",
      author: "Dra. Carmen Ruiz",
      date: "2023-12-28",
      category: "Derecho del Consumidor",
      readTime: "6 min",
      image: "/api/placeholder/400/250"
    },
    {
      id: 5,
      title: "Planificación Fiscal 2024: Estrategias Legales",
      excerpt: "Estrategias legales para optimizar su carga fiscal y cumplir con las obligaciones tributarias del nuevo año.",
      author: "Dra. Lucía Vargas",
      date: "2023-12-20",
      category: "Derecho Fiscal",
      readTime: "10 min",
      image: "/api/placeholder/400/250"
    },
    {
      id: 6,
      title: "Divorcio y Custodia: Proceso Legal Simplificado",
      excerpt: "Explicación clara del proceso de divorcio en México y los factores que determinan la custodia de los menores.",
      author: "Dra. Carmen Ruiz",
      date: "2023-12-15",
      category: "Derecho Familiar",
      readTime: "9 min",
      image: "/api/placeholder/400/250"
    }
  ];

  const documents = [
    {
      id: 1,
      title: "Contrato de Compraventa de Inmueble",
      description: "Formato estándar para la compraventa de bienes inmuebles con todas las cláusulas necesarias.",
      category: "Contratos",
      type: "PDF",
      size: "245 KB",
      downloads: 1250
    },
    {
      id: 2,
      title: "Poder Notarial General",
      description: "Formato de poder notarial para representación legal en diversos actos jurídicos.",
      category: "Poderes",
      type: "DOCX",
      size: "180 KB",
      downloads: 890
    },
    {
      id: 3,
      title: "Contrato de Trabajo por Tiempo Indeterminado",
      description: "Modelo de contrato laboral que cumple con todas las disposiciones de la LFT.",
      category: "Laboral",
      type: "PDF",
      size: "320 KB",
      downloads: 2100
    },
    {
      id: 4,
      title: "Testamento Público Abierto",
      description: "Formato y guía para la elaboración de testamento público abierto.",
      category: "Sucesiones",
      type: "PDF",
      size: "290 KB",
      downloads: 670
    },
    {
      id: 5,
      title: "Convenio de Divorcio Voluntario",
      description: "Formato para convenio de divorcio por mutuo consentimiento con hijos menores.",
      category: "Familiar",
      type: "DOCX",
      size: "210 KB",
      downloads: 540
    },
    {
      id: 6,
      title: "Acta Constitutiva de Sociedad Anónima",
      description: "Formato completo para la constitución de sociedades anónimas de capital variable.",
      category: "Corporativo",
      type: "PDF",
      size: "450 KB",
      downloads: 380
    }
  ];

  const externalLinks = [
    {
      id: 1,
      title: "Suprema Corte de Justicia de la Nación",
      description: "Jurisprudencia, tesis y criterios del máximo tribunal del país.",
      url: "https://www.scjn.gob.mx/",
      category: "Jurisprudencia"
    },
    {
      id: 2,
      title: "Diario Oficial de la Federación",
      description: "Publicaciones oficiales del gobierno federal mexicano.",
      url: "https://www.dof.gob.mx/",
      category: "Legislación"
    },
    {
      id: 3,
      title: "Instituto Nacional de Transparencia",
      description: "Información sobre transparencia y acceso a la información pública.",
      url: "https://home.inai.org.mx/",
      category: "Transparencia"
    },
    {
      id: 4,
      title: "Servicio de Administración Tributaria",
      description: "Trámites fiscales, consultas y servicios del SAT.",
      url: "https://www.sat.gob.mx/",
      category: "Fiscal"
    },
    {
      id: 5,
      title: "Registro Público de Comercio",
      description: "Consultas y trámites relacionados con el registro mercantil.",
      url: "https://rpc.economia.gob.mx/",
      category: "Comercial"
    },
    {
      id: 6,
      title: "PROFECO",
      description: "Procuraduría Federal del Consumidor - Derechos del consumidor.",
      url: "https://www.profeco.gob.mx/",
      category: "Consumidor"
    }
  ];

  const categories = [
    'all',
    'Derecho Laboral',
    'Derecho Digital',
    'Derecho Corporativo',
    'Derecho del Consumidor',
    'Derecho Fiscal',
    'Derecho Familiar'
  ];

  const documentCategories = [
    'all',
    'Contratos',
    'Poderes',
    'Laboral',
    'Sucesiones',
    'Familiar',
    'Corporativo'
  ];

  const linkCategories = [
    'all',
    'Jurisprudencia',
    'Legislación',
    'Transparencia',
    'Fiscal',
    'Comercial',
    'Consumidor'
  ];

  const filteredBlogPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredLinks = externalLinks.filter(link => {
    const matchesCategory = selectedCategory === 'all' || link.category === selectedCategory;
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCurrentCategories = () => {
    switch (activeTab) {
      case 'blog': return categories;
      case 'documents': return documentCategories;
      case 'links': return linkCategories;
      default: return categories;
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Centro de Recursos</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Acceda a nuestro blog especializado, biblioteca de documentos legales y 
              enlaces útiles para mantenerse informado sobre temas jurídicos.
            </p>
          </div>
        </div>
      </section>

      {/* Navegación de Pestañas */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => {setActiveTab('blog'); setSelectedCategory('all'); setSearchTerm('');}}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'blog'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen className="h-5 w-5 inline mr-2" />
              Blog Legal
            </button>
            <button
              onClick={() => {setActiveTab('documents'); setSelectedCategory('all'); setSearchTerm('');}}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'documents'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="h-5 w-5 inline mr-2" />
              Documentos
            </button>
            <button
              onClick={() => {setActiveTab('links'); setSelectedCategory('all'); setSearchTerm('');}}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'links'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <LinkIcon className="h-5 w-5 inline mr-2" />
              Enlaces Útiles
            </button>
          </div>
        </div>
      </section>

      {/* Búsqueda y Filtros */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={`Buscar en ${activeTab === 'blog' ? 'artículos' : activeTab === 'documents' ? 'documentos' : 'enlaces'}...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {getCurrentCategories().map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Todas las categorías' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Blog */}
          {activeTab === 'blog' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Blog Legal
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Artículos especializados sobre temas legales actuales, análisis de casos 
                  y guías prácticas para entender mejor sus derechos y obligaciones.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogPosts.map((post) => (
                  <article key={post.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {post.category}
                        </span>
                        <span className="text-sm text-gray-500">{post.readTime} lectura</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-4 w-4 mr-1" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{new Date(post.date).toLocaleDateString('es-MX')}</span>
                        </div>
                      </div>
                      
                      <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm">
                        Leer más →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Documentos */}
          {activeTab === 'documents' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Biblioteca de Documentos
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Descargue formularios legales, contratos modelo y documentos útiles 
                  para sus trámites y procedimientos legales.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{doc.type}</span>
                            <span>{doc.size}</span>
                            <span>{doc.downloads} descargas</span>
                          </div>
                        </div>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {doc.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{doc.description}</p>
                    
                    <button className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-semibold text-yellow-800 mb-2">Aviso Legal</h3>
                <p className="text-yellow-700 text-sm">
                  Los documentos proporcionados son formatos generales que pueden requerir 
                  adaptaciones específicas según su caso particular. Se recomienda consultar 
                  con un abogado antes de utilizar cualquier documento legal.
                </p>
              </div>
            </div>
          )}

          {/* Enlaces Útiles */}
          {activeTab === 'links' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Enlaces Útiles
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Acceda a sitios web oficiales, bases de datos jurídicas y recursos 
                  externos que pueden ser útiles para sus consultas legales.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLinks.map((link) => (
                  <div key={link.id} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <LinkIcon className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">{link.category}</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{link.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{link.description}</p>
                    
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                    >
                      Visitar sitio web →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿No Encuentra lo que Busca?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Nuestro equipo de expertos puede ayudarle con consultas específicas 
            y proporcionarle la información legal que necesita.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              Consulta Personalizada
            </a>
            <a 
              href="/registration" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              Crear Cuenta
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Resources;

