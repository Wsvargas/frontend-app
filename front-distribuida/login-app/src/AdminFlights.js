import React, { useEffect, useState } from 'react';

const AdminFlights = () => {
    const [flights, setFlights] = useState([]);

    useEffect(() => {
        fetch('http://13.216.49.242:5032/flights')  // 🔹 API de vuelos
            .then(response => response.json())
            .then(data => setFlights(data))
            .catch(error => console.error('Error al obtener vuelos:', error));
    }, []);

    return (
        <div>
            <h2>Gestión de Vuelos</h2>
            <ul>
                {flights.map(flight => (
                    <li key={flight.id}>
                        {flight.origin} → {flight.destination} ({flight.status})
                    </li>
                ))}
            </ul>
            {/* Aquí agregarás formularios para crear, editar y eliminar vuelos */}
        </div>
    );
};

export default AdminFlights;
