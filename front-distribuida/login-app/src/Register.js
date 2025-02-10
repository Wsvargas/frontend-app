import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        date_of_birth: '',
        role: 'cliente', // Valor por defecto
        is_active: 't'  // Valor por defecto
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        // 🔹 Verifica qué datos se están enviando desde el frontend
        console.log("📌 Datos enviados al backend:", formData);
    
        try {
            const response = await fetch('http://34.231.43.55:5001/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    date_of_birth: formData.date_of_birth, // Asegurar formato "YYYY-MM-DD"
                    role: "cliente",  // 🔹 Forzar el rol "cliente"
                    is_active: true   // 🔹 Forzar is_active como booleano
                })
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || 'Error en el registro');
            }
            
            if (window.confirm("✅ Registro exitoso. ¿Quieres ir al login?")) {
                navigate('/login');
            }
        } catch (error) {
            console.error("❌ Error en el registro:", error.message);
            setError(error.message);
        }
    };
    

    return (
        <div>
            <h2>Registro</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Nombre" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Correo" onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Teléfono" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
                <input type="date" name="date_of_birth" placeholder="Fecha de Nacimiento" onChange={handleChange} required />
                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
};

export default Register;
