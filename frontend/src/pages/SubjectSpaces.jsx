import React, { useState, useMemo } from 'react';

const SubjectSpaces = () => {
  // --- ÉTATS ---
  const [view, setView] = useState('grid');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const [previewItem, setPreviewItem] = useState(null);

  // --- DONNÉES ---
  const [subjects, setSubjects] = useState([
    { 
      id: 1, 
      title: "ALGORITHMIQUE AVANCÉE", 
      instructor: "Marc Dubois", 
      promo: "SIL3", 
      year: "2025-2026",
      semester: "Semestre 1",
      students: ["Jean Dupont", "Marie Curie", "Alice Martin"],
      // Nouveau format : Les notes sont indexées par étudiant ET par titre de travail
      grades: {
        "Jean Dupont": { "TP1 : Manipulation de piles": "15/20", "Projet final : Chemin court": "14/20" },
        "Marie Curie": { "TP1 : Manipulation de piles": "18/20", "Projet final : Chemin court": "19/20" },
        "Alice Martin": { "TP1 : Manipulation de piles": "12/20" }
      },
      contents: [
        { title: "Introduction aux Graphes", type: "PDF", date: "02 Jan 2026", description: "Introduction aux concepts de sommets, d'arcs et de pondération.", body: "Lien vers le document : cours_graphes_v1.pdf" },
        { title: "Complexité Algorithmique", type: "Vidéo", date: "05 Jan 2026", description: "Analyse Big O et étude des cas moyens.", body: "Lien zoom : https://zoom.us/rec/..." }
      ],
      tasks: [
        { title: "TP1 : Manipulation de piles", deadline: "20 Jan 2026", status: "Terminé", instructions: "Implémenter une pile en utilisant une liste chaînée.", points: "20 pts" },
        { title: "Projet final : Chemin court", deadline: "15 Fév 2026", status: "En cours", instructions: "Développement de l'algorithme de Dijkstra en Python.", points: "40 pts" }
      ],
      img: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800" 
    },
    { 
      id: 2, 
      title: "ARCHITECTURE RÉSEAU", 
      instructor: null, 
      promo: "M1-DS", 
      year: "2025-2026",
      semester: "Semestre 1",
      students: [],
      grades: {},
      contents: [],
      tasks: [],
      img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800" 
    }
  ]);

  // --- LOGIQUE RECHERCHE ---
  const filteredSubjects = useMemo(() => {
    return subjects.filter(s => 
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.instructor && s.instructor.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, subjects]);

  const handleCreateSpace = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newSpace = {
      id: Date.now(),
      title: formData.get('title').toUpperCase(),
      promo: formData.get('promo'),
      year: formData.get('year'),
      semester: formData.get('semester'),
      instructor: null,
      students: [],
      grades: {},
      contents: [],
      tasks: [],
      img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800"
    };
    setSubjects([...subjects, newSpace]);
    setIsModalOpen(false);
  };

  const assignInstructor = (name) => {
    const updated = { ...selectedSubject, instructor: name };
    setSelectedSubject(updated);
    setSubjects(subjects.map(s => s.id === updated.id ? updated : s));
  };

  const addStudentManually = (name) => {
    if (!name.trim()) return;
    const updated = { ...selectedSubject, students: [...selectedSubject.students, name] };
    setSelectedSubject(updated);
    setSubjects(subjects.map(s => s.id === updated.id ? updated : s));
  };

  const removeStudent = (index) => {
    const studentName = selectedSubject.students[index];
    if (window.confirm(`Voulez-vous vraiment retirer l'étudiant ${studentName} de cet espace ?`)) {
      const updatedStudents = selectedSubject.students.filter((_, i) => i !== index);
      const updated = { ...selectedSubject, students: updatedStudents };
      setSelectedSubject(updated);
      setSubjects(subjects.map(s => s.id === updated.id ? updated : s));
    }
  };

  // --- VUE DÉTAILS ---
  if (view === 'details' && selectedSubject) {
    return (
      <main className="flex-1 flex flex-col h-full bg-[#f8f7f5] animate-in fade-in duration-300 relative">
        
        {/* MODALE D'APERÇU DU CONTENU/TRAVAIL */}
        {previewItem && (
          <div className="fixed inset-0 z-[110] flex items-center justify-end bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl h-full shadow-2xl p-12 animate-in slide-in-from-right duration-300 overflow-y-auto">
              <button onClick={() => setPreviewItem(null)} className="mb-10 flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors">
                <span className="material-symbols-outlined">close</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Fermer l'aperçu</span>
              </button>
              
              <div className="space-y-8">
                <div>
                  <span className="px-3 py-1 bg-orange-50 text-orange-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-orange-100 mb-4 inline-block">
                    {previewItem.type || 'Travail à rendre'}
                  </span>
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">{previewItem.title}</h2>
                </div>

                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Description / Instructions</h4>
                  <p className="text-slate-600 font-bold leading-relaxed">{previewItem.description || previewItem.instructions}</p>
                </div>

                {(previewItem.body || previewItem.points) && (
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Détails supplémentaires</h4>
                    <div className="p-5 border-2 border-dashed border-slate-200 rounded-2xl flex items-center gap-4 text-slate-500 font-bold text-sm">
                      <span className="material-symbols-outlined">{previewItem.body ? 'link' : 'grade'}</span>
                      {previewItem.body || `Barème : ${previewItem.points}`}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <header className="w-full px-10 pt-10 bg-white border-b border-slate-100">
          <div className="flex justify-between items-start mb-10">
            <div className="flex gap-6">
              <button onClick={() => setView('grid')} className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-orange-500 transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">{selectedSubject.promo} • {selectedSubject.year}</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded border border-blue-100">Mode Supervision</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{selectedSubject.title}</h1>
              </div>
            </div>
          </div>

          <div className="flex gap-12">
            <TabLink label="Contenu & Travaux" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} icon="assignment" />
            <TabLink label="Inscriptions Étudiants" active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon="group_add" />
            <TabLink label="Notes & Résultats" active={activeTab === 'grades'} onClick={() => setActiveTab('grades')} icon="grade" />
            <TabLink label="Gestion Intervenant" active={activeTab === 'instructor'} onClick={() => setActiveTab('instructor')} icon="person_pin" />
          </div>
        </header>

        <section className="p-10 max-w-7xl">
          {activeTab === 'tasks' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* COLONNE GAUCHE : CONTENUS */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-slate-400">folder_open</span>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Ressources & Supports</h3>
                  </div>
                  <div className="space-y-4">
                    {selectedSubject.contents.length > 0 ? selectedSubject.contents.map((item, i) => (
                      <div key={i} onClick={() => setPreviewItem(item)} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center group hover:border-orange-200 cursor-pointer transition-all">
                        <div>
                          <h4 className="text-sm font-black text-slate-800 uppercase leading-tight mb-1 group-hover:text-orange-500 transition-colors">{item.title}</h4>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-300 group-hover:text-orange-500 transition-all">chevron_right</span>
                      </div>
                    )) : <p className="text-[10px] uppercase font-bold text-slate-300 tracking-widest p-10 border-2 border-dashed border-slate-100 rounded-3xl text-center">Aucun contenu publié</p>}
                  </div>
                </div>

                {/* COLONNE DROITE : TRAVAUX */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-orange-500">task_alt</span>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Évaluations & Devoirs</h3>
                  </div>
                  <div className="space-y-4">
                    {selectedSubject.tasks.length > 0 ? selectedSubject.tasks.map((task, i) => (
                      <div key={i} onClick={() => setPreviewItem(task)} className="cursor-pointer group">
                        <WorkCard title={task.title} deadline={task.deadline} status={task.status} />
                      </div>
                    )) : <p className="text-[10px] uppercase font-bold text-slate-300 tracking-widest p-10 border-2 border-dashed border-slate-100 rounded-3xl text-center">Aucun travail assigné</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'grades' && (
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-x-auto animate-in slide-in-from-bottom-4">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Tableau Récapitulatif des Notes</h3>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Mise à jour en temps réel</span>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest border-r border-slate-100">Étudiants</th>
                    {selectedSubject.tasks.map((task, idx) => (
                      <th key={idx} className="p-6 text-[10px] font-black uppercase text-slate-600 tracking-widest text-center min-w-[150px]">
                        {task.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {selectedSubject.students.length > 0 ? selectedSubject.students.map((student, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-6 text-[11px] font-bold text-slate-700 uppercase border-r border-slate-100 bg-white sticky left-0">{student}</td>
                      {selectedSubject.tasks.map((task, tIdx) => {
                        const score = selectedSubject.grades[student]?.[task.title];
                        return (
                          <td key={tIdx} className="p-6 text-center">
                            {score ? (
                              <span className="text-[11px] font-black text-orange-500 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">{score}</span>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-300 uppercase italic">Non noté</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  )) : (
                    <tr><td colSpan={selectedSubject.tasks.length + 1} className="p-20 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">Aucun étudiant inscrit</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ONGLETS ÉTUDIANTS ET INTERVENANT CONSERVÉS */}
          {activeTab === 'instructor' && (
            <div className="max-w-xl bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in slide-in-from-bottom-4">
              <h2 className="text-xs font-black uppercase text-slate-400 mb-6 tracking-widest">Intervenant Officiel</h2>
              {selectedSubject.instructor ? (
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <img className="h-12 w-12 rounded-2xl" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSubject.instructor}`} alt="" />
                    <span className="font-black text-slate-900 uppercase text-sm">{selectedSubject.instructor}</span>
                  </div>
                  <button onClick={() => assignInstructor(null)} className="text-[10px] font-black uppercase text-red-500 hover:underline">Remplacer</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <input id="inst-name" className="w-full p-5 bg-slate-50 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500" placeholder="Nom du formateur..." />
                  <button onClick={() => assignInstructor(document.getElementById('inst-name').value)} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Assigner maintenant</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'students' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in slide-in-from-bottom-4">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-3xl text-orange-500">groups</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase mb-2">Import Promo {selectedSubject.promo}</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-8">Inscrire tous les étudiants de cette promotion.</p>
                <button className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-orange-100">Confirmer l'importation</button>
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <h3 className="text-xs font-black text-slate-900 uppercase mb-6 tracking-widest">Ajout individuel</h3>
                <div className="flex gap-2 mb-8">
                  <input id="student-name" className="flex-1 p-4 bg-slate-50 rounded-2xl border-none font-bold text-xs outline-none focus:ring-2 focus:ring-orange-500" placeholder="Nom de l'étudiant..." />
                  <button onClick={() => { addStudentManually(document.getElementById('student-name').value); document.getElementById('student-name').value = ""; }} className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined">person_add</span>
                  </button>
                </div>
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Inscrits ({selectedSubject.students.length})</p>
                  {selectedSubject.students.map((student, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                      <span className="text-[11px] font-bold text-slate-700 uppercase">{student}</span>
                      <button onClick={() => removeStudent(idx)} className="opacity-0 group-hover:opacity-100 text-red-400 transition-opacity">
                        <span className="material-symbols-outlined text-lg">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    );
  }

  // --- VUE GRILLE (ACCUEIL) ---
  return (
    <main className="flex-1 flex flex-col h-full bg-[#f8f7f5] p-10 overflow-y-auto">
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <form onSubmit={handleCreateSpace} className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-200">
            <h2 className="text-3xl font-black uppercase mb-8 tracking-tighter">Créer un <span className="text-orange-500">Espace</span></h2>
            <div className="space-y-5">
              <input name="title" required className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-orange-500" placeholder="NOM DE LA MATIÈRE" />
              <div className="grid grid-cols-2 gap-4">
                <select name="promo" className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold outline-none appearance-none"><option>SIL3</option><option>M1-DS</option></select>
                <select name="year" className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold outline-none appearance-none"><option>2025-2026</option></select>
              </div>
            </div>
            <div className="flex gap-4 mt-10">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 font-black uppercase text-[10px] text-slate-400">Annuler</button>
              <button type="submit" className="flex-[2] bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 transition-all">Créer l'espace</button>
            </div>
          </form>
        </div>
      )}

      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-6xl font-black text-slate-900 uppercase tracking-tighter">Espaces <span className="text-orange-500">Matières</span></h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] mt-2 tracking-[0.3em]">Portail de supervision • Directeur</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">search</span>
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-80 pl-14 pr-6 py-4 rounded-2xl border-none bg-white shadow-sm font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500/20" placeholder="Rechercher un module..." />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-orange-100 hover:scale-105 transition-all"><span className="material-symbols-outlined text-3xl">add</span></button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        {filteredSubjects.map(s => (
          <article key={s.id} onClick={() => { setSelectedSubject(s); setView('details'); }} className="group cursor-pointer bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
            <div className="flex justify-between items-start mb-8">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${s.instructor ? 'bg-green-500' : 'bg-slate-100'} text-white transition-colors duration-500`}><span className="material-symbols-outlined text-2xl">{s.instructor ? 'verified' : 'hourglass_empty'}</span></div>
              <span className="text-[9px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">{s.semester}</span>
            </div>
            <p className="text-[10px] font-black text-orange-500 uppercase mb-2 tracking-widest">{s.promo} • {s.year}</p>
            <h3 className="text-2xl font-black text-slate-900 uppercase leading-[1.1] mb-8 group-hover:text-orange-500 transition-colors">{s.title}</h3>
            <div className="pt-6 border-t border-slate-50 flex items-center gap-3">
              <img className="h-6 w-6 rounded-lg grayscale group-hover:grayscale-0" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.instructor || 'empty'}`} alt="" />
              <div className="flex flex-col"><span className="text-[9px] font-black uppercase text-slate-700">{s.instructor || "Non affecté"}</span><span className="text-[8px] text-slate-400 font-bold uppercase">{s.students?.length || 0} inscrits</span></div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
};

const WorkCard = ({ title, deadline, status }) => (
  <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between group-hover:border-orange-200 transition-colors h-full">
    <div>
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase border ${status === 'Terminé' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>{status}</span>
      </div>
      <h4 className="text-sm font-black text-slate-900 uppercase leading-tight mb-4 group-hover:text-orange-500 transition-colors">{title}</h4>
    </div>
    <div className="flex items-center gap-2 text-slate-400">
      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
      <span className="text-[9px] font-black uppercase tracking-widest">{deadline}</span>
    </div>
  </div>
);

const TabLink = ({ label, active, onClick, icon }) => (
  <button onClick={onClick} className={`flex items-center gap-2 pb-6 px-1 relative transition-all ${active ? 'text-orange-500' : 'text-slate-300 hover:text-slate-500'}`}>
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-[0.15em]">{label}</span>
    {active && <div className="absolute bottom-0 left-0 w-full h-1.5 bg-orange-500 rounded-t-full animate-in slide-in-from-left duration-300" />}
  </button>
);

export default SubjectSpaces;