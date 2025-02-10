import React from 'react';
import { Navigate } from 'react-router-dom';

// Función para obtener el token del almacenamiento local
const getToken = () => localStorage.getItem('accessToken');

const PrivateRoute = ({ children }) => {
  return getToken() ? children : <Navigate to="/" />;
};

export default PrivateRoute;
