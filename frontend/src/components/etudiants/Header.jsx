import React from 'react';
import { useLocation } from 'react-router-dom';

const StudentHeader = () => {
  const location = useLocation();

  // On définit ici les textes pour chaque chemin de ta Sidebar
  const pageDetails = {
    '/etudiant/dashboard': {
      title: "Bonjour, Mischael 👋",
      subtitle: "Prêt à apprendre quelque chose de nouveau aujourd'hui ?"
    },
    '/etudiant/espaces': {
      title: "Mes Espaces Pédagogiques 📚",
      subtitle: "Accédez à vos cours et ressources par matière"
    },
    '/etudiant/travaux': {
      title: "Mes Travaux & Devoirs 📝",
      subtitle: "Gérez vos tâches et respectez les délais"
    }
  };

  // On récupère les infos selon le chemin actuel, avec un fallback (par défaut)
  const currentPath = location.pathname;
  const content = pageDetails[currentPath] || {
    title: "Bonjour, Mischael 👋",
    subtitle: "Bienvenue sur votre espace personnel"
  };

  return (
    <header className="h-20 px-8 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-100/50 font-['Lexend']">
      <div className="flex flex-col">
        {/* Le titre et le sous-titre changent instantanément avec le NavLink */}
        <h2 className="text-2xl font-bold text-[#0f172a] transition-all duration-300">
          {content.title}
        </h2>
        <p className="text-sm text-[#64748b] transition-all duration-300">
          {content.subtitle}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="size-10 rounded-full bg-white border border-slate-100 text-[#64748b] hover:text-[#ea580c] hover:border-[#ea580c]/30 flex items-center justify-center transition-all relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2.5 size-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#0f172a]">Mischael ADINGNI</p>
            <p className="text-xs text-[#64748b]">Étudiant L3</p>
          </div>
          <div 
            className="size-10 rounded-full bg-slate-200 bg-cover bg-center border-2 border-white shadow-sm" 
            style={{ backgroundImage: "url('https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas')" }}
          ></div>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;