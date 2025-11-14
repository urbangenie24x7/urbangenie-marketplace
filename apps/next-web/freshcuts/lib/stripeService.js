// Stripe Payment Service (Alternative to Razorpay)
class StripeService {
  constructor() {
    this.publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo'
  }

  async initializeStripe() {
    if (typeof window !== 'undefined' && !window.Stripe) {
      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3/'
      script.onload = () => {
        window.stripe = window.Stripe(this.publishableKey)
      }
      document.head.appendChild(script)
    }
    return window.stripe
  }

  async processPayment(orderData, onSuccess, onFailure) {
    try {
      // For demo - simulate successful payment
      setTimeout(() => {
        onSuccess({
          paymentId: `stripe_${Date.now()}`,
          method: 'stripe',
          status: 'completed'
        })
      }, 2000)
    } catch (error) {
      onFailure(error.message)
    }
  }
}

export default new StripeService()