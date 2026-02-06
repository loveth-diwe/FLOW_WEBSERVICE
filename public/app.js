/* global CheckoutWebComponents */

window.initializeCheckout = async function() {
  // These MUST match the IDs in your HTML
  const container = document.getElementById("flow-container");
  const triggerBtn = document.getElementById("checkout-trigger");

  if (!container) {
    console.error("Error: 'flow-container' not found in the HTML.");
    return;
  }

  const amount = document.getElementById("input-amount").value;
  const currency = document.getElementById("input-currency").value;
  const country = document.getElementById("input-country").value;
  const reference = document.getElementById("input-reference").value; // Added reference

  // UI Feedback
  container.innerHTML = '<p class="placeholder-text">Loading payment methods...</p>';
  triggerBtn.disabled = true;
  triggerBtn.innerText = "Processing...";

  try {
    const response = await fetch("/create-payment-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency, country })
    });
    
    const paymentSession = await response.json();
    if (!response.ok) throw new Error("Payment session failed to load.");

    container.innerHTML = ""; // Clear the loading text

    const checkout = await CheckoutWebComponents({
      publicKey: "pk_sbox_w5tsowjlb3s27oveipn5bmrs34f",
      environment: "sandbox",
      paymentSession,
      onReady: () => {
        triggerBtn.disabled = false;
        triggerBtn.innerText = "Checkout";
      }
    });

    const flowComponent = checkout.create("flow");
    flowComponent.mount(container);

  } catch (error) {
    console.error(error);
    container.innerHTML = `<p class="placeholder-text" style="color: #d9534f;">${error.message}</p>`;
    triggerBtn.disabled = false;
    triggerBtn.innerText = "Checkout";
  }
};