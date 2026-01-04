import React, { useState } from 'react';

const StudentAssignmentsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Tout voir");
  const [selectedAssignment, setSelectedAssignment] = useState(null); // État pour le détail

  const stats = [
    { label: "À faire", value: 3, sub: "-1 aujourd'hui", color: "orange", icon: "pending_actions" },
    { label: "En retard", value: 1, sub: "+1 cette semaine", color: "red", icon: "warning" },
    { label: "Terminés", value: 12, sub: "Excellent travail !", color: "green", icon: "check_circle" },
  ];

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
      fullDesc: "Consigne complète : Analysez comment la conscience définit l'identité humaine à travers les textes de Descartes et Locke. Le plan doit comporter 3 parties distinctes. Format PDF uniquement.",
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
      fullDesc: "Les exercices portent sur la somme de vecteurs et la relation de Chasles. La correction sera disponible une fois que le professeur aura validé les retours tardifs.",
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
      fullDesc: "Votre rendu a été bien reçu. La note sera publiée après la session de correction globale prévue pour la fin du mois.",
      timeLeft: "Rendu le 10/10",
      isUrgent: false,
      isDone: true,
      actionLabel: "Voir note"
    }
  ];

  const filteredAssignments = assignments.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.subject.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === "Tout voir") return matchesSearch;
    return matchesSearch && item.status === filter;
  });

  return (
    <div className="flex-1 w-full flex flex-col min-h-screen bg-slate-50 font-['Lexend'] antialiased">
      <div className="px-6 xl:px-12 py-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
        
        {/* 1. Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-medium text-sm">{stat.label}</span>
                <span className="text-4xl font-extrabold text-slate-900">{stat.value}</span>
                <span className={`text-${stat.color}-600 text-[10px] uppercase tracking-wider font-bold bg-${stat.color}-50 px-2 py-1 rounded-full w-fit mt-1`}>{stat.sub}</span>
              </div>
              <div className={`p-3 bg-${stat.color}-50 rounded-2xl text-${stat.color}-500`}><span className="material-symbols-outlined">{stat.icon}</span></div>
            </div>
          ))}
        </div>

        {/* 2. Search & Filters */}
        <div className="flex flex-col gap-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un devoir..."
            className="w-full bg-white border-none text-slate-900 text-lg rounded-[2.5rem] px-8 py-6 shadow-sm focus:ring-2 focus:ring-[#f97415]/20 outline-none"
          />
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["Tout voir", "En attente", "Terminé", "En retard"].map((btn) => (
              <button key={btn} onClick={() => setFilter(btn)} className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filter === btn ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"}`}>
                {btn}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Assignment List */}
        <div className="flex flex-col gap-4">
          {filteredAssignments.map((item) => {
            // Logique de désactivation
            const isDisabled = item.actionLabel === "Voir correction" || item.actionLabel === "Voir note";

            return (
              <div 
                key={item.id} 
                onClick={() => setSelectedAssignment(item)}
                className={`group bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#f97415]/20 transition-all flex flex-col md:flex-row gap-6 items-start md:items-center cursor-pointer`}
              >
                <div className="flex items-center gap-4 md:w-1/4">
                  <div className={`h-14 w-14 rounded-2xl ${item.subjectColor} flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-outlined text-2xl">{item.subjectIcon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.subject}</h4>
                    <span className={`text-[10px] uppercase tracking-widest font-black ${item.statusColor} px-2.5 py-1 rounded-full inline-block mt-1`}>{item.status}</span>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-extrabold text-slate-900 mb-1 group-hover:text-[#f97415] transition-colors">{item.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-1">{item.desc}</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className={`flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-xl bg-slate-50 ${item.isUrgent ? 'text-[#f97415]' : 'text-slate-500'}`}>
                    <span className="material-symbols-outlined text-lg">timer</span>
                    {item.timeLeft}
                  </div>
                  
                  <button 
                    disabled={isDisabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Action : ${item.actionLabel}`);
                    }}
                    className={`px-6 py-3 rounded-full font-bold text-sm transition-all whitespace-nowrap
                      ${isDisabled 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                        : 'bg-[#f97415] hover:bg-orange-600 text-white shadow-lg shadow-orange-200'}`}
                  >
                    {item.actionLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- MODAL DE DÉTAILS --- */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-8 ${selectedAssignment.subjectColor} flex justify-between items-start`}>
              <div className="flex items-center gap-4">
                <div className="bg-white/40 p-3 rounded-2xl backdrop-blur-md">
                  <span className="material-symbols-outlined text-3xl">{selectedAssignment.subjectIcon}</span>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">{selectedAssignment.subject}</p>
                  <h2 className="text-2xl font-black">{selectedAssignment.title}</h2>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAssignment(null)}
                className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex gap-8 border-b border-slate-100 pb-6">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Statut</span>
                  <span className={`font-bold ${selectedAssignment.statusColor.replace('bg-', 'text-')}`}>{selectedAssignment.status}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Deadline / Rendu</span>
                  <span className="font-bold text-slate-900">{selectedAssignment.timeLeft}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-500">description</span>
                  Instructions détaillées
                </h4>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                  {selectedAssignment.fullDesc || selectedAssignment.desc}
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setSelectedAssignment(null)}
                  className="flex-1 py-4 rounded-full font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Fermer
                </button>
                <button 
                  disabled={selectedAssignment.actionLabel === "Voir correction" || selectedAssignment.actionLabel === "Voir note"}
                  className="flex-[2] py-4 rounded-full font-bold bg-slate-900 text-white shadow-xl hover:bg-slate-800 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {selectedAssignment.actionLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignmentsList;