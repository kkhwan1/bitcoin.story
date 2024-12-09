import express from 'express';
import { auth } from '../middleware/auth.js';
import { getMarketData, getCoinPrice, getOrderBook } from '../services/upbitService.js';
import User from '../models/User.js';

const router = express.Router();

// 전체 코인 목록 조회
router.get('/markets', async (req, res) => {
  try {
    const markets = await getMarketData();
    res.json(markets);
  } catch (error) {
    res.status(500).json({ message: '시장 데이터를 가져오는데 실패했습니다.' });
  }
});

// 특정 코인 가격 조회
router.get('/price/:symbol', async (req, res) => {
  try {
    const price = await getCoinPrice(req.params.symbol);
    res.json(price);
  } catch (error) {
    res.status(500).json({ message: '가격 데이터를 가져오는데 실패했습니다.' });
  }
});

// 호가 데이터 조회
router.get('/orderbook/:symbol', async (req, res) => {
  try {
    const orderbook = await getOrderBook(req.params.symbol);
    res.json(orderbook);
  } catch (error) {
    res.status(500).json({ message: '호가 데이터를 가져오는데 실패했습니다.' });
  }
});

// 즐겨찾기 목록 ��회
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: '즐겨찾기 목록을 가져오는데 실패했습니다.' });
  }
});

// 즐겨찾기 추가/제거
router.post('/favorites/:symbol', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const symbol = req.params.symbol;

    const index = user.favorites.indexOf(symbol);
    if (index === -1) {
      user.favorites.push(symbol);
    } else {
      user.favorites.splice(index, 1);
    }

    await user.save();
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: '즐겨찾기 업데이트에 실패했습니다.' });
  }
});

export default router; 