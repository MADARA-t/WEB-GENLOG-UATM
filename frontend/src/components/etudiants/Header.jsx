import React from 'react';
import { useLocation } from 'react-router-dom';

const StudentHeader = () => {
  const location = useLocation();

  const pageDetails = {
    '/etudiant': {
      title: "Bonjour, Mischael 📚",
      subtitle: "Bienvenue dans votre espace étudiant"
    },
    '/etudiant/espaces': {
      title: "Hello, Mischael 📚",
      subtitle: "Bienvenue dans votre espace étudiant"
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
    title: "Espace Étudiant",
    subtitle: "Bienvenue sur votre plateforme"
  };

  return (
    <header className="h-24 px-10 flex items-center justify-between bg-white/70 backdrop-blur-xl sticky top-0 z-[60] border-b border-white/40 font-['Lexend']">

      {/* Section Gauche : Branding & Page Title */}
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

      {/* Section Droite : Actions & Profil */}
      <div className="flex items-center gap-6">

        {/* Bouton Notification Premium */}
       {/* <button className="group relative size-11 flex items-center justify-center bg-white rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.04)] border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-orange-500/10 hover:border-orange-200">
          <span className="material-symbols-outlined text-slate-400 group-hover:text-orange-600 transition-colors">
            notifications
          </span>
          <span className="absolute top-3 right-3.5 size-2 bg-orange-600 rounded-full border-2 border-white" />
        </button>  */}

        {/* Separator Lumineux */}
        <div className="h-10 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent" />

        {/* Profil Section */}
        <div className="flex items-center gap-4 group">
          <div className="text-right hidden md:block">
            <p className="text-sm font-black text-[#0f172a] leading-none tracking-tight group-hover:text-orange-600 transition-colors">
              Mischael ADINGNI
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
              Licence 3
            </p>
          </div>

          <div className="relative">
            <div className="size-12 rounded-2xl overflow-hidden border-2 border-white shadow-[0_10px_25px_rgba(0,0,0,0.1)] group-hover:shadow-orange-500/20 group-hover:border-orange-100 transition-all duration-300">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas"
                alt="avatar"
                className="w-full h-full object-cover bg-slate-100"
              />
            </div>
            {/* Badge Online */}
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