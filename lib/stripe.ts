import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

export const COURSE_PRICE = 2495 // $24.95 in cents
export const COURSE_NAME = 'California Traffic School — ClearPass Drive'
