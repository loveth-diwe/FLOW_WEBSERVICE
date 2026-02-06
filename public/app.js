/* global CheckoutWebComponents */

async function initializeCheckout() {
  const amount = document.getElementById("input-amount").value;
  const currency = document.getElementById("input-currency").value;
  const country = document.getElementById("input-country").value;

  // Clear placeholder text before mounting
  document.getElementById("flow-container").innerHTML = "";

  const response = await fetch("/create-payment-sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency, country })
  });
  
  const paymentSession = await response.json();
  if (!response.ok) return console.error("Session Error", paymentSession);

  const checkout = await CheckoutWebComponents({
    publicKey: "pk_sbox_w5tsowjlb3s27oveipn5bmrs34f",
    environment: "sandbox",
    paymentSession,
    onReady: () => console.log("Checkout is live!"),
  });

  const flowComponent = checkout.create("flow");
  flowComponent.mount(document.getElementById("flow-container"));
}