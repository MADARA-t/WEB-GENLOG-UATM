import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION BACKEND ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const AssignmentManagement = ({ onBack }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [viewMode, setViewMode] = useState(null);
    const fileInputRef = useRef(null);

    // --- ÉTATS POUR LES DONNÉES RÉELLES ---
    const [assignments, setAssignments] = useState([]); // Initialement vide pour n'afficher que le contenu DB
    const [allStudents, setAllStudents] = useState([]);
    const [groups, setGroups] = useState([{ id: 1, members: [] }]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    // --- LOGIQUE DE RÉCUPÉRATION ---
    const fetchData = async () => {
        // Récupération des devoirs créés
        const { data: assignmentsData, error: assError } = await supabase
            .from('assignments')
            .select('*')
            .order('created_at', { ascending: false });

        // Récupération des étudiants pour la sélection de groupe
        const { data: studentsData } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'Étudiant');

        if (assignmentsData) setAssignments(assignmentsData);
        if (studentsData) setAllStudents(studentsData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- ACTIONS BACKEND ---
    const showToast = (msg, type = "success") => {
        setToast({ show: true, message: msg, type });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);
    };

    const handleSaveAssignment = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        
        const payload = {
            title: formData.get('title'),
            type: formData.get('type'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            endTime: formData.get('endTime'),
            description: formData.get('description'),
            status: 'Publié',
            // On enregistre la structure des groupes si c'est collectif
            assigned_groups: formData.get('type') === 'Collectif' ? groups : null
        };

        try {
            const { error } = await supabase.from('assignments').insert([payload]);
            if (error) throw error;
            showToast("Devoir créé et assigné avec succès !");
            fetchData();
            closeModal();
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    // --- GESTION DES GROUPES ---
    const addGroup = () => setGroups([...groups, { id: Date.now(), members: [] }]);
    
    const toggleStudentInGroup = (groupId, studentId) => {
        setGroups(groups.map(g => {
            if (g.id === groupId) {
                const isMember = g.members.includes(studentId);
                return {
                    ...g,
                    members: isMember ? g.members.filter(id => id !== studentId) : [...g.members, studentId]
                };
            }
            return g;
        }));
    };

    const handleOpenEdit = (assignment) => {
        setSelectedAssignment(assignment);
        setViewMode('edit');
        setIsModalOpen(true);
    };

    const handleOpenDetails = (assignment) => {
        setSelectedAssignment(assignment);
        setViewMode('details');
        setIsModalOpen(true);
    };

    const handleCreateNew = () => {
        setSelectedAssignment(null);
        setViewMode('edit');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAssignment(null);
        setViewMode(null);
        setGroups([{ id: 1, members: [] }]);
    };

    return (
        <div className="min-h-screen bg-[#fffcf9] p-6 md:p-10 pb-20 font-sans text-slate-900">
            
            {/* TOAST STATUS */}
            {toast.show && (
                <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl shadow-xl text-white font-bold text-[10px] uppercase tracking-widest animate-in slide-in-from-top-full ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {toast.message}
                </div>
            )}

            {/* MODALE DE GESTION */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
                        
                        {/* Header Modale */}
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                                    {viewMode === 'edit' ? (selectedAssignment ? 'Modifier le devoir' : 'Nouveau devoir') : 'Détails du devoir'}
                                </h2>
                                <div className="h-1 w-12 bg-orange-500 mt-1 rounded-full"></div>
                            </div>
                            <button onClick={closeModal} className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 hover:text-orange-600 shadow-sm border border-slate-100 transition-all">
                                <span className="material-symbols-outlined font-bold">close</span>
                            </button>
                        </div>

                        {/* Corps Modale */}
                        <div className="p-8 max-h-[75vh] overflow-y-auto">
                            {viewMode === 'edit' ? (
                                <form id="assignmentForm" onSubmit={handleSaveAssignment} className="space-y-8">
                                    {/* Titre et Type */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Titre du devoir</label>
                                            <input name="title" required type="text" defaultValue={selectedAssignment?.title} className="w-full px-6 py-4 bg-slate-100/50 border-2 border-transparent focus:border-orange-500/20 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all" placeholder="Ex: Étude de marché..." />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Format</label>
                                            <select name="type" id="typeToggle" defaultValue={selectedAssignment?.type || "Individuel"} className="w-full px-6 py-4 bg-slate-100/50 border-2 border-transparent focus:border-orange-500/20 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all">
                                                <option value="Individuel">Individuel</option>
                                                <option value="Collectif">Collectif</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* SELECTION DES GROUPES (Visible uniquement si Collectif) */}
                                    <div className="hidden group-config-panel space-y-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Assignation des groupes</h4>
                                            <button type="button" onClick={addGroup} className="px-4 py-2 bg-white rounded-xl text-[9px] font-black uppercase border border-slate-200 hover:border-orange-500 transition-colors">Ajouter un groupe</button>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 gap-4">
                                            {groups.map((group, index) => (
                                                <div key={group.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                                    <p className="text-[10px] font-black text-orange-500 uppercase mb-3">Groupe {index + 1} ({group.members.length} étudiants)</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {allStudents.map(student => (
                                                            <button 
                                                                type="button"
                                                                key={student.id}
                                                                onClick={() => toggleStudentInGroup(group.id, student.id)}
                                                                className={`px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all ${group.members.includes(student.id) ? 'bg-orange-500 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                            >
                                                                {student.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <style>{`#typeToggle:has(option[value="Collectif"]:checked) ~ .group-config-panel { display: block !important; }`}</style>

                                    {/* Section Deadline */}
                                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="material-symbols-outlined text-slate-400">schedule</span>
                                            <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Dates et échéances</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase text-slate-400">Date de début</label>
                                                <input name="startDate" type="date" defaultValue={selectedAssignment?.startDate} className="w-full px-5 py-3.5 bg-white border-none rounded-xl font-bold text-sm shadow-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase text-slate-400">Deadline (Date & Heure)</label>
                                                <div className="flex gap-2">
                                                    <input name="endDate" type="date" defaultValue={selectedAssignment?.endDate} className="flex-1 px-5 py-3.5 bg-white border-none rounded-xl font-bold text-sm shadow-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                                                    <input name="endTime" type="time" defaultValue={selectedAssignment?.endTime || "23:59"} className="w-32 px-4 py-3.5 bg-white border-none rounded-xl font-bold text-sm shadow-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Consignes</label>
                                        <textarea name="description" rows="4" defaultValue={selectedAssignment?.description} className="w-full px-6 py-4 bg-slate-100/50 border-2 border-transparent focus:border-orange-500/20 focus:bg-white rounded-2xl font-medium text-slate-600 outline-none resize-none transition-all" placeholder="Décrivez les attentes..."></textarea>
                                    </div>

                                    {/* Zone de fichiers */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Documents joints</label>
                                        <div 
                                            onClick={() => fileInputRef.current.click()}
                                            className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-orange-50/30 hover:border-orange-200 transition-all group cursor-pointer text-center"
                                        >
                                            <input type="file" ref={fileInputRef} className="hidden" multiple />
                                            <span className="material-symbols-outlined text-4xl text-slate-300 group-hover:text-orange-500 mb-2 transition-colors">attach_file</span>
                                            <p className="text-sm font-bold text-slate-500">Cliquez pour ajouter des fichiers</p>
                                            <p className="text-[10px] text-slate-400 uppercase mt-1 tracking-tight">PDF, DOCX, Images acceptés</p>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-8">
                                    <div className="flex gap-6 items-start bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                            <span className="material-symbols-outlined text-orange-500">info</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-slate-800 uppercase text-sm mb-2">Instructions</h4>
                                            <p className="text-slate-600 leading-relaxed font-medium">
                                                {selectedAssignment?.description || "Aucune consigne fournie."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6 bg-slate-50 rounded-3xl">
                                            <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Date Limite</span>
                                            <span className="text-sm font-bold text-slate-800">{selectedAssignment?.endDate} à {selectedAssignment?.endTime || "23:59"}</span>
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-3xl">
                                            <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Type de travail</span>
                                            <span className="text-sm font-bold text-slate-800">{selectedAssignment?.type}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Modale */}
                        <div className="p-8 border-t border-slate-50 flex justify-between items-center bg-white">
                            <button onClick={closeModal} className="text-xs font-black uppercase text-slate-400 hover:text-slate-800 transition-colors tracking-widest">Annuler</button>
                            {viewMode === 'edit' && (
                                <button form="assignmentForm" disabled={loading} type="submit" className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-slate-200">
                                    {loading ? 'Publication...' : 'Enregistrer le devoir'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER PAGE */}
            <header className="mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4 uppercase">
                            Gestion des <span className="text-orange-500">Devoirs</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-medium max-w-xl">
                            Espace de création et de suivi des travaux pédagogiques.
                        </p>
                    </div>
                    <button onClick={handleCreateNew} className="h-16 px-8 bg-orange-500 text-white rounded-2xl flex items-center gap-4 hover:bg-slate-900 transition-all shadow-2xl shadow-orange-100 group">
                        <span className="text-sm font-black uppercase tracking-widest">Créer un devoir</span>
                        <span className="material-symbols-outlined bg-white/20 p-1 rounded-lg">add</span>
                    </button>
                </div>
            </header>

            {/* GRILLE (Affiche uniquement les devoirs de la DB) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {assignments.length > 0 ? (
                    assignments.map((assignment) => (
                        <div key={assignment.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all flex flex-col min-h-[300px]">
                            <div className="flex justify-between items-start mb-6">
                                <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                                    {assignment.subject || "Général"}
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${assignment.status === 'Publié' ? 'bg-green-500' : 'bg-orange-400'}`}></div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{assignment.status}</span>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-slate-800 leading-tight mb-4">{assignment.title}</h3>

                            <div className="mt-auto pt-6 border-t border-slate-50 flex flex-col gap-4">
                                <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">event</span>
                                        {assignment.endDate}
                                    </div>
                                    <div>{assignment.endTime || "23:59"}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => handleOpenDetails(assignment)} className="py-3 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase hover:bg-slate-100 transition-colors">Détails</button>
                                    <button onClick={() => handleOpenEdit(assignment)} className="py-3 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-black uppercase hover:bg-orange-500 hover:text-white transition-all">Modifier</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                        <p className="text-slate-300 font-black uppercase tracking-widest text-sm">Aucun devoir créé pour le moment</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignmentManagement;