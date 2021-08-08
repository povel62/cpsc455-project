import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useSelector } from "react-redux";
import Button from "@material-ui/core/Button";

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  let token = useSelector((state) => state.loginReducer.accessToken);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      console.log("Stripe 23 | token generated!", paymentMethod);
      try {
        const { id } = paymentMethod;
        const response = await axios.post(
          "/api/user/stripe/charge",
          {
            amount: 999,
            id: id,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        console.log("Stripe 35 | data", response.data.success);
        if (response.data.success) {
          console.log("CheckoutForm.js 25 | payment successful!");
          alert("Payment successful");
        }
      } catch (error) {
        console.log("CheckoutForm.js 28 | ", error);
      }
    } else {
      console.log(error.message);
    }
  };

  return (
    <form style={{ maxWidth: 400 }}>
      <br />
      <CardElement />
      <br />
      <br />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Pay Now
      </Button>
    </form>
  );
};
