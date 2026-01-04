import React, { useState, useRef } from 'react';

const InstructorSpaces = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null); // On stocke l'ID pour garder la référence au state
  const [activeTab, setActiveTab] = useState('resources');
  
  const [isAddingAssignment, setIsAddingAssignment] = useState(false);
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);
  const fileInputRef = useRef(null);

  // État du formulaire de nouveau devoir
  const [newAssignment, setNewAssignment] = useState({ title: '', deadline: '', status: 'En cours' });

  const currentUser = {
    name: "Dr. Jean-Pierre Castaldi",
    role: "Professeur Titulaire",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  };

  const [courses, setCourses] = useState([
    {
      id: "WEB-301",
      title: "Développement Web Avancé",
      level: "Licence 3 • Groupe A",
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
        { id: 1, title: "Projet Single Page Application", deadline: "2025-11-24", status: "En cours" }
      ],
      students: [
        { id: 1, name: "Marc Dubois", email: "m.dubois@ecole.com" },
        { id: 2, name: "Sophie Martin", email: "s.martin@ecole.com" }
      ]
    },
    {
      id: "UX-202",
      title: "Design d'Interface & Ergonomie",
      level: "Licence 2 • Groupe B",
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
      level: "Master 1 • Promo 2026",
      studentsCount: 32,
      semester: "Semestre 1",
      img: "https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=600",
      status: "En cours",
      description: "Exploration de données avec Pandas, NumPy et visualisation avec Matplotlib.",
      resources: [],
      assignments: [{ id: 2, title: "Analyse Exploratoire - Dataset Titanic", deadline: "2025-12-15", status: "Bientôt" }],
      students: []
    }
  ]);

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  // Fonction pour ajouter le devoir au cours actuel
  const handleCreateAssignment = (e) => {
    e.preventDefault();
    const createdAssignment = {
      ...newAssignment,
      id: Date.now(),
    };

    setCourses(courses.map(c => {
      if (c.id === selectedCourseId) {
        return { ...c, assignments: [createdAssignment, ...c.assignments] };
      }
      return c;
    }));

    setIsAddingAssignment(false);
    setNewAssignment({ title: '', deadline: '', status: 'En cours' });
  };

  const updateDeadline = (courseId, assignmentId, newDate) => {
    setCourses(courses.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          assignments: c.assignments.map(a => a.id === assignmentId ? { ...a, deadline: newDate } : a)
        };
      }
      return c;
    }));
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // MODALE NOUVEAU DEVOIR
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
              onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
              required 
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Consignes</label>
            <textarea className="w-full p-4 bg-slate-50 border-none rounded-xl mt-1 font-medium h-32 outline-none focus:ring-2 focus:ring-orange-500/20" placeholder="Décrivez les attentes..." required></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Date d'échéance</label>
              <input 
                type="date" 
                className="w-full h-12 px-4 bg-slate-50 border-none rounded-xl mt-1 font-medium outline-none focus:ring-2 focus:ring-orange-500/20" 
                value={newAssignment.deadline}
                onChange={(e) => setNewAssignment({...newAssignment, deadline: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Fichier joint</label>
              <button type="button" className="w-full h-12 px-4 bg-orange-50 text-orange-600 border border-orange-200 border-dashed rounded-xl mt-1 font-bold text-xs flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">attach_file</span> Joindre un PDF
              </button>
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all mt-4">
            Créer et notifier les étudiants
          </button>
        </form>
      </div>
    </div>
  );

  // MODALE NOUVELLE ANNONCE
  const AnnouncementModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
             <div className="size-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <span className="material-symbols-outlined">campaign</span>
             </div>
             <h2 className="text-2xl font-black text-slate-900">Publier une annonce</h2>
          </div>
          <button onClick={() => setIsAddingAnnouncement(false)} className="size-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddingAnnouncement(false); alert("Annonce publiée !"); }}>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Sujet de l'annonce</label>
            <input type="text" className="w-full h-12 px-4 bg-slate-50 border-none rounded-xl mt-1 font-medium outline-none focus:ring-2 focus:ring-orange-500/20" placeholder="ex: Report de cours..." required />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Message aux étudiants</label>
            <textarea className="w-full p-4 bg-slate-50 border-none rounded-xl mt-1 font-medium h-40 outline-none focus:ring-2 focus:ring-orange-500/20" placeholder="Tapez votre message..." required></textarea>
          </div>
          <button type="submit" className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20">
            Diffuser l'information
          </button>
        </form>
      </div>
    </div>
  );

  if (selectedCourse) {
    return (
      <div className="flex-1 min-h-screen bg-[#f8fafc] font-['Lexend'] antialiased">
        {isAddingAssignment && <AssignmentModal />}
        {isAddingAnnouncement && <AnnouncementModal />}
        <input type="file" ref={fileInputRef} onChange={(e) => e.target.files[0] && alert("Fichier chargé")} className="hidden" />

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
                <button className="h-12 px-6 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-orange-50 transition-colors flex items-center gap-2 shadow-xl">
                  <span className="material-symbols-outlined text-xl">share</span>Partager l'espace
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-b border-slate-100 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 flex gap-8">
            {[
              { id: 'resources', label: 'Supports & Ressources', icon: 'folder_open' },
              { id: 'assignments', label: 'Travaux & Devoirs', icon: 'assignment' },
              { id: 'students', label: 'Liste Étudiants', icon: 'groups' }
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
                  <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 text-orange-600 font-black text-xs uppercase hover:bg-orange-50 p-2 rounded-xl transition-all">
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
                          <button onClick={() => confirm("Supprimer ?")} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined">delete</span></button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div onClick={() => fileInputRef.current.click()} className="h-64 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-4 cursor-pointer">
                      <span className="material-symbols-outlined text-5xl">cloud_upload</span>
                      <p className="font-medium italic text-sm text-center">Glissez vos fichiers ici ou utilisez le bouton d'ajout.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-xl font-bold text-slate-900">Travaux à rendre</h2>
                  <button onClick={() => setIsAddingAssignment(true)} className="h-10 px-4 bg-orange-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">add</span>Créer un devoir
                  </button>
                </div>
                {selectedCourse.assignments.map((task, i) => (
                  <div key={task.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group">
                    <div className="flex items-center gap-5">
                      <div className="size-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                        <span className="material-symbols-outlined text-3xl">assignment</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{task.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                             <span className="material-symbols-outlined text-sm text-slate-400">calendar_month</span>
                             <input 
                                type="date" 
                                value={task.deadline} 
                                onChange={(e) => updateDeadline(selectedCourse.id, task.id, e.target.value)}
                                className="text-xs font-bold text-slate-400 bg-transparent border-none p-0 focus:text-orange-600 focus:ring-0 cursor-pointer"
                             />
                          </div>
                          <span className="size-1 bg-slate-200 rounded-full"/>
                          <span className="text-[10px] font-black uppercase text-green-500">{task.status}</span>
                        </div>
                      </div>
                    </div>
                    <button className="h-10 px-5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-orange-600 transition-all">Gérer les rendus</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'students' && (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                 <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Étudiant</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
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
                        <td className="px-8 py-5 text-slate-500 text-sm font-medium">{student.email}</td>
                        <td className="px-8 py-5">
                          <a href={`mailto:${student.email}`} className="p-2 text-slate-300 hover:text-orange-500 transition-colors block"><span className="material-symbols-outlined text-lg">mail</span></a>
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
               <div className="mt-10 pt-8 border-t border-white/10">
                  <button onClick={() => setIsAddingAnnouncement(true)} className="w-full py-4 bg-orange-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-900/20">Publier une annonce</button>
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
        {/* Barre de Bienvenue... (identique au précédent) */}
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