import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppointmentBooking from './components/AppointmentBooking';
import Chatbot from './components/Chatbot';
import { NotificationProvider } from './components/ui/notification';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Laws from './pages/Laws';
import ConferencesPayment from './pages/ConferencesPayment';
import Registration from './pages/Registration';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import ClientArea from './components/ClientArea';
import './App.css';

function App() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <NotificationProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home onOpenAppointment={() => setIsAppointmentModalOpen(true)} />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/services" element={<Services />} />
              <Route path="/laws" element={<Laws />} />
              <Route path="/conferences-payment" element={<ConferencesPayment />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/client-area" element={<ClientArea />} />
            </Routes>
          </main>
          <Footer />
          
          {/* Componentes Globales */}
          <AppointmentBooking 
            isOpen={isAppointmentModalOpen} 
            onClose={() => setIsAppointmentModalOpen(false)} 
          />
          <Chatbot />
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;

