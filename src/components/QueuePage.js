// src/components/QueuePage.js

function QueuePage({ queue, currentSong, onPlaySong }) {
  const currentIndex = currentSong ? queue.findIndex(song => song.id === currentSong.id) : -1;
  const displayQueue = currentIndex !== -1 ? queue.slice(currentIndex) : queue;

  return (
    <div className="flex-grow bg-spotify-lightdark rounded-lg overflow-y-auto p-4 md:p-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Sıradakiler</h1>
      
      <div className="text-spotify-lightgray">
        {displayQueue.length > 0 ? (
          <div>
            <div className="hidden md:grid grid-cols-[auto_1fr_1fr] gap-4 px-4 py-2 border-b border-spotify-gray/50 text-sm font-semibold">
              <div className="text-center">#</div>
              <div>BAŞLIK</div>
              <div>ALBÜM</div>
            </div>

            {displayQueue.map((song, index) => (
              <div 
                key={`${song.id}-${index}`} 
                className="group cursor-pointer hover:bg-spotify-gray/50 rounded-md"
                onClick={() => onPlaySong(song)}
              >
                <div className="md:hidden flex items-center gap-4 p-2">
                  <img src={song.cover_url} className="w-12 h-12 rounded flex-shrink-0" alt={song.title}/>
                  <div className="flex-1 min-w-0">
                    <p className={`break-all ${currentSong?.id === song.id ? 'text-spotify-green' : 'text-white'}`}>{song.title}</p>
                    <p className="text-sm truncate">{song.artist}</p>
                  </div>
                </div>

                <div className="hidden md:grid grid-cols-[auto_1fr_1fr] gap-4 p-4 items-center">
                  <div className="text-center w-8">{index + 1}</div>
                  <div className="flex items-center gap-3">
                    <img src={song.cover_url} className="w-10 h-10 rounded" alt="Albüm Kapağı"/>
                    <div>
                      <p className={currentSong?.id === song.id ? 'text-spotify-green' : 'text-white'}>{song.title}</p>
                      <p className="text-sm">{song.artist}</p>
                    </div>
                  </div>
                  <div><p className="truncate">{song.album?.title}</p></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-8">Sırada şarkı yok.</p>
        )}
      </div>
    </div>
  );
}

export default QueuePage;