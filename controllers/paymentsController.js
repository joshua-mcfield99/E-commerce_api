const stripe = require('../config/stripe'); // Use your Stripe secret key

// Controller to handle the creation of a payment intent
exports.createPaymentIntent = async (req, res) => {
    const { amount } = req.body;
    console.log("Received amount in cents:", amount);

    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
    }

    try {
        console.log("Generating clientSecret for payment intent");
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
        });
        console.log("Generated clientSecret:", paymentIntent.client_secret);
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ error: "Payment intent creation failed" });
    }
};