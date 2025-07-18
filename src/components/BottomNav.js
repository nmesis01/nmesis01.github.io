// src/components/BottomNav.js
function BottomNav({ onPageChange, activePage }) {
    const navItems = [
        { 
            id: 'home', 
            label: 'Ana Sayfa', 
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.09954L3 9.7947V21H9V14H15V21H21V9.7947L12 2.09954ZM12 4.22554L19 10.1557V19H17V12H7V19H5V10.1557L12 4.22554Z"></path></svg> 
        },
        { 
            id: 'search', 
            label: 'Ara', 
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> 
        },
        {
            // YENİ EKLENEN BUTON
            id: 'library',
            label: 'Kitaplığım',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3H21V5H3V3ZM3 6H21V8H3V6ZM3 9H12V11H3V9ZM3 12H21V14H3V12ZM3 15H21V17H3V15ZM3 18H12V20H3V18Z"></path></svg>
        },
        { 
            id: 'queue', 
            label: 'Sıra', 
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"></line><line x1="8" x2="21" y1="12" y2="12"></line><line x1="8" x2="21" y1="18" y2="18"></line><line x1="3" x2="3.01" y1="6" y2="6"></line><line x1="3" x2="3.01" y1="12" y2="12"></line><line x1="3" x2="3.01" y1="18" y2="18"></line></svg> 
        }
    ];

    return (
        <nav className="md:hidden fixed bottom-0 w-full bg-spotify-lightdark p-2 pb-1 border-t border-black/50">
            <div className="flex justify-around items-center">
                {navItems.map(item => (
                    <button 
                        key={item.id}
                        onClick={() => onPageChange(item.id)}
                        className={`flex flex-col items-center justify-center gap-1 w-20 h-14 transition-colors duration-200 ${activePage === item.id ? 'text-white' : 'text-spotify-lightgray hover:text-white'}`}
                    >
                        <div className="w-6 h-6">{item.icon}</div>
                        <span className="text-xs">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
export default BottomNav;