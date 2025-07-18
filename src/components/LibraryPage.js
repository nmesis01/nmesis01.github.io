// src/components/LibraryPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function LibraryPage({ playlists, onCreatePlaylist, onDeletePlaylist }) {
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreatePlaylist(newPlaylistName);
    setNewPlaylistName('');
  };

  const handleDelete = (e, playlist) => {
    e.preventDefault();  // Link'e tıklanmasını engelle
    e.stopPropagation(); // Olayın daha fazla yayılmasını durdur
    onDeletePlaylist(playlist.id, playlist.name);
  };

  return (
    <div className='animate-fade-in'>
      <h1 className="text-3xl font-bold mb-6">Kitaplığın</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
        <input 
          type="text"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="Yeni Çalma Listesi Adı"
          className="w-full bg-spotify-gray p-3 rounded-md text-white placeholder-spotify-lightgray focus:outline-none focus:ring-2 focus:ring-spotify-green"
        />
        <button type="submit" className="bg-spotify-green text-black font-bold py-3 px-6 rounded-full hover:scale-105 transition-transform">Oluştur</button>
      </form>

      {playlists.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {playlists.map(playlist => (
            <Link key={playlist.id} to={`/playlist/${playlist.id}`} className="relative bg-spotify-gray p-4 rounded-lg hover:bg-spotify-lightgray/30 transition-colors duration-300 cursor-pointer group">
              
              {/* YENİ EKLENEN SİLME BUTONU */}
              <button 
                onClick={(e) => handleDelete(e, playlist)}
                className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-2 text-white opacity-0 group-hover:opacity-100 hover:bg-opacity-90 transition-opacity z-10"
                title="Çalma listesini sil"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
              </button>

              <div className="w-full h-auto rounded-md mb-4 shadow-lg aspect-square bg-spotify-lightdark flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="text-spotify-lightgray"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
              </div>
              <h3 className="font-bold text-white truncate">{playlist.name}</h3>
              <p className="text-sm text-spotify-lightgray">{playlist.songs.length} şarkı</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-spotify-lightgray">Henüz bir çalma listen yok.</p>
      )}
    </div>
  );
}

export default LibraryPage;