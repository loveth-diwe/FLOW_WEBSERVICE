const express = require("express");
const { enabled } = require("express/lib/application");
const fetch = require("node-fetch");
const app = express();

app.use(express.static("public"));
app.use(express.json());

// Insert your secret key here
const SECRET_KEY = "sk_sbox_r22hwwp4zx3oi74v4jm4akk5tau";

app.post("/create-payment-sessions", async (_req, res) => {
  // Create a PaymentSession
  const request = await fetch(
    "https://api.sandbox.checkout.com/payment-sessions",
    {
      method: "POST",
      headers: {
        Authorization: SECRET_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 10626,
        currency: "GBP",
        reference: "ORD-123AAA",
        payment_type: "Regular",
        description: "Payment for Guitars and Amps",
        processing_channel_id: "pc_f35zeezjelcuhn55zo3gdi2zpu",
        payment_method_configuration: {
          card:{
            store_payment_details:"enabled"
          }
        },
        processing:{
          aft:false,
          discount_amount:0,
          locale:"en-GB",
          shipping_amount:0,
          tax_amount: 0,
        },
        billing_descriptor: {
          name: "Loveth Test2",
          city: "London",
        },
        customer: {
          email: "checup@zohomail.eu",
          name: "Loveth Test2",
        },
        shipping: {
          address: {
            address_line1: "123 High St.",
            address_line2: "Flat 456",
            city: "London",
            zip: "SW1A 1AA",
            country: "GB",
          },
          phone: {
            number: "1234567890",
            country_code: "+44",
          },
        },
        billing: {
          address: {
            address_line1: "123 High St.",
            address_line2: "Flat 456",
            city: "London",
            zip: "SW1A 1AA",
            country: "GB",
          },
          phone: {
            number: "017614284340",
            country_code: "+49",
          },
        },
        risk: {
          enabled: true,
        },
        success_url: "http://localhost:3000/?status=succeeded",
        failure_url: "http://localhost:3000/?status=failed",
        metadata: {},
      //   products: [
      //     {
      //   name: "Guitar",
      //   quantity: 1,
      //   price: 1635
      //   },
      //     {
      //   name: "Amp",
      //   quantity: 3,
      //   price: 1635
      //     }
      // ],
        items: [
          {
            name: "Guitar",
            quantity: 1,
            unit_price: 10626,
            total_amount: 10626,
            reference:"123456"
          },
          // {
          //   name: "Amp",
          //   quantity: 3,
          //   unit_price: 1635,
          //   total_amount: 4905,
          // },
        ],
        //enabled_payment_methods: ["paypal", "card", "klarna","ideal","bancontact","eps","p24","multibanco"],
      }),
    }
  );

  const parsedPayload = await request.json();

  res.status(request.status).send(parsedPayload);
});

app.listen(3000, () =>
  console.log("Node server listening on port 3000: http://localhost:3000/")
);