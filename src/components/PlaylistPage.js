// src/components/PlaylistPage.js DOSYASININ YENİ VE TAM İÇERİĞİ

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function PlaylistPage({ playlists, onPlaySong, currentSong, onAddToQueue, onRemoveSongFromPlaylist, onOpenAddSongModal }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const { playlistId } = useParams();
  const playlist = playlists.find(p => p.id.toString() === playlistId);

  if (!playlist) {
    return (
        <div className="p-6 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Çalma Listesi Bulunamadı</h2>
            <p className="text-spotify-lightgray mb-6">Bu çalma listesi silinmiş veya hiç var olmamış olabilir.</p>
            <Link to="/library" className="bg-spotify-green text-black font-bold py-3 px-6 rounded-full hover:scale-105 transition-transform">
                Kitaplığına Dön
            </Link>
        </div>
    );
  }

  const handlePlayFromPlaylist = (songToPlay) => {
    const songIndex = playlist.songs.findIndex(s => s.id === songToPlay.id);
    const playlistQueue = playlist.songs.slice(songIndex + 1);
    onPlaySong(songToPlay, playlistQueue);
  };

  const handleMenuToggle = (e, songId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === songId ? null : songId);
  };

  return (
    <div onClick={() => setOpenMenuId(null)} className='animate-fade-in'>
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
        <div className="w-36 h-36 md:w-48 md:h-48 rounded-lg shadow-2xl flex-shrink-0 bg-spotify-gray flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="currentColor" className="text-spotify-lightgray"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        </div>
        <div className="text-center md:text-left">
          <span className="text-sm font-bold hidden md:block">ÇALMA LİSTESİ</span>
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tighter break-all">{playlist.name}</h1>
          <p className="text-spotify-lightgray mt-2">{playlist.songs.length} şarkı</p>
        </div>
      </div>
      <div className="flex items-center gap-6 mb-8 px-4 md:px-0">
        {playlist.songs.length > 0 && (
            <button onClick={() => handlePlayFromPlaylist(playlist.songs[0])} className="bg-spotify-green text-black rounded-full p-4 hover:scale-105 transition-transform">
            
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"></path></svg>
          </button>
        )}
        <button
      onClick={() => onOpenAddSongModal(playlist.id)}
      title="Bu listeye şarkı ekle"
      className="text-spotify-lightgray hover:text-white transition-colors"
  >
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
  </button>
      </div>
      <div className="text-spotify-lightgray px-4 md:px-0">
        <div className="hidden md:grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-2 border-b border-spotify-gray text-sm">
            <div className="text-center w-8">#</div>
            <div>BAŞLIK</div>
            <div>ALBÜM</div>
            <div className="w-8"></div>
        </div>
        
        {playlist.songs && playlist.songs.length > 0 ? playlist.songs.map((song, index) => (
          <div key={`${song.id}-${index}`} className="group hover:bg-spotify-gray/50 rounded-md">
            
            {/* --- Mobil ve Masaüstü için ortak yapı --- */}
            <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-2 items-center">
                <span className="text-center w-8 text-spotify-lightgray">{index + 1}</span>
                <div className="flex items-center gap-4 cursor-pointer min-w-0" onClick={() => handlePlayFromPlaylist(song)}>
                    <img src={song.cover_url} className="w-10 h-10 rounded flex-shrink-0" alt={song.title} />
                    <div className="flex-1 min-w-0">
                        <p className={`break-all ${currentSong?.id === song.id ? 'text-spotify-green' : 'text-white'}`}>{song.title}</p>
                        <p className="text-sm text-spotify-lightgray">{song.artist}</p>
                    </div>
                </div>
                <div className="hidden md:block text-sm text-spotify-lightgray truncate">
                    {song.album?.title || 'Bilinmiyor'}
                </div>
                 <div className="relative flex-shrink-0">
                    <button onClick={(e) => handleMenuToggle(e, song.id)} className="text-spotify-lightgray p-2 hover:text-white opacity-0 group-hover:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                    </button>
                    {openMenuId === song.id && (
                        <div className="absolute bottom-8 right-0 bg-spotify-gray rounded-md shadow-lg z-10 w-48">
                            <ul>
                                <li>
                                    <button onClick={() => { onAddToQueue(song); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-spotify-lightgray hover:bg-spotify-lightdark/50">
                                        Sıraya Ekle
                                    </button>
                                </li>
                                {/* YENİ EKLENEN BUTON */}
                                <li>
                                    <button onClick={() => { onRemoveSongFromPlaylist(playlist.id, song.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-spotify-lightgray hover:bg-spotify-lightdark/50">
                                      Kaldır
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                 </div>
            </div>
          </div>
        )) : <p className="text-center mt-8">Bu çalma listesinde henüz şarkı yok.</p>}
      </div>
    </div>
  );
}

export default PlaylistPage;