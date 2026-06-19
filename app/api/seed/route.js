import { NextResponse } from 'next/server';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { products } from '@/lib/data';

export async function GET() {
  try {
    const results = [];
    for (const product of products) {
      // Add a default stock of 1 for testing the lock system
      const productData = {
        ...product,
        stock: 1, 
        reservedUntil: null,
        reservedBy: null
      };
      
      await setDoc(doc(db, 'products', product.id), productData);
      results.push(`Seeded ${product.title}`);
    }
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Error seeding DB:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
