// src/components/SearchPage.js
import { useState, useMemo } from 'react';

function SearchPage({ allSongs = [], albums = [], onPlaySong, onAlbumSelect, currentSong, onAddToQueue, openPlaylistModal }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [openMenuId, setOpenMenuId] = useState(null);

    // Varsayılan şarkıları geri ekliyoruz
    const defaultSongTitles = [ 'Sevda Türküsü', 'Sıyrılıp Gelen', 'Haklıyız Kazanacağız', 'Cemo', 'Güleycan', 'Gel ki Şafaklar Tutuşsun', 'Avusturya İşçi Marşı', 'Haziranda Ölmek Zor', 'Devrim Yürüyüşümüz Sürüyor', 'Partizan', 'Dağlara Gel'];
    const defaultSongs = useMemo(() => {
        return defaultSongTitles.map(title => allSongs.find(song => song.title === title)).filter(Boolean);
    }, [allSongs]);


    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) {
            return { songs: [], albums: [] };
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        const filteredSongs = allSongs.filter(song =>
            song.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            (song.artist || (song.album && song.album.artist) || '').toLowerCase().includes(lowerCaseSearchTerm)
        );

        const filteredAlbums = albums.filter(album =>
            album.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            album.artist.toLowerCase().includes(lowerCaseSearchTerm)
        );

        return { songs: filteredSongs, albums: filteredAlbums };
    }, [searchTerm, allSongs, albums]);
    
    const handleMenuToggle = (e, songId) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === songId ? null : songId);
    };

    // Şarkı listesini render eden yardımcı fonksiyon (kodu tekrarlamamak için)
    const renderSongList = (songs) => {
        return songs.map((song) => (
            <div key={song.id} className="hover:bg-spotify-gray/50 rounded-md flex items-center p-2 group">
                <div className="flex-1 flex items-center gap-4 cursor-pointer min-w-0" onClick={() => onPlaySong(song)}>
                    <img src={song.cover_url} className="w-10 h-10 rounded flex-shrink-0" alt={song.title} />
                    <div className="flex-1 min-w-0">
                        <p className={`break-all ${currentSong?.id === song.id ? 'text-spotify-green' : 'text-white'}`}>{song.title}</p>
                        <p className="text-sm text-spotify-lightgray truncate">{song.artist || (song.album && song.album.artist)}</p>
                    </div>
                </div>
                <div className="relative flex-shrink-0">
                    <button onClick={(e) => handleMenuToggle(e, song.id)} className="text-spotify-lightgray p-2 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                    </button>
                    {openMenuId === song.id && (
                        <div className="absolute bottom-8 right-0 bg-spotify-gray rounded-md shadow-lg z-10 w-48 text-left">
                            <ul>
                                <li>
                                    <button onClick={() => { onAddToQueue(song); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-spotify-lightgray hover:bg-spotify-lightdark/50">
                                        Sıraya Ekle
                                    </button>
                                </li>
                                <li>
                                    <button onClick={(e) => { e.stopPropagation(); openPlaylistModal(song); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-spotify-lightgray hover:bg-spotify-lightdark/50">
                                        Çalma Listesine Ekle
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        ));
    };

    return (
        <div onClick={() => setOpenMenuId(null)} className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Ara</h1>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Ne Dinlemek İstersin?"
                        className="w-full bg-spotify-gray p-3 pl-10 rounded-md text-white placeholder-spotify-lightgray focus:outline-none focus:ring-2 focus:ring-spotify-green"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-spotify-lightgray">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                </div>
            </div>
            
            {/* ARAMA SONUÇLARI VEYA VARSAYILAN ŞARKILAR */}
            {searchTerm.trim() === '' ? (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Gözat</h2>
                    {renderSongList(defaultSongs)}
                </div>
            ) : (searchResults.songs.length === 0 && searchResults.albums.length === 0) ? (
                <p className="text-center mt-8">"{searchTerm}" için sonuç bulunamadı.</p>
            ) : (
                <div className="flex flex-col gap-8">
                    {searchResults.albums.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Albümler</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                                {searchResults.albums.map(album => (
                                    <div 
                                        key={album.id}
                                        className="bg-spotify-gray p-4 rounded-lg hover:bg-spotify-lightgray/30 transition-colors duration-300 cursor-pointer group"
                                        onClick={() => onAlbumSelect(album.id)}
                                    >
                                        <img src={album.cover_url} alt={album.title} className="w-full h-auto rounded-md mb-4 shadow-lg aspect-square object-cover"/>
                                        <h3 className="font-bold text-white truncate">{album.title}</h3>
                                        <p className="text-sm text-spotify-lightgray truncate">{album.artist}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {searchResults.songs.length > 0 && (
                         <div>
                            <h2 className="text-2xl font-bold mb-4">Şarkılar</h2>
                            {renderSongList(searchResults.songs)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
export default SearchPage;