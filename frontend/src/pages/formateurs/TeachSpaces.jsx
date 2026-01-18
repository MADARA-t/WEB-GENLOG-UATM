import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
// Configuration API

const InstructorSpaces = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [activeTab, setActiveTab] = useState('assignments');
  
  const [isAddingAssignment, setIsAddingAssignment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    type: 'individual',
    startDate: '',
    dueDate: '',
    points: 20
  });
  
  const [detailView, setDetailView] = useState(null);
  
  // États pour les données du backend
  const [spaces, setSpaces] = useState([]);
  const [works, setWorks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Charger les espaces pédagogiques au montage
  useEffect(() => {
    fetchSpaces();
  }, []);

  // Charger les travaux quand un espace est sélectionné
  useEffect(() => {
    if (selectedCourseId) {
      fetchWorks(selectedCourseId);
      fetchStudents(selectedCourseId);
    }
  }, [selectedCourseId]);

  // Auto-hide success/error messages
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  // Récupérer les espaces pédagogiques
  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pedagogical-spaces');
      setSpaces(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des espaces pédagogiques');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les travaux d'un espace
  const fetchWorks = async (spaceId) => {
    try {
      setLoading(true);
      const response = await api.get(`/works?spaceId=${spaceId}`);
      setWorks(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des travaux');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les étudiants d'un espace
  const fetchStudents = async (spaceId) => {
    try {
      const response = await api.get(`/space-students/space/${spaceId}`);
      setStudents(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des étudiants:', err);
    }
  };

  // Créer un travail et l'assigner automatiquement
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // 1. Créer le travail
      const workData = {
        title: newAssignment.title,
        description: newAssignment.description,
        type: newAssignment.type,
        spaceId: selectedCourseId,
        startDate: new Date(newAssignment.startDate).toISOString(),
        dueDate: new Date(newAssignment.dueDate).toISOString(),
        points: parseInt(newAssignment.points),
        createdBy: currentUser.id
      };

      const workResponse = await api.post('/works', workData);
      const createdWork = workResponse.data;

      // 2. Assigner automatiquement selon le type
      if (newAssignment.type === 'individual') {
        // Assigner à tous les étudiants individuellement
        const assignmentPromises = students.map(student => 
          api.post('/work-assignments', {
            workId: createdWork.id,
            studentId: student.studentId || student.id
          })
        );
        await Promise.all(assignmentPromises);
        setSuccessMessage(`Travail créé et assigné à ${students.length} étudiant(s) !`);
      } else {
        // Pour les travaux collectifs, on laisse le formateur créer les groupes après
        setSuccessMessage('Travail collectif créé ! Vous pouvez maintenant créer des groupes.');
      }

      // 3. Rafraîchir la liste et réinitialiser
      await fetchWorks(selectedCourseId);
      setIsAddingAssignment(false);
      setNewAssignment({
        title: '',
        description: '',
        type: 'individual',
        startDate: '',
        dueDate: '',
        points: 20
      });

    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du travail');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Modifier un travail
  const handleUpdateWork = async () => {
    try {
      setLoading(true);
      setError(null);

      const updateData = {
        title: detailView.title,
        description: detailView.description,
        startDate: new Date(detailView.startDate).toISOString(),
        dueDate: new Date(detailView.dueDate).toISOString(),
        points: parseInt(detailView.points)
      };

      await api.patch(`/works/${detailView.id}`, updateData);
      
      setSuccessMessage('Travail modifié avec succès !');
      setIsEditing(false);
      await fetchWorks(selectedCourseId);
      
      // Mettre à jour la vue détail
      setDetailView(prev => ({ ...prev, ...updateData }));
      
    } catch (err) {
      setError('Erreur lors de la modification du travail');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un travail
  const handleDeleteWork = async (workId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce travail ?')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/works/${workId}`);
      setSuccessMessage('Travail supprimé avec succès !');
      await fetchWorks(selectedCourseId);
      setDetailView(null);
    } catch (err) {
      setError('Erreur lors de la suppression du travail');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedCourse = spaces.find(c => c.id === selectedCourseId);
  const filteredCourses = spaces.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formater les dates pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Modale de création
  const AssignmentModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-black text-slate-900">Nouveau Devoir</h2>
          <button 
            onClick={() => setIsAddingAssignment(false)} 
            className="size-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form className="space-y-4" onSubmit={handleCreateAssignment}>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Titre du devoir</label>
            <input
              type="text"
              className="w-full h-12 px-4 bg-slate-50 border-none rounded-xl mt-1 font-medium outline-none focus:ring-2 focus:ring-orange-500/20"
              placeholder="ex: Projet Single Page Application"
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Type de travail</label>
            <select
              className="w-full h-12 px-4 bg-slate-50 border-none rounded-xl mt-1 font-medium outline-none focus:ring-2 focus:ring-orange-500/20"
              value={newAssignment.type}
              onChange={(e) => setNewAssignment({ ...newAssignment, type: e.target.value })}
              required
            >
              <option value="individual">Individuel</option>
              <option value="collective">Collectif</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Consignes</label>
            <textarea
              className="w-full p-4 bg-slate-50 border-none rounded-xl mt-1 font-medium h-32 outline-none focus:ring-2 focus:ring-orange-500/20"
              placeholder="Décrivez les attentes..."
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Date de début</label>
              <input
                type="date"
                className="w-full h-12 px-4 bg-slate-50 border-none rounded-xl mt-1 font-medium outline-none focus:ring-2 focus:ring-orange-500/20"
                value={newAssignment.startDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, startDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Date d'échéance</label>
              <input
                type="date"
                className="w-full h-12 px-4 bg-slate-50 border-none rounded-xl mt-1 font-medium outline-none focus:ring-2 focus:ring-orange-500/20"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Points (Barème)</label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full h-12 px-4 bg-slate-50 border-none rounded-xl mt-1 font-medium outline-none focus:ring-2 focus:ring-orange-500/20"
              value={newAssignment.points}
              onChange={(e) => setNewAssignment({ ...newAssignment, points: e.target.value })}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Création en cours...' : 'Créer et notifier les étudiants'}
          </button>
        </form>
      </div>
    </div>
  );

  // Messages de notification
  const NotificationBar = () => {
    if (!successMessage && !error) return null;
    
    return (
      <div className="fixed top-4 right-4 z-[200] max-w-md animate-in slide-in-from-right duration-300">
        {successMessage && (
          <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
            <span className="material-symbols-outlined">check_circle</span>
            <span className="font-bold">{successMessage}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <span className="font-bold">{error}</span>
          </div>
        )}
      </div>
    );
  };

  // Vue détaillée d'un espace
  if (selectedCourse) {
    return (
      <div className="flex-1 min-h-screen bg-[#f8fafc] font-['Lexend'] antialiased">
        <NotificationBar />
        {isAddingAssignment && <AssignmentModal />}

        <div className="h-64 w-full relative">
          <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-700" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto w-full px-6 py-8">
              <button 
                onClick={() => setSelectedCourseId(null)} 
                className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors group"
              >
                <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span className="text-xs font-black uppercase tracking-widest">Tableau de bord</span>
              </button>
              <div className="flex flex-col md:flex-row justify-between items-end gap-4 text-white">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-5xl font-black">{selectedCourse.name}</h1>
                  <p className="text-white/70 font-medium text-lg">{selectedCourse.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-b border-slate-100 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 flex gap-8">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`py-5 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'assignments' ? 'border-orange-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              <span className="material-symbols-outlined text-lg">assignment</span>Travaux & Devoirs
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-5 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'students' ? 'border-orange-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              <span className="material-symbols-outlined text-lg">groups</span>Étudiants ({students.length})
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {activeTab === 'assignments' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {detailView ? (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <button 
                      onClick={() => { setDetailView(null); setIsEditing(false); }} 
                      className="flex items-center gap-2 text-slate-400 hover:text-orange-600 font-black text-[10px] uppercase tracking-widest"
                    >
                      <span className="material-symbols-outlined text-lg">arrow_back</span> Retour
                    </button>

                    <div className="flex gap-2">
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span> Modifier
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteWork(detailView.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span> Supprimer
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Titre du devoir</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={detailView.title}
                          onChange={(e) => setDetailView({ ...detailView, title: e.target.value })}
                          className="w-full text-2xl font-black text-slate-900 bg-slate-50 border-none rounded-2xl p-4 mt-2 focus:ring-2 focus:ring-orange-500/20 outline-none"
                        />
                      ) : (
                        <h2 className="text-3xl font-black text-slate-900 mt-2">{detailView.title}</h2>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Date de début</label>
                        {isEditing ? (
                          <input
                            type="date"
                            value={detailView.startDate?.split('T')[0]}
                            onChange={(e) => setDetailView({ ...detailView, startDate: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 mt-2 font-bold text-slate-600 outline-none"
                          />
                        ) : (
                          <p className="text-slate-600 font-bold mt-2">{formatDate(detailView.startDate)}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Échéance</label>
                        {isEditing ? (
                          <input
                            type="date"
                            value={detailView.dueDate?.split('T')[0]}
                            onChange={(e) => setDetailView({ ...detailView, dueDate: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 mt-2 font-bold text-slate-600 outline-none"
                          />
                        ) : (
                          <p className="text-slate-600 font-bold mt-2">{formatDate(detailView.dueDate)}</p>
                        )}
                      </div>
                    </div>

                    <div className="h-px bg-slate-100 my-4" />

                    <div>
                      <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3 ml-2">Consignes pédagogiques</h3>
                      {isEditing ? (
                        <textarea
                          value={detailView.description}
                          onChange={(e) => setDetailView({ ...detailView, description: e.target.value })}
                          className="w-full h-40 bg-slate-50 border-none rounded-2xl p-6 text-slate-600 focus:ring-2 focus:ring-orange-500/20 outline-none"
                        />
                      ) : (
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 p-6 rounded-2xl border border-slate-50">
                          {detailView.description || "Aucune consigne n'a été rédigée."}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Points</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={detailView.points}
                          onChange={(e) => setDetailView({ ...detailView, points: e.target.value })}
                          className="w-full bg-slate-50 border-none rounded-2xl p-4 mt-2 font-bold text-slate-600 outline-none"
                        />
                      ) : (
                        <p className="text-slate-600 font-bold mt-2">Sur {detailView.points} points</p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <button
                      onClick={handleUpdateWork}
                      disabled={loading}
                      className="w-full mt-10 py-4 bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg disabled:opacity-50"
                    >
                      {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-bold text-slate-900">Travaux à rendre</h2>
                    <button 
                      onClick={() => setIsAddingAssignment(true)} 
                      className="h-10 px-4 bg-orange-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg">add</span> Créer un devoir
                    </button>
                  </div>

                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin size-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
                    </div>
                  ) : works.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-16 text-center">
                      <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">assignment</span>
                      <p className="text-slate-400 font-medium">Aucun travail créé pour cet espace</p>
                      <button 
                        onClick={() => setIsAddingAssignment(true)}
                        className="mt-4 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors"
                      >
                        Créer votre premier devoir
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {works.map((task) => (
                        <div 
                          key={task.id} 
                          className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all"
                        >
                          <div 
                            className="flex items-center gap-5 cursor-pointer flex-1" 
                            onClick={() => { setDetailView(task); setIsEditing(false); }}
                          >
                            <div className="size-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all">
                              <span className="material-symbols-outlined text-3xl">assignment</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-lg">{task.title}</h4>
                              <div className="flex items-center gap-3 mt-1 text-slate-400 text-xs font-bold">
                                <span>Échéance: {formatDate(task.dueDate)}</span>
                                <span className={`px-2 py-1 rounded-lg ${task.type === 'individual' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                  {task.type === 'individual' ? 'Individuel' : 'Collectif'}
                                </span>
                                <span className="text-orange-500">{task.points} points</span>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setDetailView(task); }} 
                            className="h-10 px-5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-orange-600 transition-all ml-4"
                          >
                            Voir détails
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'students' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin size-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
                </div>
              ) : students.length === 0 ? (
                <div className="p-16 text-center">
                  <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">group</span>
                  <p className="text-slate-400 font-medium">Aucun étudiant inscrit dans cet espace</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Étudiant</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Date d'inscription</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {students.map((student) => (
                      <tr key={student.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-400 uppercase">
                              {student.student?.name?.charAt(0) || 'E'}
                            </div>
                            <span className="font-bold text-slate-900">{student.student?.name || 'Étudiant'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-slate-600 font-medium">
                          {student.student?.email || 'N/A'}
                        </td>
                        <td className="px-8 py-5 text-center text-slate-500 text-sm">
                          {formatDate(student.joinedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Vue principale : Liste des espaces
  return (
    <div className="flex-1 min-h-screen bg-[#f8fafc] font-['Lexend'] antialiased">
      <NotificationBar />
      
      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-6 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="size-20 rounded-[2rem] bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-3xl">
                {currentUser.name?.charAt(0) || 'F'}
              </div>
              <div className="absolute -bottom-1 -right-1 size-6 bg-green-500 border-4 border-white rounded-full"></div>
            </div>
            <div>
              <p className="text-orange-600 font-black text-[10px] uppercase tracking-[0.2em] mb-1">Espace Formateur</p>
              <h2 className="text-3xl font-black text-slate-900 leading-none">Bienvenue, {currentUser.name || 'Formateur'}</h2>
              <p className="text-slate-400 font-medium mt-2">{currentUser.role} • {spaces.length} espace(s) pédagogique(s)</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Espaces Pédagogiques</h1>
            <p className="text-slate-500 font-medium">Gérez vos matières et créez des travaux.</p>
          </div>
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            <button 
              onClick={() => setViewMode('grid')} 
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <span className="material-symbols-outlined block">grid_view</span>
            </button>
            <button 
              onClick={() => setViewMode('list')} 
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <span className="material-symbols-outlined block">format_list_bulleted</span>
            </button>
          </div>
        </div>

        <div className="relative group max-w-2xl">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un espace..."
            className="w-full h-16 pl-14 pr-6 bg-white border-none rounded-[1.5rem] shadow-sm focus:ring-2 focus:ring-orange-500/20 text-slate-900 font-medium outline-none transition-all"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin size-16 border-4 border-orange-500 border-t-transparent rounded-full"></div>
          </div>
        ) : spaces.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-16 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">school</span>
            <p className="text-slate-400 font-medium text-lg">Aucun espace pédagogique disponible</p>
            <p className="text-slate-400 text-sm mt-2">Contactez le directeur pour être assigné à un espace</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className="group bg-white rounded-[2.5rem] p-3 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-500 flex flex-col cursor-pointer"
              >
                <div className="relative h-52 rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-900 to-slate-700">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-6xl opacity-20">school</span>
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">ID: {course.id}</span>
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm bg-green-500 text-white">
                    Actif
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-orange-600 transition-colors">
                      {course.name}
                    </h3>
                    <p className="text-slate-400 text-sm font-medium mt-1 line-clamp-2">{course.description}</p>
                  </div>
                  <button className="w-full h-12 bg-slate-900 hover:bg-orange-600 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 group/btn">
                    Gérer l'espace
                    <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Espace</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCourses.map((course) => (
                  <tr 
                    key={course.id} 
                    onClick={() => setSelectedCourseId(course.id)} 
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-8 py-6 flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs uppercase italic">
                        {course.id}
                      </div>
                      <span className="font-bold text-slate-900 group-hover:text-orange-600">{course.name}</span>
                    </td>
                    <td className="px-8 py-6 text-slate-500 font-medium max-w-md truncate">{course.description}</td>
                    <td className="px-8 py-6">
                      <button className="text-orange-600 font-bold text-sm hover:underline italic">
                        Accéder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorSpaces;