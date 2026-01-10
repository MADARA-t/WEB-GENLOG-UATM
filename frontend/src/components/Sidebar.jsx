import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

// --- STYLES CONSTANTS ---
const activeButtonStyle = "bg-orange-500 text-white shadow-lg shadow-orange-200";
const inactiveButtonStyle = "text-slate-500 hover:bg-slate-50 hover:text-slate-700";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);

  // --- LOGIQUE DE DÉCONNEXION EFFECTIVE ---
  const handleLogout = (e) => {
    e.preventDefault();
    
    // 1. Suppression de TOUTES les données de session
    localStorage.clear(); 
    sessionStorage.clear();

    // 2. Optionnel : Supprimer un cookie si vous en utilisez
    // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // 3. Redirection avec rechargement complet (plus sécurisé qu'un simple navigate)
    // Cela réinitialise tous les états de l'application (Context, Redux, etc.)
    window.location.href = '/'; 
  };

  return (
    <>
      {/* INJECTION DU CSS DIRECTEMENT */}
      <style>
        {`
          /* Masquer la barre de défilement visuellement */
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
            overflow-y: auto;
          }

          /* Animation de fondu pour les textes */
          .fade-text {
            animation: fadeIn 0.3s ease-in-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}
      </style>

      <aside 
        className={`flex-shrink-0 bg-white flex flex-col hidden md:flex sticky top-0 h-screen border-r border-slate-100 transition-all duration-300 z-[100]
        ${isCollapsed ? 'w-24' : 'w-80'}`}
      >
        {/* BOUTON TOGGLE */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-12 size-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-orange-600 shadow-sm hover:scale-110 transition-all z-[110]"
        >
          <span className="material-symbols-outlined text-[18px] font-black">
            {isCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>

        {/* SECTION LOGO */}
        <div className={`p-8 mb-2 flex items-center gap-4 overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="bg-orange-500 rounded-2xl h-12 w-12 flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <span className="material-symbols-outlined !text-[28px]">school</span>
          </div>
          {!isCollapsed && (
            <div className="fade-text whitespace-nowrap">
              <h1 className="text-slate-900 text-xl font-black tracking-tight leading-none">SETICE</h1>
              <p className="text-orange-500 text-[10px] font-bold uppercase tracking-[0.1em] mt-1">Director Panel</p>
            </div>
          )}
        </div>

        {/* NAVIGATION - SCROLL INVISIBLE ICI */}
        <div className="flex-1 px-4 no-scrollbar overflow-x-hidden">
          <nav className="mt-4 space-y-2">
            {[
              { to: "/directeur/dashboard", icon: "grid_view", label: "Tableau de bord" },
              { to: "/directeur/subjectspaces", icon: "library_books", label: "Espaces pédagogiques" },
              { to: "/directeur/inscriptions", icon: "groups", label: "Inscriptions" },
             // { to: "/directeur/creation", icon: "task", label: "Travaux" },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center rounded-2xl transition-all duration-300 group relative
                  ${isCollapsed ? 'justify-center px-0 py-4' : 'gap-4 px-5 py-4'}
                  ${isActive ? activeButtonStyle : inactiveButtonStyle}
                `}
              >
                <span className="material-symbols-outlined !text-[24px] flex-shrink-0">
                  {item.icon}
                </span>
                
                {!isCollapsed && (
                  <span className="text-sm font-bold whitespace-nowrap fade-text">
                    {item.label}
                  </span>
                )}

                {/* TOOLTIP EN MODE RÉDUIT */}
                {isCollapsed && (
                  <div className="absolute left-full ml-6 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-[120] shadow-2xl translate-x-2 group-hover:translate-x-0">
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* SECTION DÉCONNEXION */}
        <div className="p-6 border-t border-slate-50">
          <button 
            onClick={handleLogout}
            className={`flex items-center rounded-2xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all w-full group overflow-hidden
            ${isCollapsed ? 'justify-center py-4 px-0' : 'gap-4 px-5 py-4'}`}
          >
            <span className="material-symbols-outlined !text-[24px] group-hover:rotate-12 transition-transform flex-shrink-0">
              logout
            </span>
            {!isCollapsed && (
              <span className="text-sm font-bold whitespace-nowrap fade-text">
                Déconnexion
              </span>
            )}
            {/* Tooltip déconnexion en mode réduit */}
            {isCollapsed && (
              <div className="absolute left-full ml-6 px-4 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-[120] shadow-2xl">
                Déconnexion
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}