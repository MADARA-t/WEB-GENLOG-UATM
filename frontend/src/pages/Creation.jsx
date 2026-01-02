import React, { useState } from 'react';

const AssignmentManagement = ({ onBack }) => {
    // --- NOUVEAUX ÉTATS POUR LES ACTIONS ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null); // Pour l'édition ou les détails
    const [viewMode, setViewMode] = useState(null); // 'edit' | 'details'

    // Mock data pour les devoirs
    const [assignments] = useState([
        {
            id: 1,
            title: "Analyse de cas : Campagne Q3",
            subject: "Marketing Digital",
            teacher: "Mme. Dubois",
            type: "Individuel",
            startDate: "20 Oct 25",
            endDate: "30 Oct 25",
            status: "Brouillon",
            color: "orange",
            description: "Analyse complète des indicateurs de performance du troisième trimestre."
        },
        {
            id: 2,
            title: "Projet Final : Portfolio React",
            subject: "Développement Web",
            teacher: "M. Martin",
            type: "Individuel",
            startDate: "En cours",
            endDate: "15 Nov 25",
            status: "Publié",
            submissions: 12,
            color: "blue",
            description: "Création d'une application single-page avec React et Tailwind CSS."
        },
        {
            id: 3,
            title: "Wireframes & Prototypage",
            subject: "UX Design",
            teacher: "Groupe A",
            type: "Collectif",
            startDate: "01 Nov 25",
            endDate: "10 Nov 25",
            status: "Programmé",
            color: "purple",
            description: "Réalisation des maquettes basse fidélité pour l'application mobile."
        }
    ]);

    // --- HANDLERS ---
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
        <div className="p-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative">
            
            {/* --- FENÊTRE DÉDIÉE (MODALE ACTIONNELLE) --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header Modale */}
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                                    {viewMode === 'edit' ? (selectedAssignment ? 'Modifier le devoir' : 'Nouveau devoir') : 'Détails du devoir'}
                                </h2>
                                <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mt-1">
                                    {selectedAssignment?.subject || 'Nouvelle configuration'}
                                </p>
                            </div>
                            <button onClick={closeModal} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Corps Modale */}
                        <div className="p-8 max-h-[70vh] overflow-y-auto">
                            {viewMode === 'edit' ? (
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Titre du devoir</label>
                                            <input type="text" defaultValue={selectedAssignment?.title} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Ex: Analyse de cas..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Type</label>
                                            <select defaultValue={selectedAssignment?.type} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none">
                                                <option>Individuel</option>
                                                <option>Collectif</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Consignes</label>
                                        <textarea rows="4" defaultValue={selectedAssignment?.description} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none" placeholder="Détaillez les attentes..."></textarea>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex gap-4 items-start bg-orange-50 p-6 rounded-[2rem] border border-orange-100">
                                        <span className="material-symbols-outlined text-orange-500 text-3xl">info</span>
                                        <p className="text-slate-700 font-medium leading-relaxed">
                                            {selectedAssignment?.description || "Aucune description fournie pour ce devoir."}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-2xl">
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Date limite</p>
                                            <p className="text-sm font-bold text-slate-900">{selectedAssignment?.endDate}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl">
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Statut actuel</p>
                                            <p className="text-sm font-bold text-slate-900">{selectedAssignment?.status}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Modale */}
                        <div className="p-8 border-t border-slate-100 flex justify-end gap-4 bg-slate-50/30">
                            <button onClick={closeModal} className="px-6 py-3 text-xs font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">Annuler</button>
                            {viewMode === 'edit' && (
                                <button className="px-8 py-3 bg-orange-500 text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-orange-200">Enregistrer</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <header className="flex flex-col gap-6 mb-10">
                <nav className="flex items-center gap-2 text-sm font-medium">
                    <a className="text-[#f97415] hover:text-[#e0630b] transition-colors" href="#">Madara</a>
                    <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
                    <a className="text-[#f97415] hover:text-[#e0630b] transition-colors" href="#">Travaux</a>
                    <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
                    <span className="text-slate-500">Création de devoirs</span>
                </nav>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 rounded-full hover:bg-white text-slate-400 hover:text-[#f97415] border border-transparent hover:border-orange-100 transition-all">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-[1.1]">
                            Création de Devoirs
                        </h1>
                    </div>
                    <p className="text-slate-500 text-lg max-w-3xl font-light leading-relaxed">
                        Concevez de nouveaux devoirs, définissez les consignes et gérez les dates de disponibilité. Configurez le type de travail et suivez l'état de publication.
                    </p>
                </div>
            </header>

            {/* Toolbar */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 top-0 z-10 bg-[#fffaf5]/95 backdrop-blur-sm py-4 -my-4 mb-6 transition-all">
                <div className="flex flex-wrap items-center gap-3">
                    <FilterDropdown label="Matière" />
                    <FilterDropdown label="Formateur" />
                    <FilterDropdown label="Statut" />
                </div>

                <button onClick={handleCreateNew} className="flex items-center justify-center gap-3 bg-[#f97415] hover:bg-[#e0630b] text-white px-8 py-3.5 rounded-full shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all active:scale-95 group">
                    <span className="material-symbols-outlined text-[24px] group-hover:rotate-90 transition-transform">add_circle</span>
                    <span className="text-sm font-bold tracking-wider uppercase">Créer un nouveau devoir</span>
                </button>
            </div>

            {/* Grid de Devoirs */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {assignments.map((assignment) => (
                    <AssignmentCard 
                        key={assignment.id} 
                        data={assignment} 
                        onEdit={() => handleOpenEdit(assignment)}
                        onViewDetails={() => handleOpenDetails(assignment)}
                    />
                ))}

                {/* Card Modèle Rapide */}
                <div onClick={handleCreateNew} className="group relative rounded-[2rem] p-7 flex flex-col gap-4 border-2 border-dashed border-slate-200 justify-center items-center text-center hover:border-[#f97415] hover:bg-orange-50/30 transition-all cursor-pointer min-h-[300px]">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:text-[#f97415] transition-colors text-slate-300 mb-2">
                        <span className="material-symbols-outlined text-[32px]">post_add</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-500 group-hover:text-[#f97415] transition-colors">Modèle Rapide</h3>
                    <p className="text-slate-400 text-sm max-w-[200px]">Utilisez un modèle pré-existant pour créer un devoir en quelques clics.</p>
                </div>
            </div>
        </div>
    );
};

// --- Sous-composants ---

const FilterDropdown = ({ label }) => (
    <div className="relative group">
        <button className="flex items-center gap-2 bg-white border border-slate-200 hover:border-[#f97415]/50 text-slate-700 px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md">
            <span className="text-sm font-bold tracking-wide uppercase">{label}</span>
            <span className="material-symbols-outlined text-slate-400 group-hover:text-[#f97415] text-[20px]">keyboard_arrow_down</span>
        </button>
    </div>
);

const AssignmentCard = ({ data, onEdit, onViewDetails }) => {
    const [showOptions, setShowOptions] = useState(false);

    const colorClasses = {
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
        green: "bg-green-50 text-green-600 border-green-100"
    };

    return (
        <article className="group relative bg-white rounded-[2rem] p-7 flex flex-col gap-6 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start">
                <span className={`${colorClasses[data.color] || colorClasses.orange} px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border`}>
                    {data.subject}
                </span>
                <div className="flex gap-1 relative">
                    <button className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowOptions(!showOptions); }}
                        className={`transition-colors p-1 rounded-full hover:bg-slate-50 ${showOptions ? 'text-[#f97415] bg-orange-50' : 'text-slate-300'}`}
                    >
                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>

                    {/* --- MENU CONTEXTUEL DES 3 POINTS --- */}
                    {showOptions && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowOptions(false)}></div>
                            <div className="absolute right-0 top-10 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                <button onClick={() => { onEdit(); setShowOptions(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-600 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                    <span className="text-xs font-bold uppercase">Modifier</span>
                                </button>
                                <button onClick={() => { onViewDetails(); setShowOptions(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-600 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                                    <span className="text-xs font-bold uppercase">Détails</span>
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-600 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                    <span className="text-xs font-bold uppercase">Dupliquer</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2" onClick={onViewDetails}>
                <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-[#f97415] transition-colors cursor-pointer">
                    {data.title}
                </h3>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    <span>{data.teacher}</span>
                    <span className="text-slate-300">•</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium text-slate-600">{data.type}</span>
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-50 flex flex-col gap-4">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-400 font-medium">
                        <span className="material-symbols-outlined text-[20px]">date_range</span>
                        <span>Début: {data.startDate}</span>
                    </div>
                    <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">Fin: {data.endDate}</span>
                </div>

                <div className="flex items-center gap-3">
                    <StatusBadge status={data.status} />
                    <button 
                        onClick={data.status === 'Publié' ? onViewDetails : onEdit}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#f97415] text-white py-2.5 px-4 rounded-full text-sm font-bold uppercase tracking-wide hover:bg-[#e0630b] transition-colors shadow-md shadow-orange-500/10"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {data.status === 'Publié' ? 'folder_open' : 'edit'}
                        </span>
                        {data.status === 'Publié' ? `Dépôts (${data.submissions})` : 'Modifier'}
                    </button>
                </div>
            </div>
        </article>
    );
};

const StatusBadge = ({ status }) => {
    const config = {
        "Brouillon": "bg-slate-100 text-slate-500 border-slate-200",
        "Publié": "bg-green-50 text-green-700 border-green-100",
        "Programmé": "bg-blue-50 text-blue-600 border-blue-100",
    };
    const iconName = status === "Brouillon" ? "edit_note" : status === "Publié" ? "public" : "schedule_send";

    return (
        <span className={`flex items-center gap-1.5 pl-1 pr-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${config[status]}`}>
            <span className="material-symbols-outlined text-[16px]">{iconName}</span>
            {status}
        </span>
    );
};

export default AssignmentManagement;