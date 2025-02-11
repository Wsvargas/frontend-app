import React, { useState } from "react";
import { useParams } from "react-router-dom"; // 🔹 Obtener el `flightId`
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe("pk_test_51Qr8qUQFRejcDSxhesf7yU4DqC8Vc2WiGeVHDqPj1tTCDV6DCocSZnLHTVjJqoqfayrbxKuwhGvPzoDnzq8Vxwhm00XZKdpun5");

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { flightId } = useParams();  // 🔹 Obtener `flightId` desde la URL
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        const { error, paymentIntent } = await stripe.confirmCardPayment(
            "sk_test_51Qr8qUQFRejcDSxhcs6Xk2hL91atx3pAEscyPg6EzvVQgssJrZ9AK8YsKlxBYp8hbY6XTjVP0sbA88GWmh3j1TaN00DkiVEFub",
            {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: { email: "cliente@example.com" }
                }
            }
        );

        if (error) {
            setMessage(`Error: ${error.message}`);
        } else if (paymentIntent.status === "succeeded") {
            setMessage("✅ Pago exitoso");

            const userId = localStorage.getItem('user_id');  
            
            try {
                const bookingResponse = await axios.post("http://54.172.40.36:5021/booking", {
                    user_id: userId,
                    flight_id: flightId,
                    booking_date: new Date().toISOString(),
                    status: "confirmed"
                });

                if (bookingResponse.status === 201) {
                    setMessage("✅ Reserva confirmada en la base de datos.");
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
            <button type="submit" disabled={!stripe}>
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
