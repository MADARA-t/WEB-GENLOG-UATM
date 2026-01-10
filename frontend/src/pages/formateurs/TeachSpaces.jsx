import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION SUPABASE ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- COMPOSANT MODALE EXTRAIT ---
const AssignmentModal = ({ 
  setIsAddingAssignment, 
  newAssignment, 
  setNewAssignment, 
  activeModalTab, 
  setActiveModalTab, 
  handleCreateAssignment, 
  selectedCourse, 
  toggleStudentSelection,
  isSubmitting 
}) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
    <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Nouveau Devoir</h2>
          <div className="flex gap-4 mt-4 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveModalTab('info')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeModalTab === 'info' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
            >
              Informations
            </button>
            {newAssignment.isCollective && (
              <button 
                onClick={() => setActiveModalTab('team')}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeModalTab === 'team' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
              >
                Assignation Équipe
              </button>
            )}
          </div>
        </div>
        <button onClick={() => setIsAddingAssignment(false)} className="size-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {activeModalTab === 'info' ? (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if(!newAssignment.isCollective) handleCreateAssignment(e); else setActiveModalTab('team'); }}>
          <div className="flex items-center justify-between bg-orange-50 p-4 rounded-2xl border border-orange-100">
            <div>
              <p className="text-xs font-black text-orange-600 uppercase tracking-widest">Type de devoir</p>
              <p className="text-[10px] text-orange-400 font-medium">Individuel ou par groupe d'étudiants</p>
            </div>
            <div className="flex bg-white p-1 rounded-xl border border-orange-200">
              <button 
                type="button"
                onClick={() => setNewAssignment({...newAssignment, isCollective: false})}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${!newAssignment.isCollective ? 'bg-slate-900 text-white' : 'text-slate-400'}`}
              >
                Solo
              </button>
              <button 
                type="button"
                onClick={() => setNewAssignment({...newAssignment, isCollective: true})}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${newAssignment.isCollective ? 'bg-slate-900 text-white' : 'text-slate-400'}`}
              >
                Équipe
              </button>
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Document joint</label>
              <label className="flex items-center justify-center w-full h-12 px-4 bg-orange-50 border-2 border-dashed border-orange-200 rounded-xl mt-1 cursor-pointer hover:bg-orange-100 transition-all">
                <span className="text-[10px] font-black text-orange-600 uppercase truncate">
                  {newAssignment.file ? newAssignment.file.name : "Importer"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setNewAssignment({ ...newAssignment, file: e.target.files[0] })}
                />
              </label>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Barème (Points)</label>
              <input
                type="number"
                className="w-full h-12 px-4 bg-slate-50 border-none rounded-xl mt-1 font-medium outline-none focus:ring-2 focus:ring-orange-500/20"
                placeholder="20"
                value={newAssignment.points || ''}
                onChange={(e) => setNewAssignment({ ...newAssignment, points: e.target.value })}
              />
            </div>
          </div>

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
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all mt-4 flex items-center justify-center gap-2 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-orange-600 text-white shadow-lg'}`}
          >
            {isSubmitting ? (
              <><span className="animate-pulse">Création en cours...</span></>
            ) : (
              newAssignment.isCollective ? "Suivant : Choisir l'équipe" : "Créer le devoir"
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sélectionnez les membres ({newAssignment.assignedStudents.length})</p>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {selectedCourse?.students.map(student => (
                <div 
                  key={student.id} 
                  onClick={() => toggleStudentSelection(student.id)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${newAssignment.assignedStudents.includes(student.id) ? 'bg-orange-50 border-orange-200' : 'bg-white border-transparent hover:border-slate-200'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">{student.name.charAt(0)}</div>
                    <span className="text-sm font-bold text-slate-700">{student.name}</span>
                  </div>
                  {newAssignment.assignedStudents.includes(student.id) && (
                    <span className="material-symbols-outlined text-orange-600 text-lg">check_circle</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setActiveModalTab('info')} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Retour</button>
            <button 
              onClick={handleCreateAssignment} 
              disabled={isSubmitting}
              className={`flex-[2] py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-orange-600'}`}
            >
              {isSubmitting ? "Création..." : "Confirmer et créer"}
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);

const InstructorSpaces = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [activeTab, setActiveTab] = useState('resources');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);

  const [isAddingAssignment, setIsAddingAssignment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const editFileRef = useRef(null);

  const [newAssignment, setNewAssignment] = useState({ 
    title: '', 
    deadline: '', 
    status: 'En cours', 
    description: '', 
    points: '20',
    file: null,
    isCollective: false,
    assignedStudents: [] 
  });
  
  const [activeModalTab, setActiveModalTab] = useState('info'); 
  const [detailView, setDetailView] = useState(null);
  
  const [currentUser, setCurrentUser] = useState({
    id: null,
    name: "Chargement...",
    role: "Formateur",
    avatar: ""
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginTime, setLoginTime] = useState("En cours...");

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setCurrentUser({
        id: savedUser.id,
        name: savedUser.name,
        role: savedUser.role || "Professeur",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${savedUser.name}`
      });
      fetchInstructorCourses(savedUser.id);
      const time = localStorage.getItem('loginTime') || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLoginTime(time);
    }
  }, []);

  const fetchInstructorCourses = async (userId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subjects')
        .select(`
          *,
          subject_tasks (
            *,
            task_submissions (*)
          ),
          subject_enrollments (
            student_id,
            users (id, name)
          )
        `)
        .eq('instructor_id', userId);

      if (error) throw error;

      const formattedCourses = data.map(s => ({
        id: s.id.toString(),
        title: s.title,
        level: s.promo_full,
        studentsCount: s.subject_enrollments?.length || 0,
        semester: s.semester,
        img: s.image_url,
        status: "En cours",
        description: "",
        resources: [],
        assignments: s.subject_tasks.map(t => ({
          id: t.id,
          title: t.title,
          deadline: t.deadline,
          status: t.status,
          description: t.instructions,
          points: t.points || 20,
          isCollective: t.is_collective || false,
          attachment_url: t.attachment_url,
          submissions: t.task_submissions?.map(sub => ({
            studentId: sub.student_id,
            grade: sub.grade,
            file: sub.file_url,
            date: new Date(sub.submitted_at).toLocaleDateString(),
            studentName: s.subject_enrollments.find(se => se.student_id === sub.student_id)?.users.name || "Étudiant"
          })) || []
        })),
        students: s.subject_enrollments.map(se => ({
          id: se.users.id,
          name: se.users.name
        }))
      }));

      setCourses(formattedCourses);
    } catch (err) {
      console.error("Erreur:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const selectedAssignment = selectedCourse?.assignments.find(a => a.id === selectedAssignmentId);

  const toggleStudentSelection = (studentId) => {
    setNewAssignment(prev => ({
      ...prev,
      assignedStudents: prev.assignedStudents.includes(studentId)
        ? prev.assignedStudents.filter(id => id !== studentId)
        : [...prev.assignedStudents, studentId]
    }));
  };

  const handleCreateAssignment = async (e) => {
    if(e) e.preventDefault();
    setIsSubmitting(true);
    
    let fileUrl = null;
    try {
      if (newAssignment.file) {
        const file = newAssignment.file;
        const filePath = `${Math.random()}.${file.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage.from('task-attachments').upload(filePath, file);
        if (!uploadError) {
          const { data: publicData } = supabase.storage.from('task-attachments').getPublicUrl(filePath);
          fileUrl = publicData.publicUrl;
        }
      }
      
      const { data, error } = await supabase
        .from('subject_tasks')
        .insert([{
          subject_id: parseInt(selectedCourseId),
          title: newAssignment.title,
          instructions: newAssignment.description,
          deadline: newAssignment.deadline,
          status: 'En cours',
          points: newAssignment.points,
          is_collective: newAssignment.isCollective,
          attachment_url: fileUrl
        }]).select();

      if (!error) {
        await fetchInstructorCourses(currentUser.id);
        setIsAddingAssignment(false);
        setNewAssignment({ title: '', deadline: '', status: 'En cours', description: '', points: '20', file: null, isCollective: false, assignedStudents: [] });
        setActiveModalTab('info');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGradeStudent = async (assignmentId, studentId, grade) => {
    if (!grade || isNaN(grade)) return;
    try {
      const { error } = await supabase
        .from('task_submissions')
        .upsert({ 
          task_id: assignmentId, 
          student_id: studentId, 
          grade: parseFloat(grade) 
        }, { onConflict: 'task_id, student_id' });

      if (error) throw error;

      setCourses(prev => prev.map(c => {
        if (c.id === selectedCourseId) {
          return {
            ...c,
            assignments: c.assignments.map(a => {
              if (a.id === assignmentId) {
                return {
                  ...a,
                  submissions: a.submissions.some(s => s.studentId === studentId)
                    ? a.submissions.map(s => s.studentId === studentId ? { ...s, grade: parseFloat(grade) } : s)
                    : [...a.submissions, { studentId, grade: parseFloat(grade), studentName: c.students.find(st => st.id === studentId)?.name || "Étudiant" }]
                };
              }
              return a;
            })
          };
        }
        return c;
      }));
    } catch (err) {
      console.error("Erreur notation:", err.message);
    }
  };

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex-1 min-h-screen bg-[#f8fafc] flex items-center justify-center font-black text-slate-400 uppercase tracking-widest animate-pulse">Chargement de vos espaces...</div>;

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
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-black text-slate-900">{selectedAssignment.title}</h1>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase ${selectedAssignment.isCollective ? 'border-orange-200 text-orange-500' : 'border-slate-200 text-slate-400'}`}>
                      {selectedAssignment.isCollective ? 'Équipe' : 'Solo'}
                    </span>
                  </div>
                  <p className="text-slate-400 mt-2 font-medium">{selectedAssignment.description}</p>
                  
                  {selectedAssignment.attachment_url && (
                    <a 
                      href={selectedAssignment.attachment_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-black uppercase hover:bg-orange-100 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">download</span> Voir la ressource jointe
                    </a>
                  )}
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
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter italic">Soumis le {sub.date} • {sub.file || 'Document'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                      <button className="text-slate-400 hover:text-slate-900"><span className="material-symbols-outlined">download</span></button>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Note :</span>
                        <input
                          type="number"
                          min="0" max="20"
                          defaultValue={sub.grade}
                          onBlur={(e) => handleGradeStudent(selectedAssignment.id, sub.studentId, e.target.value)}
                          placeholder={`/${selectedAssignment.points}`}
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
                    } <span className="text-sm text-white/40">/ {selectedAssignment.points}</span>
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
        {isAddingAssignment && (
          <AssignmentModal 
            setIsAddingAssignment={setIsAddingAssignment}
            newAssignment={newAssignment}
            setNewAssignment={setNewAssignment}
            activeModalTab={activeModalTab}
            setActiveModalTab={setActiveModalTab}
            handleCreateAssignment={handleCreateAssignment}
            selectedCourse={selectedCourse}
            toggleStudentSelection={toggleStudentSelection}
            isSubmitting={isSubmitting}
          />
        )}

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
                          <div className="flex items-center gap-2 mt-2">
                            <h2 className="text-3xl font-black text-slate-900">{detailView.title}</h2>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase ${detailView.isCollective ? 'border-orange-200 text-orange-500' : 'border-slate-200 text-slate-400'}`}>
                              {detailView.isCollective ? 'Équipe' : 'Solo'}
                            </span>
                          </div>
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
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900 text-lg">{task.title}</h4>
                              <span className={`text-[7px] font-black px-1.5 py-0.5 rounded border uppercase ${task.isCollective ? 'border-orange-200 text-orange-500' : 'border-slate-200 text-slate-400'}`}>
                                {task.isCollective ? 'Équipe' : 'Solo'}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-slate-400 text-xs font-bold">
                              <span>{task.deadline}</span>
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
              <img src={currentUser.avatar} alt={currentUser.name} className="size-20 rounded-[2rem] object-cover ring-4 ring-orange-50 bg-slate-100" />
              <div className="absolute -bottom-1 -right-1 size-6 bg-green-500 border-4 border-white rounded-full"></div>
            </div>
            <div>
              <p className="text-orange-600 font-black text-[10px] uppercase tracking-[0.2em] mb-1">Espace Formateur</p>
              <h2 className="text-3xl font-black text-slate-900 leading-none">Bienvenue, {currentUser.name}</h2>
              <p className="text-slate-400 font-medium mt-2">{currentUser.role}</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Dernière connexion</p>
              <p className="text-sm font-bold text-slate-700">Aujourd'hui à {loginTime}</p>
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