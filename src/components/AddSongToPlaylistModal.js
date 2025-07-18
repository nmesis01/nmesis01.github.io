// src/components/AddSongToPlaylistModal.js
import React, { useState, useMemo, useRef, useEffect } from 'react';

function AddSongToPlaylistModal({ isOpen, onClose, allSongs, onSongSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null); // Input elementine referans oluşturmak için

  // Modal her açıldığında input alanına odaklanmak için useEffect kullanıyoruz
  useEffect(() => {
    if (isOpen) {
      // Küçük bir gecikme, elemanın DOM'a tam olarak yerleşmesini ve odaklanmaya hazır olmasını sağlar.
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100); 
    }
  }, [isOpen]); // Bu efekt sadece isOpen durumu değiştiğinde çalışacak

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
    return allSongs.filter(song => {
      const title = song.title || '';
      const artist = song.artist || (song.album && song.album.artist) || '';
      return title.toLowerCase().includes(lowerCaseSearchTerm) ||
             artist.toLowerCase().includes(lowerCaseSearchTerm);
    });
  }, [searchTerm, allSongs]);

  if (!isOpen) return null;

  const handleSongClick = (song) => {
    onSongSelect(song);
    setSearchTerm(''); 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-spotify-gray rounded-lg p-6 w-11/12 max-w-md flex flex-col animate-fade-in" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-4 text-center">Listeye Şarkı Ekle</h2>
        <input
          ref={inputRef} // Oluşturduğumuz ref'i input'a bağlıyoruz
          type="text"
          placeholder="Şarkı veya sanatçı ara..."
          className="w-full bg-spotify-lightdark p-3 rounded-md text-white placeholder-spotify-lightgray focus:outline-none focus:ring-2 focus:ring-spotify-green mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="max-h-60 overflow-y-auto">
          {searchResults.map(song => (
            <div key={song.id} onClick={() => handleSongClick(song)} className="flex items-center gap-4 p-2 rounded-md hover:bg-spotify-lightdark/80 cursor-pointer">
              <img src={song.cover_url} className="w-10 h-10 rounded" alt={song.title} />
              <div>
                <p className="text-white">{song.title}</p>
                <p className="text-sm text-spotify-lightgray">{song.artist || (song.album && song.album.artist)}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full mt-6 bg-spotify-lightdark text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-80 transition-transform">
          Kapat
        </button>
      </div>
    </div>
  );
}

export default AddSongToPlaylistModal;