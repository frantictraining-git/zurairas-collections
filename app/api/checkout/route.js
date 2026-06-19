import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Use the latest stable version
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Format the items for Stripe Checkout
    const line_items = items.map((item) => ({
      price_data: {
        currency: 'cad', // Standardize to CAD for Canadian store
        product_data: {
          name: item.title,
          images: item.images && item.images.length > 0 ? [
            // Stripe requires absolute URLs for images, so in production we'd need full URLs.
            // For development with local images, we just omit them or use a placeholder if they are relative.
            item.images[0].startsWith('http') ? item.images[0] : undefined
          ].filter(Boolean) : [],
          description: `Size: ${item.size} | Color: ${item.color || 'Default'}`,
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents
      },
      quantity: item.quantity,
    }));

    // Create the Checkout Session
    // We add specific Canadian payment methods to allowed_payment_types if desired,
    // but by default 'card' accepts major credit cards, Apple Pay, and Google Pay automatically.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Add 'acss_debit' for Pre-Authorized Debits if configured in Stripe dashboard
      line_items,
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['CA', 'US', 'GB'], // Limit shipping to specific countries
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500, // $15.00 CAD
              currency: 'cad',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session. Please ensure Stripe keys are configured.' },
      { status: 500 }
    );
  }
}
