import { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import HomePage from './components/HomePage';
import AlbumPage from './components/AlbumPage';
import SearchPage from './components/SearchPage';
import QueuePage from './components/QueuePage';
import Notification from './components/Notification';
import BottomNav from './components/BottomNav';
import NotFoundPage from './components/NotFoundPage';
import LibraryPage from './components/LibraryPage';
import PlaylistPage from './components/PlaylistPage';
import PlaylistModal from './components/PlaylistModal'; 
import AddSongToPlaylistModal from './components/AddSongToPlaylistModal';

function App() {
  const [playlistModalInfo, setPlaylistModalInfo] = useState({ isOpen: false, songToAdd: null }); // BU SATIRI EKLEYİN
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
  const [hasAudioFocus, setHasAudioFocus] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);
  const [playlists, setPlaylists] = useState(() => JSON.parse(localStorage.getItem('userPlaylists')) || []);
  const [isAddSongModalOpen, setAddSongModalOpen] = useState(false);
  const [playlistIdToAddSong, setPlaylistIdToAddSong] = useState(null);
  
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const activePage = useMemo(() => location.pathname.split('/')[1] || 'home', [location.pathname]);
  const mainContentRef = useRef(null);
  const scrollPositions = useRef({});
  const scrollTimeout = useRef(null);
  const isIntentionalPause = useRef(false);
  const isTransitioning = useRef(false);

  useEffect(() => {
    localStorage.setItem('userPlaylists', JSON.stringify(playlists));
  }, [playlists]);

   const openAddSongModal = (playlistId) => {
    setPlaylistIdToAddSong(playlistId);
    setAddSongModalOpen(true);
  };

  const closeAddSongModal = () => {
    setAddSongModalOpen(false);
    setPlaylistIdToAddSong(null);
  };

  const handleSelectSongToAdd = (song) => {
    if (playlistIdToAddSong) {
      addSongToPlaylist(playlistIdToAddSong, song);
    }
    // Şarkı eklendikten sonra modal'ı hemen kapatmıyoruz,
    // kullanıcı isterse birden fazla şarkı ekleyebilsin.
  };
  const createPlaylist = (name) => {
      if (!name || name.trim() === '') {
          showNotification('Lütfen geçerli bir isim girin.');
          return;
      }
      const newPlaylist = {
          id: `playlist_${Date.now()}`,
          name: name.trim(),
          songs: []
      };
      setPlaylists(prev => [...prev, newPlaylist]);
      showNotification(`'${name.trim()}' oluşturuldu`);
  };
  const openPlaylistModal = (song) => {
    setPlaylistModalInfo({ isOpen: true, songToAdd: song });
  };

  const closePlaylistModal = () => {
    setPlaylistModalInfo({ isOpen: false, songToAdd: null });
  };
  const addSongToPlaylist = (playlistId, songToAdd) => {
      setPlaylists(prev => prev.map(p => {
          if (p.id === playlistId) {
              if (p.songs.some(s => s.id === songToAdd.id)) {
                  showNotification('Şarkı zaten listede.');
                  return p;
              }
              showNotification(`'${p.name}' listesine eklendi.`);
              return { ...p, songs: [...p.songs, songToAdd] };
          }
          return p;
      }));
  };
  useEffect(() => {
    let cancelled = false;
    const fetchAlbums = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://spotiyorum-bth5dva3cbd3dga2.polandcentral-01.azurewebsites.net/api/albums');
        if (!response.ok) throw new Error('Network response was not ok');
        const albumList = await response.json();
        if (!cancelled) setAlbums(albumList);
      } catch (error) { if (!cancelled) console.error("Veri çekme hatası:", error); }
      if (!cancelled) setLoading(false);
    };
    fetchAlbums();
    return () => { cancelled = true; };
  }, []);

  const allSongs = useMemo(
    () => albums.flatMap(album => album.songs ? album.songs.map(song => ({ ...song, album })) : []),
    [albums]
  );

  useEffect(() => { localStorage.setItem('currentSong', JSON.stringify(currentSong)); }, [currentSong]);
  useEffect(() => { localStorage.setItem('musicQueue', JSON.stringify(currentQueue)); }, [currentQueue]);
  useEffect(() => { localStorage.setItem('volume', volume); }, [volume]);

  useEffect(() => {
    if (!notification) return;
    const timeout = setTimeout(() => setNotification(''), 2000);
    return () => clearTimeout(timeout);
  }, [notification]);

  const deletePlaylist = (playlistIdToDelete, playlistName) => {
  // Kullanıcıya silme işlemi için bir onay sorusu soruyoruz.
  if (window.confirm(`'${playlistName}' listesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
    setPlaylists(prevPlaylists =>
      prevPlaylists.filter(playlist => playlist.id !== playlistIdToDelete)
    );
    showNotification(`'${playlistName}' silindi.`);
  }
};
  const removeSongFromPlaylist = (playlistId, songIdToRemove) => {
    setPlaylists(prevPlaylists =>
        prevPlaylists.map(playlist => {
            if (playlist.id === playlistId) {
                const updatedSongs = playlist.songs.filter(song => song.id !== songIdToRemove);
                showNotification(`'${playlist.name}' listesinden kaldırıldı.`);
                return { ...playlist, songs: updatedSongs };
            }
            return playlist;
        })
    );
};
  const showNotification = useCallback((message) => {
    setNotification(message);
  }, []);
  const handlePageChange = useCallback((page) => navigate(page === 'home' ? '/' : `/${page}`), [navigate]);

  const handleRestartSong = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setHasAudioFocus(true);
      setUserInteracted(true);
      if(!isPlaying) setIsPlaying(true);
    }
  }, [isPlaying]);

  const playNewSong = useCallback((song, queue = []) => {
    setPlayHistory(prev => (currentSong && currentSong.id !== song.id ? [currentSong, ...prev] : prev));
    isTransitioning.current = true;
    setTimeout(() => { isTransitioning.current = false; }, 500);
    setCurrentSong(song);
    setCurrentQueue(queue);
    setHasAudioFocus(true);
    setUserInteracted(true);
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
      playNewSong(prevSong, [currentSong, ...currentQueue]);
    }
    setPlayHistory(newHistory);
  }, [playHistory, currentSong, handleRestartSong, playNewSong, currentQueue]);

  const handlePlayFromAlbum = useCallback((song, album) => {
    const songIndex = album.songs.findIndex(s => s.id === song.id);
    const albumQueue = album.songs.slice(songIndex + 1).map(s => ({ ...s, source: 'system', album }));
    setPlayHistory([]);
    playNewSong({ ...song, source: 'system', album }, albumQueue);
  }, [playNewSong]);

  const handlePlayFromPlaylist = useCallback((song, queue) => {
    const fullSongData = allSongs.find(s => s.id === song.id) || song;
    setPlayHistory([]);
    playNewSong(fullSongData, queue.map(q => allSongs.find(s => s.id === q.id) || q));
}, [playNewSong, allSongs]);

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
      showNotification('Sıraya Eklendi');
      return [...prevQueue, newUserSong];
    });
  }, [currentSong, showNotification]);

  const togglePlayPause = useCallback(() => {
    if (currentSong) {
      setHasAudioFocus(true);
      setUserInteracted(true);
      isIntentionalPause.current = isPlaying;
      if (!isPlaying) {
        isTransitioning.current = true;
        setTimeout(() => { isTransitioning.current = false; }, 500);
      }
      setIsPlaying(prev => !prev);
    }
  }, [currentSong, isPlaying]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target.tagName.toLowerCase() === 'input') {
        return;
      }
      if (event.code === 'Space') {
        event.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlayPause]);

    useLayoutEffect(() => {
      const mainEl = mainContentRef.current;
      // Belirtilen sayfalardan biriyse kaydedilen pozisyonu yükle, değilse en başa git.
      if (['/', '/search', '/queue'].includes(location.pathname)) {
        if (mainEl) {
          mainEl.scrollTop = scrollPositions.current[location.pathname] || 0;
        }
      } else {
        // Diğer sayfalarda (örneğin Albüm sayfası) en başa git
        if (mainEl) {
          mainEl.scrollTop = 0;
        }
      }
    }, [location.pathname]);
// YENİ EKLENDİ: Kaydırma olayını dinleyip pozisyonu kaydet
const handleScroll = useCallback(() => {
  if (scrollTimeout.current) {
    clearTimeout(scrollTimeout.current);
  }

  scrollTimeout.current = setTimeout(() => {
    if (mainContentRef.current) {
      const mainEl = mainContentRef.current;
      const currentPath = location.pathname;

      // Sadece belirtilen sayfalarda pozisyonu kaydet
      if (['/', '/search', '/queue'].includes(currentPath)) {
        scrollPositions.current[currentPath] = mainEl.scrollTop;
      }
    }
  }, 150); // 150 milisaniyelik bir gecikmeyle kaydet
}, [location.pathname]);
  const handleVolumeChange = useCallback((e) => setVolume(e.target.value), []);
  const handleToggleShuffle = useCallback(() => setIsShuffleOn(prev => !prev), []);
  const handleToggleRepeat = useCallback(() => {
    setRepeatMode(prev => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'));
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if ('mediaSession' in navigator && currentSong) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: currentSong.album?.title || "",
        artwork: currentSong.cover_url
          ? [{ src: currentSong.cover_url, sizes: '512x512', type: 'image/jpeg' }]
          : [],
      });

      navigator.mediaSession.setActionHandler("play", () => {
        setIsPlaying(true);
        setUserInteracted(true);
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        setIsPlaying(false);
      });
      navigator.mediaSession.setActionHandler("previoustrack", handlePrevSong);
      navigator.mediaSession.setActionHandler("nexttrack", handleNextSong);
    }

    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
      }
    };
  }, [currentSong, handlePrevSong, handleNextSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setSongProgress({ currentTime: audio.currentTime, duration: audio.duration });
    const onDurationChange = () => setSongProgress(prev => ({ ...prev, duration: audio.duration }));
    const onEnded = () => {
      setIsPlaying(false);
      setUserInteracted(false);
      handleNextSong();
    };
    const onPause = () => {
      setIsPlaying(false);
      setHasAudioFocus(false);
      setUserInteracted(false);
      isIntentionalPause.current = false;
    };
    const onPlay = () => {
      setIsPlaying(true);
      setHasAudioFocus(true);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('loadedmetadata', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('play', onPlay);

    if (currentSong) {
      let audioUrl = currentSong.audio_url;
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (isSafari && audioUrl && audioUrl.endsWith('.opus')) {
        audioUrl = audioUrl.replace(/\.opus$/, '.mp3');
      }
      if (audio.src !== audioUrl) {
        audio.src = audioUrl;
        audio.load();
        setSongProgress({ currentTime: 0, duration: 0 });
      }
    }

    if (isPlaying && userInteracted && audio.paused) {
      audio.play().catch(() => {
        setIsPlaying(false);
        setUserInteracted(false);
      });
    } else if (!isPlaying && !audio.paused) {
      audio.pause();
    }

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('loadedmetadata', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('play', onPlay);
    };
  }, [currentSong, isPlaying, handleNextSong, userInteracted]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

  const displayQueue = useMemo(() => (currentSong ? [currentSong, ...currentQueue] : currentQueue), [currentSong, currentQueue]);

  if (loading) {
    return <div className="bg-black h-screen flex items-center justify-center text-white text-xl">Grup Yorum Halktır Susturulamaz</div>;
  }

  return (
    <div className="bg-black h-screen w-screen text-white flex flex-col">
      <div className="flex-grow flex overflow-hidden">
        <Sidebar onPageChange={handlePageChange} activePage={activePage} playlists={playlists} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main ref={mainContentRef} onScroll={handleScroll} className="flex-1 overflow-y-auto bg-spotify-dark p-4 md:rounded-lg md:m-2 md:p-6 pb-40 md:pb-6">
          <Routes>
            <Route path="/" element={<HomePage albums={albums} onAlbumSelect={(id) => navigate(`/album/${id}`)} />} />
            
            {/* AlbumPage'e proplar eklendi */}
            <Route 
              path="/album/:albumId" 
              element={<AlbumPage 
                          albums={albums} 
                          onPlaySong={handlePlayFromAlbum} 
                          currentSong={currentSong} 
                          onAddToQueue={handleAddToQueue}
                          playlists={playlists} 
                          onAddSongToPlaylist={addSongToPlaylist} 
                          openPlaylistModal={openPlaylistModal}
                        />} 
            />
              <Route 
  path="/playlist/:playlistId" 
  element={<PlaylistPage 
              playlists={playlists} 
              onPlaySong={handlePlayFromPlaylist} 
              currentSong={currentSong} 
              onAddToQueue={handleAddToQueue}
              onRemoveSongFromPlaylist={removeSongFromPlaylist} // Bu satırı ekleyin
              openPlaylistModal={openPlaylistModal}
              onOpenAddSongModal={openAddSongModal} // Bu satırı ekleyin
            />} 
/>

            {/* SearchPage'e proplar eklendi */}
            <Route 
  path="/search" 
  element={<SearchPage 
              allSongs={allSongs} 
              albums={albums} // Albümleri prop olarak ekleyin
              onPlaySong={handlePlayFromRandom} 
              currentSong={currentSong} 
              onAddToQueue={handleAddToQueue}
              openPlaylistModal={openPlaylistModal}
              onAlbumSelect={(id) => navigate(`/album/${id}`)} // Albüme tıklama fonksiyonunu ekleyin
            />} 
/>

            <Route path="/queue" element={<QueuePage queue={displayQueue} currentSong={currentSong} onPlaySong={handlePlayFromQueue} />} />
<Route 
  path="/library" 
  element={<LibraryPage 
              playlists={playlists} 
              onCreatePlaylist={createPlaylist} 
              onDeletePlaylist={deletePlaylist} // Bu satırı ekleyin
            />} 
/>            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </main>
        </div>
      </div>
      <div className="flex-shrink-0">
        <Player
          isPlayerExpanded={isPlayerExpanded}
          setIsPlayerExpanded={setIsPlayerExpanded}
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
          onViewQueue={() => navigate('/queue')}
        />
        <BottomNav onPageChange={handlePageChange} activePage={activePage} />
      </div>
      <audio ref={audioRef} preload="auto" />
      <Notification message={notification} />
      <PlaylistModal
      isOpen={playlistModalInfo.isOpen}
      onClose={closePlaylistModal}
      songToAdd={playlistModalInfo.songToAdd}
      playlists={playlists}
      onAddSongToPlaylist={addSongToPlaylist}
    />
    <AddSongToPlaylistModal
      isOpen={isAddSongModalOpen}
      onClose={closeAddSongModal}
      allSongs={allSongs}
      onSongSelect={handleSelectSongToAdd}
    />
    </div>
  );
}

export default App;