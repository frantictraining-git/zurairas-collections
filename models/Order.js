import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  cartItems: { type: Array, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true, enum: ['etransfer', 'stripe'] },
  status: { type: String, required: true, enum: ['awaiting_payment', 'paid', 'cancelled', 'expired'] },
  stripeSessionId: { type: String }, // For future/stripe tracking if needed
  expiresAt: { type: Date } // Used for E-Transfer 24h soft-lock
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
