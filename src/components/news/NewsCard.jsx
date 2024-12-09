import React from 'react';
import { Link } from 'react-router-dom';

export const NewsCard = ({ news }) => {
  return (
    <Link 
      to={`/news/${news.id}`}
      className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {news.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {news.summary}
          </p>
          <div className="flex items-center text-xs text-gray-500">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {news.source}
            </span>
            <span className="ml-2">
              {new Date(news.publishedAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}; 