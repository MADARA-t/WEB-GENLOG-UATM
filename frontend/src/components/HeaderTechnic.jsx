import React from 'react';
import { NavLink } from 'react-router-dom'; // 1. Importer NavLink

// Importation de la police Lexend
const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');`;

const Header = () => {
  return (
    <>
      <style>{fontImport}</style>
      <header className="flex items-center justify-between whitespace-nowrap bg-white px-6 md:px-10 py-4 shadow-sm z-10 relative font-['Lexend']">
        <div className="flex items-center gap-4 text-slate-900">
          <div className="size-10 bg-[#f97415] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#f97415]/30">
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>school</span>
          </div>
          <div>
            <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight">SETICE</h2>
            <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">Espace Technicien</p>
          </div>
        </div>

        <div className="flex flex-1 justify-end gap-8 items-center">
          <nav className="hidden md:flex items-center gap-8">
            {/* 2. Utiliser NavLink avec la prop 'to' au lieu de 'href' */}
            <NavLink 
              to="/technicien/comptes" 
              className={({ isActive }) => 
                isActive 
                  ? "text-[#f97415] text-sm font-bold" 
                  : "text-slate-500 hover:text-[#f97415] text-sm font-medium transition-colors"
              }
            >
              Comptes
            </NavLink>

            <NavLink 
              to="/technicien/maintenance" 
              className={({ isActive }) => 
                isActive 
                  ? "text-[#f97415] text-sm font-bold" 
                  : "text-slate-500 hover:text-[#f97415] text-sm font-medium transition-colors"
              }
            >
              Maintenance
            </NavLink>

            <NavLink 
              to="/technicien/systemsmanager" 
              className={({ isActive }) => 
                isActive 
                  ? "text-[#f97415] text-sm font-bold" 
                  : "text-slate-500 hover:text-[#f97415] text-sm font-medium transition-colors"
              }
            >
              Système
            </NavLink>
          </nav>

          <div className="flex gap-3 items-center pl-6 border-l border-slate-100">
            <button className="flex items-center justify-center rounded-full size-10 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div 
              className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-slate-100 cursor-pointer" 
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80")' }}
            ></div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;