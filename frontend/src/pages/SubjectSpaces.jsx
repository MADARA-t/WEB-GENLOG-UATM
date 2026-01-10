import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';

// Configuration API
const API_URL = 'http://localhost:3000';
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const SubjectSpaces = () => {
  const [view, setView] = useState('grid');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('students');
  const [previewItem, setPreviewItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Données depuis l'API
  const [subjects, setSubjects] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [spaceStudents, setSpaceStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);

  useEffect(() => {
    fetchSpaces();
    fetchPromotions();
    fetchFormateurs();
    fetchTechniciens();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchSpaceStudents(selectedSubject.id);
      fetchAvailableStudents(selectedSubject.promotionId);
    }
  }, [selectedSubject?.id]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pedagogical-spaces');
      const adaptedSpaces = response.data.map(space => ({
        id: space.id,
        title: space.name,
        description: space.description,
        promotionId: space.promotionId,
        promo: space.promotion?.name || 'N/A',
        year: space.promotion?.year || '2025',
        semester: "Semestre 1",
        instructor: space.formateur ? `${space.formateur.firstName} ${space.formateur.lastName}` : null,
        instructorId: space.formateurId,
        technicien: space.technicien ? `${space.technicien.firstName} ${space.technicien.lastName}` : null,
        technicienId: space.technicienId,
        img: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800",
        studentsCount: 0
      }));
      setSubjects(adaptedSpaces);
    } catch (error) {
      console.error('Erreur chargement espaces:', error);
      showNotification('Erreur lors du chargement des espaces', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await api.get('/promotions');
      setPromotions(response.data);
    } catch (error) {
      console.error('Erreur chargement promotions:', error);
    }
  };

  const fetchFormateurs = async () => {
    try {
      const response = await api.get('/users');
      const formateursList = response.data
        .filter(user => user.role === 'formateur' && user.isActive)
        .map(user => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        }));
      setFormateurs(formateursList);
    } catch (error) {
      console.error('Erreur chargement formateurs:', error);
    }
  };

  const fetchTechniciens = async () => {
    try {
      const response = await api.get('/users');
      const techniciensList = response.data
        .filter(user => user.role === 'technicien' && user.isActive)
        .map(user => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        }));
      setTechniciens(techniciensList);
    } catch (error) {
      console.error('Erreur chargement techniciens:', error);
    }
  };

  const fetchSpaceStudents = async (spaceId) => {
    try {
      const response = await api.get(`/space-students/space/${spaceId}`);
      const students = response.data.map(item => ({
        id: item.id,
        studentId: item.student.id,
        name: `${item.student.firstName} ${item.student.lastName}`,
        email: item.student.email,
        joinedAt: new Date(item.joinedAt).toLocaleDateString('fr-FR')
      }));
      setSpaceStudents(students);
      setSelectedSubject(prev => ({ ...prev, studentsCount: students.length }));
    } catch (error) {
      console.error('Erreur chargement étudiants:', error);
      setSpaceStudents([]);
    }
  };

  const fetchAvailableStudents = async (promotionId) => {
    try {
      const response = await api.get(`/student-promotions/promotion/${promotionId}`);
      const students = response.data.map(item => ({
        id: item.student.id,
        name: `${item.student.firstName} ${item.student.lastName}`,
        email: item.student.email
      }));
      setAvailableStudents(students);
    } catch (error) {
      console.error('Erreur chargement étudiants disponibles:', error);
      setAvailableStudents([]);
    }
  };

  const filteredSubjects = useMemo(() => {
    return subjects.filter(s => 
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.instructor && s.instructor.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, subjects]);

  const handleCreateSpace = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      setLoading(true);
      await api.post('/pedagogical-spaces', {
        name: formData.get('title'),
        description: formData.get('description') || '',
        promotionId: parseInt(formData.get('promotionId'))
      });
      
      showNotification('✓ Espace pédagogique créé avec succès', 'success');
      setIsModalOpen(false);
      fetchSpaces();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Erreur lors de la création', 'error');
    } finally {
      setLoading(false);
    }
  };

  const assignFormateur = async (formateurId) => {
    try {
      await api.patch(`/pedagogical-spaces/${selectedSubject.id}`, {
        formateurId: formateurId ? parseInt(formateurId) : null
      });
      
      const formateur = formateurs.find(f => f.id === parseInt(formateurId));
      setSelectedSubject({ ...selectedSubject, instructorId: formateurId, instructor: formateur?.name || null });
      showNotification('✓ Formateur assigné avec succès', 'success');
      fetchSpaces();
    } catch (error) {
      showNotification('Erreur lors de l\'assignation', 'error');
    }
  };

  const assignTechnicien = async (technicienId) => {
    try {
      await api.patch(`/pedagogical-spaces/${selectedSubject.id}`, {
        technicienId: technicienId ? parseInt(technicienId) : null
      });
      
      const technicien = techniciens.find(t => t.id === parseInt(technicienId));
      setSelectedSubject({ ...selectedSubject, technicienId, technicien: technicien?.name || null });
      showNotification('✓ Technicien assigné avec succès', 'success');
      fetchSpaces();
    } catch (error) {
      showNotification('Erreur lors de l\'assignation', 'error');
    }
  };

  const addStudent = async (studentId) => {
    try {
      await api.post('/space-students/student', {
        spaceId: selectedSubject.id,
        studentId: parseInt(studentId)
      });
      
      showNotification('✓ Étudiant ajouté avec succès', 'success');
      fetchSpaceStudents(selectedSubject.id);
    } catch (error) {
      showNotification(error.response?.data?.message || 'Erreur lors de l\'ajout', 'error');
    }
  };

  const removeStudent = async (enrollmentId, studentName) => {
    if (!window.confirm(`Retirer ${studentName} de cet espace ?`)) return;
    
    try {
      await api.delete('/space-students/student', {
        data: {
          spaceId: selectedSubject.id,
          studentId: enrollmentId
        }
      });
      
      showNotification('✓ Étudiant retiré avec succès', 'success');
      fetchSpaceStudents(selectedSubject.id);
    } catch (error) {
      showNotification('Erreur lors du retrait', 'error');
    }
  };

  const importPromotion = async () => {
    if (!window.confirm(`Importer tous les étudiants de ${selectedSubject.promo} dans cet espace ?`)) return;
    
    try {
      setLoading(true);
      for (const student of availableStudents) {
        if (!spaceStudents.find(s => s.studentId === student.id)) {
          await api.post('/space-students/student', {
            spaceId: selectedSubject.id,
            studentId: student.id
          });
        }
      }
      showNotification(`✓ Promotion ${selectedSubject.promo} importée avec succès`, 'success');
      fetchSpaceStudents(selectedSubject.id);
    } catch (error) {
      showNotification('Erreur lors de l\'importation', 'error');
    } finally {
      setLoading(false);
    }
  };

  // VUE DÉTAILS
  if (view === 'details' && selectedSubject) {
    const unassignedStudents = availableStudents.filter(
      avail => !spaceStudents.find(enrolled => enrolled.studentId === avail.id)
    );

    return (
      <main className="flex-1 flex flex-col h-full bg-[#f8f7f5] animate-in fade-in duration-300 relative overflow-y-auto">
        
        {/* Notification */}
        {notification && (
          <div className={`fixed top-6 right-6 z-[120] p-5 rounded-2xl shadow-2xl animate-in slide-in-from-right-5 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            <p className="text-sm font-bold">{notification.message}</p>
          </div>
        )}

        <header className="w-full px-10 pt-10 bg-white border-b border-slate-100 sticky top-0 z-50">
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
            <TabLink label="Inscriptions Étudiants" active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon="group_add" />
            <TabLink label="Gestion Intervenants" active={activeTab === 'instructor'} onClick={() => setActiveTab('instructor')} icon="person_pin" />
          </div>
        </header>

        <section className="p-10 max-w-7xl">
          {activeTab === 'instructor' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
              
              {/* Formateur */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-blue-500">person_pin</span>
                  <h2 className="text-xs font-black uppercase text-slate-900 tracking-widest">Formateur Principal</h2>
                </div>
                
                {selectedSubject.instructor ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 bg-blue-50 rounded-3xl border border-blue-100">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center font-black">
                          {selectedSubject.instructor.charAt(0)}
                        </div>
                        <div>
                          <span className="font-black text-slate-900 uppercase text-sm block">{selectedSubject.instructor}</span>
                          <span className="text-[10px] text-blue-600 font-bold uppercase">Formateur assigné</span>
                        </div>
                      </div>
                      <button onClick={() => assignFormateur(null)} className="text-[10px] font-black uppercase text-red-500 hover:underline">
                        Retirer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <select 
                      onChange={(e) => e.target.value && assignFormateur(e.target.value)}
                      className="w-full p-5 bg-slate-50 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Sélectionner un formateur --</option>
                      {formateurs.map(f => (
                        <option key={f.id} value={f.id}>{f.name} ({f.email})</option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 italic">Aucun formateur n'est actuellement assigné à cet espace</p>
                  </div>
                )}
              </div>

              {/* Technicien */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-slate-500">engineering</span>
                  <h2 className="text-xs font-black uppercase text-slate-900 tracking-widest">Support Technique</h2>
                </div>
                
                {selectedSubject.technicien ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-slate-600 text-white rounded-2xl flex items-center justify-center font-black">
                          {selectedSubject.technicien.charAt(0)}
                        </div>
                        <div>
                          <span className="font-black text-slate-900 uppercase text-sm block">{selectedSubject.technicien}</span>
                          <span className="text-[10px] text-slate-600 font-bold uppercase">Technicien assigné</span>
                        </div>
                      </div>
                      <button onClick={() => assignTechnicien(null)} className="text-[10px] font-black uppercase text-red-500 hover:underline">
                        Retirer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <select 
                      onChange={(e) => e.target.value && assignTechnicien(e.target.value)}
                      className="w-full p-5 bg-slate-50 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-slate-500"
                    >
                      <option value="">-- Sélectionner un technicien --</option>
                      {techniciens.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 italic">Aucun technicien n'est actuellement assigné</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4">
              
              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  label="Étudiants inscrits" 
                  value={spaceStudents.length} 
                  icon="groups" 
                  color="orange" 
                />
                <StatCard 
                  label="Promotion" 
                  value={selectedSubject.promo} 
                  icon="school" 
                  color="blue" 
                />
                <StatCard 
                  label="Disponibles" 
                  value={unassignedStudents.length} 
                  icon="person_add" 
                  color="green" 
                />
              </div>

              {/* Actions d'ajout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Import promotion */}
                <div className="bg-white p-10 rounded-[3rem] border-2 border-orange-200 shadow-sm">
                  <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-3xl text-orange-500">groups</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase mb-2 text-center">Import Promo {selectedSubject.promo}</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-8 text-center">
                    Ajouter tous les étudiants de cette promotion ({availableStudents.length} étudiants)
                  </p>
                  <button 
                    onClick={importPromotion}
                    disabled={loading || unassignedStudents.length === 0}
                    className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Importation...' : 'Confirmer l\'importation'}
                  </button>
                </div>

                {/* Ajout individuel */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                  <h3 className="text-xs font-black text-slate-900 uppercase mb-6 tracking-widest">Ajout individuel</h3>
                  <select 
                    onChange={(e) => {
                      if (e.target.value) {
                        addStudent(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full p-5 bg-slate-50 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500 mb-4"
                  >
                    <option value="">-- Sélectionner un étudiant --</option>
                    {unassignedStudents.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.email})
                      </option>
                    ))}
                  </select>
                  {unassignedStudents.length === 0 && (
                    <p className="text-xs text-green-600 font-bold text-center p-4 bg-green-50 rounded-2xl">
                      ✓ Tous les étudiants de la promotion sont inscrits
                    </p>
                  )}
                </div>
              </div>

              {/* Liste des inscrits */}
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                    Étudiants inscrits ({spaceStudents.length})
                  </h3>
                </div>
                
                {spaceStudents.length > 0 ? (
                  <div className="divide-y divide-slate-50">
                    {spaceStudents.map((student) => (
                      <div key={student.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-black">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-black text-slate-900 uppercase text-sm block">{student.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{student.email} • Inscrit le {student.joinedAt}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeStudent(student.studentId, student.name)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <span className="material-symbols-outlined">person_remove</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-20 text-center">
                    <span className="material-symbols-outlined text-6xl text-slate-200">groups_off</span>
                    <p className="mt-4 text-xs font-bold text-slate-300 uppercase">Aucun étudiant inscrit</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    );
  }

  // VUE GRILLE
  return (
    <main className="flex-1 flex flex-col h-full bg-[#f8f7f5] p-10 overflow-y-auto">
      
      {/* Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[120] p-5 rounded-2xl shadow-2xl animate-in slide-in-from-right-5 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          <p className="text-sm font-bold">{notification.message}</p>
        </div>
      )}

      {/* Modal création */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div onSubmit={handleCreateSpace} className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-200">
            <h2 className="text-3xl font-black uppercase mb-8 tracking-tighter">Créer un <span className="text-orange-500">Espace</span></h2>
            <div className="space-y-5">
              <input 
                id="space-title"
                required 
                className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-orange-500" 
                placeholder="NOM DE LA MATIÈRE" 
              />
              <textarea 
                id="space-desc"
                className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-orange-500" 
                placeholder="Description (optionnel)" 
                rows="3"
              />
              <select 
                id="space-promo"
                required
                className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold outline-none appearance-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">-- Sélectionner une promotion --</option>
                {promotions.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.year})</option>
                ))}
              </select>
            </div>
            <div className="flex gap-4 mt-10">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="flex-1 font-black uppercase text-[10px] text-slate-400"
              >
                Annuler
              </button>
              <button 
                onClick={() => {
                  const form = document.createElement('form');
                  const titleInput = document.createElement('input');
                  titleInput.name = 'title';
                  titleInput.value = document.getElementById('space-title').value;
                  const descInput = document.createElement('input');
                  descInput.name = 'description';
                  descInput.value = document.getElementById('space-desc').value;
                  const promoInput = document.createElement('input');
                  promoInput.name = 'promotionId';
                  promoInput.value = document.getElementById('space-promo').value;
                  form.appendChild(titleInput);
                  form.appendChild(descInput);
                  form.appendChild(promoInput);
                  handleCreateSpace({ preventDefault: () => {}, target: form });
                }}
                disabled={loading}
                className="flex-[2] bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 transition-all disabled:opacity-50"
              >
                {loading ? 'Création...' : 'Créer l\'espace'}
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-6xl font-black text-slate-900 uppercase tracking-tighter">Espaces <span className="text-orange-500">Pédagogiques</span></h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] mt-2 tracking-[0.3em]">Portail de supervision • Directeur</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">search</span>
            <input 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full md:w-80 pl-14 pr-6 py-4 rounded-2xl border-none bg-white shadow-sm font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500/20" 
              placeholder="Rechercher un module..." 
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-orange-100 hover:scale-105 transition-all"
          >
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-orange-500 animate-spin">progress_activity</span>
            <p className="mt-4 text-slate-500 font-bold">Chargement...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          {filteredSubjects.map(s => (
            <SpaceCard 
              key={s.id} 
              space={s} 
              onClick={() => { setSelectedSubject(s); setView('details'); }} 
            />
          ))}
        </div>
      )}
    </main>
  );
};

const SpaceCard = ({ space, onClick }) => (
  <article 
    onClick={onClick} 
    className="group cursor-pointer bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
  >
    <div className="flex justify-between items-start mb-8">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
        space.instructor ? 'bg-green-500' : 'bg-slate-100'
      } text-white transition-colors duration-500`}>
        <span className="material-symbols-outlined text-2xl">
          {space.instructor ? 'verified' : 'hourglass_empty'}
        </span>
      </div>
      <span className="text-[9px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
        {space.semester}
      </span>
    </div>
    <p className="text-[10px] font-black text-orange-500 uppercase mb-2 tracking-widest">
      {space.promo} • {space.year}
    </p>
    <h3 className="text-2xl font-black text-slate-900 uppercase leading-[1.1] mb-8 group-hover:text-orange-500 transition-colors">
      {space.title}
    </h3>
    <div className="pt-6 border-t border-slate-50 flex items-center gap-3">
      <div className="h-6 w-6 rounded-lg bg-slate-200 flex items-center justify-center text-slate-600 font-black text-xs">
        {space.instructor ? space.instructor.charAt(0) : '?'}
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] font-black uppercase text-slate-700">
          {space.instructor || "Non affecté"}
        </span>
        <span className="text-[8px] text-slate-400 font-bold uppercase">
          {space.studentsCount || 0} inscrits
        </span>
      </div>
    </div>
  </article>
);

const TabLink = ({ label, active, onClick, icon }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-2 pb-6 px-1 relative transition-all ${
      active ? 'text-orange-500' : 'text-slate-300 hover:text-slate-500'
    }`}
  >
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-[0.15em]">{label}</span>
    {active && (
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-orange-500 rounded-t-full animate-in slide-in-from-left duration-300" />
    )}
  </button>
);

const StatCard = ({ label, value, icon, color }) => {
  const colors = {
    orange: 'bg-orange-50 text-orange-500 border-orange-100',
    blue: 'bg-blue-50 text-blue-500 border-blue-100',
    green: 'bg-green-50 text-green-500 border-green-100'
  };
  
  return (
    <div className={`p-6 rounded-2xl border-2 ${colors[color]} flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center`}>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-wide opacity-70">{label}</p>
        <p className="text-3xl font-black">{value}</p>
      </div>
    </div>
  );
};

export default SubjectSpaces