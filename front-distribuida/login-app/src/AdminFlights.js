import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://34.207.193.135'; // Reemplaza con la IP de tu instancia

const AdminFlights = () => {
    const [flights, setFlights] = useState([]);
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        departure_time: '',
        arrival_time: '',
        price: '',
        status: 'active',
        total_seats: '',
        available_seats: ''
    });
    const [editFlight, setEditFlight] = useState(null);
    
    // 🔹 Obtener lista de vuelos
    useEffect(() => {
        fetch(`${API_BASE_URL}:5032/flights`)
            .then(response => response.json())
            .then(data => setFlights(data))
            .catch(error => console.error('Error al obtener vuelos:', error));
    }, []);

    // 🔹 Manejar cambios en el formulario
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 🔹 Crear un nuevo vuelo
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}:5031/flights`, formData);
            alert('Vuelo creado exitosamente');
            setFlights([...flights, response.data]);  // Agregar el vuelo a la lista
        } catch (error) {
            console.error('Error al crear vuelo:', error);
        }
    };

    // 🔹 Seleccionar vuelo para editar
    const handleEditClick = (flight) => {
        setEditFlight(flight.id);
        setFormData({
            status: flight.status,
            available_seats: flight.available_seats
        });
    };

    // 🔹 Guardar cambios en un vuelo
    const handleUpdate = async (id) => {
        try {
            await axios.put(`${API_BASE_URL}:5034/flights/${id}`, {
                status: formData.status,
                available_seats: formData.available_seats
            });
            alert('Vuelo actualizado');
            setFlights(flights.map(f => f.id === id ? { ...f, ...formData } : f));
            setEditFlight(null); // Salir del modo edición
        } catch (error) {
            console.error('Error al actualizar vuelo:', error);
        }
    };

    // 🔹 Eliminar vuelo
    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este vuelo?')) return;
        try {
            await axios.delete(`${API_BASE_URL}:5035/flights/${id}`);
            alert('Vuelo eliminado');
            setFlights(flights.filter(f => f.id !== id));
        } catch (error) {
            console.error('Error al eliminar vuelo:', error);
        }
    };

    return (
        <div>
            <h2>Gestión de Vuelos</h2>

            {/* 🔹 Formulario para crear un nuevo vuelo */}
            <form onSubmit={handleCreate}>
                <h4>Crear Vuelo</h4>
                <input type="text" name="origin" placeholder="Origen" onChange={handleChange} required />
                <input type="text" name="destination" placeholder="Destino" onChange={handleChange} required />
                <input type="datetime-local" name="departure_time" onChange={handleChange} required />
                <input type="datetime-local" name="arrival_time" onChange={handleChange} required />
                <input type="number" name="price" placeholder="Precio" onChange={handleChange} required />
                <input type="number" name="total_seats" placeholder="Asientos Totales" onChange={handleChange} required />
                <input type="number" name="available_seats" placeholder="Asientos Disponibles" onChange={handleChange} required />
                <button type="submit">Crear Vuelo</button>
            </form>

            {/* 🔹 Lista de vuelos */}
            <ul>
                {flights.map(flight => (
                    <li key={flight.id}>
                        {flight.origin} → {flight.destination} ({flight.status}) - {flight.available_seats} asientos
                        {editFlight === flight.id ? (
                            <>
                                <input type="text" name="status" value={formData.status} onChange={handleChange} />
                                <input type="number" name="available_seats" value={formData.available_seats} onChange={handleChange} />
                                <button onClick={() => handleUpdate(flight.id)}>Guardar</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => handleEditClick(flight)}>✏ Editar</button>
                                <button onClick={() => handleDelete(flight.id)}>🗑 Eliminar</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminFlights;
