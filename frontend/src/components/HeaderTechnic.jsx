import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

// Importation de la police Lexend
const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');`;

const Header = () => {
  // --- ÉTAT POUR L'UTILISATEUR ET LE MENU ---
  const [showProfile, setShowProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "Technicien",
    role: "Maintenance",
    avatar: ""
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setCurrentUser({
        name: savedUser.name,
        role: savedUser.role || "Technicien Système",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${savedUser.name}`
      });
    }
  }, []);

  return (
    <>
      <style>{fontImport}</style>
      <header className="flex items-center justify-between whitespace-nowrap bg-white px-6 md:px-10 py-4 shadow-sm z-[100] relative font-['Lexend']">
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

          <div className="flex gap-3 items-center pl-6 border-l border-slate-100 relative">
            <button className="flex items-center justify-center rounded-full size-10 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* PHOTO DE PROFIL CLIQUABLE */}
            <div className="relative">
              <div 
                onClick={() => setShowProfile(!showProfile)}
                className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-slate-100 cursor-pointer hover:border-[#f97415] transition-all bg-slate-100" 
                style={{ backgroundImage: `url("${currentUser.avatar}")` }}
              ></div>

              {/* MENU DÉROULANT AU CLIC */}
              {showProfile && (
                <>
                  {/* Overlay pour fermer en cliquant ailleurs */}
                  <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)}></div>
                  
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 z-20 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex flex-col items-center text-center">
                      <div 
                        className="size-20 rounded-2xl bg-center bg-no-repeat bg-cover border-4 border-slate-50 shadow-md mb-3"
                        style={{ backgroundImage: `url("${currentUser.avatar}")` }}
                      ></div>
                      <h4 className="text-slate-900 font-bold text-base leading-tight">{currentUser.name}</h4>
                      <p className="text-[#f97415] text-[10px] font-black uppercase tracking-[0.15em] mt-1">{currentUser.role}</p>
                      
                      <div className="h-px bg-slate-100 w-full my-4"></div>
                      
                      <button 
                        onClick={() => {
                          localStorage.removeItem('user');
                          window.location.href = '/';
                        }}
                        className="w-full py-2.5 px-4 bg-slate-50 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;