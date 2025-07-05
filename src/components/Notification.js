// -----------------------------------------------------------------------------
// src/components/Notification.js (YENİ DOSYA)
// -----------------------------------------------------------------------------
function Notification({ message }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-spotify-green text-white text-sm font-bold py-2 px-4 rounded-full shadow-lg animate-fade-in-out">
      {message}
    </div>
  );
}
export default Notification;