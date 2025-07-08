// src/App.js (Media Session API hataları giderilmiş nihai sürüm)

import { useState, useRef, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import HomePage from './components/HomePage';
import AlbumPage from './components/AlbumPage';
import SearchPage from './components/SearchPage';
import QueuePage from './components/QueuePage';
import Notification from './components/Notification';
import BottomNav from './components/BottomNav';
import NotFoundPage from './components/NotFoundPage'; // YENİ IMPORT
function App() {
  // --- STATE HOOKS ---
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQueue, setCurrentQueue] = useState(() => JSON.parse(localStorage.getItem('musicQueue')) || []);
  const [currentSong, setCurrentSong] = useState(() => JSON.parse(localStorage.getItem('currentSong')) || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songProgress, setSongProgress] = useState({ currentTime: 0, duration: 0 });
  const [volume, setVolume] = useState(() => parseFloat(localStorage.getItem('volume')) || 1);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off');
  const [notification, setNotification] = useState('');
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [playHistory, setPlayHistory] = useState([]);

  const audioRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const activePage = location.pathname.split('/')[1] || 'home';
  // YENİ: Ana içerik alanının referansını tutmak için ref
  const mainContentRef = useRef(null);
  // --- DATA & STATE PERSISTENCE ---
  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://nodebackend-production-f8c4.up.railway.app/api/albums');
        if (!response.ok) throw new Error('Network response was not ok');
        const albumList = await response.json();
        setAlbums(albumList);
      } catch (error) { console.error("Veri çekme hatası:", error); }
      setLoading(false);
    };
    fetchAlbums();
  }, []);

    // YENİ: Sayfa (route) değiştiğinde scroll'u başa al
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [location.pathname]);
  const allSongs = albums.flatMap(album => album.songs ? album.songs.map(song => ({ ...song, album })) : []);

  useEffect(() => { localStorage.setItem('currentSong', JSON.stringify(currentSong)); }, [currentSong]);
  useEffect(() => { localStorage.setItem('musicQueue', JSON.stringify(currentQueue)); }, [currentQueue]);
  useEffect(() => { localStorage.setItem('volume', volume); }, [volume]);

  // --- HELPER FUNCTIONS ---
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 2000);
  };
  const handlePageChange = (page) => navigate(page === 'home' ? '/' : `/${page}`);

  // --- SONG CONTROL LOGIC (MEMOIZED) ---
  const handleRestartSong = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if(!isPlaying) setIsPlaying(true);
    }
  }, [isPlaying]);

  const playNewSong = useCallback((song, queue = []) => {
    if (currentSong && currentSong.id !== song.id) {
      setPlayHistory(prev => [currentSong, ...prev]);
    }
    setCurrentSong(song);
    setCurrentQueue(queue);
    setIsPlaying(true);
  }, [currentSong]);

  const handleNextSong = useCallback(() => {
    if (repeatMode === 'one' && currentSong) {
      handleRestartSong();
      return;
    }
    const nextSong = currentQueue[0];
    if (nextSong) {
      playNewSong(nextSong, currentQueue.slice(1));
    } else {
      const randomSongs = [...allSongs].sort(() => 0.5 - Math.random()).slice(0, 5).map(s => ({ ...s, source: 'system' }));
      if (randomSongs.length > 0) {
        playNewSong(randomSongs[0], randomSongs.slice(1));
      } else {
        setCurrentSong(null);
        setIsPlaying(false);
      }
    }
  }, [currentQueue, repeatMode, currentSong, allSongs, playNewSong, handleRestartSong]);
  
  const handlePrevSong = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      handleRestartSong();
      return;
    }
    if (playHistory.length === 0) return;
    const newHistory = [...playHistory];
    const prevSong = newHistory.shift();
    if (currentSong) {
      setCurrentQueue(prev => [currentSong, ...prev]);
    }
    setPlayHistory(newHistory);
    setCurrentSong(prevSong);
    setIsPlaying(true);
  }, [playHistory, currentSong, handleRestartSong]);

  const handlePlayFromAlbum = useCallback((song, album) => {
    const songIndex = album.songs.findIndex(s => s.id === song.id);
    const albumQueue = album.songs.slice(songIndex + 1).map(s => ({ ...s, source: 'system', album }));
    setPlayHistory([]);
    playNewSong({ ...song, source: 'system', album }, albumQueue);
  }, [playNewSong]);
  
  const handlePlayFromRandom = useCallback((song) => {
    const randomQueue = allSongs.filter(s => s.id !== song.id).sort(() => 0.5 - Math.random()).slice(0, 5).map(s => ({ ...s, source: 'system' }));
    setPlayHistory([]);
    playNewSong({ ...song, source: 'system' }, randomQueue);
  }, [playNewSong, allSongs]);

  const handlePlayFromQueue = useCallback((songToPlay) => {
    if (currentSong?.id === songToPlay.id) {
      handleRestartSong();
      return;
    }
    const songIndex = currentQueue.findIndex(s => s.id === songToPlay.id);
    if (songIndex > -1) {
      playNewSong(songToPlay, currentQueue.slice(songIndex + 1));
    }
  }, [currentSong, currentQueue, playNewSong, handleRestartSong]);
  
  const handleAddToQueue = useCallback((songToAdd) => {
    setCurrentQueue(prevQueue => {
      if (prevQueue.some(song => song.id === songToAdd.id) || currentSong?.id === songToAdd.id) {
        showNotification('Bu şarkı zaten sırada.');
        return prevQueue;
      }
      const newUserSong = { ...songToAdd, source: 'user' };
      const firstSystemSongIndex = prevQueue.findIndex(song => song.source === 'system');
      if (firstSystemSongIndex !== -1) {
        const newQueue = [...prevQueue];
        newQueue.splice(firstSystemSongIndex, 0, newUserSong);
        showNotification('Sıraya Eklendi');
        return newQueue;
      }
      showNotification('Sıranın sonuna eklendi');
      return [...prevQueue, newUserSong];
    });
  }, [currentSong]);
  
  const togglePlayPause = useCallback(() => {
    if (currentSong) setIsPlaying(prev => !prev);
  }, [currentSong]);
  
  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };
  
  const handleToggleShuffle = useCallback(() => setIsShuffleOn(prev => !prev), []);
  const handleToggleRepeat = useCallback(() => {
    setRepeatMode(prev => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'));
  }, []);

  // --- AUDIO ELEMENT & MEDIA SESSION EFFECTS ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const onTimeUpdate = () => {
      setSongProgress({ currentTime: audio.currentTime, duration: audio.duration });
      
      // Media Session pozisyonunu doğrudan burada güncelle
      if ('mediaSession' in navigator && navigator.mediaSession.metadata) {
        navigator.mediaSession.setPositionState({
          duration: audio.duration || 0,
          position: audio.currentTime || 0,
        });
      }
    };
    
    const onEnded = () => handleNextSong();

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    if (currentSong && audio.src !== currentSong.audio_url) {
        audio.src = currentSong.audio_url;
        setSongProgress({ currentTime: 0, duration: 0 }); 
    }
    
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
    
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentSong, isPlaying, handleNextSong]);

  useEffect(() => { 
    if (audioRef.current) audioRef.current.volume = volume; 
  }, [volume]);
  
  // Media Session - Sadece metadata ve eylemleri ayarlar
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    if (currentSong) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: currentSong.album.title,
        artwork: [{ src: currentSong.cover_url, sizes: '512x512', type: 'image/jpeg' }]
      });

      navigator.mediaSession.setActionHandler('play', togglePlayPause);
      navigator.mediaSession.setActionHandler('pause', togglePlayPause);
      navigator.mediaSession.setActionHandler('previoustrack', handlePrevSong);
      navigator.mediaSession.setActionHandler('nexttrack', handleNextSong);
    } else {
      navigator.mediaSession.metadata = null;
    }
  }, [currentSong, togglePlayPause, handlePrevSong, handleNextSong]);
  
  // Media Session - Sadece oynatma durumunu ayarlar
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [isPlaying]);

  const displayQueue = currentSong ? [currentSong, ...currentQueue] : currentQueue;

  // --- RENDER ---
  if (loading) {
    return <div className="bg-black h-screen flex items-center justify-center text-white text-xl">Grup Yorum Halktır Susturulamaz</div>;
  }

  return (
    <div className="bg-black h-screen w-screen text-white flex flex-col">
      <div className="flex-grow flex overflow-hidden">
        <Sidebar onPageChange={handlePageChange} activePage={activePage} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main ref={mainContentRef} className="flex-1 overflow-y-auto bg-spotify-dark p-4 md:rounded-lg md:m-2 md:p-6 pb-40 md:pb-6">
            <Routes>
              <Route path="/" element={<HomePage albums={albums} onAlbumSelect={(id) => navigate(`/album/${id}`)} />} />
              <Route path="/album/:albumId" element={<AlbumPage albums={albums} onPlaySong={handlePlayFromAlbum} currentSong={currentSong} onAddToQueue={handleAddToQueue} />} />
              <Route path="/search" element={<SearchPage allSongs={allSongs} onPlaySong={handlePlayFromRandom} currentSong={currentSong} onAddToQueue={handleAddToQueue} />} />
              <Route path="/queue" element={<QueuePage queue={displayQueue} currentSong={currentSong} onPlaySong={handlePlayFromQueue} />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </div>
      <div className="flex-shrink-0">
        <Player
          isPlayerExpanded={isPlayerExpanded} setIsPlayerExpanded={setIsPlayerExpanded}
          currentSong={currentSong} isPlaying={isPlaying} onPlayPause={togglePlayPause}
          onNext={handleNextSong} onPrev={handlePrevSong} progress={songProgress}
          audioRef={audioRef} volume={volume} onVolumeChange={handleVolumeChange}
          onRestart={handleRestartSong} isShuffleOn={isShuffleOn} repeatMode={repeatMode}
          onToggleShuffle={handleToggleShuffle} onToggleRepeat={handleToggleRepeat}
          onViewQueue={() => navigate('/queue')}
        />
        <BottomNav onPageChange={handlePageChange} activePage={activePage} />
      </div>
      <audio ref={audioRef} />
      <Notification message={notification} />
    </div>
  );
}

export default App;