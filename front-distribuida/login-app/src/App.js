import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';  // 🔹 Importamos Register.js
import Dashboard from './Dashboard';
import PrivateRoute from './PrivateRoute';  // 🔹 Agregaremos una protección para rutas privadas
import Reservas from './Reservas';

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
      </Routes>
    </Router>
  );
}

export default App;
