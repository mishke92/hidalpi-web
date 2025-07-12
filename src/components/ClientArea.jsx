import React, { useState } from 'react';
import { FileText, Calendar, MessageSquare, Download, Eye, Clock, CheckCircle, AlertCircle, User, Bell } from 'lucide-react';

function ClientArea() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Datos simulados del cliente
  const clientData = {
    name: "Juan Pérez García",
    email: "juan.perez@email.com",
    phone: "+52 (55) 1234-5678",
    clientId: "CLI-2024-001",
    memberSince: "2023-06-15"
  };

  const cases = [
    {
      id: "CASE-2024-001",
      title: "Divorcio Voluntario",
      lawyer: "Dra. Carmen Ruiz",
      status: "En Proceso",
      progress: 75,
      lastUpdate: "2024-01-15",
      nextAction: "Audiencia programada para el 25 de enero",
      priority: "normal"
    },
    {
      id: "CASE-2024-002",
      title: "Constitución de Empresa",
      lawyer: "Dr. Roberto Hidalgo",
      status: "Completado",
      progress: 100,
      lastUpdate: "2024-01-10",
      nextAction: "Caso cerrado exitosamente",
      priority: "low"
    },
    {
      id: "CASE-2023-045",
      title: "Reclamación Laboral",
      lawyer: "Dra. Patricia López",
      status: "Pendiente",
      progress: 25,
      lastUpdate: "2024-01-08",
      nextAction: "Esperando documentación adicional",
      priority: "high"
    }
  ];

  const documents = [
    {
      id: 1,
      name: "Contrato de Divorcio - Borrador",
      type: "PDF",
      size: "245 KB",
      date: "2024-01-15",
      caseId: "CASE-2024-001",
      status: "Nuevo"
    },
    {
      id: 2,
      name: "Acta Constitutiva - Final",
      type: "PDF",
      size: "890 KB",
      date: "2024-01-10",
      caseId: "CASE-2024-002",
      status: "Firmado"
    },
    {
      id: 3,
      name: "Demanda Laboral",
      type: "DOCX",
      size: "156 KB",
      date: "2024-01-08",
      caseId: "CASE-2023-045",
      status: "En Revisión"
    },
    {
      id: 4,
      name: "Poder Notarial",
      type: "PDF",
      size: "320 KB",
      date: "2024-01-05",
      caseId: "CASE-2024-001",
      status: "Firmado"
    }
  ];

  const appointments = [
    {
      id: 1,
      title: "Audiencia de Divorcio",
      lawyer: "Dra. Carmen Ruiz",
      date: "2024-01-25",
      time: "10:00",
      location: "Juzgado Familiar No. 3",
      type: "Audiencia",
      status: "Confirmada"
    },
    {
      id: 2,
      title: "Revisión de Documentos",
      lawyer: "Dra. Patricia López",
      date: "2024-01-20",
      time: "14:30",
      location: "Oficinas Hidalpi",
      type: "Consulta",
      status: "Pendiente"
    },
    {
      id: 3,
      title: "Firma de Contratos",
      lawyer: "Dr. Roberto Hidalgo",
      date: "2024-01-18",
      time: "11:00",
      location: "Notaría Pública No. 15",
      type: "Trámite",
      status: "Completada"
    }
  ];

  const messages = [
    {
      id: 1,
      from: "Dra. Carmen Ruiz",
      subject: "Actualización sobre su caso de divorcio",
      preview: "Le informo que hemos recibido la respuesta de la contraparte...",
      date: "2024-01-15",
      read: false,
      caseId: "CASE-2024-001"
    },
    {
      id: 2,
      from: "Sistema Hidalpi",
      subject: "Recordatorio: Cita programada",
      preview: "Le recordamos que tiene una cita programada para mañana...",
      date: "2024-01-14",
      read: true,
      caseId: null
    },
    {
      id: 3,
      from: "Dr. Roberto Hidalgo",
      subject: "Constitución de empresa completada",
      preview: "Me complace informarle que el proceso de constitución...",
      date: "2024-01-10",
      read: true,
      caseId: "CASE-2024-002"
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completado': return 'text-green-600 bg-green-100';
      case 'en proceso': return 'text-blue-600 bg-blue-100';
      case 'pendiente': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'normal': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{clientData.name}</h1>
                <p className="text-gray-600">Cliente desde {new Date(clientData.memberSince).toLocaleDateString('es-MX')}</p>
                <p className="text-sm text-gray-500">ID: {clientData.clientId}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{clientData.email}</p>
              <p className="text-sm text-gray-600">{clientData.phone}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'dashboard', name: 'Panel Principal', icon: <FileText className="h-5 w-5" /> },
                { id: 'cases', name: 'Mis Casos', icon: <FileText className="h-5 w-5" /> },
                { id: 'documents', name: 'Documentos', icon: <FileText className="h-5 w-5" /> },
                { id: 'appointments', name: 'Citas', icon: <Calendar className="h-5 w-5" /> },
                { id: 'messages', name: 'Mensajes', icon: <MessageSquare className="h-5 w-5" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                  {tab.id === 'messages' && messages.filter(m => !m.read).length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {messages.filter(m => !m.read).length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Panel Principal</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Casos Activos</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {cases.filter(c => c.status !== 'Completado').length}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Casos Completados</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {cases.filter(c => c.status === 'Completado').length}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">Próximas Citas</h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    {appointments.filter(a => a.status !== 'Completada').length}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Casos Recientes</h3>
                  <div className="space-y-3">
                    {cases.slice(0, 3).map((case_) => (
                      <div key={case_.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{case_.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                            {case_.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Abogado: {case_.lawyer}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${case_.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{case_.progress}% completado</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Próximas Citas</h3>
                  <div className="space-y-3">
                    {appointments.filter(a => a.status !== 'Completada').slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-1">{appointment.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{appointment.lawyer}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(appointment.date).toLocaleDateString('es-MX')} - {appointment.time}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{appointment.location}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cases */}
          {activeTab === 'cases' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Mis Casos</h2>
              <div className="space-y-4">
                {cases.map((case_) => (
                  <div key={case_.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{case_.title}</h3>
                          {getPriorityIcon(case_.priority)}
                        </div>
                        <p className="text-gray-600">Caso: {case_.id}</p>
                        <p className="text-gray-600">Abogado: {case_.lawyer}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(case_.status)}`}>
                        {case_.status}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Progreso</span>
                        <span className="text-sm font-medium text-gray-900">{case_.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${case_.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Próxima acción:</strong> {case_.nextAction}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Última actualización: {new Date(case_.lastUpdate).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {activeTab === 'documents' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Mis Documentos</h2>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{doc.name}</h4>
                        <p className="text-sm text-gray-600">
                          {doc.type} • {doc.size} • {new Date(doc.date).toLocaleDateString('es-MX')}
                        </p>
                        <p className="text-xs text-gray-500">Caso: {doc.caseId}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'Nuevo' ? 'bg-blue-100 text-blue-800' :
                        doc.status === 'Firmado' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doc.status}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appointments */}
          {activeTab === 'appointments' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Mis Citas</h2>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{appointment.title}</h4>
                        <p className="text-gray-600">{appointment.lawyer}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'Confirmada' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(appointment.date).toLocaleDateString('es-MX')}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {appointment.time}
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 mr-2">📍</span>
                        {appointment.location}
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      Tipo: {appointment.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {activeTab === 'messages' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Mis Mensajes</h2>
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={`border rounded-lg p-4 ${
                    !message.read ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className={`font-medium ${!message.read ? 'text-blue-900' : 'text-gray-900'}`}>
                          {message.subject}
                        </h4>
                        <p className="text-sm text-gray-600">De: {message.from}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{new Date(message.date).toLocaleDateString('es-MX')}</p>
                        {!message.read && (
                          <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-1"></span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{message.preview}</p>
                    {message.caseId && (
                      <p className="text-xs text-gray-500 mt-2">Relacionado con: {message.caseId}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientArea;

