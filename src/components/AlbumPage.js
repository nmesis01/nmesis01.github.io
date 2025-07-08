// src/components/AlbumPage.js (Masaüstü sütun hizalaması düzeltildi)

import { useState } from 'react';
import { useParams } from 'react-router-dom';

function AlbumPage({ albums, onPlaySong, currentSong, onAddToQueue }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const { albumId } = useParams();
  const album = albums.find(a => a.id.toString() === albumId);

  if (!album) {
    return <div className="p-6 text-white">Yükleniyor...</div>;
  }

  return (
    <div onClick={() => setOpenMenuId(null)}>
      {/* Albüm Bilgileri Başlığı */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
        <img src={album.cover_url} className="w-36 h-36 md:w-48 md:h-48 rounded-lg shadow-2xl flex-shrink-0" alt={album.title} />
        <div className="text-center md:text-left">
          <span className="text-sm font-bold hidden md:block">ÇALMA LİSTESİ</span>
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tighter">{album.title}</h1>
          <p className="text-spotify-lightgray mt-2">{album.description}</p>
        </div>
      </div>
      
      {/* Oynatma Butonu */}
      <div className="flex items-center gap-6 mb-8 px-4 md:px-0">
        <button onClick={() => onPlaySong(album.songs[0], album)} className="bg-spotify-green text-black rounded-full p-4 hover:scale-105 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"></path></svg>
        </button>
      </div>

      {/* Şarkı Listesi */}
      <div className="text-spotify-lightgray px-4 md:px-0">
        {/* MASAÜSTÜ BAŞLIKLARI */}
        <div className="hidden md:grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-2 border-b border-spotify-gray text-sm">
            <div className="text-center w-8">#</div>
            <div>BAŞLIK</div>
            <div>ALBÜM</div>
            <div className="w-8"></div>
        </div>
        
        {album.songs && album.songs.map((song, index) => (
          <div key={song.id} className="group hover:bg-spotify-gray/50 rounded-md">
            
            {/* MOBİL GÖRÜNÜM (Değişiklik yok) */}
            <div className="md:hidden flex items-center p-2">
                <div className="flex-1 flex items-center gap-4 cursor-pointer" onClick={() => onPlaySong(song, album)}>
                    <span className="text-center w-5 text-spotify-lightgray">{index + 1}</span>
                    <img src={song.cover_url} className="w-10 h-10 rounded flex-shrink-0" alt={song.title} />
                    <div className="flex-1 truncate">
                        <p className={`truncate ${currentSong?.id === song.id ? 'text-spotify-green' : 'text-white'}`}>{song.title}</p>
                        <p className="text-sm text-spotify-lightgray">{album.artist}</p>
                    </div>
                </div>
                <div className="relative flex-shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === song.id ? null : song.id); }} className="text-spotify-lightgray p-2 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                    </button>
                    {openMenuId === song.id && (
                        <div className="absolute bottom-8 right-0 bg-spotify-gray rounded-md shadow-lg z-10 w-40">
                            <ul>
                                <li>
                                    <button onClick={() => { onAddToQueue(song); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-spotify-lightgray hover:bg-spotify-lightdark/50">
                                        Sıraya Ekle
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* MASAÜSTÜ GÖRÜNÜM (DÜZELTİLDİ) */}
            <div className="hidden md:grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-2 items-center">
                
                {/* 1. Sütun: # */}
                <span 
                    className="text-center w-8 text-spotify-lightgray group-hover:text-white cursor-pointer"
                    onClick={() => onPlaySong(song, album)}
                >
                    {index + 1}
                </span>

                {/* 2. Sütun: Başlık */}
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => onPlaySong(song, album)}>
                    <img src={song.cover_url} className="w-10 h-10 rounded flex-shrink-0" alt={song.title} />
                    <div className="flex-1 truncate">
                        <p className={`truncate ${currentSong?.id === song.id ? 'text-spotify-green' : 'text-white'}`}>{song.title}</p>
                        <p className="text-sm text-spotify-lightgray">{album.artist}</p>
                    </div>
                </div>
                
                {/* 3. Sütun: Albüm Adı */}
                <div className="text-sm text-spotify-lightgray truncate">
                    {album.title}
                </div>

                {/* 4. Sütun: Menü butonu */}
                <div className="relative flex-shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === song.id ? null : song.id); }} className="text-spotify-lightgray p-2 hover:text-white opacity-0 group-hover:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                    </button>
                    {openMenuId === song.id && (
                        <div className="absolute bottom-8 right-0 bg-spotify-gray rounded-md shadow-lg z-10 w-40">
                             <ul>
                                <li>
                                    <button onClick={() => { onAddToQueue(song); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-spotify-lightgray hover:bg-spotify-lightdark/50">
                                        Sıraya Ekle
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default AlbumPage;