/* global CheckoutWebComponents */

window.initializeCheckout = async function() {
  // These MUST match the IDs in your HTML
  const container = document.getElementById("flow-container");
  const triggerBtn = document.getElementById("checkout-trigger");

  if (!container) {
    console.error("Error: 'flow-container' not found in the HTML.");
    return;
  }

  // Capture all user inputs
  const amount = document.getElementById("input-amount").value;
  const currency = document.getElementById("input-currency").value;
  const country = document.getElementById("input-country").value;
  const reference = document.getElementById("input-reference").value;

  // UI Feedback: Disable button to prevent double-clicks
  triggerBtn.disabled = true;
  triggerBtn.innerText = "Processing...";

  try {
    const response = await fetch("/create-payment-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Now correctly sending the reference to your server
      body: JSON.stringify({ amount, currency, country, reference })
    });
    
    const paymentSession = await response.json();
    if (!response.ok) throw new Error("Payment session failed to load.");

    // Initialize the Checkout SDK
    const checkout = await CheckoutWebComponents({
      publicKey: "pk_sbox_w5tsowjlb3s27oveipn5bmrs34f",
      environment: "sandbox",
      paymentSession,
      onReady: () => {
        triggerBtn.disabled = false;
        triggerBtn.innerText = "Checkout";
      }
    });

    // Create and mount the flow component
    const flowComponent = checkout.create("flow");
    flowComponent.mount(container);

  } catch (error) {
    console.error(error);
    // Error message only appears if the session fails
    container.innerHTML = `<p style="color: #d9534f; text-align: center; margin-top: 50px;">${error.message}</p>`;
    triggerBtn.disabled = false;
    triggerBtn.innerText = "Checkout";
  }
};