/* global CheckoutWebComponents */

// Make sure the function is defined globally
window.initializeCheckout = async function() {
  const container = document.getElementById("flow-container");
  const triggerBtn = document.getElementById("checkout-trigger");

  const amount = document.getElementById("input-amount").value;
  const currency = document.getElementById("input-currency").value;
  const country = document.getElementById("input-country").value;

  // Show loading state
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
    if (!response.ok) throw new Error("Session creation failed");

    // Clear loading state
    container.innerHTML = "";

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
    container.innerHTML = `<p class="placeholder-text" style="color: red;">Error: ${error.message}</p>`;
    triggerBtn.disabled = false;
    triggerBtn.innerText = "Checkout";
  }
};