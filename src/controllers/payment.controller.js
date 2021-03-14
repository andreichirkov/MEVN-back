const dollarsToCents = require('dollars-to-cents')
const stripe = require('stripe')('sk_test_51IOPsbCxyJSINBfHwfXe8vlrMBkK9yVYAqN9QW4GG2Rx1Fe4SIr1pciqK8RiKrQa2JXCogGg1bCHBgLunJvjg035007vMERh5G');

const createPaymentIntent = async({ body: { amount } }, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: dollarsToCents(amount),
      currency: 'usd',
      payment_method_types: ['card'],
    });
    return res.status(200).send(paymentIntent)
  } catch(err) {
    res.status(500).send(err)
  }
}

// const stripeWebHook = async ({ body}, res) => {

// }

module.exports = {
  createPaymentIntent
}