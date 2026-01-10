import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialisation de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // --- ÉTAT POUR L'UTILISATEUR CONNECTÉ ---
  const [user, setUser] = useState({ name: "Chargement...", role: "..." });
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    // 1. Récupération automatique du profil
    const fetchUserProfile = async () => {
      try {
        // On cherche "Madara" par défaut ou l'utilisateur en session
        const savedUser = JSON.parse(localStorage.getItem('user'));
        const targetName = savedUser?.name || 'Madara';

        const { data: profile } = await supabase
          .from('users')
          .select('name, role')
          .eq('name', targetName)
          .single();
        
        if (profile) {
          setUser({ name: profile.name, role: profile.role });
        }
      } catch (error) {
        console.error("Erreur Header profil:", error);
      }
    };

    fetchUserProfile();

   {} // 2. Gestion du clic extérieur
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
        {/* SECTION PROFIL */}
        <div className="relative flex items-center gap-3 pl-4 border-l border-slate-100" ref={profileRef}>
          <div className="text-right hidden sm:block cursor-pointer" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <p className="text-[11px] font-black uppercase text-black leading-none">{user.name}</p>
            <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest mt-1">{user.role}</p>
          </div>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm hover:scale-105 transition-transform cursor-pointer"
          >
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Profil" />
          </div>

          {/* Menu Profil */}
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <ProfileMenuItem icon="person" label="Mon Profil" />
              <ProfileMenuItem icon="settings" label="Paramètres" />
              <hr className="my-2 border-slate-50" />
              <ProfileMenuItem icon="logout" label="Déconnexion" color="text-red-500" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const ProfileMenuItem = ({ icon, label, color = "text-slate-600" }) => (
  <button className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-50 transition-colors group`}>
    <span className={`material-symbols-outlined text-[20px] ${color} group-hover:scale-110 transition-transform`}>{icon}</span>
    <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{label}</span>
  </button>
);