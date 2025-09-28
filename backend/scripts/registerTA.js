import TeachingAssistant from '../models/TeachingAssistant.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const registerDemoTA = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ssd_mid_lab');
    console.log('Connected to MongoDB');

    // Check if demo TA already exists
    const existingTA = await TeachingAssistant.findOne({ username: 'ta_demo' });
    if (existingTA) {
      console.log('Demo TA already exists:', existingTA.username);
      process.exit(0);
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('ta123456', saltRounds);

    // Create demo TA
    const demoTA = new TeachingAssistant({
      username: 'ta_demo',
      password: hashedPassword,
      email: 'ta@demo.com',
      fullName: 'Demo Teaching Assistant'
    });

    await demoTA.save();
    console.log('Demo TA created successfully:', {
      username: demoTA.username,
      email: demoTA.email,
      fullName: demoTA.fullName
    });

  } catch (error) {
    console.error('Error creating demo TA:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

registerDemoTA();
