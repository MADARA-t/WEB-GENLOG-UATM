import React, { useState, useMemo } from 'react';

// --- COMPOSANTS INTERNES ---

const StatCard = ({ label, value, isPrimary = false }) => (
  <div className="flex flex-col items-end px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 transition-all duration-500 hover:shadow-md">
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
    <span className={`text-2xl font-black ${isPrimary ? 'text-orange-500' : 'text-slate-900'}`}>{value}</span>
  </div>
);

const PromotionCard = ({ promo, onClick, type = "active" }) => {
  const isArchived = type === "archived";
  const { title, year, campus, level, progress, status, icon, studentsCount } = promo;

  return (
    <div
      onClick={() => onClick(promo)}
      className={`group relative flex flex-col bg-white rounded-[2rem] p-8 shadow-sm border border-transparent transition-all duration-300 hover:-translate-y-1 cursor-pointer ${isArchived
        ? 'opacity-75 hover:opacity-100 bg-slate-50/50'
        : 'hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-100'
        }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isArchived ? 'bg-slate-200 text-slate-500' : 'bg-orange-50 text-orange-500'}`}>
          <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${status === 'En cours' ? 'bg-green-100 text-green-700' :
            status === 'Rentrée' ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'
            }`}>
            {status}
          </span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{year}</span>
        </div>
        <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2 uppercase">{title}</h3>
        <p className="text-sm text-slate-500 font-medium">{level} • {campus}</p>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-100">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Progression cohorte</span>
          <span className="text-sm font-black text-slate-900">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-orange-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${title}${i}`}
                className="w-8 h-8 rounded-full border-2 border-white bg-slate-100"
                alt="student"
              />
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
              +{studentsCount}
            </div>
          </div>
          <span className="text-orange-500 text-sm font-black uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
            Détails <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </span>
        </div>
      </div>
    </div>
  );
};

// --- COMPOSANT PRINCIPAL ---

export default function Promotions() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState('Tous');

  // États pour la simulation de modification/ajout
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  
  // États de tri et recherche internes à la cohorte
  const [studentSearch, setStudentSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const [promotions, setPromotions] = useState([
    { id: 1, title: "Dev. Fullstack", year: "2024", campus: "Paris", level: "Bachelor 3", progress: 78, status: "En cours", icon: "terminal", studentsCount: 12 },
    { id: 2, title: "Design Graphique", year: "2024", campus: "Lyon", level: "Master 1", progress: 45, status: "En cours", icon: "brush", studentsCount: 8 },
    { id: 3, title: "Marketing Digital", year: "2025", campus: "Paris", level: "Bachelor 1", progress: 12, status: "Rentrée", icon: "campaign", studentsCount: 15 },
    { id: 4, title: "Data Science", year: "2024", campus: "Bordeaux", level: "Master 2", progress: 92, status: "En cours", icon: "database", studentsCount: 6 },
  ]);

  const studentNames = ["Marc Aurele", "Sonia Backes", "Jean Dupont", "Lucie Bernard", "Kevin Vasseur", "Amélie Petit", "Thomas Wright", "Julie Durand", "Yassine Bel", "Chloé Fontaine"];

  const [newPromo, setNewPromo] = useState({ title: "", year: "2025", campus: "", level: "", icon: "school" });

  const filteredPromotions = useMemo(() => {
    return promotions.filter(promo => {
      const matchSearch = promo.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchYear = yearFilter === 'Tous' || promo.year === yearFilter;
      return matchSearch && matchYear;
    });
  }, [searchTerm, yearFilter, promotions]);

  const totalStudents = useMemo(() =>
    filteredPromotions.reduce((acc, curr) => acc + curr.studentsCount, 0).toLocaleString(),
    [filteredPromotions]
  );

  const cohortStudents = useMemo(() => {
    if (!selectedPromo) return [];
    
    let list = Array.from({ length: selectedPromo.studentsCount }, (_, i) => ({
      id: i,
      name: studentNames[i % studentNames.length] + (i > 9 ? ` ${i}` : ""),
      email: `student.${i}@ecole.fr`,
      joinedDate: `2024-09-${(i % 28) + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPromo.id}-${i}`
    }));

    if (studentSearch) {
      list = list.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()));
    }

    list.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "date") return new Date(b.joinedDate) - new Date(a.joinedDate);
      return 0;
    });

    return list;
  }, [selectedPromo, studentSearch, sortBy]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const createdPromo = { ...newPromo, id: Date.now(), progress: 0, status: "Rentrée", studentsCount: 0 };
    setPromotions([createdPromo, ...promotions]);
    setIsFormOpen(false);
    setNewPromo({ title: "", year: "2025", campus: "", level: "", icon: "school" });
  };

  const handleUpdatePromo = () => {
    setPromotions(promotions.map(p => p.id === selectedPromo.id ? selectedPromo : p));
    setIsEditing(false);
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudentName) return;
    const updated = { ...selectedPromo, studentsCount: selectedPromo.studentsCount + 1 };
    setSelectedPromo(updated);
    setPromotions(promotions.map(p => p.id === selectedPromo.id ? updated : p));
    setNewStudentName("");
    setIsAddingStudent(false);
  };

  if (selectedPromo) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f8f7f5] p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="max-w-6xl mx-auto w-full">
          <button
            onClick={() => { setSelectedPromo(null); setIsEditing(false); setStudentSearch(""); }}
            className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] mb-8 hover:text-orange-500 transition-colors"
          >
            <span className="material-symbols-outlined !text-sm">arrow_back</span> Retour à la liste
          </button>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-10 border-b border-slate-50 bg-slate-50/30">
              <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="flex gap-6 items-center">
                  <div className="w-16 h-16 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-3xl">{selectedPromo.icon}</span>
                  </div>
                  <div>
                    {isEditing ? (
                      <input
                        className="text-3xl font-black text-slate-900 uppercase tracking-tighter border-b-2 border-orange-500 focus:outline-none bg-transparent"
                        value={selectedPromo.title}
                        onChange={(e) => setSelectedPromo({ ...selectedPromo, title: e.target.value })}
                      />
                    ) : (
                      <>
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">{selectedPromo.title}</h2>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-[9px] font-black uppercase">{selectedPromo.status}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Session {selectedPromo.year}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <StatCard label="Effectif" value={selectedPromo.studentsCount} isPrimary />
                  <StatCard label="Moyenne" value="14.5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4">
              <div className="p-8 border-r border-slate-100 space-y-8">
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Configuration</h4>
                    {isEditing && (
                      <button onClick={handleUpdatePromo} className="text-green-600 material-symbols-outlined text-sm">check_circle</button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Campus</p>
                      {isEditing ? (
                        <input className="text-xs font-bold text-slate-900 border-b w-full" value={selectedPromo.campus} onChange={(e) => setSelectedPromo({ ...selectedPromo, campus: e.target.value })} />
                      ) : (
                        <p className="text-xs font-bold text-slate-900">{selectedPromo.campus}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Niveau</p>
                      {isEditing ? (
                        <input className="text-xs font-bold text-slate-900 border-b w-full" value={selectedPromo.level} onChange={(e) => setSelectedPromo({ ...selectedPromo, level: e.target.value })} />
                      ) : (
                        <p className="text-xs font-bold text-slate-900">{selectedPromo.level}</p>
                      )}
                    </div>
                  </div>
                </section>

                <div className="pt-6 border-t border-slate-50 space-y-3">
                  <button onClick={() => setIsEditing(!isEditing)} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-200 transition-all">
                    <span className="material-symbols-outlined text-sm">{isEditing ? "close" : "edit"}</span> {isEditing ? "Annuler" : "Modifier"}
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 rounded-xl text-[10px] font-black uppercase text-white hover:bg-orange-600 transition-all">
                    <span className="material-symbols-outlined text-sm">download</span> Export CSV
                  </button>
                </div>
              </div>

              <div className="lg:col-span-3 p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  {/* AJOUT : Compteur d'étudiants dans le titre de la section */}
                  <div>
                    <h3 className="text-sm font-black uppercase text-slate-900 flex items-center gap-2">
                      Membres de la cohorte
                      <span className="bg-slate-100 text-slate-400 px-2 py-0.5 rounded-md text-[10px]">{cohortStudents.length}</span>
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Liste officielle des inscrits</p>
                  </div>

                  <div className="flex flex-1 md:justify-end items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none md:w-64">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-lg">search</span>
                      <input 
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold placeholder-slate-300 focus:ring-1 focus:ring-orange-500"
                        placeholder="Chercher..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                      />
                    </div>
                    <select 
                      className="bg-transparent border-none text-[10px] font-black uppercase text-slate-400 focus:ring-0 cursor-pointer"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name">Nom</option>
                      <option value="date">Date</option>
                    </select>
                    <button 
                      onClick={() => setIsAddingStudent(!isAddingStudent)}
                      className="bg-orange-500 text-white p-2 rounded-lg flex items-center hover:bg-orange-600 transition-all"
                    >
                      <span className="material-symbols-outlined">person_add</span>
                    </button>
                  </div>
                </div>

                {isAddingStudent && (
                  <form onSubmit={handleAddStudent} className="mb-6 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-3 animate-in slide-in-from-top-2">
                    <input autoFocus placeholder="Nom complet..." className="flex-1 bg-white border-none rounded-xl px-4 text-xs font-bold" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} />
                    <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Ajouter</button>
                  </form>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-50">
                        <th className="pb-4 text-[10px] font-black uppercase text-slate-400">Étudiant</th>
                        <th className="pb-4 text-[10px] font-black uppercase text-slate-400">Contact</th>
                        <th className="pb-4 text-[10px] font-black uppercase text-slate-400">Arrivée</th>
                        <th className="pb-4 text-[10px] font-black uppercase text-slate-400 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {cohortStudents.map((student) => (
                        <tr key={student.id} className="group hover:bg-slate-50/50 transition-all">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <img src={student.avatar} className="w-8 h-8 rounded-full border border-slate-200 bg-white" alt="" />
                              <span className="text-xs font-bold text-slate-900">{student.name}</span>
                            </div>
                          </td>
                          <td className="py-4 text-[11px] font-medium text-slate-400">{student.email}</td>
                          <td className="py-4 text-[11px] font-bold text-slate-500">{student.joinedDate}</td>
                          <td className="py-4 text-right">
                            <button className="text-slate-300 hover:text-orange-500 transition-colors">
                              <span className="material-symbols-outlined text-lg">more_vert</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {cohortStudents.length === 0 && (
                    <div className="py-20 text-center text-slate-300 text-xs font-bold uppercase tracking-widest">
                      Aucun étudiant trouvé
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f8f7f5] scrollbar-hide">
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Nouvelle <span className="text-orange-500">Promotion</span></h2>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Titre</label>
                <input required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange-500" placeholder="ex: Bachelor Design" value={newPromo.title} onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Année</label>
                  <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" value={newPromo.year} onChange={(e) => setNewPromo({ ...newPromo, year: e.target.value })}>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Campus</label>
                  <input required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" placeholder="Paris" value={newPromo.campus} onChange={(e) => setNewPromo({ ...newPromo, campus: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="w-full bg-orange-500 text-white font-black uppercase py-4 rounded-2xl shadow-xl shadow-orange-200 mt-4 active:scale-95 transition-all">
                Créer la cohorte
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="px-8 lg:px-12 py-8 max-w-[1440px] mx-auto w-full">
        <nav className="flex mb-10 items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <a className="text-orange-500" href="#">Madara</a>
          <span className="material-symbols-outlined text-slate-400 !text-xs">chevron_right</span>
          <span className="text-slate-400">Gestion des promotions</span>
        </nav>

        <header className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-12">
          <div>
            <h1 className="text-slate-900 text-5xl font-black tracking-tighter leading-none mb-6 uppercase">
              Gestion des <br /><span className="text-orange-500">Promotions</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-xl">
              Administrez les cohortes, gérez les inscriptions et suivez la progression académique.
            </p>
          </div>
          <div className="flex gap-4">
            <StatCard label="Total Étudiants" value={totalStudents} />
            <StatCard label="Promotions" value={filteredPromotions.length} isPrimary />
          </div>
        </header>

        <div className="flex flex-col lg:flex-row items-center gap-4 mb-12 bg-white p-2 pr-4 rounded-full shadow-sm border border-slate-100">
          <div className="flex items-center flex-1 w-full pl-6">
            <span className="material-symbols-outlined text-slate-300 mr-3">search</span>
            <input className="w-full bg-transparent border-none text-slate-900 placeholder-slate-300 focus:ring-0 text-xs font-bold uppercase" placeholder="Rechercher une promotion" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-black text-[11px] uppercase tracking-widest shadow-lg transition-all active:scale-95">
            <span className="material-symbols-outlined">add_circle</span> Nouvelle Promotion
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {filteredPromotions.map((promo) => (
            <PromotionCard key={promo.id} promo={promo} onClick={(p) => setSelectedPromo(p)} />
          ))}
          <button onClick={() => setIsFormOpen(true)} className="flex flex-col items-center justify-center min-h-[350px] rounded-[2rem] border-4 border-dashed border-slate-200 hover:border-orange-500 hover:bg-orange-50/30 transition-all group">
            <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-orange-500 group-hover:text-white text-orange-500 flex items-center justify-center mb-6 transition-all duration-500">
              <span className="material-symbols-outlined text-4xl">add</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Nouvelle Promotion</h3>
            <p className="text-sm text-slate-400 font-medium text-center px-12 italic">Créer une nouvelle cohorte pour l'année académique.</p>
          </button>
        </div>
      </div>
    </div>
  );
}