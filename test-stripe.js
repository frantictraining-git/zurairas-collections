require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function testStripe() {
  console.log("Testing Stripe Session Creation...");
  
  // Test 1: Relative URL (What we had before)
  console.log("\n--- TEST 1: Relative Image URL ---");
  try {
    await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cart',
      line_items: [{
        price_data: {
          currency: 'cad',
          unit_amount: 14500,
          product_data: {
            name: 'Crimson Embroidered Kameez',
            images: ['/images/test.jpg'] // The bug!
          }
        },
        quantity: 1
      }]
    });
    console.log("Test 1 Succeeded (Unexpected)");
  } catch (error) {
    console.error("Test 1 Failed! Exact Stripe Error:");
    console.error(`  [${error.type}] ${error.message}`);
  }

  // Test 2: Absolute URL (The Fix)
  console.log("\n--- TEST 2: Absolute Image URL ---");
  try {
    await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cart',
      line_items: [{
        price_data: {
          currency: 'cad',
          unit_amount: 14500,
          product_data: {
            name: 'Crimson Embroidered Kameez',
            images: ['https://zurairas-collections.vercel.app/images/test.jpg'] // The Fix!
          }
        },
        quantity: 1
      }]
    });
    console.log("Test 2 Succeeded! Session successfully created.");
  } catch (error) {
    console.error("Test 2 Failed!");
    console.error(`  [${error.type}] ${error.message}`);
  }
}

testStripe();
