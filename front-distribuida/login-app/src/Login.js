import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');  // Aquí definimos email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://54.83.42.239:5003/login', {
            email,
            password,
        });

        if (response.status === 200) {
            alert('Inicio de sesión exitoso'); // Mostrar mensaje de éxito
            navigate('/reservas');  // Redirige a la página de reservas
        } else {
            setError('Usuario o contraseña incorrectos');
        }
    } catch (err) {
        console.error(err);
        setError('Error de credenciales');
    }
};

  return (
    <div className="container mt-5">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">Iniciar sesión</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/register')}>Registrarse</button>
      </form>
    </div>
  );
}

export default Login;