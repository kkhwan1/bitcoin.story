import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500';
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-8">
            <Link to="/" className={`${isActive('/')} font-medium`}>
              Home
            </Link>
            <Link to="/news" className={`${isActive('/news')} font-medium`}>
              News
            </Link>
            {/* 기존 네비게이션 링크들... */}
          </div>
        </div>
      </div>
    </nav>
  );
}; 