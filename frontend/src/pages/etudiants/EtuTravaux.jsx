import React, { useState, useRef } from 'react';

const StudentAssignmentsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Tout voir");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Données des devoirs
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      subject: "Philosophie",
      subjectColor: "bg-indigo-50 text-indigo-600",
      subjectIcon: "psychology",
      status: "En attente",
      statusColor: "text-blue-600 bg-blue-50",
      title: "Dissertation : La conscience",
      desc: "Rédiger une introduction et un plan détaillé.",
      instructions: "Le travail doit faire au moins 2 pages. Utilisez les références vues au chapitre 2.",
      timeLeft: "02j 04h 12m",
      isUrgent: true,
      actionLabel: "Déposer",
      attachment: { name: "Sujet_Philosophie.pdf", size: "1.2 MB" }
    },
    {
      id: 2,
      subject: "Mathématiques",
      subjectColor: "bg-teal-50 text-teal-600",
      subjectIcon: "functions",
      status: "En retard",
      statusColor: "text-red-600 bg-red-50",
      title: "Exercices sur les vecteurs",
      desc: "Faire les exercices 12 à 15 page 45.",
      instructions: "Justifier chaque étape du calcul vectoriel.",
      timeLeft: "Expiré",
      isLate: true,
      actionLabel: "Voir correction",
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
      instructions: "Analyse de l'ironie voltairienne.",
      timeLeft: "Rendu le 10/10",
      isDone: true,
      actionLabel: "Voir note",
    },
    {
      id: 4,
      subject: "Histoire-Géo",
      subjectColor: "bg-orange-50 text-orange-600",
      subjectIcon: "public",
      status: "En attente",
      statusColor: "text-blue-600 bg-blue-50",
      title: "Cartographie de la mondialisation",
      desc: "Réaliser un croquis de synthèse sur les flux mondiaux.",
      instructions: "Utilisez la nomenclature officielle. Légende organisée en trois parties.",
      timeLeft: "04j 10h 00m",
      actionLabel: "Déposer",
      attachment: { name: "Fond_de_carte.jpg", size: "2.5 MB" }
    },
    {
      id: 5,
      subject: "Anglais",
      subjectColor: "bg-blue-50 text-blue-600",
      subjectIcon: "translate",
      status: "Terminé",
      statusColor: "text-green-600 bg-green-50",
      title: "Essay: Climate Change",
      desc: "Argumentative essay about environmental issues.",
      instructions: "Minimum 500 words. Use advanced connectors.",
      timeLeft: "Rendu hier",
      isDone: true,
      actionLabel: "Voir note",
    },
    {
      id: 6,
      subject: "Physique",
      subjectColor: "bg-purple-50 text-purple-600",
      subjectIcon: "bolt",
      status: "En attente",
      statusColor: "text-blue-600 bg-blue-50",
      title: "TP Électricité : Loi d'Ohm",
      desc: "Rendre le compte rendu d'expérience n°3.",
      instructions: "Inclure les graphiques réalisés sur Excel.",
      timeLeft: "12h 30m",
      isUrgent: true,
      actionLabel: "Déposer"
    }
  ]);

  // Logique de déclenchement du sélecteur de fichiers
  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  // Simulation du dépôt de fichier réussi
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      // Simulation d'un upload réseau de 1.5s
      setTimeout(() => {
        setAssignments(prev => prev.map(a => 
          a.id === selectedAssignment.id 
          ? { ...a, status: "Terminé", statusColor: "text-green-600 bg-green-50", actionLabel: "Voir note", isDone: true, timeLeft: "Rendu à l'instant", isUrgent: false } 
          : a
        ));
        setIsUploading(false);
        setSelectedAssignment(null);
      }, 1500);
    }
  };

  const filteredAssignments = assignments.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.subject.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === "Tout voir") return matchesSearch;
    if (filter === "Corrigés") return matchesSearch && item.status === "Terminé";
    return matchesSearch && item.status === filter;
  });

  return (
    <div className="flex-1 w-full flex flex-col min-h-screen bg-slate-50 font-['Lexend'] antialiased relative">
      
      {/* Input de fichier caché */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.jpg,.png"
      />

      {/* --- PANEL DE DÉTAILS --- */}
      {selectedAssignment && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90]" onClick={() => setSelectedAssignment(null)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-[100] animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-8 overflow-y-auto flex-1 flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <button onClick={() => setSelectedAssignment(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <span className="material-symbols-outlined text-slate-500">close</span>
                </button>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedAssignment.statusColor}`}>
                  {selectedAssignment.status}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${selectedAssignment.subjectColor}`}>
                    <span className="material-symbols-outlined text-sm">{selectedAssignment.subjectIcon}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{selectedAssignment.subject}</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 leading-tight">{selectedAssignment.title}</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Consignes</h4>
                  <p className="text-slate-600 bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 leading-relaxed">
                    {selectedAssignment.instructions || selectedAssignment.desc}
                  </p>
                </div>

                {selectedAssignment.attachment && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Document joint</h4>
                    <a 
                      href="#" 
                      download 
                      className="flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-orange-500 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-orange-500">download</span>
                        <span className="text-sm font-bold text-slate-700">{selectedAssignment.attachment.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{selectedAssignment.attachment.size}</span>
                    </a>
                  </div>
                )}

                {selectedAssignment.actionLabel === "Déposer" && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Votre travail</h4>
                    <div 
                      onClick={triggerFileSelect}
                      className={`border-2 border-dashed rounded-[1.5rem] p-10 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer
                        ${isUploading ? 'bg-slate-50 border-slate-200 cursor-wait' : 'hover:bg-orange-50/30 border-slate-200 hover:border-orange-200 group'}`}
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-3">
                          <span className="animate-spin material-symbols-outlined text-orange-600 text-4xl">progress_activity</span>
                          <p className="text-sm font-bold text-orange-600">Téléchargement en cours...</p>
                        </div>
                      ) : (
                        <>
                          <div className="size-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                            <span className="material-symbols-outlined">cloud_upload</span>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-slate-700">Cliquez pour choisir un fichier</p>
                            <p className="text-xs text-slate-400 mt-1">Sélectionnez un document sur votre appareil</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 border-t border-slate-100">
              <button 
                disabled={selectedAssignment.actionLabel === "Voir correction" || selectedAssignment.actionLabel === "Voir note" || isUploading}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all
                  ${(selectedAssignment.actionLabel === "Voir correction" || selectedAssignment.actionLabel === "Voir note")
                    ? 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-orange-600'
                  }`}
              >
                {selectedAssignment.actionLabel}
              </button>
            </div>
          </div>
        </>
      )}

      {/* --- LISTE DES DEVOIRS --- */}
      <div className="px-6 xl:px-12 py-8 max-w-7xl mx-auto w-full flex flex-col gap-8">

        <section className="relative">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-none rounded-[2rem] pl-16 py-6 shadow-sm focus:ring-2 focus:ring-orange-500/10 outline-none"
            placeholder="Rechercher par matière..."
          />
        </section>

        <div className="flex p-1 bg-white border border-slate-200 rounded-full w-fit">
          {["Tout voir", "En attente", "Corrigés", "En retard"].map((btn) => (
            <button
              key={btn}
              onClick={() => setFilter(btn)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${filter === btn ? "bg-slate-900 text-white" : "text-slate-500"}`}
            >
              {btn}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredAssignments.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedAssignment(item)}
              className="group bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center gap-6 cursor-pointer"
            >
              <div className={`h-14 w-14 rounded-2xl ${item.subjectColor} flex items-center justify-center shrink-0`}>
                <span className="material-symbols-outlined">{item.subjectIcon}</span>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600">{item.title}</h3>
                <span className={`text-[10px] font-black uppercase tracking-widest ${item.statusColor} px-2 py-1 rounded-full mt-1 inline-block`}>{item.status}</span>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Échéance</span>
                   <span className={`text-sm font-bold ${item.isUrgent ? 'text-orange-600' : 'text-slate-600'}`}>{item.timeLeft}</span>
                </div>
                <button 
                  disabled={item.actionLabel === "Voir correction" || item.actionLabel === "Voir note"}
                  className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
                    ${(item.actionLabel === "Voir correction" || item.actionLabel === "Voir note")
                      ? 'bg-slate-50 text-slate-200 cursor-not-allowed'
                      : 'bg-orange-500 text-white'
                    }`}
                >
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