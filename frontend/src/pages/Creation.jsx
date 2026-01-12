import React, { useState, useRef } from 'react';

const AssignmentManagement = ({ onBack }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [viewMode, setViewMode] = useState(null);
    const fileInputRef = useRef(null);

    // Mock data pour l'espace pédagogique
    const [assignments] = useState([
       
    ]);

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
    };

    return (
        <div className="min-h-screen bg-[#fffcf9] p-6 md:p-10 pb-20 font-sans text-slate-900">
            
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
                                <form className="space-y-8">
                                    {/* Titre et Type */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Titre du devoir</label>
                                            <input type="text" defaultValue={selectedAssignment?.title} className="w-full px-6 py-4 bg-slate-100/50 border-2 border-transparent focus:border-orange-500/20 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all" placeholder="Ex: Étude de marché..." />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Format</label>
                                            <select defaultValue={selectedAssignment?.type} className="w-full px-6 py-4 bg-slate-100/50 border-2 border-transparent focus:border-orange-500/20 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all">
                                                <option>Individuel</option>
                                                <option>Collectif</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Section Deadline */}
                                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="material-symbols-outlined text-slate-400">schedule</span>
                                            <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Dates et échéances</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase text-slate-400">Date de début</label>
                                                <input type="date" defaultValue={selectedAssignment?.startDate} className="w-full px-5 py-3.5 bg-white border-none rounded-xl font-bold text-sm shadow-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase text-slate-400">Deadline (Date & Heure)</label>
                                                <div className="flex gap-2">
                                                    <input type="date" defaultValue={selectedAssignment?.endDate} className="flex-1 px-5 py-3.5 bg-white border-none rounded-xl font-bold text-sm shadow-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                                                    <input type="time" defaultValue={selectedAssignment?.endTime || "23:59"} className="w-32 px-4 py-3.5 bg-white border-none rounded-xl font-bold text-sm shadow-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Consignes</label>
                                        <textarea rows="4" defaultValue={selectedAssignment?.description} className="w-full px-6 py-4 bg-slate-100/50 border-2 border-transparent focus:border-orange-500/20 focus:bg-white rounded-2xl font-medium text-slate-600 outline-none resize-none transition-all" placeholder="Décrivez les attentes..."></textarea>
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

                                    {selectedAssignment?.files?.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest ml-2">Ressources jointes</h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {selectedAssignment.files.map((file, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                                        <div className="flex items-center gap-3">
                                                            <span className="material-symbols-outlined text-orange-500">description</span>
                                                            <span className="text-sm font-bold text-slate-700">{file}</span>
                                                        </div>
                                                        <button className="text-slate-400 hover:text-orange-500 transition-colors">
                                                            <span className="material-symbols-outlined">download</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer Modale */}
                        <div className="p-8 border-t border-slate-50 flex justify-between items-center bg-white">
                            <button onClick={closeModal} className="text-xs font-black uppercase text-slate-400 hover:text-slate-800 transition-colors tracking-widest">Annuler</button>
                            {viewMode === 'edit' && (
                                <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-slate-200">
                                    Enregistrer le devoir
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

            {/* GRILLE */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {assignments.map((assignment) => (
                    <div key={assignment.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all flex flex-col min-h-[300px]">
                        <div className="flex justify-between items-start mb-6">
                            <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                                {assignment.subject}
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
                ))}
            </div>
        </div>
    );
};

export default AssignmentManagement;