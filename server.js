const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.static("public"));
app.use(express.json());

const SECRET_KEY = process.env.CHECKOUT_SECRET_KEY;

app.post("/create-payment-sessions", async (req, res) => {
  const { amount, currency, country, reference } = req.body;
  const baseUrl = "https://flow-webservice-hns0.onrender.com";

  try {
    const request = await fetch(
      "https://api.sandbox.checkout.com/payment-sessions",
      {
        method: "POST",
        headers: {
          Authorization: SECRET_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseInt(amount) || 0, // Ensure it's a number
          currency: (currency || "GBP").toUpperCase(),
          reference: reference || "REF-Default", // Fallback if empty
          billing: {
            address: {
              country: (country || "GB").toUpperCase(), 
            },
          },
          risk: {
            enabled: true,
          },
          payment_type: "Regular",
          processing_channel_id: "pc_f35zeezjelcuhn55zo3gdi2zpu",
          customer: {
            email: "test-user@example.com",
            name: "Test User",
          },
          success_url: `${baseUrl}/?status=succeeded`,
          failure_url: `${baseUrl}/?status=failed`,
        }),
      }
    );

    const parsedPayload = await request.json();

    // CRITICAL: Forward the exact error from Checkout.com to your browser
    if (!request.ok) {
      console.error("Checkout.com API rejected the request:", parsedPayload);
      return res.status(request.status).json(parsedPayload);
    }

    res.status(request.status).json(parsedPayload);
  } catch (error) {
    console.error("Server Logic Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));