import React, { useEffect, useState } from 'react';

const Reservas = () => {
    const [reservas, setReservas] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5022/booking')  // Cambiar a la IP del backend en AWS
            .then(response => response.json())
            .then(data => setReservas(data))
            .catch(error => console.error('Error al obtener reservas:', error));
    }, []);

    return (
        <div>
            <h2>Mis Reservas</h2>
            <ul>
                {reservas.map(reserva => (
                    <li key={reserva.id}>
                        Vuelo: {reserva.flight_id} - Estado: {reserva.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Reservas;
