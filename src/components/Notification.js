// src/components/Notification.js

function Notification({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-36 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <div className="bg-spotify-green text-white text-sm font-bold py-2 px-4 rounded-full shadow-lg animate-fade-in-out pointer-events-auto">
        {message}
      </div>
    </div>
  );
}
export default Notification;