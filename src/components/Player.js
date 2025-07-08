// src/components/Player.js (Swipe ve Genişletme sorunu düzeltildi)

import React from 'react';
import { useSwipeable } from 'react-swipeable'; // Kütüphaneden hook'u import et

function Player({
  isPlayerExpanded, setIsPlayerExpanded, currentSong, isPlaying, onPlayPause, onNext, onPrev, progress,
  audioRef, volume, onVolumeChange, onRestart, isShuffleOn, repeatMode,
  onToggleShuffle, onToggleRepeat, onViewQueue
}) {

  // --- Yardımcı Fonksiyonlar ---
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds === 0) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e) => {
    if (!audioRef.current || isNaN(progress.duration)) return;
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const seekTime = (clickPosition / progressBarWidth) * progress.duration;
    audioRef.current.currentTime = seekTime;
  };

  const handleToggleExpand = () => {
    if (currentSong) {
      setIsPlayerExpanded(!isPlayerExpanded);
    }
  };
  
  // --- react-swipeable hook'u (Sadece kaydırma için) ---
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => !isPlayerExpanded && onNext(),
    onSwipedRight: () => !isPlayerExpanded && onPrev(),
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  const progressPercentage = (progress.currentTime / progress.duration) * 100 || 0;

  if (!currentSong) {
    return null; 
  }

  // --- Dinamik CSS Sınıfları ---
  const mobilePlayerClasses = `
    md:hidden fixed left-0 right-0 z-50 transition-all duration-300 ease-in-out
    ${isPlayerExpanded ? 'top-0 bottom-0 bg-gradient-to-b from-spotify-gray to-spotify-dark rounded-none' : 'bottom-16 h-16 bg-spotify-gray rounded-t-lg'}
  `;

  const renderProgressBar = () => (
    <div className="w-full flex items-center gap-2 text-xs text-spotify-lightgray">
        <span>{formatTime(progress.currentTime)}</span>
        <div 
          className="w-full h-3 flex items-center cursor-pointer group"
          onClick={handleSeek}
        >
            <div className="w-full h-1 bg-spotify-gray rounded-full">
                <div className="h-1 bg-white rounded-full group-hover:bg-spotify-green transition-all" style={{ width: `${progressPercentage}%` }}>
                </div>
            </div>
        </div>
        <span>{formatTime(progress.duration)}</span>
    </div>
  );

  return (
    <>
      {/* ==================================================================== */}
      {/* MOBİL PLAYER (Genişletilebilir) */}
      {/* ==================================================================== */}
      <div className={mobilePlayerClasses}>
        {/* --- Mini Player --- */}
        {!isPlayerExpanded && (
          // DÜZELTME: Kapsayıcıya onClick ve kaydırma olaylarını ekliyoruz
           <div {...swipeHandlers} className="h-full flex items-center justify-between px-4 cursor-pointer" onClick={handleToggleExpand}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-spotify-lightdark/50">
              <div className="h-1 bg-white" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <div className="flex items-center gap-3 truncate">
              <img src={currentSong.cover_url} className="w-10 h-10 rounded" alt={currentSong.title} />
              <div className="truncate">
                <p className="font-semibold text-sm text-white truncate">{currentSong.title}</p>
                <p className="text-xs text-spotify-lightgray truncate">{currentSong.artist}</p>
              </div>
            </div>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); // Tıklamanın player'ı genişletmesini engelle
                onPlayPause(); 
              }} 
              className="text-white p-2"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z"></path></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"></path></svg>
              )}
            </button>
          </div>
        )}

        {/* --- Tam Ekran Player --- */}
        {isPlayerExpanded && (
          <div className="h-full flex flex-col p-4">
            <div className="flex-shrink-0 text-center">
              <button onClick={handleToggleExpand} className="absolute top-4 left-2 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                </svg>
              </button>
              <p className="text-sm font-bold text-spotify-lightgray">ÇALMA LİSTESİNDEN</p>
              <h2 className="font-bold text-white">{currentSong.album?.title || 'Bilinmeyen Albüm'}</h2>
            </div>
            <div className="flex-grow flex items-center justify-center my-4">
              <img src={currentSong.cover_url} className="w-full max-w-xs rounded-lg shadow-2xl aspect-square" alt={currentSong.title} />
            </div>
            <div className="flex-shrink-0">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white truncate">{currentSong.title}</h2>
                <p className="text-md text-spotify-lightgray truncate">{currentSong.artist}</p>
              </div>
              {renderProgressBar()}
              <div className="flex items-center justify-between mt-4">
                <button onClick={onToggleShuffle} className={`${isShuffleOn ? 'text-spotify-green' : 'text-spotify-lightgray'}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 20l-3.5-3.5 2.5-2.5-3.5-3.5-2.5 2.5L3.5 10"/><path d="M20 14l-3.5-3.5 2.5-2.5-3.5-3.5-2.5 2.5L9.5 4"/><path d="M4 4l2.5 2.5"/><path d="M17.5 17.5L20 20"/></svg>
                </button>
                <button onClick={onPrev}><svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4L14 12L7 20V4ZM15 4V20H17V4H15Z" transform="scale(-1, 1) translate(-21, 0)"></path></svg></button>
                <button onClick={onPlayPause} className="bg-white text-black rounded-full p-3"><svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">{isPlaying ? <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z"/> : <path d="M8 5.14v14l11-7-11-7z"/>}</svg></button>
                <button onClick={onNext}><svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4L14 12L7 20V4ZM15 4V20H17V4H15Z"></path></svg></button>
                <button onClick={onToggleRepeat} className={`${repeatMode !== 'off' ? 'text-spotify-green' : 'text-spotify-lightgray'} relative`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8h1"/><path d="M7 14l-3-3 3-3"/><path d="M20 10h1"/></svg>
                  {repeatMode === 'one' && <div className="absolute bg-spotify-green h-1 w-1 rounded-full -bottom-1 left-1/2 -translate-x-1/2"></div>}
                </button>
              </div>
              <div className="flex items-center justify-end mt-4">
                 <button 
                    onClick={() => {
                        onViewQueue(); 
                        setIsPlayerExpanded(false);
                    }} 
                    title="Sıra" 
                    className="text-spotify-lightgray hover:text-white"
                 >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" x2="21" y1="6" y2="6"></line><line x1="8" x2="21" y1="12" y2="12"></line><line x1="8" x2="21" y1="18" y2="18"></line><line x1="3" x2="3.01" y1="6" y2="6"></line><line x1="3" x2="3.01" y1="12" y2="12"></line><line x1="3" x2="3.01" y1="18" y2="18"></line></svg>
                 </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* MASAÜSTÜ PLAYER */}
      {/* ==================================================================== */}
      <footer className="hidden md:flex bg-spotify-lightdark p-4 items-center justify-between">
        <div className="w-1/3 flex items-center gap-3 min-w-0">
          <img src={currentSong.cover_url} className="w-14 h-14 rounded" alt={currentSong.title} />
          <div className="truncate">
            <p className="font-semibold text-sm text-white truncate">{currentSong.title}</p>
            <p className="text-xs text-spotify-lightgray truncate">{currentSong.artist}</p>
          </div>
        </div>
        <div className="w-1/3 flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
                <button onClick={onToggleShuffle} className={`${isShuffleOn ? 'text-spotify-green' : 'text-spotify-lightgray'} hover:text-white transition-colors`}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 20l-3.5-3.5 2.5-2.5-3.5-3.5-2.5 2.5L3.5 10"/><path d="M20 14l-3.5-3.5 2.5-2.5-3.5-3.5-2.5 2.5L9.5 4"/><path d="M4 4l2.5 2.5"/><path d="M17.5 17.5L20 20"/></svg></button>
                <button onClick={onPrev} className="text-spotify-lightgray hover:text-white transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4L14 12L7 20V4ZM15 4V20H17V4H15Z" transform="scale(-1, 1) translate(-21, 0)"/></svg></button>
                <button onClick={onPlayPause} className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">{isPlaying ? <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z"/> : <path d="M8 5.14v14l11-7-11-7z"/>}</svg></button>
                <button onClick={onNext} className="text-spotify-lightgray hover:text-white transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4L14 12L7 20V4ZM15 4V20H17V4H15Z"/></svg></button>
                <button onClick={onToggleRepeat} className={`${repeatMode !== 'off' ? 'text-spotify-green' : 'text-spotify-lightgray'} hover:text-white transition-colors relative`}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8h1"/><path d="M7 14l-3-3 3-3"/><path d="M20 10h1"/></svg>{repeatMode === 'one' && <div className="absolute bg-spotify-green h-1 w-1 rounded-full -bottom-1 left-1/2 -translate-x-1/2"></div>}</button>
            </div>
            {renderProgressBar()}
        </div>
        <div className="w-1/3 flex justify-end items-center gap-4">
            <button onClick={onViewQueue} title="Sıra" className="text-spotify-lightgray hover:text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" x2="21" y1="6" y2="6"></line><line x1="8" x2="21" y1="12" y2="12"></line><line x1="8" x2="21" y1="18" y2="18"></line><line x1="3" x2="3.01" y1="6" y2="6"></line><line x1="3" x2="3.01" y1="12" y2="12"></line><line x1="3" x2="3.01" y1="18" y2="18"/></svg></button>
            <button className="text-spotify-lightgray hover:text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></button>
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={onVolumeChange} className="w-24 h-1 accent-spotify-green cursor-pointer"/>
        </div>
      </footer>
    </>
  );
}

export default Player;