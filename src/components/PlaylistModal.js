// src/components/PlaylistModal.js
import React from 'react';

function PlaylistModal({ isOpen, onClose, playlists, songToAdd, onAddSongToPlaylist }) {
  if (!isOpen || !songToAdd) {
    return null;
  }

  const handleAdd = (playlistId) => {
    onAddSongToPlaylist(playlistId, songToAdd);
    onClose(); // Şarkı eklendikten sonra modal'ı kapat
  };

  // Modal dışına tıklandığında kapat
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-spotify-gray rounded-lg p-6 w-11/12 max-w-sm animate-fade-in">
        <h2 className="text-xl font-bold text-white mb-4 text-center">Çalma Listesine Ekle</h2>
        <p className="text-center text-spotify-lightgray mb-6 truncate">
          Şarkı: <span className="text-white">{songToAdd.title}</span>
        </p>
        
        <div className="max-h-60 overflow-y-auto">
          {playlists && playlists.length > 0 ? (
            <ul>
              {playlists.map(playlist => (
                <li key={playlist.id}>
                  <button 
                    onClick={() => handleAdd(playlist.id)}
                    className="w-full text-left p-3 my-1 text-white rounded-md hover:bg-spotify-lightdark/80 transition-colors"
                  >
                    {playlist.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-spotify-lightgray">Henüz çalma listeniz yok.</p>
          )}
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-6 bg-spotify-lightdark text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-80 transition-transform"
        >
          Kapat
        </button>
      </div>
    </div>
  );
}

export default PlaylistModal;