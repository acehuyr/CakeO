/**
 * Seed script — creates the admin@gmail.com user (or updates their role to admin)
 * Run once: node seed/adminSeed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const email = 'admin@gmail.com';
    const password = 'admin123';
    const name = 'Admin';

    let user = await User.findOne({ email });

    if (user) {
      // Update role and reset password
      user.role = 'admin';
      user.name = name;
      user.password = password; // will be hashed by pre-save hook
      await user.save();
      console.log(`🔄  Updated existing user → admin@gmail.com role set to admin`);
    } else {
      await User.create({ name, email, password, role: 'admin' });
      console.log(`🎉  Created admin user: admin@gmail.com / admin123`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
