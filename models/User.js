import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Hashed password, optional if using OAuth like Google
  role: { type: String, default: 'customer' }, // 'customer' or 'admin'
  savedAddresses: [{
    street: String,
    city: String,
    province: String,
    postalCode: String,
    country: { type: String, default: 'Canada' }
  }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
