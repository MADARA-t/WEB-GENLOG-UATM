import React, { useState, useEffect, useRef } from 'react';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Refs pour fermer les menus en cliquant à l'extérieur
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-100 sticky top-0 z-20 font-['Lexend']">
      <div className="flex-1 max-w-lg">
        <div className="relative flex items-center w-full h-11 group">
          <span className="material-symbols-outlined absolute left-4 text-slate-400 group-focus-within:text-orange-500 transition-colors">search</span>
          <input 
            className="w-full h-full pl-12 pr-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500/20 outline-none transition-all" 
            placeholder="Rechercher..." 
            type="text" 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {/* SECTION NOTIFICATIONS */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 transition-colors rounded-xl ${showNotifications ? 'text-orange-500 bg-orange-50' : 'text-slate-400 hover:text-orange-500 hover:bg-slate-50'}`}
          >
            <span className="material-symbols-outlined !text-[26px]">notifications</span>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Menu Notifications Style Facebook */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-5 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-black text-xs uppercase tracking-widest">Notifications</h3>
                <span className="text-[10px] text-orange-500 font-bold cursor-pointer hover:underline">Tout marquer comme lu</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                <NotificationItem title="Nouvel émargement" desc="La promotion Sciences Po a validé..." time="Il y a 2 min" isUnread />
                <NotificationItem title="Retard détecté" desc="3 étudiants sont en retard pour..." time="Il y a 15 min" isUnread />
                <NotificationItem title="Export terminé" desc="Votre rapport mensuel est prêt." time="Il y a 1h" />
              </div>
              <div className="p-4 bg-slate-50 text-center">
                <button className="text-[10px] font-black uppercase text-slate-400 hover:text-orange-500 transition-colors">Voir tout</button>
              </div>
            </div>
          )}
        </div>

        {/* SECTION PROFIL */}
        <div className="relative flex items-center gap-3 pl-4 border-l border-slate-100" ref={profileRef}>
          <div className="text-right hidden sm:block cursor-pointer" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <p className="text-[11px] font-black uppercase text-black leading-none">Odalric Fassinou</p>
            <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest mt-1">Directeur</p>
          </div>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm hover:scale-105 transition-transform cursor-pointer"
          >
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jean" alt="Profil" />
          </div>

          {/* Menu Profil */}
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <ProfileMenuItem icon="person" label="Mon Profil" />
              <ProfileMenuItem icon="settings" label="Paramètres" />
              <ProfileMenuItem icon="shield_person" label="Sécurité" />
              <div className="my-2 border-t border-slate-50"></div>
              <ProfileMenuItem icon="logout" label="Déconnexion" color="text-red-500" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Sous-composant pour les notifications
const NotificationItem = ({ title, desc, time, isUnread = false }) => (
  <div className="p-4 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3 relative border-b border-slate-50/50">
    {isUnread && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-orange-500 rounded-full"></div>}
    <div className={`h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center ${isUnread ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
      <span className="material-symbols-outlined text-[20px]">info</span>
    </div>
    <div>
      <p className={`text-[11px] uppercase ${isUnread ? 'font-black' : 'font-bold text-slate-600'}`}>{title}</p>
      <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-1">{desc}</p>
      <p className="text-[9px] text-slate-300 font-bold mt-1 uppercase tracking-tighter">{time}</p>
    </div>
  </div>
);

// Sous-composant pour le menu de profil
const ProfileMenuItem = ({ icon, label, color = "text-slate-600" }) => (
  <button className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-50 transition-colors group`}>
    <span className={`material-symbols-outlined text-[20px] ${color} group-hover:scale-110 transition-transform`}>{icon}</span>
    <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{label}</span>
  </button>
);