// src/components/Notification.js (Daha kararlı ortalama yöntemiyle güncellendi)

function Notification({ message }) {
  if (!message) return null;

  return (
    // 1. Adım: Tam genişlikte, görünmez bir kapsayıcı oluştur.
    // Bu kapsayıcı, içindeki elemanları ortalamakla görevli.
    // pointer-events-none: Bu kapsayıcının fare tıklamalarını engellemesini önler.
    <div className="fixed bottom-36 left-0 right-0 flex justify-center z-50 pointer-events-none">
      
      {/* 2. Adım: Asıl bildirim kutusu. */}
      {/* Artık pozisyonlama ile uğraşmıyor, sadece kendi görünümüne odaklanıyor. */}
      {/* pointer-events-auto: Sadece bu görünür kutu tıklanabilir olsun. */}
      <div className="bg-spotify-green text-white text-sm font-bold py-2 px-4 rounded-full shadow-lg animate-fade-in-out pointer-events-auto">
        {message}
      </div>

    </div>
  );
}

export default Notification;