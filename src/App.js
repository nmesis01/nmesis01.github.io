// -----------------------------------------------------------------------------
// src/App.js (Ana Düzen Yöneticisi - Rastgele Çalma Düzeltmesi)
// -----------------------------------------------------------------------------
import { useState, useRef, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import HomePage from './components/HomePage';
import AlbumPage from './components/AlbumPage';
import SearchPage from './components/SearchPage';
import QueuePage from './components/QueuePage';
import Notification from './components/Notification';
import BottomNav from './components/BottomNav';

function App() {
  // --- STATE TANIMLAMALARI ---
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('home');
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [currentQueue, setCurrentQueue] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songProgress, setSongProgress] = useState({ currentTime: 0, duration: 0 });
  const [volume, setVolume] = useState(1);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off');
  const [notification, setNotification] = useState('');
  const audioRef = useRef(null);

  // --- VERİ ÇEKME VE DİĞER FONKSİYONLAR ---
  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/albums');
        if (!response.ok) throw new Error('Network response was not ok');
        const albumList = await response.json();
        setAlbums(albumList);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
        setAlbums([]);
      }
      setLoading(false);
    };
    fetchAlbums();
  }, []);

  const allSongs = albums.flatMap(album =>
    album.songs ? album.songs.map(song => ({ ...song, album: album })) : []
  );
  
  const handlePageChange = (page) => { setActivePage(page); };
  
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 2000);
  };

  const handleNextSong = useCallback(() => {
    if (currentQueue.length === 0 || !currentSong) return;
    const currentIndex = currentQueue.findIndex(song => song.id === currentSong.id);
    
    // DÜZELTME: Sıranın sonuna gelindiyse durmak yerine rastgele yeni bir sıra başlat.
    if (repeatMode === 'off' && currentIndex === currentQueue.length - 1 && !isShuffleOn) {
      showNotification("Sıra bitti, rastgele şarkılar çalınıyor...");
      // Tüm şarkılardan 5 tane rastgele seç ve yeni bir sıra oluştur
      const randomSongs = [...allSongs].sort(() => 0.5 - Math.random()).slice(0, 5);
      if (randomSongs.length > 0) {
        setCurrentQueue(randomSongs);
        setCurrentSong(randomSongs[0]);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
      return;
    }

    let nextIndex;
    if (isShuffleOn) {
      let randomIndex = Math.floor(Math.random() * currentQueue.length);
      if (currentQueue.length > 1) {
        while (currentQueue[randomIndex].id === currentSong.id) {
          randomIndex = Math.floor(Math.random() * currentQueue.length);
        }
      }
      nextIndex = randomIndex;
    } else {
      nextIndex = (currentIndex + 1) % currentQueue.length;
    }
    setCurrentSong(currentQueue[nextIndex]);
    setIsPlaying(true);
  }, [currentQueue, currentSong, isShuffleOn, repeatMode, allSongs]);

  const handlePrevSong = () => {
    if (currentQueue.length === 0 || !currentSong) return;
    const currentIndex = currentQueue.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + currentQueue.length) % currentQueue.length;
    setCurrentSong(currentQueue[prevIndex]);
    setIsPlaying(true);
  };

  const handleRestartSong = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const handleSelectAlbum = (id) => { setSelectedAlbumId(id); setActivePage('album'); };

  const handlePlayFromAlbum = (song, album) => {
    if (currentSong?.id === song.id) {
      handleRestartSong();
    } else {
      const newQueue = album.songs.map(s => ({ ...s, album: { id: album.id, title: album.title, artist: album.artist } }));
      setCurrentSong(song);
      setCurrentQueue(newQueue);
      setIsPlaying(true);
    }
  };

   const handlePlayFromRandom = (song) => {
    if (currentSong?.id === song.id) {
      handleRestartSong();
    } else {
      setCurrentSong(song);
      setCurrentQueue([song]);
      setIsPlaying(true);
    }
  };

   const handlePlayFromQueue = (song) => {
     if (currentSong?.id === song.id) {
      handleRestartSong();
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  }

  const handleAddToQueue = (songToAdd) => {
    const songWithAlbumInfo = allSongs.find(s => s.id === songToAdd.id);
    if (!songWithAlbumInfo) return;
    if (currentQueue.find(song => song.id === songWithAlbumInfo.id)) {
      showNotification('Bu şarkı zaten sırada.');
      return;
    }
    if (currentQueue.length === 0 || !currentSong) {
      setCurrentSong(songWithAlbumInfo);
      setCurrentQueue([songWithAlbumInfo]);
      setIsPlaying(true);
      showNotification('Sıraya Eklendi');
      return;
    }
    const newQueue = [...currentQueue, songWithAlbumInfo];
    setCurrentQueue(newQueue);
    showNotification('Sıranın sonuna eklendi');
  };

  const togglePlayPause = () => { if (currentSong) { setIsPlaying(!isPlaying); } };
  const handleVolumeChange = (e) => { setVolume(e.target.value); };
  const handleToggleShuffle = () => { setIsShuffleOn(!isShuffleOn); };
  const handleToggleRepeat = () => {
    setRepeatMode(prevMode => {
      if (prevMode === 'off') return 'all';
      if (prevMode === 'all') return 'one';
      return 'off';
    });
  };
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setSongProgress({ currentTime: audio.currentTime, duration: audio.duration });
    const handleMetadataLoaded = () => setSongProgress({ currentTime: audio.currentTime, duration: audio.duration });
    const handleSongEnd = () => {
      if (repeatMode === 'one') {
        handleRestartSong();
      } else {
        handleNextSong();
      }
    };
    const handleError = (e) => {
        if (currentSong && audio.src === currentSong.audio_url) {
            console.error("Oynatma hatası:", e);
            setIsPlaying(false);
        }
    };
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleMetadataLoaded);
    audio.addEventListener('ended', handleSongEnd);
    audio.addEventListener('error', handleError);
    if (currentSong && audio.src !== currentSong.audio_url) {
      setSongProgress({ currentTime: 0, duration: 0 });
      audio.src = currentSong.audio_url;
    }
    if (isPlaying) {
      audio.play().catch(handleError);
    } else {
      audio.pause();
    }
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleMetadataLoaded);
      audio.removeEventListener('ended', handleSongEnd);
      audio.removeEventListener('error', handleError);
    };
  }, [currentSong, isPlaying, repeatMode, handleNextSong, handleRestartSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const selectedAlbum = albums.find(album => album.id === selectedAlbumId);

  // --- RENDER ---
  if (loading) {
    return <div className="bg-black h-screen flex items-center justify-center text-white text-xl">Veritabanına bağlanılıyor...</div>;
  }

  return (
    <div className="bg-black h-screen w-screen text-white flex flex-col">
      <div className="flex-grow flex overflow-hidden">
        <Sidebar onPageChange={handlePageChange} activePage={activePage} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-spotify-dark p-4 md:rounded-lg md:m-2 md:p-6 mb-0">
            {activePage === 'home' && <HomePage albums={albums} onAlbumSelect={handleSelectAlbum} />}
            {activePage === 'search' && <SearchPage allSongs={allSongs} onPlaySong={handlePlayFromRandom} currentSong={currentSong} onAddToQueue={handleAddToQueue} />}
            {activePage === 'album' && <AlbumPage album={selectedAlbum} onPlaySong={handlePlayFromAlbum} currentSong={currentSong} onAddToQueue={handleAddToQueue} />}
            {activePage === 'queue' && <QueuePage queue={currentQueue} currentSong={currentSong} onPlaySong={handlePlayFromQueue} />}
          </main>
        </div>
      </div>

      <div className="flex-shrink-0">
        <Player
          currentSong={currentSong}
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
          onNext={handleNextSong}
          onPrev={handlePrevSong}
          progress={songProgress}
          audioRef={audioRef}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          onRestart={handleRestartSong}
          isShuffleOn={isShuffleOn}
          repeatMode={repeatMode}
          onToggleShuffle={handleToggleShuffle}
          onToggleRepeat={handleToggleRepeat}
          onViewQueue={() => setActivePage('queue')}
        />
        <BottomNav onPageChange={handlePageChange} activePage={activePage} />
      </div>

      <audio ref={audioRef} />
      <Notification message={notification} />
    </div>
  );
}
export default App;