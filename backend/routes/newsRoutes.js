import express from 'express';

const router = express.Router();

// 샘플 뉴스 데이터
const sampleNews = [
  {
    id: '1',
    title: '비트코인 ETF 승인 이후 시장 동향 분석',
    summary: '미국 SEC의 비트코인 현물 ETF 승인 이후, 기관 투자자들의 참여가 크게 증가하고 있습니다. BlackRock과 Fidelity의 ETF 순자산이 10억 달러를 돌파했으며, 이는 암호화폐 시장의 제도화가 가속화되고 있음을 보여줍니다.',
    publishedAt: new Date().toISOString(),
    url: 'https://example.com/news/1',
    source: 'Crypto Market News'
  },
  {
    id: '2',
    title: '이더리움 덴크버 업그레이드 예정',
    summary: '이더리움 재단이 다음 주요 업그레이드인 덴크버(Dencun)의 일정을 발표했습니다. 이번 업그레이드는 레이어2 솔루션의 비용을 크게 낮출 것으로 기대됩니다.',
    publishedAt: new Date().toISOString(),
    url: 'https://example.com/news/2',
    source: 'ETH Daily'
  }
];

// 뉴스 데이터를 즉시 생성
const getNewsData = () => {
  return sampleNews.map(news => ({
    ...news,
    publishedAt: new Date().toISOString()
  })).sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
};

router.get('/', (req, res) => {
  try {
    // CORS 헤더 추가
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    // 데이터 즉시 반환
    const newsData = getNewsData();
    res.json(newsData);
  } catch (error) {
    console.error('News API error:', error);
    // 에러 발생 시에도 빈 배열 반환
    res.json([]);
  }
});

export default router; 