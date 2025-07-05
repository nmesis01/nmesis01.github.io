// -----------------------------------------------------------------------------
// src/components/QueuePage.js (Sadece Gelecek Şarkıları Gösterir)
// -----------------------------------------------------------------------------
function QueuePage({ queue, currentSong, onPlaySong }) {
  const currentIndex = currentSong ? queue.findIndex(song => song.id === currentSong.id) : -1;
  const upcomingQueue = currentIndex !== -1 ? queue.slice(currentIndex) : queue;

  return (
    <main className="flex-grow bg-spotify-lightdark rounded-lg overflow-y-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sıradakiler</h1>
      <div className="text-spotify-lightgray">
        {upcomingQueue.length > 0 ? (
          upcomingQueue.map((song, index) => (
            <div key={`${song.id}-${index}`} className="hover:bg-spotify-gray/50 rounded-md grid grid-cols-[auto_1fr_1fr_auto] gap-4 p-4 items-center group cursor-pointer" onClick={() => onPlaySong(song, song.album)}>
              <div className="text-center">{index + 1}</div>
              <div className="flex items-center gap-3">
                <img src={song.cover_url} className="w-10 h-10 rounded" alt="Albüm Kapağı"/>
                <div>
                  <p className={currentSong?.id === song.id ? 'text-spotify-green' : 'text-white'}>{song.title}</p>
                  <p className="text-sm">{song.artist}</p>
                </div>
              </div>
              <div><p className="truncate">{song.album?.title}</p></div>
              <div>{song.duration}</div>
            </div>
          ))
        ) : (
          <p className="text-center mt-8">Sırada şarkı yok.</p>
        )}
      </div>
    </main>
  );
}
export default QueuePage;