require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const createAdmin = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aarvik';

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('[AARVIK Setup] Connected to MongoDB for Admin creation.');

    // Command line arguments or defaults
    const args = process.argv.slice(2);
    const email = (args[0] || process.env.ADMIN_INITIAL_EMAIL || 'admin@aarvik.org').toLowerCase().trim();
    const password = args[1] || process.env.ADMIN_INITIAL_PASSWORD || 'AarvikAdmin#2026';
    const name = args[2] || 'System Administrator';

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log(`[AARVIK Setup] Admin with email "${email}" already exists. ID: ${existingAdmin._id}`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = await Admin.create({
      name,
      email,
      passwordHash,
      role: 'admin',
    });

    console.log('====================================================');
    console.log('   AARVIK ADMINISTRATOR ACCOUNT CREATED SUCCESSFULLY');
    console.log('====================================================');
    console.log(`Name     : ${newAdmin.name}`);
    console.log(`Email    : ${newAdmin.email}`);
    console.log(`Password : ${password}`);
    console.log(`Role     : ${newAdmin.role}`);
    console.log('====================================================');
    console.log('Keep these credentials secure and change the password');
    console.log('in production environments.');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('[AARVIK Setup] Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
