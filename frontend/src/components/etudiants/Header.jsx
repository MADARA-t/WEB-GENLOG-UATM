import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const StudentHeader = () => {
  const location = useLocation();
  
  // --- ÉTAT POUR L'UTILISATEUR DYNAMIQUE ---
  const [userData, setUserData] = useState({
    name: "Étudiant",
    firstName: "Étudiant",
    role: "Licence",
    promo: ""
  });

  useEffect(() => {
    // Récupération des infos stockées lors du login
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      // On sépare le prénom du nom (on prend le premier mot pour le "Bonjour")
      const firstName = savedUser.name.split(' ')[0];
      setUserData({
        name: savedUser.name,
        firstName: firstName,
        role: savedUser.role,
        promo: savedUser.promo || "Non assigné"
      });
    }
  }, []);

  const pageDetails = {
    '/etudiant': {
      title: `Bonjour, ${userData.firstName} 📚`,
      subtitle: "Bienvenue dans votre espace étudiant"
    },
    '/etudiant/espaces': {
      title: `Hello, ${userData.firstName} 📚`,
      subtitle: "Consultez vos matières et supports"
    },
    '/etudiant/travaux': {
      title: "Mes Travaux & Devoirs 📝",
      subtitle: "Gérez vos tâches et respectez les délais"
    },
    '/etudiant/dashboard': {
      title: "Tableau de bord 📊",
      subtitle: "Suivez votre progression en temps réel"
    }
  };

  const currentPath = location.pathname.replace(/\/$/, "");
  const activePath = currentPath === "/etudiant" || currentPath === "" ? "/etudiant" : currentPath;

  const content = pageDetails[activePath] || {
    title: `Espace de ${userData.firstName}`,
    subtitle: "Bienvenue sur votre plateforme"
  };

  return (
    <header className="h-24 px-10 flex items-center justify-between bg-white/70 backdrop-blur-xl sticky top-0 z-[60] border-b border-white/40 font-['Lexend']">

      {/* Section Gauche : Dynamic Title based on Path & User */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <div className="size-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-pulse" />
          <h2 className="text-2xl font-black tracking-tight text-[#0f172a]">
            {content.title}
          </h2>
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-3.5">
          {content.subtitle}
        </p>
      </div>

      {/* Section Droite : Profil */}
      <div className="flex items-center gap-6">
        <div className="h-10 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent" />

        <div className="flex items-center gap-4 group">
          <div className="text-right hidden md:block">
            <p className="text-sm font-black text-[#0f172a] leading-none tracking-tight group-hover:text-orange-600 transition-colors">
              {userData.name}
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
              {userData.promo}
            </p>
          </div>

          <div className="relative">
            <div className="size-12 rounded-2xl overflow-hidden border-2 border-white shadow-[0_10px_25px_rgba(0,0,0,0.1)] group-hover:shadow-orange-500/20 group-hover:border-orange-100 transition-all duration-300">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`}
                alt="avatar"
                className="w-full h-full object-cover bg-slate-100"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 size-4 bg-green-500 rounded-lg border-2 border-white shadow-sm flex items-center justify-center">
              <div className="size-1.5 bg-white rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;