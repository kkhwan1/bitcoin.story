import streamlit as st
import feedparser
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import sqlite3
import schedule
import time

# SQLite 데이터베이스 연결
def get_db():
    conn = sqlite3.connect('news.db')
    conn.row_factory = sqlite3.Row
    return conn

# 데이터베이스 초기화
def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            link TEXT NOT NULL,
            pubDate TIMESTAMP NOT NULL,
            image TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def fetch_news():
    try:
        # 블루밍비트 RSS 피드 파싱
        feed = feedparser.parse('https://bloomingbit.io/feed')
        
        conn = get_db()
        # 기존 뉴스 삭제
        conn.execute('DELETE FROM news')
        
        news_items = []
        for entry in feed.entries:
            # 각 기사의 내용 가져오기
            response = requests.get(entry.link)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 대표 이미지 찾기
            og_image = soup.find('meta', property='og:image')
            image_url = og_image['content'] if og_image else None
            
            # 뉴스 저장
            conn.execute('''
                INSERT INTO news (title, description, link, pubDate, image)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                entry.title,
                entry.description,
                entry.link,
                datetime.strptime(entry.published, '%a, %d %b %Y %H:%M:%S %z'),
                image_url
            ))
        
        conn.commit()
        conn.close()
        
        print("Successfully updated news items")
        return True
    except Exception as e:
        print(f"Error fetching news: {str(e)}")
        return False

def run_scheduler():
    schedule.every(30).minutes.do(fetch_news)
    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == "__main__":
    st.title('Crypto News Crawler')
    
    # 데이터베이스 초기화
    init_db()
    
    if st.button('Fetch News Now'):
        with st.spinner('Fetching news...'):
            success = fetch_news()
            if success:
                st.success('News successfully updated!')
            else:
                st.error('Failed to fetch news')
    
    # 스케줄러 상태 표시
    st.write('Scheduler Status: Running (Updates every 30 minutes)')
    
    # 현재 저장된 뉴스 표시
    conn = get_db()
    news = conn.execute('SELECT * FROM news ORDER BY pubDate DESC').fetchall()
    st.write(f'Total news items: {len(news)}')
    
    for item in news:
        st.write('---')
        st.write(f"**{item['title']}**")
        st.write(f"Published: {item['pubDate']}")
        if item['image']:
            st.image(item['image'])
    
    conn.close() 