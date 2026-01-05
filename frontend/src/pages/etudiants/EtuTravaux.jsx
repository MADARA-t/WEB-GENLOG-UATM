import React from 'react';

const StudentAssignmentsList = () => {
  // Données des statistiques
  const stats = [
    { label: "À faire", value: 3, sub: "-1 aujourd'hui", color: "orange", icon: "pending_actions" },
    { label: "En retard", value: 1, sub: "+1 cette semaine", color: "red", icon: "warning" },
    { label: "Terminés", value: 12, sub: "Excellent travail !", color: "green", icon: "check_circle" },
  ];

  // Données des devoirs
  const assignments = [
    {
      id: 1,
      subject: "Philosophie",
      subjectColor: "bg-indigo-50 text-indigo-600",
      subjectIcon: "psychology",
      status: "En attente",
      statusColor: "text-blue-600 bg-blue-50",
      title: "Dissertation : La conscience",
      desc: "Rédiger une introduction et un plan détaillé sur le sujet donné en cours.",
      timeLeft: "02j 04h 12m",
      isUrgent: true,
      actionLabel: "Déposer"
    },
    {
      id: 2,
      subject: "Mathématiques",
      subjectColor: "bg-teal-50 text-teal-600",
      subjectIcon: "functions",
      status: "En retard",
      statusColor: "text-red-600 bg-red-50",
      title: "Exercices sur les vecteurs",
      desc: "Faire les exercices 12 à 15 page 45 du manuel scolaire.",
      timeLeft: "Expiré",
      isUrgent: false,
      isLate: true,
      actionLabel: "Voir correction"
    },
    {
      id: 3,
      subject: "Français",
      subjectColor: "bg-rose-50 text-rose-600",
      subjectIcon: "menu_book",
      status: "Terminé",
      statusColor: "text-green-600 bg-green-50",
      title: "Analyse de texte : Voltaire",
      desc: "Commentaire composé sur l'extrait de Candide.",
      timeLeft: "Rendu le 10/10",
      isUrgent: false,
      isDone: true,
      actionLabel: "Voir note"
    },
    {
      id: 4,
      subject: "Physique-Chimie",
      subjectColor: "bg-amber-50 text-amber-600",
      subjectIcon: "science",
      status: "En attente",
      statusColor: "text-blue-600 bg-blue-50",
      title: "TP : Réactions acides",
      desc: "Compte rendu du TP n°4 à rendre format PDF.",
      timeLeft: "05j 18h 00m",
      isUrgent: false,
      actionLabel: "Déposer"
    }
  ];

  return (
    <div className="flex-1 w-full flex flex-col min-h-screen bg-slate-50 font-['Lexend'] antialiased">
      
      {/* Header Interne */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-slate-900 text-2xl font-bold tracking-tight">Mes Travaux & Devoirs</h2>
          <p className="text-slate-500 text-sm">Gérez vos tâches et respectez les délais</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:flex items-center bg-slate-100 rounded-full h-11 px-4 focus-within:ring-2 focus-within:ring-[#f97415]/20 transition-all w-64">
            <span className="material-symbols-outlined text-slate-400">search</span>
            <input 
              className="bg-transparent border-none text-sm text-slate-700 placeholder-slate-400 focus:ring-0 w-full h-full outline-none" 
              placeholder="Rechercher un devoir..." 
              type="text"
            />
          </div>
          <button className="relative p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#f97415] transition-colors shadow-sm">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </header>

      <div className="px-6 xl:px-12 py-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-start justify-between group hover:border-[#f97415]/30 transition-all cursor-default">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-medium text-sm">{stat.label}</span>
                <span className="text-4xl font-extrabold text-slate-900">{stat.value}</span>
                <span className={`text-${stat.color}-500 text-xs font-semibold bg-${stat.color}-50 px-2 py-1 rounded-full w-fit mt-1`}>
                  {stat.sub}
                </span>
              </div>
              <div className={`p-3 bg-${stat.color}-50 rounded-full text-${stat.color}-500 group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-slate-800">Liste des devoirs</h3>
          <div className="flex p-1 bg-white border border-slate-200 rounded-full shadow-sm overflow-x-auto max-w-full">
            <button className="px-5 py-2 rounded-full bg-slate-900 text-white text-sm font-medium shadow-sm whitespace-nowrap">Tout voir</button>
            <button className="px-5 py-2 rounded-full text-slate-500 hover:text-slate-900 text-sm font-medium whitespace-nowrap transition-colors">En attente</button>
            <button className="px-5 py-2 rounded-full text-slate-500 hover:text-slate-900 text-sm font-medium whitespace-nowrap transition-colors">Corrigés</button>
            <button className="px-5 py-2 rounded-full text-slate-500 hover:text-slate-900 text-sm font-medium whitespace-nowrap transition-colors">En retard</button>
          </div>
        </div>

        {/* Assignment List */}
        <div className="flex flex-col gap-4">
          {assignments.map((item) => (
            <div 
              key={item.id} 
              className={`group bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start md:items-center 
                ${item.isLate ? 'opacity-90' : 'hover:border-[#f97415]/20'} 
                ${item.isDone ? 'hover:border-green-200' : ''}`}
            >
              {/* Subject Info */}
              <div className="flex items-center gap-4 md:w-1/4 min-w-[200px]">
                <div className={`h-12 w-12 rounded-2xl ${item.subjectColor} flex items-center justify-center shrink-0`}>
                  <span className="material-symbols-outlined">{item.subjectIcon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 line-clamp-1">{item.subject}</h4>
                  <span className={`text-xs font-semibold ${item.statusColor} px-2.5 py-1 rounded-full`}>
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-bold text-slate-900 mb-1 transition-colors ${!item.isDone ? 'group-hover:text-[#f97415]' : ''}`}>
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-1">{item.desc}</p>
              </div>

              {/* Timeline & Action */}
              <div className="flex flex-row md:flex-col lg:flex-row items-center gap-6 md:w-auto w-full justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 mt-2 md:mt-0">
                <div className={`flex items-center gap-2 font-mono px-3 py-1.5 rounded-lg 
                  ${item.isUrgent ? 'text-[#f97415] bg-orange-50' : ''} 
                  ${item.isLate ? 'text-red-500' : ''} 
                  ${item.isDone ? 'text-slate-400' : 'bg-slate-50 text-slate-600'}`}>
                  
                  <span className={`material-symbols-outlined text-[18px] ${item.isDone ? 'text-green-500' : ''}`}>
                    {item.isLate ? 'event_busy' : item.isDone ? 'check_circle' : 'timer'}
                  </span>
                  <span className="font-bold text-sm">{item.timeLeft}</span>
                </div>

                <button className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2
                  ${item.isUrgent || item.status === "En attente" 
                    ? 'bg-[#f97415] hover:bg-orange-600 text-white shadow-lg shadow-orange-600/20 active:scale-95' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-[#f97415]/50 hover:text-[#f97415]'}`}>
                  {item.isDone && <span className="material-symbols-outlined text-lg">visibility</span>}
                  {item.actionLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentAssignmentsList;