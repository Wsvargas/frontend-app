import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';  // 🔹 Importamos Register.js
import Dashboard from './Dashboard';
import PrivateRoute from './PrivateRoute';  // 🔹 Agregaremos una protección para rutas privadas

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔹 Rutas públicas (Login y Registro) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔹 Ruta protegida (Dashboard) */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
