// src/components/HomePage.js
function HomePage({ albums, onAlbumSelect }) {
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour < 12 && currentHour > 5) {
      return "Günaydın";
    } else if (currentHour < 18 && currentHour >= 12) {
      return "İyi Günler";
    } else if (currentHour > 22 || currentHour < 5){
      return "İyi Geceler";
    } else{
      return "İyi akşamlar";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{getGreeting()}</h1>
            <h2 className="text-spotify-lightgray text-sm font-semibold mt-1 mb-6">Faşizme Ölüm Halklara Hürriyet</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {albums.map(album => (
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
  );
}
export default HomePage;