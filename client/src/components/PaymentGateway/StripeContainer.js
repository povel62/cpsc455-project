import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { CheckoutForm } from "./CheckoutForm";

const PUBLIC_KEY =
  "pk_test_51HqZQ2EDyDRTboqUPzmSL5SUtXRkUmRDiyndfrkRHT0Px4q9fWjTaJex3UBDmGKEuSV0NWEgsaYX6GCEgECsc8HA00ZmUYxT1a";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const Stripe = () => {
  return (
    <Elements stripe={stripeTestPromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Stripe;
