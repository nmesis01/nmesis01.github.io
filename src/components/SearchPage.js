// -----------------------------------------------------------------------------
// src/components/SearchPage.js (Mobil Uyumlu Liste)
// -----------------------------------------------------------------------------
import { useState, useEffect, useMemo } from 'react';

function SearchPage({ allSongs = [], onPlaySong, currentSong, onAddToQueue }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);

    const defaultSongTitles = [ 'Sevda Turkusu', 'Siyrilip Gelen', 'Hakliyiz Kazanacagiz', 'Cemo', 'Guleycan', 'Gel ki Safaklar Tutussun', 'Avusturya Isci Marsi', 'Haziranda Olmek Zor', 'Devrim Yuruyusumuz Suruyor' ];
    const defaultSongs = useMemo(() => {
        return defaultSongTitles.map(title => allSongs.find(song => song.title === title)).filter(Boolean);
    }, [allSongs]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setResults([]);
            return;
        }
        const debounceTimer = setTimeout(() => {
            setIsLoading(true);
            fetch(`http://localhost:5001/api/search?q=${searchTerm}`)
                .then(res => res.json())
                .then(data => { setResults(data); setIsLoading(false); })
                .catch(err => { console.error("Arama hatası:", err); setIsLoading(false); });
        }, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const songsToDisplay = searchTerm ? results : defaultSongs;

    return (
        <div onClick={() => setOpenMenuId(null)}>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Ara</h1>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Ne dinlemek istersin?"
                        className="w-full bg-spotify-gray p-3 pl-10 rounded-md text-white placeholder-spotify-lightgray focus:outline-none focus:ring-2 focus:ring-spotify-green"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-spotify-lightgray">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                </div>
            </div>
            
            <div className="text-spotify-lightgray">
                {isLoading ? ( <p className="text-center mt-8">Aranıyor...</p> ) : (
                    songsToDisplay.length > 0 ? (
                        songsToDisplay.map((song) => (
                            <div key={song.id} className="hover:bg-spotify-gray/50 rounded-md flex items-center p-2 group">
                                <div className="flex-1 flex items-center gap-4 cursor-pointer" onClick={() => onPlaySong(song)}>
                                    <img src={song.cover_url} className="w-10 h-10 rounded flex-shrink-0" alt={song.title} />
                                    <div className="flex-1 truncate">
                                        <p className={`truncate ${currentSong?.id === song.id ? 'text-spotify-green' : 'text-white'}`}>{song.title}</p>
                                        <p className="text-sm text-spotify-lightgray">{song.artist}</p>
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
                        ))
                    ) : ( searchTerm && <p className="text-center mt-8">"{searchTerm}" için sonuç bulunamadı.</p> )
                )}
            </div>
        </div>
    );
}
export default SearchPage;