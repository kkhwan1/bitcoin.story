import axios from 'axios';
import cheerio from 'cheerio';

export const getNews = async () => {
  try {
    // 블루밍비트 뉴스 페이지에서 데이터 가져오기
    const response = await axios.get('https://bloomingbit.io/news', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      }
    });

    const $ = cheerio.load(response.data);
    const news = [];

    // 실시간 뉴스 섹션에서 뉴스 추출
    $('.news-item').each((i, element) => {
      const $item = $(element);
      const title = $item.find('.news-title').text().trim();
      const summary = $item.find('.news-summary').text().trim();
      const date = $item.find('.news-date').text().trim();
      const link = $item.find('a').attr('href');
      const imageUrl = $item.find('img').attr('src');

      if (title) {
        news.push({
          id: i,
          title,
          summary: summary || title,
          date: date || new Date().toISOString(),
          source: 'BloomingBit',
          link: link?.startsWith('http') ? link : `https://bloomingbit.io${link}`,
          imageUrl: imageUrl?.startsWith('http') ? imageUrl : `https://bloomingbit.io${imageUrl}`
        });
      }
    });

    console.log(`Successfully fetched ${news.length} news items from BloomingBit`);
    return news;
  } catch (error) {
    console.error('News fetch failed:', error);
    return [
      {
        id: 0,
        title: '뉴스를 불러오는 중입니다',
        summary: '잠시 후 다시 시도해주세요.',
        date: new Date().toISOString(),
        source: 'BloomingBit',
        link: 'https://bloomingbit.io/news',
        imageUrl: null
      }
    ];
  }
};

// 5분마다 뉴스 업데이트
setInterval(async () => {
  try {
    await getNews();
  } catch (error) {
    console.error('Scheduled news update failed:', error);
  }
}, 300000);