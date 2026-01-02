import React, { useState, useMemo } from 'react';

const SubjectSpaces = () => {
  // --- ÉTATS ---
  const [view, setView] = useState('grid');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  
  const [subjects, setSubjects] = useState([
    { id: 1, title: "Introduction au Design UI", instructor: "Sophie Martin", promo: "Promo 2024", students: 24, img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop" },
    { id: 2, title: "Développement Front-End", instructor: "Marc Dubois", promo: "Promo 2024", students: 18, img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop" },
    { id: 3, title: "UX Research & Testing", instructor: "Sarah Connor", promo: "Promo 2025", students: 32, img: "https://images.unsplash.com/photo-1586717791821-3f44a563cc4c?q=80&w=800&auto=format&fit=crop" },
    { id: 4, title: "Algorithmique Avancée", instructor: "Jean Valjean", promo: "Promo 2024", students: 15, img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop" },
    { id: 5, title: "Marketing Digital", instructor: "Emily Blunt", promo: "Promo 2025", students: 45, img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop" },
  ]);

  // --- LOGIQUE ---
  const filteredSubjects = useMemo(() => {
    return subjects.filter(s => 
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, subjects]);

  const handleEnterDetails = (subject) => {
    setSelectedSubject(subject);
    setView('details');
    setActiveTab('content');
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Voulez-vous vraiment supprimer l'espace "${title}" ?`)) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const handleSaveSubject = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const subjectData = {
      title: formData.get('title'),
      instructor: formData.get('instructor'),
      promo: formData.get('promo'),
      students: editingSubject ? editingSubject.students : 0,
      img: editingSubject ? editingSubject.img : "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800"
    };

    if (editingSubject) {
      setSubjects(subjects.map(s => s.id === editingSubject.id ? { ...subjectData, id: s.id } : s));
    } else {
      setSubjects([...subjects, { ...subjectData, id: Date.now() }]);
    }
    
    setIsModalOpen(false);
    setEditingSubject(null);
  };

  // --- VUE DÉTAILS ---
  if (view === 'details' && selectedSubject) {
    return (
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f8f7f5] antialiased animate-in fade-in duration-300">
        <header className="w-full px-8 pt-8 bg-white border-b border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setView('grid')} 
                className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{selectedSubject.promo}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: MAT-{selectedSubject.id}</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">{selectedSubject.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <img className="h-10 w-10 rounded-xl object-cover" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSubject.instructor}`} alt="" />
              <div>
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Intervenant</p>
                <p className="text-sm font-bold text-slate-700">{selectedSubject.instructor}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-10 px-2">
            <TabLink label="Contenu & Cours" active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon="menu_book" />
            <TabLink label="Livrables & Travaux" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} icon="assignment_turned_in" />
            <TabLink label="Étudiants & Notes" active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon="group" />
          </div>
        </header>

        <section className="p-8 max-w-[1400px] mx-auto w-full">
          {activeTab === 'content' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-300">
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">Modules d'apprentissage</h2>
                  <div className="space-y-4">
                    <ModuleItem title="01. Introduction au module" type="Théorie" duration="2h" completed />
                    <ModuleItem title="02. Ateliers et Pratique" type="Pratique" duration="4h" active />
                    <ModuleItem title="03. Étude de cas final" type="Projet" duration="3h" />
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Ressources (US 5.1)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FileCard name="Support_Pedagogique.pdf" ext="PDF" size="4.2 MB" />
                    <FileCard name="Assets_Travail.zip" ext="ZIP" size="28 MB" />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-4">Annonce</h3>
                  <p className="text-sm font-medium text-slate-300 text-pretty">"N'oubliez pas de consulter les ressources avant le cours de demain."</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-300">
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="bg-orange-500 p-10 text-white">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase mb-4 inline-block">US 5.3 - Espace de rendu</span>
                  <h2 className="text-3xl font-black uppercase">Dépôt du Devoir Final</h2>
                  <p className="text-orange-100 text-sm font-bold uppercase mt-2">Échéance : 28 Décembre 2025 • 23:59</p>
                </div>
                <div className="p-10">
                  <div className="border-4 border-dashed border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-orange-50 transition-all cursor-pointer group">
                    <span className="material-symbols-outlined text-4xl text-orange-500 mb-4">upload_file</span>
                    <p className="text-sm font-black text-slate-900 uppercase">Glissez votre travail ici</p>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button className="h-14 px-10 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg">Envoyer mon rendu</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Gestion des notes & Suivi</h2>
                  <p className="text-sm font-bold text-slate-900 uppercase">Promotion {selectedSubject.promo} ({selectedSubject.students} inscrits)</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-colors">
                  <span className="material-symbols-outlined text-sm">download</span>
                  Exporter CSV
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Étudiant</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut Rendu</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Note / 20</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[...Array(8)].map((_, i) => (
                      <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                            <img className="h-9 w-9 rounded-xl bg-slate-100" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=student${i}`} alt="" />
                            <span className="text-sm font-bold text-slate-700 uppercase">Étudiant {i + 1}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                            i % 3 === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                          }`}>
                            {i % 3 === 0 ? 'Rendu' : 'En attente'}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <input 
                            type="number" 
                            placeholder="--" 
                            className="w-16 h-10 bg-slate-50 border-none rounded-xl text-center font-black text-slate-900 focus:ring-2 focus:ring-orange-500 outline-none"
                          />
                        </td>
                        <td className="px-8 py-4 text-right">
                          <button className="h-9 w-9 rounded-xl inline-flex items-center justify-center text-slate-400 hover:bg-white hover:text-orange-500 hover:shadow-sm transition-all">
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f8f7f5] scroll-smooth antialiased relative">
      {/* MODALE */}
      {(isModalOpen || editingSubject) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <form onSubmit={handleSaveSubject} className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-3xl font-black uppercase mb-8">
              {editingSubject ? 'Modifier' : 'Créer'} <span className="text-orange-500">l'Espace</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Nom de la matière</label>
                <input name="title" defaultValue={editingSubject?.title} required className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Ex: Design System" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Formateur Responsable</label>
                <input name="instructor" defaultValue={editingSubject?.instructor} required className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Nom du formateur" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Promotion Cible</label>
                <select name="promo" defaultValue={editingSubject?.promo} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none appearance-none">
                  <option>Promo 2024</option>
                  <option>Promo 2025</option>
                  <option>Promo 2026</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-10">
              <button type="button" onClick={() => { setIsModalOpen(false); setEditingSubject(null); }} className="flex-1 py-4 font-black uppercase text-xs text-slate-400 hover:text-slate-600 transition-colors">Annuler</button>
              <button type="submit" className="flex-1 bg-orange-500 text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all">Enregistrer</button>
            </div>
          </form>
        </div>
      )}

      {/* Header Section */}
      <header className="w-full px-8 pt-8 pb-6 flex flex-col gap-6">
        <nav className="flex mb-10 items-center gap-2 text-sm font-medium">
          <a className="text-[#f97415] hover:text-[#e0630b] transition-colors" href="#">Madara</a>
          <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
          <a className="text-[#f97415] hover:text-[#e0630b] transition-colors" href="#">Pédagogie</a>
          <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
          <span className="text-slate-500">Espaces de matières</span>
        </nav>
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight">
            Espaces de <span className="text-orange-500">Matières</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-3xl leading-relaxed font-medium">
            Gérez les environnements pédagogiques et assignez des formateurs.
          </p>
        </div>
      </header>

      {/* Toolbar */}
      <section className="px-8 pb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
            <div className="relative group w-full md:w-80">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">search</span>
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 h-12 rounded-full border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm transition-all outline-none text-sm" 
                placeholder="Rechercher une matière..." 
                type="text"
              />
            </div>
            <div className="flex gap-2">
              <FilterButton label="Formateur" />
              <FilterButton label="Promotion" />
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold tracking-wide text-sm shadow-lg shadow-orange-200 transition-all hover:scale-105 active:scale-95 w-full lg:w-auto uppercase"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>Créer un espace</span>
          </button>
        </div>
      </section>

      {/* Grid Content */}
      <section className="px-8 pb-12 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredSubjects.map((subject) => (
            <SubjectCard 
              key={subject.id} 
              data={subject} 
              onDelete={() => handleDelete(subject.id, subject.title)}
              onEdit={() => setEditingSubject(subject)}
              onView={() => handleEnterDetails(subject)}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

// --- SOUS-COMPOSANTS ---

const TabLink = ({ label, active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 pb-6 px-2 transition-all relative group ${active ? 'text-orange-500' : 'text-slate-400 hover:text-slate-600'}`}
  >
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
    <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    {active && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-full"></div>}
  </button>
);

const ModuleItem = ({ title, type, duration, active, completed }) => (
  <div className={`p-5 rounded-3xl flex items-center justify-between border-2 transition-all ${active ? 'border-orange-100 bg-orange-50/30' : 'border-transparent bg-slate-50/50'}`}>
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${completed ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-orange-500 shadow-sm'}`}>
        <span className="material-symbols-outlined text-[20px]">{completed ? 'check_circle' : 'play_circle'}</span>
      </div>
      <div>
        <h4 className="text-sm font-black uppercase text-slate-900">{title}</h4>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{type} • {duration}</p>
      </div>
    </div>
    {active && <span className="px-3 py-1 bg-orange-500 text-white text-[9px] font-black uppercase rounded-lg">En cours</span>}
  </div>
);

const FileCard = ({ name, size }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-orange-200 transition-all cursor-pointer group">
    <div className="flex items-center gap-4">
      <span className="material-symbols-outlined text-orange-500">download</span>
      <span className="text-xs font-bold text-slate-800 uppercase">{name}</span>
    </div>
    <span className="text-[9px] font-black text-slate-300 uppercase">{size}</span>
  </div>
);

const FilterButton = ({ label }) => (
  <button className="flex items-center gap-2 h-12 px-5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-orange-500 hover:text-orange-500 transition-all shadow-sm group">
    <span className="text-[10px] font-black tracking-widest uppercase">{label}</span>
    <span className="material-symbols-outlined text-slate-400 group-hover:text-orange-500 text-[20px]">expand_more</span>
  </button>
);

const SubjectCard = ({ data, onDelete, onEdit, onView }) => {
  const instructorAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.instructor)}`;
  return (
    <article 
      onClick={onView}
      className="group cursor-pointer flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 border border-slate-100"
    >
      <div className="h-40 w-full bg-slate-100 relative overflow-hidden">
        <img src={data.img} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" alt={data.title} />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-white/50 shadow-sm">
          <span className="text-[10px] font-black text-slate-900 tracking-widest uppercase">{data.promo}</span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1 gap-4">
        <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-orange-500 transition-colors">{data.title}</h3>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white shadow-sm">
            <img className="h-full w-full object-cover" src={instructorAvatar} alt={data.instructor} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Formateur</span>
            <span className="text-sm font-bold text-slate-700">{data.instructor}</span>
          </div>
        </div>
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-[20px]">groups</span>
            <span className="text-xs font-bold uppercase tracking-wide">{data.students} Étudiants</span>
          </div>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <IconButton icon="visibility" title="Consulter" onClick={onView} />
            <IconButton icon="edit" title="Modifier" onClick={onEdit} />
            <IconButton icon="delete" title="Supprimer" onClick={onDelete} danger />
          </div>
        </div>
      </div>
    </article>
  );
};

const IconButton = ({ icon, title, danger, onClick }) => (
  <button 
    onClick={onClick}
    className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
      danger ? 'text-slate-400 hover:bg-red-50 hover:text-red-500' : 'text-slate-400 hover:bg-orange-50 hover:text-orange-500'
    }`} 
    title={title}
  >
    <span className="material-symbols-outlined text-[18px]">{icon}</span>
  </button>
);

export default SubjectSpaces;