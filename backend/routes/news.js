import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const staticArticles = [
      {
        title: "비트코인 시장 동향",
        description: "최근 비트코인 가격이 상승세를 보이고 있습니다.",
        link: "https://example.com/news/1",
        pubDate: new Date().toISOString(),
        image: "https://via.placeholder.com/300x200"
      },
      {
        title: "이더리움 업데이트 소식",
        description: "이더리움 네트워크의 주요 업데이트 소식입니다.",
        link: "https://example.com/news/2",
        pubDate: new Date().toISOString(),
        image: "https://via.placeholder.com/300x200"
      }
    ];

    res.json({ articles: staticArticles });
  } catch (error) {
    console.error('뉴스 데이터 가져오기 실패:', error);
    res.status(500).json({ error: '뉴스를 가져오는데 실패했습니다.' });
  }
});

export default router; 