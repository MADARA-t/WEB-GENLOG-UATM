import React, { useState, useMemo, useEffect } from 'react';
import api from '../services/api';

// --- COMPOSANTS INTERNES ---

const StatCard = ({ label, value, isPrimary = false }) => (
  <div className="flex flex-col items-end px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 transition-all duration-500 hover:shadow-md">
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
    <span className={`text-2xl font-black ${isPrimary ? 'text-orange-500' : 'text-slate-900'}`}>{value}</span>
  </div>
);

const PromotionCard = ({ promo, onClick, onRefresh, type = "active" }) => {
  const isArchived = type === "archived";
  const { title, year, campus, level, progress, status, icon, studentsCount } = promo;
  const [showOptions, setShowOptions] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la promotion "${title}" ?`)) {
      return;
    }

    try {
      await api.delete(`/promotions/${promo.id}`);
      alert('Promotion supprimée avec succès');
      onRefresh();
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression : ' + (error.response?.data?.message || error.message));
    }
  };

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
        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowOptions(!showOptions); }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined">more_horiz</span>
          </button>

          {showOptions && (
            <>
              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowOptions(false); }}></div>
              <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 overflow-hidden">
                <button 
                  onClick={handleDelete}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  <span className="text-xs font-bold uppercase">Supprimer</span>
                </button>
              </div>
            </>
          )}
        </div>
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
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [cohortStudents, setCohortStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [newPromo, setNewPromo] = useState({ title: "", year: "2025", campus: "", level: "", icon: "school" });

  useEffect(() => {
    fetchPromotions();
    fetchAvailableStudents();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/promotions');
      const adaptedPromotions = response.data.map(promo => ({
        id: promo.id,
        title: promo.name,
        year: promo.year,
        campus: "Paris",
        level: "Bachelor",
        progress: 50,
        status: new Date(promo.startDate) > new Date() ? "Rentrée" : "En cours",
        icon: "school",
        studentsCount: 0,
        backendData: promo
      }));
      setPromotions(adaptedPromotions);
    } catch (error) {
      console.error('Erreur chargement promotions:', error);
      alert('Erreur lors du chargement des promotions');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableStudents = async () => {
    try {
      const response = await api.get('/users');
      const students = response.data
        .filter(user => user.role === 'etudiant' && user.isActive)
        .map(user => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        }));
      setAvailableStudents(students);
    } catch (error) {
      console.error('Erreur chargement étudiants:', error);
    }
  };

  const fetchPromotionStudents = async (promotionId) => {
    try {
      const response = await api.get(`/student-promotions/promotion/${promotionId}`);
      const students = response.data.map(item => ({
        id: item.student.id,
        enrollmentId: item.id,
        name: `${item.student.firstName} ${item.student.lastName}`,
        email: item.student.email,
        joinedDate: new Date(item.enrollmentDate).toISOString().split('T')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.student.id}`
      }));
      setCohortStudents(students);
      setSelectedPromo(prev => ({ ...prev, studentsCount: students.length }));
      setPromotions(prev => prev.map(p => p.id === promotionId ? { ...p, studentsCount: students.length } : p));
    } catch (error) {
      console.error('Erreur chargement étudiants:', error);
      setCohortStudents([]);
    }
  };

  useEffect(() => {
    if (selectedPromo) {
      fetchPromotionStudents(selectedPromo.id);
    }
  }, [selectedPromo?.id]);

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

  const displayedStudents = useMemo(() => {
    let list = [...cohortStudents];
    if (studentSearch) {
      list = list.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()));
    }
    list.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "date") return new Date(b.joinedDate) - new Date(a.joinedDate);
      return 0;
    });
    return list;
  }, [cohortStudents, studentSearch, sortBy]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await api.post('/promotions', {
        name: newPromo.title,
        year: newPromo.year,
        startDate: `${newPromo.year}-01-01`,
        endDate: `${newPromo.year}-12-31`,
        createdBy: user.id
      });
      const createdPromo = {
        id: response.data.id,
        title: response.data.name,
        year: response.data.year,
        campus: newPromo.campus,
        level: newPromo.level,
        progress: 0,
        status: "Rentrée",
        icon: newPromo.icon,
        studentsCount: 0,
        backendData: response.data
      };
      setPromotions([createdPromo, ...promotions]);
      setIsFormOpen(false);
      setNewPromo({ title: "", year: "2025", campus: "", level: "", icon: "school" });
      alert('Promotion créée avec succès !');
    } catch (error) {
      console.error('Erreur création promotion:', error);
      alert('Erreur lors de la création : ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdatePromo = async () => {
    try {
      await api.patch(`/promotions/${selectedPromo.id}`, {
        name: selectedPromo.title,
      });
      setPromotions(promotions.map(p => p.id === selectedPromo.id ? selectedPromo : p));
      setIsEditing(false);
      alert('Promotion mise à jour avec succès !');
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) {
      alert('Veuillez sélectionner un étudiant');
      return;
    }

    try {
      await api.post('/student-promotions', {
        studentId: parseInt(selectedStudentId),
        promotionId: selectedPromo.id,
        enrollmentDate: new Date().toISOString()
      });
      
      alert('Étudiant ajouté avec succès !');
      setSelectedStudentId("");
      setIsAddingStudent(false);
      fetchPromotionStudents(selectedPromo.id);
    } catch (error) {
      console.error('Erreur ajout étudiant:', error);
      alert('Erreur lors de l\'ajout : ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRemoveStudent = async (enrollmentId, studentName) => {
    if (!window.confirm(`Retirer ${studentName} de cette promotion ?`)) {
      return;
    }

    try {
      await api.delete(`/student-promotions/${enrollmentId}`);
      alert('Étudiant retiré avec succès');
      fetchPromotionStudents(selectedPromo.id);
    } catch (error) {
      console.error('Erreur retrait étudiant:', error);
      alert('Erreur lors du retrait : ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-orange-500 animate-spin">progress_activity</span>
          <p className="mt-4 text-slate-500 font-bold">Chargement des promotions...</p>
        </div>
      </div>
    );
  }

  if (selectedPromo) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f8f7f5] p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="max-w-6xl mx-auto w-full">
          <button
            onClick={() => { setSelectedPromo(null); setIsEditing(false); setStudentSearch(""); setCohortStudents([]); }}
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
                  <StatCard label="Année" value={selectedPromo.year} />
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
                  <div>
                    <h3 className="text-sm font-black uppercase text-slate-900 flex items-center gap-2">
                      Membres de la cohorte
                      <span className="bg-slate-100 text-slate-400 px-2 py-0.5 rounded-md text-[10px]">{displayedStudents.length}</span>
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
                  <form onSubmit={handleAddStudent} className="mb-6 p-4 bg-orange-50 rounded-2xl border border-orange-100 animate-in slide-in-from-top-2">
                    <div className="flex gap-3">
                      <select 
                        required
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        className="flex-1 bg-white border-none rounded-xl px-4 text-xs font-bold"
                      >
                        <option value="">-- Sélectionner un étudiant --</option>
                        {availableStudents
                          .filter(student => !cohortStudents.find(cs => cs.id === student.id))
                          .map(student => (
                            <option key={student.id} value={student.id}>
                              {student.name} ({student.email})
                            </option>
                          ))
                        }
                      </select>
                      <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">
                        Ajouter
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { setIsAddingStudent(false); setSelectedStudentId(""); }}
                        className="bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase"
                      >
                        Annuler
                      </button>
                    </div>
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
                      {displayedStudents.map((student) => (
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
                            <button 
                              onClick={() => handleRemoveStudent(student.enrollmentId, student.name)}
                              className="text-slate-300 hover:text-red-500 transition-colors"
                              title="Retirer de la promotion"
                            >
                              <span className="material-symbols-outlined text-lg">person_remove</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {displayedStudents.length === 0 && (
                    <div className="py-20 text-center text-slate-300 text-xs font-bold uppercase tracking-widest">
                      Aucun étudiant dans cette promotion
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
                    <option value="2026">2026</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Campus</label>
                  <input required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" placeholder="Paris" value={newPromo.campus} onChange={(e) => setNewPromo({ ...newPromo, campus: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Niveau</label>
                <input required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" placeholder="Bachelor 3" value={newPromo.level} onChange={(e) => setNewPromo({ ...newPromo, level: e.target.value })} />
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
            <input 
              className="w-full bg-transparent border-none text-slate-900 placeholder-slate-300 focus:ring-0 text-xs font-bold uppercase" 
              placeholder="Rechercher une promotion" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <button 
            onClick={() => setIsFormOpen(true)} 
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-black text-[11px] uppercase tracking-widest shadow-lg transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">add_circle</span> Nouvelle Promotion
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {filteredPromotions.map((promo) => (
            <PromotionCard 
              key={promo.id} 
              promo={promo} 
              onClick={(p) => setSelectedPromo(p)}
              onRefresh={fetchPromotions}
            />
          ))}
          
          <button 
            onClick={() => setIsFormOpen(true)} 
            className="flex flex-col items-center justify-center min-h-[350px] rounded-[2rem] border-4 border-dashed border-slate-200 hover:border-orange-500 hover:bg-orange-50/30 transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-orange-500 group-hover:text-white text-orange-500 flex items-center justify-center mb-6 transition-all duration-500">
              <span className="material-symbols-outlined text-4xl">add</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Nouvelle Promotion</h3>
            <p className="text-sm text-slate-400 font-medium text-center px-12 italic">Créer une nouvelle cohorte pour l'année académique.</p>
          </button>
        </div>

        {filteredPromotions.length === 0 && !loading && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-slate-200">school_off</span>
            <p className="mt-4 text-slate-400 font-bold">Aucune promotion trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}