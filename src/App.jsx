import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './admin/ProtectedRoute';

// Public Components
import Header from './components/Header';
import Hero from './components/Hero';
import Shelters from './components/Shelters';
import DogGallery from './components/DogGallery';
import Footer from './components/Footer';

// Admin Components
import Login from './admin/Login';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import DogManager from './admin/DogManager';
import ShelterManager from './admin/ShelterManager';

const PublicPortal = () => (
  <div className="app-main">
    <Header />
    <main>
      <Hero />
      <Shelters />
      <DogGallery />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<PublicPortal />} />
          
          {/* Admin Login */}
          <Route path="/admin/login" element={<Login />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="perros" element={<DogManager />} />
            <Route path="albergues" element={<ShelterManager />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
