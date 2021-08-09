import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { setPremium } from "../../redux/actions/actions";

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  let token = useSelector((state) => state.loginReducer.accessToken);

  const updatePremium = async () => {
    //e.preventDefault();
    //setEditInfo(!editInfo);

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

    // setOpenSnackBar(true);
    if (response.status === 200) {
      dispatch(setPremium(true));
      // setSnackBarContent({
      //   content: "Account made premium successfully",
      //   severity: "success",
      // });
    }
    //else {
    // setSnackBarContent({
    //   content: "Something went wrong please try again later",
    //   severity: "error",
    // });
    //}
  };

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
          updatePremium();
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
