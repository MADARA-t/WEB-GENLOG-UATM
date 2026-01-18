import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StudentSpacesPremium = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [activeTab, setActiveTab] = useState('resources');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [sidePanelTab, setSidePanelTab] = useState('upload');

  // États pour les données de l'API
  const [spaces, setSpaces] = useState([]);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Charger les espaces de l'étudiant au montage
  useEffect(() => {
    fetchStudentSpaces();
  }, []);

  // Charger les travaux quand un espace est sélectionné
  useEffect(() => {
    if (selectedCourseId) {
      fetchSpaceWorks(selectedCourseId);
    }
  }, [selectedCourseId]);

  // Récupérer les espaces pédagogiques de l'étudiant
  const fetchStudentSpaces = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Récupérer tous les espaces de l'étudiant via space-students
      const enrollmentsResponse = await api.get(`/space-students/student/${currentUser.id}`);
      
      // 2. Pour chaque inscription, récupérer les détails de l'espace
      const spacesPromises = enrollmentsResponse.data.map(enrollment => 
        api.get(`/pedagogical-spaces/${enrollment.spaceId}`)
      );
      
      const spacesResponses = await Promise.all(spacesPromises);
      
      // 3. Adapter les données au format du composant
      const adaptedSpaces = spacesResponses.map(response => ({
        id: response.data.id,
        title: response.data.name,
        instructor: response.data.formateur 
          ? `${response.data.formateur.firstName} ${response.data.formateur.lastName}` 
          : "Non assigné",
        category: response.data.promotion?.name || "Formation",
        semester: "Semestre 1",
        img: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800",
        description: response.data.description || ""
      }));

      setSpaces(adaptedSpaces);
      
    } catch (err) {
      console.error('Erreur chargement espaces:', err);
      setError('Erreur lors du chargement de vos espaces pédagogiques');
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les travaux d'un espace
  const fetchSpaceWorks = async (spaceId) => {
    try {
      setLoading(true);
      
      // Récupérer tous les travaux de l'espace
      const worksResponse = await api.get(`/works?spaceId=${spaceId}`);
      
      // Récupérer les assignations de l'étudiant pour cet espace
      const assignmentsResponse = await api.get(`/work-assignments/student/${currentUser.id}`);
      
      // Filtrer les travaux assignés à l'étudiant dans cet espace
      const studentAssignments = assignmentsResponse.data.filter(assignment => 
        worksResponse.data.some(work => work.id === assignment.workId)
      );

      // Adapter les données
      const adaptedWorks = worksResponse.data.map(work => {
        const assignment = studentAssignments.find(a => a.workId === work.id);
        
        return {
          id: work.id,
          title: work.title,
          deadline: new Date(work.dueDate).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short'
          }),
          status: assignment?.submittedAt ? "Rendu" : "En attente",
          isCollective: work.type === 'collective',
          instructions: work.description || "Aucune consigne disponible",
          workResources: [], // À implémenter si vous avez des ressources
          teamMembers: work.type === 'collective' ? [] : [] // À implémenter
        };
      });

      setWorks(adaptedWorks);
      
    } catch (err) {
      console.error('Erreur chargement travaux:', err);
      setError('Erreur lors du chargement des travaux');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const selectedCourse = spaces.find(c => c.id === selectedCourseId);
  const filteredCourses = spaces.filter(c =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Vue détaillée d'un espace
  if (selectedCourse) {
    return (
      <div className="flex-1 min-h-screen bg-[#FDFDFD] font-['Lexend'] antialiased animate-in fade-in duration-500 relative overflow-x-hidden">
        
        {/* VOLET DÉTAILS DU DEVOIR */}
        <div className={`fixed inset-y-0 right-0 w-full md:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out border-l border-slate-100 flex flex-col ${selectedAssignment ? 'translate-x-0' : 'translate-x-full'}`}>
          {selectedAssignment && (
            <>
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <div className="flex flex-col">
                  <h3 className="font-black text-xl text-slate-900 tracking-tight">Travail à rendre</h3>
                  <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                    {selectedAssignment.isCollective ? 'Projet Collectif' : 'Projet Individuel'}
                  </p>
                </div>
                <button onClick={() => setSelectedAssignment(null)} className="size-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-all">
                  <span className="material-symbols-outlined text-slate-400">close</span>
                </button>
              </div>

              <div className="px-8 pt-6 flex gap-8 border-b border-slate-50">
                <button onClick={() => setSidePanelTab('upload')} className={`pb-4 text-[11px] font-black uppercase tracking-widest transition-all relative ${sidePanelTab === 'upload' ? 'text-slate-900' : 'text-slate-400'}`}>
                  Dépôt
                  {sidePanelTab === 'upload' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-full" />}
                </button>
                {selectedAssignment.isCollective && (
                  <button onClick={() => setSidePanelTab('team')} className={`pb-4 text-[11px] font-black uppercase tracking-widest transition-all relative ${sidePanelTab === 'team' ? 'text-slate-900' : 'text-slate-400'}`}>
                    Équipe
                    {sidePanelTab === 'team' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-full" />}
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {sidePanelTab === 'upload' ? (
                  <div className="space-y-8 animate-in fade-in">
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 leading-tight">{selectedAssignment.title}</h4>
                      <p className="text-xs font-bold text-slate-400 mt-2 tracking-widest uppercase">
                        Échéance : <span className="text-orange-600">{selectedAssignment.deadline}</span>
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Instructions</p>
                      <p className="text-sm text-slate-600 bg-slate-50 p-6 rounded-[2rem] border border-slate-100 italic leading-relaxed">
                        "{selectedAssignment.instructions}"
                      </p>
                    </div>

                    {selectedAssignment.workResources && selectedAssignment.workResources.length > 0 && (
                      <div className="space-y-4">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                          Documents de travail ({selectedAssignment.workResources.length})
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {selectedAssignment.workResources.map((res, i) => (
                            <a key={i} href="#" className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-orange-200 hover:shadow-md transition-all group">
                              <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                                  <span className="material-symbols-outlined text-orange-500 group-hover:text-white text-xl">download</span>
                                </div>
                                <span className="text-xs font-bold text-slate-700 truncate max-w-[180px]">{res.name}</span>
                              </div>
                              <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">{res.size}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} className={`relative h-48 rounded-[2.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 ${dragActive ? 'border-orange-500 bg-orange-50/50' : 'border-slate-100 bg-slate-50/50'}`}>
                      <span className="material-symbols-outlined text-3xl text-orange-500">cloud_upload</span>
                      <p className="text-sm font-black text-slate-900">Déposer le fichier final</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">PDF, ZIP, DOCX jusqu'à 20Mo</p>
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in slide-in-from-right-4">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Membres du groupe</p>
                    {selectedAssignment.teamMembers?.map((m, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[2rem]">
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-black text-[10px] border border-orange-100">
                            {m.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{m.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-slate-50">
                <button className="w-full h-16 bg-slate-900 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-orange-600 transition-all">
                  Confirmer le dépôt {selectedAssignment.isCollective ? "du groupe" : ""}
                </button>
              </div>
            </>
          )}
        </div>

        {selectedAssignment && (
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 animate-in fade-in" onClick={() => setSelectedAssignment(null)} />
        )}

        {/* Hero Section */}
        <div className="h-[320px] w-full relative overflow-hidden">
          <img src={selectedCourse.img} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/50 to-transparent" />
          <div className="absolute inset-0 flex items-center px-12">
            <div className="max-w-7xl mx-auto w-full">
              <button onClick={() => setSelectedCourseId(null)} className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-all group font-black text-[10px] uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">west</span> Retour
              </button>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest rounded-md">
                    {selectedCourse.category}
                  </span>
                  <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs">school</span>
                    Par {selectedCourse.instructor}
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none max-w-4xl">
                  {selectedCourse.title}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Tab System */}
        <div className="bg-white/90 backdrop-blur-2xl border-b border-slate-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-12 flex gap-12">
            {[
              { id: 'resources', label: 'Ressources', icon: 'auto_awesome_motion' },
              { id: 'assignments', label: 'Évaluations', icon: 'verified' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-6 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-400'}`}>
                <span className={`material-symbols-outlined text-xl ${activeTab === tab.id ? 'text-orange-500' : 'text-slate-300'}`}>
                  {tab.icon}
                </span>
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-orange-500 rounded-full" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-12 py-12">
          {activeTab === 'resources' && (
            <div className="space-y-12 animate-in slide-in-from-bottom-4">
              <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-16 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">folder_open</span>
                <p className="text-slate-400 font-medium">Aucune ressource disponible pour le moment</p>
              </div>
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="max-w-4xl space-y-4 animate-in slide-in-from-bottom-4">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin size-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
                </div>
              ) : works.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-16 text-center">
                  <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">assignment</span>
                  <p className="text-slate-400 font-medium">Aucun travail assigné pour cet espace</p>
                </div>
              ) : (
                works.map((task) => (
                  <div key={task.id} onClick={() => setSelectedAssignment(task)} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className={`size-3 rounded-full ${task.status === 'En attente' ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`} />
                      <div>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${task.isCollective ? 'border-orange-200 text-orange-600' : 'border-slate-200 text-slate-500'}`}>
                          {task.isCollective ? 'Collectif' : 'Individuel'}
                        </span>
                        <h4 className="font-black text-slate-900 text-xl group-hover:text-orange-600 transition-colors mt-1 uppercase tracking-tight">
                          {task.title}
                        </h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">
                          Limite : {task.deadline}
                        </p>
                      </div>
                    </div>
                    <button className="h-12 px-8 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all">
                      Ouvrir
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // VUE LISTE DES ESPACES
  return (
    <div className="flex-1 min-h-screen bg-[#FDFDFD] font-['Lexend'] antialiased">
      <div className="max-w-7xl mx-auto px-12 py-16">
        <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-10 mb-20">
          <div className="space-y-4">
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Espaces <span className="text-orange-600">Pédagogiques</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium">
              Gérez vos ressources et progressez dans vos projets.
            </p>
          </div>
          <div className="relative w-full md:w-96 group">
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Rechercher un cours..." 
              className="w-full h-16 pl-14 pr-6 bg-white border border-slate-100 rounded-2xl shadow-xl outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/30 font-bold transition-all" 
            />
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors">
              search
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <span className="font-bold">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin size-16 border-4 border-orange-500 border-t-transparent rounded-full"></div>
          </div>
        ) : spaces.length === 0 ? (
          <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-16 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">school</span>
            <p className="text-slate-400 font-medium text-lg">Aucun espace pédagogique disponible</p>
            <p className="text-slate-400 text-sm mt-2">Contactez votre formateur pour être inscrit</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.map((course) => (
              <div key={course.id} onClick={() => setSelectedCourseId(course.id)} className="group bg-white rounded-[3rem] p-4 border border-slate-50 shadow-xl hover:shadow-2xl transition-all duration-700 cursor-pointer">
                <div className="h-64 rounded-[2.5rem] overflow-hidden relative">
                  <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                  <span className="absolute bottom-6 left-6 px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black uppercase text-white tracking-widest border border-white/20">
                    {course.category}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-2xl font-black text-slate-900 uppercase group-hover:text-orange-600 transition-colors leading-tight">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-4">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      {course.instructor}
                    </span>
                    <div className="size-8 rounded-full bg-orange-100 flex items-center justify-center text-[10px]">
                      👤
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSpacesPremium;