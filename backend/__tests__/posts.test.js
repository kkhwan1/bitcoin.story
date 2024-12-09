import request from 'supertest';
import app from '../server.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

describe('Posts API', () => {
  let token;
  let user;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
    
    // 테스트용 사용자 생성
    user = await User.create({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123'
    });

    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Post.deleteMany({});
  });

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const postData = {
        title: 'Test Post',
        content: 'Test Content',
        coinSymbol: 'BTC'
      };

      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(postData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('title', postData.title);
      expect(res.body).toHaveProperty('author');
      expect(res.body.author).toHaveProperty('username', 'testuser');
    });

    it('should not create post without auth', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ title: 'Test', content: 'Test' });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/posts', () => {
    beforeEach(async () => {
      // 테스트용 게시글 생성
      await Post.create([
        {
          title: 'Post 1',
          content: 'Content 1',
          author: user._id,
          coinSymbol: 'BTC'
        },
        {
          title: 'Post 2',
          content: 'Content 2',
          author: user._id,
          coinSymbol: 'ETH'
        }
      ]);
    });

    it('should fetch all posts', async () => {
      const res = await request(app).get('/api/posts');

      expect(res.statusCode).toBe(200);
      expect(res.body.posts).toHaveLength(2);
      expect(res.body).toHaveProperty('totalPages');
    });

    it('should filter posts by coinSymbol', async () => {
      const res = await request(app)
        .get('/api/posts')
        .query({ coinSymbol: 'BTC' });

      expect(res.statusCode).toBe(200);
      expect(res.body.posts).toHaveLength(1);
      expect(res.body.posts[0]).toHaveProperty('coinSymbol', 'BTC');
    });
  });
}); 