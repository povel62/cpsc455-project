const stripe = Stripe(
  "pk_test_51HqZQ2EDyDRTboqUPzmSL5SUtXRkUmRDiyndfrkRHT0Px4q9fWjTaJex3UBDmGKEuSV0NWEgsaYX6GCEgECsc8HA00ZmUYxT1a"
); // Your Publishable Key
const elements = stripe.elements();

const card = elements.create("card", { style });
card.mount("#card-element");

// Give our token to our form
const stripeTokenHandler = (token) => {
  const hiddenInput = document.createElement("input");
  hiddenInput.setAttribute("type", "hidden");
  hiddenInput.setAttribute("name", "stripeToken");
  hiddenInput.setAttribute("value", token.id);
  form.appendChild(hiddenInput);

  form.submit();
};

// Create token from card data
form.addEventListener("submit", (e) => {
  e.preventDefault();

  stripe.createToken(card).then((res) => {
    if (res.error) errorEl.textContent = res.error.message;
    else stripeTokenHandler(res.token);
  });
});
