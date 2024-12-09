import express from 'express';
import cors from 'cors';
import newsRoutes from './routes/newsRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// 뉴스 라우트 연결
app.use('/api/news', newsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});