import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

export const setupTestDB = () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  });
};

export const createTestUser = async (userData = {}) => {
  const defaultUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  };

  const user = await User.create({ ...defaultUser, ...userData });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  return { user, token };
};

export const createTestPost = async (postData = {}) => {
  const { user } = await createTestUser();
  
  const defaultPost = {
    title: 'Test Post',
    content: 'Test Content',
    author: user._id,
    coinSymbol: 'BTC'
  };

  return await Post.create({ ...defaultPost, ...postData });
}; 