const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Ensure STRIPE_SECRET_KEY is in your .env file

module.exports = stripe;