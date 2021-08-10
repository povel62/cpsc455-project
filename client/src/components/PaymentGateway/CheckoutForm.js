import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { setPremium } from "../../redux/actions/actions";
import { CircularProgress } from "@material-ui/core";

export const CheckoutForm = ({ setOpenSnackBar, setSnackBarContent }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  let token = useSelector((state) => state.loginReducer.accessToken);
  const [submitting, setSubmitting] = useState(false);

  const updatePremium = async () => {
    const response = await fetch("/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        premium: true,
      }),
    });

    if (response.status == 200) {
      dispatch(setPremium(true));
      setSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    setSubmitting(true);
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
          updatePremium();
          setOpenSnackBar(true);
          setSnackBarContent({
            content: "payment successful",
            severity: "success",
          });
        }
      } catch (errorS) {
        setSubmitting(false);
        console.log("CheckoutForm.js 28 | ", errorS);
        setOpenSnackBar(true);
        setSnackBarContent({
          content: "That didn't go through. Please try again",
          severity: "error",
        });
      }
    } else {
      setSubmitting(false);
      console.log(error.message);
      setOpenSnackBar(true);
      setSnackBarContent({
        content:
          "Payment could not be made at this time. Please try again later",
        severity: "error",
      });
    }
  };

  return (
    <form style={{ maxWidth: 400 }}>
      <br />
      <CardElement />
      <br />
      <br />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={submitting}
      >
        Pay Now
        {submitting && <CircularProgress size={24} />}
      </Button>
    </form>
  );
};
