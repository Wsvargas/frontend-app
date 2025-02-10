import React, { useEffect, useState } from 'react';

const Reservas = () => {
    const [reservas, setReservas] = useState([]);
    const userId = localStorage.getItem('user_id');  // 🔹 Obtener el ID del usuario autenticado

    useEffect(() => {
        fetch(`http://localhost:5022/booking?user_id=${userId}`)  // 🔹 Filtrar por usuario autenticado
            .then(response => response.json())
            .then(data => setReservas(data))
            .catch(error => console.error('Error al obtener reservas:', error));
    }, [userId]);

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
