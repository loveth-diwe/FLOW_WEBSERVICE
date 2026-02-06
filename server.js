const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.static("public"));
app.use(express.json());

// Set this in Render's "Environment Variables" section
const SECRET_KEY = process.env.CHECKOUT_SECRET_KEY;

app.post("/create-payment-sessions", async (req, res) => {
  const { amount, currency, country, reference } = req.body;
  // Hardcoded Base URL for your specific Render deployment
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
          amount: parseInt(amount), 
          currency: currency.toUpperCase(),
          reference: reference, // Use the dynamic reference from the frontend,
          billing: {
            address: {
              country: country.toUpperCase(), 
            },
          },
          customer: {
            email: "test-user@example.com",
            name: "Test User",
          },
          // Updated redirect URLs to point to your live domain
          success_url: `${baseUrl}/?status=succeeded`,
          failure_url: `${baseUrl}/?status=failed`,
        }),
      }
    );

    const parsedPayload = await request.json();
    res.status(request.status).send(parsedPayload);
  } catch (error) {
    console.error("Session Error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));