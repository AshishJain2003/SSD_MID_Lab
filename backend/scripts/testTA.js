import TeachingAssistant from '../models/TeachingAssistant.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testTA = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ssd_mid_lab');
    console.log('Connected to MongoDB');

    // Find the demo TA
    const ta = await TeachingAssistant.findOne({ username: 'ta_demo' });
    if (!ta) {
      console.log('Demo TA not found');
      process.exit(0);
    }

    console.log('Found TA:', {
      username: ta.username,
      email: ta.email,
      fullName: ta.fullName,
      isActive: ta.isActive,
      passwordHash: ta.password.substring(0, 20) + '...'
    });

    // Test password comparison
    const testPassword = 'ta123456';
    const isValid = await bcrypt.compare(testPassword, ta.password);
    console.log('Password test result:', isValid);

    // Test with a simple password
    const simplePassword = '123456';
    const simpleHash = await bcrypt.hash(simplePassword, 10);
    console.log('Simple password hash:', simpleHash);
    
    const simpleTest = await bcrypt.compare(simplePassword, simpleHash);
    console.log('Simple password test:', simpleTest);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

testTA();
