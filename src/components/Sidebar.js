// -----------------------------------------------------------------------------
// src/components/Sidebar.js (Sadece büyük ekranlar için)
// -----------------------------------------------------------------------------
function Sidebar({ onPageChange, activePage }) {
    return (
        <aside className="hidden md:flex w-72 flex-shrink-0 flex-col gap-2 p-2">
            <div className="bg-spotify-lightdark p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-spotify-green"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                    <h1 className="text-xl font-bold text-spotify-lightgray">Spotiyorum</h1>
                </div>
                <nav>
                    <ul>
                        <li>
                            <a href="#" 
                               onClick={() => onPageChange('home')}
                               className={`flex items-center gap-4 py-2 px-2 rounded font-bold transition-colors duration-200 ${activePage === 'home' ? 'text-white' : 'text-spotify-lightgray hover:text-white'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M12 2.09954L3 9.7947V21H9V14H15V21H21V9.7947L12 2.09954ZM12 4.22554L19 10.1557V19H17V12H7V19H5V10.1557L12 4.22554Z"></path></svg>
                                <span>Ana Sayfa</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" 
                               onClick={() => onPageChange('search')}
                               className={`flex items-center gap-4 py-2 px-2 rounded font-bold transition-colors duration-200 ${activePage === 'search' ? 'text-white' : 'text-spotify-lightgray hover:text-white'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <span>Gözat</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="bg-spotify-lightdark p-4 rounded-lg flex-grow overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <a href="#" className="flex items-center gap-4 font-bold text-spotify-lightgray hover:text-white transition-colors duration-200">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3H21V5H3V3ZM3 6H21V8H3V6ZM3 9H12V11H3V9ZM3 12H21V14H3V12ZM3 15H21V17H3V15ZM3 18H12V20H3V18Z"></path></svg>
                        <span>Kitaplığın</span>
                    </a>
                    <button className="text-spotify-lightgray hover:text-white transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                </div>
                <div className="flex flex-col gap-2">
                     <p className="text-sm text-spotify-lightgray p-2">Soon ...</p>
                </div>
            </div>
        </aside>
    );
}
export default Sidebar;