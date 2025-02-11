import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';  // 🔹 Importamos Register.js test
import Dashboard from './Dashboard';
import PrivateRoute from './PrivateRoute';  // 🔹 Agregaremos una protección para rutas privadas test2
import Reservas from './Reservas';
import Pago from './Pago';
import AdminFlights from './AdminFlights';  // 🔹 Nueva ruta para gestión de vuelos por administrador

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔹 Rutas públicas (Login y Registro) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 🔹 Rutas protegidas */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/reservas" element={
          <PrivateRoute>
            <Reservas />
          </PrivateRoute>
        } />
        
        <Route path="/admin/flights" element={
          <PrivateRoute>
            <AdminFlights />
          </PrivateRoute>
        } />
        
        <Route path="/pago/:flightId" element={
          <PrivateRoute>
            <Pago />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
