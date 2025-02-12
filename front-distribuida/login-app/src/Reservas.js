import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Reservas = () => {
    const [reservas, setReservas] = useState([]); // 🔹 Lista de reservas del usuario
    const [error, setError] = useState('');
    const userId = localStorage.getItem('user_id'); // 🔹 ID del usuario autenticado

    // 🔹 Obtener reservas del usuario autenticado
    useEffect(() => {
        if (!userId) {
            setError("⚠️ No se encontró el ID del usuario.");
            return;
        }

        const fetchReservas = async () => {
            try {
                const response = await axios.get(`http://13.216.49.242:5022/booking?user_id=${userId}`);
                const reservasData = response.data;

                // 🔹 Obtener los detalles de cada vuelo reservado
                const reservasConDetalles = await Promise.all(
                    reservasData.map(async (reserva) => {
                        try {
                            const vueloResponse = await axios.get(`http://13.216.49.242:5033/flights/${reserva.flight_id}`);
                            return {
                                ...reserva,
                                vuelo: vueloResponse.data,
                            };
                        } catch (error) {
                            console.error(`⚠️ Error al obtener detalles del vuelo ${reserva.flight_id}:`, error);
                            return { ...reserva, vuelo: null };
                        }
                    })
                );

                setReservas(reservasConDetalles);
            } catch (error) {
                setError("⚠️ Error al obtener reservas: " + error.message);
            }
        };

        fetchReservas();
    }, [userId]);

    return (
        <div className="container mt-4">
            <h2>Mis Reservas</h2>

            {error && <p className="alert alert-danger">{error}</p>}

            {reservas.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID Reserva</th>
                            <th>Vuelo</th>
                            <th>Origen</th>
                            <th>Destino</th>
                            <th>Fecha de Reserva</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservas.map((reserva) => (
                            <tr key={reserva.id_reserva}>
                                <td>{reserva.id_reserva}</td>
                                <td>{reserva.flight_id}</td>
                                <td>{reserva.vuelo ? reserva.vuelo.origin : "No disponible"}</td>
                                <td>{reserva.vuelo ? reserva.vuelo.destination : "No disponible"}</td>
                                <td>{new Date(reserva.booking_date).toLocaleString()}</td>
                                <td>{reserva.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No tienes reservas registradas.</p>
            )}
        </div>
    );
};

export default Reservas;