import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Reservas = () => {
    const [vuelos, setVuelos] = useState([]);  // 🔹 Lista de vuelos disponibles
    const [selectedFlight, setSelectedFlight] = useState(null);  // 🔹 Vuelo seleccionado
    const [error, setError] = useState('');
    const userId = localStorage.getItem('user_id');  // 🔹 Obtener usuario autenticado
    const navigate = useNavigate();

    // 🔹 Obtener vuelos disponibles con asientos y fecha válida
    useEffect(() => {
        axios.get('http://34.207.193.135:5032/flights')
            .then(response => {
                const vuelosDisponibles = response.data.filter(flight => 
                    flight.status === "active" && 
                    flight.available_seats > 0 &&
                    new Date(flight.departure_time) > new Date() // 🔹 Solo vuelos en el futuro
                );
                setVuelos(vuelosDisponibles);
            })
            .catch(error => setError('Error al obtener vuelos: ' + error.message));
    }, []);

    // 🔹 Manejar selección de vuelo
    const handleSelectFlight = (flight) => {
        setSelectedFlight(flight);
    };

    // 🔹 Al hacer clic en "Reservar", ir a la página de pago con el vuelo seleccionado
    const handleReserve = () => {
        if (!selectedFlight) {
            alert("Selecciona un vuelo antes de reservar");
            return;
        }

        // Guardar los datos en memoria antes de redirigir al pago
        localStorage.setItem('selectedFlight', JSON.stringify(selectedFlight));

        // Redirigir a la página de pago con el `flight_id`
        navigate(`/pago/${selectedFlight.id}`);
    };

    return (
        <div>
            <h2>Vuelos Disponibles</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul>
                {vuelos.map(flight => (
                    <li key={flight.id}>
                        {flight.origin} → {flight.destination} | 
                        Salida: {new Date(flight.departure_time).toLocaleString()} | 
                        Asientos Disponibles: {flight.available_seats} 
                        <button onClick={() => handleSelectFlight(flight)}>Seleccionar</button>
                    </li>
                ))}
            </ul>

            {selectedFlight && (
                <div>
                    <h3>Vuelo Seleccionado</h3>
                    <p>
                        {selectedFlight.origin} → {selectedFlight.destination} <br />
                        Salida: {new Date(selectedFlight.departure_time).toLocaleString()} <br />
                        Asientos Disponibles: {selectedFlight.available_seats}
                    </p>
                    <button onClick={handleReserve} className="btn btn-success">Reservar</button>
                </div>
            )}
        </div>
    );
};

export default Reservas;
