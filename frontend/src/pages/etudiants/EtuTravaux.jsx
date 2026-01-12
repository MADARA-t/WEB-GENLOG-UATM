import React, { useState, useEffect, useRef } from 'react';

const StudentAssignmentsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Tout voir");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [now, setNow] = useState(new Date());
  const fileInputRef = useRef(null);

  // Mise à jour du temps toutes les secondes pour le décompte
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Données enrichies : deadline réelle et ressources téléchargeables
  const [assignments, setAssignments] = useState([
    
  ]);

  // Fonction pour calculer le format 00j 00h 00m 00s
  const getTimeLeft = (deadline) => {
    const diff = deadline - now;
    if (diff <= 0) return "Expiré";
    const j = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);
    return `${j > 0 ? j + 'j ' : ''}${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setIsUploading(true);
      setTimeout(() => {
        setAssignments(prev => prev.map(a => 
          a.id === selectedAssignment.id 
          ? { ...a, status: "Terminé", statusColor: "text-green-600 bg-green-50", actionLabel: "Voir note", isDone: true } 
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
    return matchesSearch && item.status === filter;
  });

  return (
    <div className="flex-1 w-full min-h-screen bg-slate-50 font-['Lexend'] antialiased p-6 lg:p-12">
      
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

      {/* --- SIDE PANEL DÉTAILS --- */}
      {selectedAssignment && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90]" onClick={() => setSelectedAssignment(null)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-8 overflow-y-auto flex-1 space-y-8">
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

              {/* MEMBRES (Si collectif) */}
              {selectedAssignment.isCollective && (
                <div className="bg-orange-50/50 p-6 rounded-[2rem] border border-orange-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-4">Équipe du projet</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedAssignment.teamMembers.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-orange-100 shadow-sm">
                        <div className="size-6 rounded-full bg-orange-500 text-[8px] font-black text-white flex items-center justify-center">{m.avatar}</div>
                        <span className="text-[10px] font-bold text-slate-700">{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CONSIGNES */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Consignes & Détails</h4>
                <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 italic">
                  "{selectedAssignment.instructions}"
                </p>
              </div>

              {/* FICHIERS À TÉLÉCHARGER (RESSOURCES) */}
              {selectedAssignment.resources && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Documents de travail ({selectedAssignment.resources.length})</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedAssignment.resources.map((file, i) => (
                      <a key={i} href="#" className="flex items-center justify-between p-4 bg-white border-2 border-slate-50 rounded-2xl hover:border-orange-500 transition-all group shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-orange-500 bg-orange-50 p-2 rounded-lg">download</span>
                          <span className="text-xs font-bold text-slate-700">{file.name}</span>
                        </div>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">{file.size}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* ZONE DE DÉPÔT */}
              {!selectedAssignment.isDone && (
                <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-3 hover:bg-orange-50/30 hover:border-orange-200 cursor-pointer transition-all">
                   <span className={`material-symbols-outlined text-4xl ${isUploading ? 'animate-spin text-orange-600' : 'text-slate-300'}`}>
                    {isUploading ? 'progress_activity' : 'cloud_upload'}
                   </span>
                   <p className="text-sm font-bold text-slate-700">{isUploading ? 'Téléchargement...' : 'Déposer mon fichier'}</p>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-100">
              <button disabled={selectedAssignment.isDone} className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all disabled:bg-slate-100 disabled:text-slate-300">
                {selectedAssignment.actionLabel}
              </button>
            </div>
          </div>
        </>
      )}

      {/* --- LISTE PRINCIPALE --- */}
      <div className="max-w-6xl mx-auto space-y-8">

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Rechercher un devoir..." className="w-full pl-14 pr-6 py-5 bg-white rounded-full border-none shadow-sm focus:ring-2 focus:ring-orange-500/10 outline-none" />
          </div>
          <div className="flex p-1 bg-white rounded-full shadow-sm border border-slate-100">
            {["Tout voir", "En attente", "Terminé"].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredAssignments.map((item) => {
            const timeLeftText = getTimeLeft(item.deadline);
            const isUrgent = timeLeftText !== "Expiré" && (item.deadline - now < 1000 * 60 * 60 * 24);

            return (
              <div key={item.id} onClick={() => setSelectedAssignment(item)} className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-center gap-6 cursor-pointer">
                <div className={`size-16 rounded-[1.5rem] ${item.subjectColor} flex items-center justify-center shrink-0`}>
                  <span className="material-symbols-outlined text-3xl">{item.subjectIcon}</span>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors uppercase tracking-tighter">{item.title}</h3>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded border ${item.isCollective ? 'border-orange-200 text-orange-500' : 'border-slate-200 text-slate-400 uppercase'}`}>
                      {item.isCollective ? 'Équipe' : 'Solo'}
                    </span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${item.statusColor}`}>{item.status}</span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{item.subject}</span>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center md:items-end">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Temps restant</span>
                    <span className={`text-sm font-black tabular-nums ${isUrgent ? 'text-orange-600 animate-pulse' : 'text-slate-700'}`}>
                      {item.isDone ? "Dépôt validé" : timeLeftText}
                    </span>
                  </div>
                  <button className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${item.isDone ? 'bg-slate-50 text-slate-300' : 'bg-slate-900 text-white hover:bg-orange-600'}`}>
                    {item.actionLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentAssignmentsList;