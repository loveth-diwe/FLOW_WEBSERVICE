/* global CheckoutWebComponents */

async function initializeCheckout() {
  const amount = document.getElementById("input-amount").value;
  const currency = document.getElementById("input-currency").value;
  const country = document.getElementById("input-country").value;

  // 1. Create the Payment Session
  const response = await fetch("/create-payment-sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency, country })
  });
  
  const paymentSession = await response.json();

  if (!response.ok) {
    console.error("Error creating session", paymentSession);
    alert("Check console for error details");
    return;
  }

  // 2. UI Transitions
  document.getElementById("config-view").style.display = "none";
  document.getElementById("checkout-view").style.display = "block";

  // 3. Initialize Checkout SDK
  const checkout = await CheckoutWebComponents({
    publicKey: "pk_sbox_w5tsowjlb3s27oveipn5bmrs34f", // Your public key
    environment: "sandbox",
    paymentSession,
    onReady: () => console.log("Checkout is ready"),
    onPaymentCompleted: (_component, paymentResponse) => {
      console.log("Payment Successful:", paymentResponse.id);
    },
    onError: (err) => console.error("SDK Error:", err),
  });

  const flowComponent = checkout.create("flow");
  flowComponent.mount(document.getElementById("flow-container"));
}

// Handle Toast Notifications for redirects
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("status") === "succeeded") {
  document.getElementById("successToast")?.classList.add("show");
} else if (urlParams.get("status") === "failed") {
  document.getElementById("failedToast")?.classList.add("show");
}