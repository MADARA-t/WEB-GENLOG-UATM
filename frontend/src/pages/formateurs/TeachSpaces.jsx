import React, { useState, useRef } from 'react';

const InstructorSpaces = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [activeTab, setActiveTab] = useState('resources');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);

  const [isAddingAssignment, setIsAddingAssignment] = useState(false);
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false); // Pour basculer entre vue et édition
  const editFileRef = useRef(null); // Pour la modification de fichier

  const [newAssignment, setNewAssignment] = useState({ title: '', deadline: '', status: 'En cours', description: '', file: null });
  const [detailView, setDetailView] = useState(null);
  
  const currentUser = {
    name: "Dr. Jean-Pierre",
    role: "Professeur Titulaire",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  };

  const [courses, setCourses] = useState([
    {
      id: "WEB-301",
      title: "Développement Web Avancé",
      level: "SIL3 - 2025-2026",
      studentsCount: 24,
      semester: "Semestre 1",
      img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
      status: "En cours",
      description: "Approfondissement des frameworks modernes et des architectures scalables.",
      resources: [
        { name: "Syllabus_Cours.pdf", type: "pdf", size: "1.2 MB", date: "12 Oct 2025" },
        { name: "Introduction_React_v2.pptx", type: "presentation", size: "8.5 MB", date: "15 Oct 2025" }
      ],
      assignments: [
        {
          id: 1,
          title: "Projet Single Page Application",
          deadline: "2025-11-24",
          status: "En cours",
          description: "Réaliser une application React utilisant une API externe avec gestion d'état.",
          submissions: [
            { studentId: 1, studentName: "Marc Dubois", date: "20 Nov 2025", grade: null, file: "projet_marc.zip" },
            { studentId: 2, studentName: "Sophie Martin", date: "21 Nov 2025", grade: 18, file: "spa_martin.zip" }
          ]
        }
      ],
      students: [
        { id: 1, name: "Marc Dubois", grade: null },
        { id: 2, name: "Sophie Martin", grade: null }
      ]
    },
    {
      id: "UX-202",
      title: "Design d'Interface & Ergonomie",
      level: "SIL3 - 2024-2025",
      studentsCount: 18,
      semester: "Semestre 1",
      img: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=600",
      status: "En cours",
      description: "Principes de psychologie cognitive appliqués au design d'interfaces numériques.",
      resources: [{ name: "Grilles_et_Layouts.pdf", type: "pdf", size: "3.4 MB", date: "02 Nov 2025" }],
      assignments: [],
      students: [{ id: 3, name: "Julie Perrin", email: "j.perrin@ecole.com" }]
    },
    {
      id: "DATA-401",
      title: "Analyse de Données Python",
      level: "SIL3 - 2025-2026",
      studentsCount: 32,
      semester: "Semestre 1",
      img: "https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=600",
      status: "En cours",
      description: "Exploration de données avec Pandas, NumPy et visualisation avec Matplotlib.",
      resources: [],
      assignments: [{ id: 2, title: "Analyse Exploratoire - Dataset Titanic", deadline: "2025-12-15", status: "Bientôt", description: "Nettoyage de données et graphiques statistiques.", submissions: [] }],
      students: []
    }
  ]);

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const selectedAssignment = selectedCourse?.assignments.find(a => a.id === selectedAssignmentId);

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    const createdAssignment = {
      ...newAssignment,
      id: Date.now(),
      submissions: [],
      fileName: newAssignment.file ? newAssignment.file.name : null,
      status: newAssignment.status || 'En cours'
    };

    setCourses(courses.map(c => {
      if (c.id === selectedCourseId) {
        return { ...c, assignments: [createdAssignment, ...c.assignments] };
      }
      return c;
    }));

    setIsAddingAssignment(false);
    setNewAssignment({ title: '', deadline: '', status: 'En cours', description: '', file: null });
  };

  const handleGradeStudent = (assignmentId, studentId, grade) => {
    setCourses(courses.map(c => {
      if (c.id === selectedCourseId) {
        return {
          ...c,
          assignments: c.assignments.map(a => {
            if (a.id === assignmentId) {
              return {
                ...a,
                submissions: a.submissions.map(s =>
                  s.studentId === studentId ? { ...s, grade: parseFloat(grade) } : s
                )
              };
            }
            return a;
          })
        };
      }
      return c;
    }));
  };

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- MODALE INTERNE ---
  const AssignmentModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-black text-slate-900">Nouveau Devoir</h2>
          <button onClick={() => setIsAddingAssignment(false)} className="size-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleCreateAssignment}>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Titre du devoir</label>
            <input
              type="text"
              className="w-full h-12 px-4 bg-slate-50 border-none rounded-xl mt-1 font-medium outline-none focus:ring-2 focus:ring-orange-500/20"
              placeholder="ex: Analyse de cas marketing..."
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              required
            />
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

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Fichier de consigne (PDF, images...)</label>
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-full h-14 border-2 border-dashed border-slate-200 rounded-xl mt-1 flex items-center justify-center gap-2 cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all text-slate-500"
            >
              <span className="material-symbols-outlined">upload_file</span>
              <span className="text-xs font-bold truncate max-w-[250px]">{newAssignment.file ? newAssignment.file.name : "Cliquez pour joindre un fichier"}</span>
            </div>
            {/* Input caché crucial pour la sélection de fichier */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={(e) => setNewAssignment({ ...newAssignment, file: e.target.files[0] })} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Date d'échéance</label>
              <input
                type="date"
                className="w-full h-12 px-4 bg-slate-50 border-none rounded-xl mt-1 font-medium outline-none focus:ring-2 focus:ring-orange-500/20"
                value={newAssignment.deadline}
                onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Barème</label>
              <div className="w-full h-12 px-4 bg-slate-100 rounded-xl mt-1 flex items-center font-bold text-slate-500 text-sm">Sur 20 points</div>
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all mt-4">
            Créer et notifier les étudiants
          </button>
        </form>
      </div>
    </div>
  );

  // --- RENDU LOGIQUE DES VUES ---

  if (selectedAssignment) {
    return (
      <div className="flex-1 min-h-screen bg-[#f8fafc] font-['Lexend'] p-6 lg:p-10 animate-in fade-in duration-300">
        <button onClick={() => setSelectedAssignmentId(null)} className="flex items-center gap-2 text-slate-400 hover:text-orange-600 mb-8 font-black text-xs uppercase tracking-widest transition-colors">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Retour aux devoirs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-black text-slate-900">{selectedAssignment.title}</h1>
                  <p className="text-slate-400 mt-2 font-medium">{selectedAssignment.description}</p>
                </div>
                <span className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl font-bold text-xs uppercase tracking-widest">{selectedAssignment.status}</span>
              </div>

              <div className="h-px bg-slate-100 my-8" />

              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500">how_to_reg</span>
                Travaux soumis ({selectedAssignment.submissions.length})
              </h3>

              <div className="space-y-4">
                {selectedAssignment.submissions.length > 0 ? selectedAssignment.submissions.map((sub) => (
                  <div key={sub.studentId} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black">{sub.studentName.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-slate-900">{sub.studentName}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter italic">Soumis le {sub.date} • {sub.file}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                      <button className="text-slate-400 hover:text-slate-900"><span className="material-symbols-outlined">download</span></button>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Note :</span>
                        <input
                          type="number"
                          min="0" max="20"
                          defaultValue={sub.grade || ''}
                          onBlur={(e) => handleGradeStudent(selectedAssignment.id, sub.studentId, e.target.value)}
                          placeholder="/20"
                          className="w-16 h-10 bg-white border border-slate-200 rounded-xl text-center font-black text-orange-600 focus:ring-2 focus:ring-orange-500/20 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400">
                    Aucun travail n'a encore été soumis par les étudiants.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6">Statistiques de réussite</h3>
              <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-3xl font-black text-orange-400">
                    {selectedAssignment.submissions.filter(s => s.grade !== null).length > 0
                      ? (selectedAssignment.submissions.reduce((acc, s) => acc + (s.grade || 0), 0) / selectedAssignment.submissions.filter(s => s.grade !== null).length).toFixed(2)
                      : "N/A"
                    } <span className="text-sm text-white/40">/ 20</span>
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">Moyenne de classe</p>
                </div>
                <div className="flex items-center justify-between px-2">
                  <span className="text-white/60 text-sm">Taux de remise</span>
                  <span className="font-bold">{selectedCourse.studentsCount > 0 ? Math.round((selectedAssignment.submissions.length / selectedCourse.studentsCount) * 100) : 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <div className="flex-1 min-h-screen bg-[#f8fafc] font-['Lexend'] antialiased">
        {isAddingAssignment && <AssignmentModal />}

        <div className="h-64 w-full relative">
          <img src={selectedCourse.img} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto w-full px-6 py-8">
              <button onClick={() => setSelectedCourseId(null)} className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors group">
                <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span className="text-xs font-black uppercase tracking-widest">Tableau de bord</span>
              </button>
              <div className="flex flex-col md:flex-row justify-between items-end gap-4 text-white">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-orange-500 rounded-lg text-[10px] font-black uppercase tracking-widest">Module {selectedCourse.id}</span>
                    <h1 className="text-3xl md:text-5xl font-black">{selectedCourse.title}</h1>
                  </div>
                  <p className="text-white/70 font-medium text-lg">{selectedCourse.level} • {selectedCourse.semester}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-b border-slate-100 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 flex gap-8">
            {[
              { id: 'resources', label: 'Supports & Ressources', icon: 'folder_open' },
              { id: 'assignments', label: 'Travaux & Devoirs', icon: 'assignment' },
              { id: 'students', label: 'Étudiants et Notes', icon: 'groups' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-5 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab.id ? 'border-orange-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>{tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'resources' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-xl font-bold text-slate-900">Documents du cours</h2>
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-orange-600 font-black text-xs uppercase hover:bg-orange-50 p-2 rounded-xl transition-all">
                    <span className="material-symbols-outlined">upload_file</span>Ajouter un fichier
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {selectedCourse.resources.length > 0 ? (
                    selectedCourse.resources.map((res, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-100 group hover:border-orange-500 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined">{res.type === 'pdf' ? 'description' : 'present_to_all'}</span>
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{res.name}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Ajouté le {res.date} • {res.size}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-orange-600 transition-colors"><span className="material-symbols-outlined">download</span></button>
                          <button onClick={() => window.confirm("Supprimer ?")} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined">delete</span></button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div onClick={() => fileInputRef.current?.click()} className="h-64 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-4 cursor-pointer">
                      <span className="material-symbols-outlined text-5xl">cloud_upload</span>
                      <p className="font-medium italic text-sm text-center">Glissez vos fichiers ici ou utilisez le bouton d'ajout.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {detailView ? (
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                      <button onClick={() => { setDetailView(null); setIsEditing(false); }} className="flex items-center gap-2 text-slate-400 hover:text-orange-600 font-black text-[10px] uppercase tracking-widest">
                        <span className="material-symbols-outlined text-lg">arrow_back</span> Retour
                      </button>

                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span> Modifier les informations
                        </button>
                      )}
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

                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Échéance</label>
                        {isEditing ? (
                          <input
                            type="date"
                            value={detailView.deadline}
                            onChange={(e) => setDetailView({ ...detailView, deadline: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 mt-2 font-bold text-slate-600 outline-none"
                          />
                        ) : (
                          <p className="text-slate-600 font-bold mt-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-slate-400">calendar_month</span> {detailView.deadline}
                          </p>
                        )}
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
                        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3 ml-2">Document joint</h3>
                        <div
                          onClick={() => isEditing && editFileRef.current?.click()}
                          className={`flex items-center gap-4 p-4 rounded-2xl border ${isEditing ? 'border-dashed border-orange-300 bg-orange-50 cursor-pointer' : 'border-slate-100 bg-slate-50'}`}
                        >
                          <span className="material-symbols-outlined text-orange-600">description</span>
                          <div className="flex-1">
                            <span className="font-bold text-sm text-slate-900 block">{detailView.fileName || "Aucun fichier"}</span>
                            {isEditing && <span className="text-[10px] text-orange-600 font-bold uppercase">Cliquez pour changer le fichier</span>}
                          </div>
                          {!isEditing && detailView.fileName && (
                            <span className="material-symbols-outlined text-slate-400 hover:text-orange-600 cursor-pointer">download</span>
                          )}
                        </div>
                        <input type="file" ref={editFileRef} className="hidden" onChange={(e) => setDetailView({ ...detailView, fileName: e.target.files[0]?.name })} />
                      </div>
                    </div>

                    {isEditing && (
                      <button
                        onClick={() => {
                          setCourses(courses.map(c => ({ ...c, assignments: c.assignments.map(a => a.id === detailView.id ? detailView : a) })));
                          setIsEditing(false);
                        }}
                        className="w-full mt-10 py-4 bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg"
                      >
                        Enregistrer les modifications
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between px-2">
                      <h2 className="text-xl font-bold text-slate-900">Travaux à rendre</h2>
                      <button onClick={() => setIsAddingAssignment(true)} className="h-10 px-4 bg-orange-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">add</span> Créer un devoir
                      </button>
                    </div>

                    {selectedCourse.assignments.map((task) => (
                      <div key={task.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group">
                        <div className="flex items-center gap-5 cursor-pointer flex-1" onClick={() => { setDetailView(task); setIsEditing(false); }}>
                          <div className="size-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all">
                            <span className="material-symbols-outlined text-3xl">assignment</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-lg">{task.title}</h4>
                            <div className="flex items-center gap-3 mt-1 text-slate-400 text-xs font-bold">
                              <span>{task.deadline}</span>
                              {task.fileName && <span className="text-orange-500 italic">● Fichier joint</span>}
                            </div>
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedAssignmentId(task.id); }} className="h-10 px-5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-orange-600 transition-all ml-4">
                          Gérer les rendus
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {activeTab === 'students' && (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Étudiant</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Note 1</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Note 2</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Note 3</th>
                      <th className="px-8 py-5 text-[10px] font-black text-orange-500 uppercase tracking-widest text-center">Moyenne</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {selectedCourse.students.map((student) => (
                      <tr key={student.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-400 uppercase">{student.name.charAt(0)}</div>
                            <span className="font-bold text-slate-900">{student.name}</span>
                          </div>
                        </td>
                        {[1, 2, 3].map((num) => (
                          <td key={num} className="px-8 py-5 text-center">
                            <input
                              type="number"
                              placeholder="--"
                              className="w-14 h-10 bg-slate-50 border-none rounded-xl text-center font-bold text-slate-600 focus:ring-2 focus:ring-orange-500/20 outline-none"
                            />
                          </td>
                        ))}
                        <td className="px-8 py-5 text-center">
                          <span className="font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-lg text-sm">--</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8">Organisation du cours</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"><span className="material-symbols-outlined text-orange-400">layers</span></div>
                  <div><p className="text-lg font-bold">12 Semaines</p><p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Durée du module</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"><span className="material-symbols-outlined text-blue-400">group_add</span></div>
                  <div><p className="text-lg font-bold">{selectedCourse.studentsCount} Inscrits</p><p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Accès autorisés</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-[#f8fafc] font-['Lexend'] antialiased">
      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-6 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img src={currentUser.avatar} alt={currentUser.name} className="size-20 rounded-[2rem] object-cover ring-4 ring-orange-50" />
              <div className="absolute -bottom-1 -right-1 size-6 bg-green-500 border-4 border-white rounded-full"></div>
            </div>
            <div>
              <p className="text-orange-600 font-black text-[10px] uppercase tracking-[0.2em] mb-1">Espace Formateur</p>
              <h2 className="text-3xl font-black text-slate-900 leading-none">Bienvenue, {currentUser.name}</h2>
              <p className="text-slate-400 font-medium mt-2">{currentUser.role} • {courses.length} modules assignés</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Dernière connexion</p>
              <p className="text-sm font-bold text-slate-700">Aujourd'hui à 14:30</p>
            </div>
            <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400"><span className="material-symbols-outlined">schedule</span></div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Espaces Pédagogiques</h1>
            <p className="text-slate-500 font-medium">Gérez vos matières et vos ressources.</p>
          </div>
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}><span className="material-symbols-outlined block">grid_view</span></button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}><span className="material-symbols-outlined block">format_list_bulleted</span></button>
          </div>
        </div>

        <div className="relative group max-w-2xl">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un module..."
            className="w-full h-16 pl-14 pr-6 bg-white border-none rounded-[1.5rem] shadow-sm focus:ring-2 focus:ring-orange-500/20 text-slate-900 font-medium outline-none transition-all"
          />
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className="group bg-white rounded-[2.5rem] p-3 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-500 flex flex-col cursor-pointer"
              >
                <div className="relative h-52 rounded-[2rem] overflow-hidden">
                  <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full"><span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{course.id}</span></div>
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${course.status === 'En cours' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>{course.status}</div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-orange-600 transition-colors">{course.title}</h3>
                    <p className="text-slate-400 text-sm font-medium mt-1">{course.level}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-600"><span className="material-symbols-outlined text-lg">group</span><span className="text-sm font-bold">{course.studentsCount} Étudiants</span></div>
                    <div className="text-orange-600 bg-orange-50 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-tighter italic">{course.semester}</div>
                  </div>
                  <button className="w-full h-12 bg-slate-900 hover:bg-orange-600 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 group/btn">
                    Gérer l'espace<span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">edit_document</span>
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
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Matière</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Groupe</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCourses.map((course) => (
                  <tr key={course.id} onClick={() => setSelectedCourseId(course.id)} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                    <td className="px-8 py-6 flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs uppercase italic">{course.id.split('-')[0]}</div>
                      <span className="font-bold text-slate-900 group-hover:text-orange-600">{course.title}</span>
                    </td>
                    <td className="px-8 py-6 text-slate-500 font-medium">{course.level}</td>
                    <td className="px-8 py-6"><button className="text-orange-600 font-bold text-sm hover:underline italic">Accéder</button></td>
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