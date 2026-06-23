import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  color: { type: String },
  images: [{ type: String }],
  story: { type: String },
  fabric: { type: String },
  care: { type: String },
  discountPercentage: { type: Number, default: 0 },
  purchasePrice: { type: Number, default: 0 }, // Cost of Goods Sold, hidden from customers
  // Inventory tracked strictly by size SKU
  inventory: {
    S: { type: Number, default: 0 },
    M: { type: Number, default: 0 },
    L: { type: Number, default: 0 },
    XL: { type: Number, default: 0 }
  }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
