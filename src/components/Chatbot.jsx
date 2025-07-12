import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy el asistente virtual de Hidalpi. ¿En qué puedo ayudarle hoy?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickReplies = [
    "¿Cuáles son sus servicios?",
    "¿Cómo agendar una cita?",
    "¿Cuáles son sus horarios?",
    "¿Dónde están ubicados?",
    "¿Cuánto cuestan sus servicios?",
    "Hablar con un abogado"
  ];

  const botResponses = {
    servicios: {
      keywords: ['servicios', 'servicio', 'áreas', 'especialidades', 'qué hacen'],
      response: "Ofrecemos servicios en las siguientes áreas:\n\n• Derecho Civil\n• Derecho Comercial\n• Derecho Laboral\n• Derecho Penal\n• Derecho de Familia\n• Derecho Fiscal\n• Derecho Inmobiliario\n\n¿Le interesa alguna área en particular?"
    },
    cita: {
      keywords: ['cita', 'agendar', 'reservar', 'consulta', 'appointment'],
      response: "Para agendar una cita puede:\n\n1. Usar nuestro sistema de reservas en línea\n2. Llamarnos al +52 (55) 1234-5678\n3. Enviarnos un WhatsApp\n4. Visitarnos directamente\n\n¿Prefiere que le ayude a agendar una cita ahora?"
    },
    horarios: {
      keywords: ['horarios', 'horario', 'abierto', 'cerrado', 'cuando'],
      response: "Nuestros horarios de atención son:\n\n📅 Lunes a Viernes: 8:00 AM - 7:00 PM\n📅 Sábados: 9:00 AM - 2:00 PM\n📅 Domingos: Cerrado\n\n🚨 Atención de emergencias 24/7"
    },
    ubicacion: {
      keywords: ['ubicación', 'dirección', 'donde', 'ubicados', 'oficina'],
      response: "Nos encontramos en:\n\n📍 Av. Reforma 123, Piso 15\nCol. Juárez, Ciudad de México\nC.P. 06600\n\n🚇 Metro Insurgentes (Línea 1)\n🚌 Metrobús Reforma\n🅿️ Estacionamiento disponible"
    },
    costos: {
      keywords: ['costo', 'precio', 'cuanto', 'honorarios', 'tarifa'],
      response: "Nuestros honorarios varían según el tipo de servicio:\n\n• Consulta inicial: GRATUITA\n• Asesoría general: Desde $1,500\n• Casos complejos: Cotización personalizada\n\n💡 La primera consulta siempre es gratuita. ¿Le gustaría agendar una?"
    },
    abogado: {
      keywords: ['abogado', 'hablar', 'contactar', 'humano', 'persona'],
      response: "Por supuesto, puedo conectarle con uno de nuestros abogados.\n\n¿Prefiere:\n1. Llamada telefónica inmediata\n2. Agendar una cita\n3. Chat en vivo con un abogado\n4. Que le llamen más tarde\n\nPor favor, indíqueme su preferencia."
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    for (const [key, data] of Object.entries(botResponses)) {
      if (data.keywords.some(keyword => message.includes(keyword))) {
        return data.response;
      }
    }
    
    // Respuesta por defecto
    return "Entiendo su consulta. Para brindarle la mejor asistencia, le recomiendo:\n\n1. Contactar directamente a nuestros abogados\n2. Agendar una consulta gratuita\n3. Llamarnos al +52 (55) 1234-5678\n\n¿Le gustaría que le ayude con alguna de estas opciones?";
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simular tiempo de respuesta del bot
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: findBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (reply) => {
    setInputText(reply);
    handleSendMessage();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border z-50 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Asistente Hidalpi</h3>
                <p className="text-xs text-blue-100">En línea</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-xs ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    {message.sender === 'user' ? 
                      <User className="h-4 w-4 text-white" /> : 
                      <Bot className="h-4 w-4 text-gray-600" />
                    }
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('es-MX', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="p-3 border-t">
              <p className="text-xs text-gray-500 mb-2">Preguntas frecuentes:</p>
              <div className="flex flex-wrap gap-1">
                {quickReplies.slice(0, 3).map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escriba su mensaje..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;

