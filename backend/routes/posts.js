import express from 'express';
import { auth } from '../middleware/auth.js';
import Post from '../models/Post.js';

const router = express.Router();

// 게시글 목록 조회
router.get('/', async (req, res) => {
  try {
    const { coinSymbol, page = 1, limit = 10 } = req.query;
    const query = coinSymbol ? { coinSymbol } : {};

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'username');

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 게시글 작성
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, coinSymbol, images } = req.body;

    const post = new Post({
      title,
      content,
      coinSymbol,
      images,
      author: req.user._id
    });

    await post.save();
    await post.populate('author', 'username');

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 게시글 수정
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }

    const { title, content, images } = req.body;
    post.title = title;
    post.content = content;
    post.images = images;
    post.updatedAt = Date.now();

    await post.save();
    await post.populate('author', 'username');

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

export default router; 