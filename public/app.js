/* global CheckoutWebComponents */

window.initializeCheckout = async function() {
  const container = document.getElementById("flow-container");
  const triggerBtn = document.getElementById("checkout-trigger");

  const amount = document.getElementById("input-amount").value;
  const currency = document.getElementById("input-currency").value;
  const country = document.getElementById("input-country").value;
  const reference = document.getElementById("input-reference").value;

  triggerBtn.disabled = true;
  triggerBtn.innerText = "Processing...";

  try {
    const response = await fetch("/create-payment-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency, country, reference })
    });
    
    const paymentSession = await response.json();
    if (!response.ok) throw new Error("Payment session failed to load.");

    const checkout = await CheckoutWebComponents({
      publicKey: "pk_sbox_w5tsowjlb3s27oveipn5bmrs34f",
      environment: "sandbox",
      paymentSession,
      // CRITICAL: This links your frontend to your Apple Merchant ID
      componentOptions: {
        applepay: {
          merchantIdentifier: "merchant.lovethdiwe.sandbox"
        }
      },
      onReady: () => {
        triggerBtn.disabled = false;
        triggerBtn.innerText = "Checkout";
      },
      onError: (error) => {
        // This will now show you WHY Apple Pay says "Payment not completed"
        console.error("Apple Pay Validation Error:", error);
      }
    });

    const flowComponent = checkout.create("flow");
    flowComponent.mount(container);

  } catch (error) {
    console.error(error);
    container.innerHTML = `<p style="color: #d9534f; text-align: center; margin-top: 50px;">${error.message}</p>`;
    triggerBtn.disabled = false;
    triggerBtn.innerText = "Checkout";
  }
};