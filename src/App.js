import React, { useState } from 'react';
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from 'axios';
import imagen from './img/TROVY.png'

import "bootswatch/dist/lux/bootstrap.min.css";
import './App.css';
import Stripe from 'stripe';

const stripePromise = loadStripe("pk_test_51Htl08CkDESmvwU8kmrKhPwgvQVN7axxFSxwAQBHegKAklKAiBknOweluCKygVBgbGmP6OKbNuAzTuq2bmqIoZsl00t6ktqiWV");

const CheckoutForm = () => {

  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const{error,paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    });

/*     if (payment.confirm == true) {
      alert('Pago realizado con éxito')
    } */

  setLoading(true)

    if (!error) {
      const { id } = paymentMethod;
      /* console.log(paymentMethod) */

      try {
        const {data} = await axios.post(
          'http://Localhost:3001/api/checkout', {
          id,
          amount: 1000
        })
  
        console.log(data);
        elements.getElement(CardElement).clear();

      } catch (error) {
        console.log(error)
      }

      setLoading(false)
    };

  };

  return <form onSubmit={handleSubmit} className="card card-body">
    
    <img src={imagen} className="img-fluid"/>

    <h3 className="text-center my-2" id="pagoPrecio">Precio: $100</h3>

    <div className="form-group">
      <CardElement className="form-control"/>
    </div>

    <button className="btn btn-success" disabled={!stripe} id="buyButton">
        { loading ? (
          <div className="spinner-border" role="status">
            <span className="sr-only">Cargando...</span>
        </div>
        ) : ("Reservar")
        }
    </button>
  </form>
};



function App() {
  return (
    <Elements stripe={stripePromise}>
        <div className="container p-4">
          <div className="row">
            <div className="col-md-4 offset-md-4">
              <CheckoutForm/>
            </div>
          </div>
        </div>
    </Elements>
  );
};

export default App;
