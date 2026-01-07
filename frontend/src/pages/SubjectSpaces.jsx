import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';

// --- COMPOSANTS INTERNES ---

const StatCard = ({ label, value, isPrimary = false }) => (
  <div className="flex flex-col items-end px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 transition-all duration-500 hover:shadow-md">
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
    <span className={`text-2xl font-black ${isPrimary ? 'text-orange-500' : 'text-slate-900'}`}>{value}</span>
  </div>
);

const SubjectCard = ({ subject, onClick }) => (
  <div
    onClick={() => onClick(subject)}
    className="group relative flex flex-col bg-white rounded-[2rem] p-8 shadow-sm border border-transparent transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-100"
  >
    <div className="flex justify-between items-start mb-6">
      <div className="w-14 h-14 rounded-full flex items-center justify-center bg-orange-50 text-orange-500">
        <span className="material-symbols-outlined text-3xl">auto_stories</span>
      </div>
      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-700">
        Actif
      </span>
    </div>

    <div className="mb-6">
      <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2 uppercase">{subject.title}</h3>
      <p className="text-sm text-slate-500 font-medium">{subject.promo}</p>
      <p className="text-xs text-slate-400 font-medium mt-1">👨‍🏫 {subject.instructor}</p>
    </div>

    <div className="mt-auto pt-6 border-t border-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <img
              key={i}
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${subject.id}${i}`}
              className="w-8 h-8 rounded-full border-2 border-white bg-slate-100"
              alt="student"
            />
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
            +{subject.students}
          </div>
        </div>
        <span className="text-orange-500 text-sm font-black uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
          Entrer <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </span>
      </div>
    </div>
  </div>
);

const SubjectSpaces = () => {
  const [subjects, setSubjects] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('grid');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPromo, setSelectedPromo] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [activeTab, setActiveTab] = useState('content');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const resSpaces = await api.get('/pedagogical-spaces');
        setSubjects(resSpaces.data.map(s => ({
          id: s.id,
          title: s.name,
          promo: s.promotion?.name || 'Non définie',
          promoId: s.promotionId,
          instructor: s.formateur ? `${s.formateur.firstName} ${s.formateur.lastName}` : 'Non assigné',
          formateurId: s.formateurId,
          students: s.studentsCount || 0,
          img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.id}`,
        })));

        const resPromos = await api.get('/promotions');
        setPromotions(resPromos.data);

        const resInstructors = await api.get('/users?role=formateur');
        setInstructors(resInstructors.data.map(u => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName}`
        })));

      } catch (err) {
        setError('Impossible de charger les données.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSubjects = useMemo(() => {
    return subjects.filter(s =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedPromo || s.promoId === parseInt(selectedPromo)) &&
      (!selectedInstructor || s.formateurId === parseInt(selectedInstructor))
    );
  }, [subjects, searchTerm, selectedPromo, selectedInstructor]);

  const handleEnterDetails = (subject) => {
    setSelectedSubject(subject);
    setView('details');
    setActiveTab('content');
    fetchStudents(subject.id);
  };

  const fetchStudents = async (spaceId) => {
    try {
      const res = await api.get(`/space_students?spaceId=${spaceId}`);
      setSelectedSubject(prev => ({
        ...prev,
        studentsList: res.data.map(s => ({
          id: s.student.id,
          name: `${s.student.firstName} ${s.student.lastName}`,
          joinedAt: s.joinedAt,
        }))
      }));
    } catch (err) {
      console.error('Erreur chargement étudiants', err);
    }
  };

  const handleSaveSubject = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const subjectData = {
      name: formData.get('title'),
      promotionId: parseInt(formData.get('promoId')),
      formateurId: parseInt(formData.get('instructorId')),
    };

    try {
      if (editingSubject) {
        await api.patch(`/pedagogical-spaces/${editingSubject.id}`, subjectData);
      } else {
        await api.post('/pedagogical-spaces', subjectData);
      }

      const res = await api.get('/pedagogical-spaces');
      setSubjects(res.data.map(s => ({
        id: s.id,
        title: s.name,
        promo: s.promotion?.name || 'Non définie',
        promoId: s.promotionId,
        instructor: s.formateur ? `${s.formateur.firstName} ${s.formateur.lastName}` : 'Non assigné',
        formateurId: s.formateurId,
        students: s.studentsCount || 0,
        img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.id}`,
      })));

      setIsModalOpen(false);
      setEditingSubject(null);
      alert('Espace pédagogique sauvegardé avec succès !');

    } catch (err) {
      alert('Erreur lors de la sauvegarde');
      console.error(err);
    }
  };

  const renderGrid = () => (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f8f7f5] scrollbar-hide">
      <div className="px-8 lg:px-12 py-8 max-w-[1440px] mx-auto w-full">
        <nav className="flex mb-10 items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <a className="text-orange-500" href="#">Madara</a>
          <span className="material-symbols-outlined text-slate-400 !text-xs">chevron_right</span>
          <span className="text-slate-400">Espaces Pédagogiques</span>
        </nav>

        <header className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-12">
          <div>
            <h1 className="text-slate-900 text-5xl font-black tracking-tighter leading-none mb-6 uppercase">
              Espaces <br /><span className="text-orange-500">Pédagogiques</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-xl">
              Gérez les matières, formateurs et contenus pédagogiques de votre établissement.
            </p>
          </div>
          <div className="flex gap-4">
            <StatCard label="Total Espaces" value={subjects.length} isPrimary />
            <StatCard label="Formateurs" value={instructors.length} />
          </div>
        </header>

        <div className="flex flex-col lg:flex-row items-center gap-4 mb-12 bg-white p-2 pr-4 rounded-full shadow-sm border border-slate-100">
          <div className="flex items-center flex-1 w-full pl-6">
            <span className="material-symbols-outlined text-slate-300 mr-3">search</span>
            <input 
              className="w-full bg-transparent border-none text-slate-900 placeholder-slate-300 focus:ring-0 text-xs font-bold uppercase" 
              placeholder="Rechercher un espace" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-black text-[11px] uppercase tracking-widest shadow-lg transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">add_circle</span> Nouvel Espace
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {filteredSubjects.map((subject) => (
            <SubjectCard 
              key={subject.id} 
              subject={subject} 
              onClick={handleEnterDetails}
            />
          ))}
          
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex flex-col items-center justify-center min-h-[350px] rounded-[2rem] border-4 border-dashed border-slate-200 hover:border-orange-500 hover:bg-orange-50/30 transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-orange-500 group-hover:text-white text-orange-500 flex items-center justify-center mb-6 transition-all duration-500">
              <span className="material-symbols-outlined text-4xl">add</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Nouvel Espace</h3>
            <p className="text-sm text-slate-400 font-medium text-center px-12 italic">Créer un nouvel espace pédagogique</p>
          </button>
        </div>

        {filteredSubjects.length === 0 && !loading && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-slate-200">auto_stories</span>
            <p className="mt-4 text-slate-400 font-bold">Aucun espace pédagogique trouvé</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderDetails = () => {
    if (!selectedSubject) return null;

    return (
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f8f7f5] p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="max-w-6xl mx-auto w-full">
          <button
            onClick={() => { setView('grid'); setSelectedSubject(null); }}
            className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] mb-8 hover:text-orange-500 transition-colors"
          >
            <span className="material-symbols-outlined !text-sm">arrow_back</span> Retour à la liste
          </button>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-10 border-b border-slate-50 bg-slate-50/30">
              <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="flex gap-6 items-center">
                  <div className="w-16 h-16 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-3xl">auto_stories</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">{selectedSubject.title}</h2>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-black uppercase">Actif</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedSubject.promo}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <StatCard label="Étudiants" value={selectedSubject.students} isPrimary />
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                    activeTab === 'content'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm mr-2">description</span>
                  Contenu
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                    activeTab === 'tasks'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm mr-2">task</span>
                  Tâches
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                    activeTab === 'students'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm mr-2">groups</span>
                  Étudiants
                </button>
              </div>

              {activeTab === 'students' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-50">
                        <th className="pb-4 text-[10px] font-black uppercase text-slate-400">Étudiant</th>
                        <th className="pb-4 text-[10px] font-black uppercase text-slate-400">Date d'inscription</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {(selectedSubject.studentsList || []).map((s) => (
                        <tr key={s.id} className="group hover:bg-slate-50/50 transition-all">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.id}`} 
                                className="w-8 h-8 rounded-full border border-slate-200 bg-white" 
                                alt="" 
                              />
                              <span className="text-xs font-bold text-slate-900">{s.name}</span>
                            </div>
                          </td>
                          <td className="py-4 text-[11px] font-bold text-slate-500">
                            {new Date(s.joinedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(!selectedSubject.studentsList || selectedSubject.studentsList.length === 0) && (
                    <div className="py-20 text-center text-slate-300 text-xs font-bold uppercase tracking-widest">
                      Aucun étudiant inscrit
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'content' && (
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                  <p className="text-slate-600 text-center">Le contenu pédagogique sera affiché ici...</p>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                  <p className="text-slate-600 text-center">Les tâches et devoirs seront affichés ici...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
              {editingSubject ? 'Modifier' : 'Nouvel'} <span className="text-orange-500">Espace</span>
            </h2>
            <button onClick={() => { setIsModalOpen(false); setEditingSubject(null); }} className="text-slate-400 hover:text-slate-600 transition-colors">
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
          </div>
          <form onSubmit={handleSaveSubject} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Titre</label>
              <input 
                type="text" 
                name="title" 
                defaultValue={editingSubject?.title || ''} 
                placeholder="ex: Mathématiques" 
                required
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Promotion</label>
              <select 
                name="promoId" 
                defaultValue={editingSubject?.promoId || ''} 
                required
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold"
              >
                <option value="">Sélectionner une promotion</option>
                {promotions.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Formateur</label>
              <select 
                name="instructorId" 
                defaultValue={editingSubject?.formateurId || ''} 
                required
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold"
              >
                <option value="">Sélectionner un formateur</option>
                {instructors.map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full bg-orange-500 text-white font-black uppercase py-4 rounded-2xl shadow-xl shadow-orange-200 mt-4 active:scale-95 transition-all">
              {editingSubject ? 'Mettre à jour' : 'Créer l\'espace'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-orange-500 animate-spin">progress_activity</span>
          <p className="mt-4 text-slate-500 font-bold">Chargement des espaces pédagogiques...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f8f7f5] antialiased">
      {renderModal()}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {view === 'grid' ? renderGrid() : renderDetails()}
    </main>
  );
};

export default SubjectSpaces;