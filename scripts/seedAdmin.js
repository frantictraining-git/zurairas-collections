import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, default: 'customer' }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const email = 'admin@zurayras.com';
    const plainPassword = 'ZurairaAdmin2026';

    let admin = await User.findOne({ email });
    if (admin) {
      console.log('Admin user already exists. Updating password to default just in case.');
      admin.password = await bcrypt.hash(plainPassword, 10);
      admin.role = 'admin';
      await admin.save();
    } else {
      console.log('Creating new Admin user.');
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      admin = new User({
        name: 'Main Admin',
        email: email,
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
    }

    console.log('Admin user seeded successfully!');
    console.log(`Email: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
