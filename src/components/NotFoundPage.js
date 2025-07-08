import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center text-white text-center h-full">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Aradığınız sayfa bulunamadı.</p>
      <Link 
        to="/" 
        className="bg-spotify-green text-black font-bold py-3 px-6 rounded-full hover:scale-105 transition-transform"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}

export default NotFoundPage;