import React from 'react';

const Header = () => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 text-slate-900">
          <div className="size-8 bg-[#f97415] rounded-full flex-shrink-0 flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-xl">dns</span>
          </div>
          <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-tight">
            MADARA <span className="text-slate-400 font-medium text-base ml-1">Tech</span>
          </h2>
        </div>
        
        <div className="hidden md:flex flex-col min-w-40 h-10 w-64">
          <div className="flex w-full flex-1 items-center rounded-full bg-slate-100 px-4 transition-colors focus-within:bg-slate-50 focus-within:ring-2 focus-within:ring-[#f97415]/20">
            <span className="material-symbols-outlined text-slate-400">search</span>
            <input 
              className="w-full bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 text-sm ml-2" 
              placeholder="Rechercher un log, une IP..."
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <nav className="hidden lg:flex items-center gap-8">
          <a className="text-slate-500 hover:text-[#f97415] text-sm font-medium transition-colors" href="#">Dashboard</a>
          <a className="text-slate-500 hover:text-[#f97415] text-sm font-medium transition-colors" href="#">Réseau</a>
          <a className="text-[#f97415] text-sm font-bold" href="#">Maintenance</a>
          <a className="text-slate-500 hover:text-[#f97415] text-sm font-medium transition-colors" href="#">Sécurité</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-500 hover:text-[#f97415] transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <div 
            className="h-10 w-10 bg-slate-200 rounded-full bg-cover bg-center border-2 border-white shadow-sm" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDUrBCjKSwuL37JCOqNgVkIylcNg096MPzAIISguPKxau__-2_zBJCAfAoYHu_hnL4a0Blc36x_8lwf9yVcaEQiMHbBNY252i4KqiVcxywjJZRx1obFec6gRM8VO7qeB7ysfb-A8IkgFPe3ty2PCsGA63L-Rfdt_TdulQKk7C3uDXkcPoexWvxPKz9cFPx1JJdP_-tPlI3jDN6DjI8DdVY2Fb3RerpsuUPFAg__hPg3JXTurVJcf3szTD6QjpcTYfvsGP6VWO8mz1E")' }}
          ></div>
        </div>
      </div>
    </header>
  );
};

export default Header;