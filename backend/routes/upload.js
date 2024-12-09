import express from 'express';
import { auth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '파일이 없습니다.' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: '파일 업로드 중 오류가 발생했습니다.' });
  }
});

router.post('/images', auth, upload.array('images', 4), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: '파일이 없습니다.' });
    }

    const imageUrls = req.files.map(file => 
      `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    );
    
    res.json({ imageUrls });
  } catch (error) {
    res.status(500).json({ message: '파일 업로드 중 오류가 발생했습니다.' });
  }
});

export default router; 