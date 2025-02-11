import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

// 🔹 Cargar Stripe de manera segura
const stripePromise = loadStripe("pk_test_51Qr8qUQFRejcDSxhesf7yU4DqC8Vc2WiGeVHDqPj1tTCDV6DCocSZnLHTVjJqoqfayrbxKuwhGvPzoDnzq8Vxwhm00XZKdpun5");

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { flightId } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        // 🔹 Obtener `clientSecret` desde el backend antes de mostrar el formulario
        const fetchClientSecret = async () => {
            try {
                const response = await axios.post("http://44.204.12.160:5005/create-payment-intent", {
                    amount: 5000,  // 🔹 Ajustar según el precio real en centavos
                    currency: "usd"
                });
                setClientSecret(response.data.clientSecret);
            } catch (error) {
                setMessage("⚠️ Error obteniendo el pago: " + error.message);
            }
        };

        fetchClientSecret();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            setMessage("⚠️ Stripe aún no está listo.");
            return;
        }

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: { email: "cliente@example.com" }
            }
        });

        if (result.error) {
            setMessage(`❌ Error: ${result.error.message}`);
        } else if (result.paymentIntent.status === "succeeded") {
            setMessage("✅ Pago exitoso");

            // 🔹 Guardar la reserva después del pago exitoso
            const userId = localStorage.getItem('user_id');  

            try {
                const bookingResponse = await axios.post("http://18.204.253.128:5021/booking", {
                    user_id: userId,
                    flight_id: flightId,
                    booking_date: new Date().toISOString(),
                    status: "confirmed"
                });

                if (bookingResponse.status === 201) {
                    setMessage("✅ Reserva confirmada. Redirigiendo...");
                    setTimeout(() => navigate("/reservas"), 3000); // 🔹 Redirige a reservas después de 3 seg
                } else {
                    setMessage("⚠️ Pago exitoso, pero error al registrar reserva.");
                }
            } catch (error) {
                setMessage("⚠️ Error al guardar la reserva: " + error.message);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Pago con Tarjeta</h2>
            <CardElement />
            <button type="submit" disabled={!stripe || !clientSecret}>
                Pagar y Reservar
            </button>
            {message && <p>{message}</p>}
        </form>
    );
};

const Pago = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

export default Pago;
