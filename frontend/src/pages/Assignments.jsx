import React, { useState } from 'react';

const DeadlinesManagement = ({ onBack }) => {
  const [activeDeadline, setActiveDeadline] = useState(null);
  
  // --- ÉTATS POUR LA SIMULATION D'EXPORT ---
  const [isExporting, setIsExporting] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);

  const [deadlines] = useState([
    {
      id: 1,
      day: "10",
      month: "OCT",
      title: "La Révolution Française : Analyse Critique",
      subject: "Histoire - 2e Année",
      promotion: "Sciences Po 2025",
      time: "18:00",
      status: "late",
      category: "Cette Semaine",
      description: "Étude approfondie des textes de 1789. Les étudiants doivent soumettre un PDF de 5 pages."
    },
    {
      id: 2,
      day: "14",
      month: "OCT",
      title: "Algèbre Linéaire : Devoir Maison #3",
      subject: "Mathématiques",
      promotion: "Eco-Gestion 2024",
      time: "23:59",
      status: "urgent",
      category: "Cette Semaine",
      description: "Résolution des systèmes matriciels complexes. Travail individuel requis."
    }
  ]);

  // --- FONCTION DE SIMULATION ---
  const handleExport = () => {
    setIsExporting(true);
    // On simule un délai de traitement de 2 secondes
    setTimeout(() => {
      setIsExporting(false);
      setShowExportToast(true);
      // On cache la notification après 3 secondes
      setTimeout(() => setShowExportToast(false), 3000);
    }, 2000);
  };

  return (
    <div className="w-full bg-[#fcfaf8] animate-in fade-in duration-500 font-['Lexend'] relative overflow-x-hidden min-h-screen">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');`}
      </style>

      {/* --- NOTIFICATION DE SUCCÈS (TOAST) --- */}
      {showExportToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-10 duration-500 border border-slate-700">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm">check</span>
          </div>
          <span className="text-[10px] font-[900] uppercase tracking-widest">Données exportées avec succès</span>
        </div>
      )}

      <main className={`w-full max-w-[1400px] mx-auto px-6 py-10 transition-all duration-500 ${activeDeadline ? 'opacity-50 pointer-events-none' : ''}`}>
        
        {/* Header Section */}
        <header className="mb-10 space-y-8">
          <nav className="flex mb-10 items-center gap-2 text-sm font-medium">
            <button onClick={onBack} className="text-[#f97415] hover:text-[#e0630b] transition-colors font-bold">Madara</button>
            <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
            <span className="text-slate-500 font-medium">Gestion des échéances</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-[900] text-slate-900 tracking-tighter leading-none mb-4 uppercase">
                GESTION DES <span className="text-[#f97415]">ÉCHÉANCES</span>
              </h1>
              <p className="text-slate-500 text-xl font-light leading-relaxed">
                Suivez et administrez les dates limites des devoirs pour toutes les promotions en un coup d'œil.
              </p>
            </div>
            
            {/* BOUTON EXPORTER AVEC LOGIQUE DE SIMULATION */}
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className={`flex items-center justify-center gap-3 px-8 py-4 rounded-full transition-all duration-300 shadow-xl active:scale-95 min-w-[240px]
                ${isExporting ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#f97415] hover:bg-[#c25409] text-white shadow-orange-500/20'}`}
            >
              <span className={`material-symbols-outlined ${isExporting ? 'animate-spin' : ''}`}>
                {isExporting ? 'sync' : 'download'}
              </span>
              <span className="font-[900] tracking-widest text-xs uppercase">
                {isExporting ? 'Génération du fichier...' : 'Exporter les données'}
              </span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
            <FilterButton label="Matière" />
            <FilterButton label="Formateur" />
            <FilterButton label="Promotion: Tous" active />
            <div className="ml-auto flex items-center gap-3 text-slate-400">
              <span className="material-symbols-outlined text-[20px]">sort</span>
              <span className="text-[10px] font-[900] uppercase tracking-[0.2em]">Trier par date</span>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="flex flex-col gap-12">
          <TimelineGroup title="Cette Semaine">
            {deadlines.map(item => (
              <DeadlineItem 
                key={item.id} 
                data={item} 
                onManage={() => setActiveDeadline(item)}
                isActive={activeDeadline?.id === item.id}
              />
            ))}
          </TimelineGroup>
        </div>
      </main>

      {/* --- SIDE PANEL (GESTIONNAIRE DÉDIÉ) --- */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.05)] z-50 transition-transform duration-500 ease-in-out border-l border-slate-100 ${activeDeadline ? 'translate-x-0' : 'translate-x-full'}`}>
        {activeDeadline && (
          <div className="flex flex-col h-full">
            {/* Panel Header */}
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-[#fffaf5]">
              <h2 className="font-[900] text-xl uppercase tracking-tighter text-slate-900">Gérer l'échéance</h2>
              <button onClick={() => setActiveDeadline(null)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-400 hover:text-red-500 shadow-sm transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 font-['Lexend']">
              <div>
                <span className="text-[10px] font-[900] text-orange-500 uppercase tracking-widest block mb-2">{activeDeadline.subject}</span>
                <h3 className="text-2xl font-[800] text-slate-900 leading-tight">{activeDeadline.title}</h3>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-[900] text-slate-400 uppercase tracking-widest">Date limite actuelle</span>
                    <span className="material-symbols-outlined text-slate-400">calendar_today</span>
                  </div>
                  <input type="date" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" defaultValue="2025-10-10" />
                  <input type="time" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" defaultValue={activeDeadline.time} />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-[900] text-slate-400 uppercase tracking-widest ml-2">Note au formateur / Instructions</label>
                  <textarea className="w-full bg-slate-50 border-none rounded-[1.5rem] p-5 text-sm font-medium min-h-[120px] outline-none focus:ring-2 focus:ring-orange-100" defaultValue={activeDeadline.description}></textarea>
                </div>
              </div>
            </div>

            {/* Panel Footer */}
            <div className="p-8 border-t border-slate-100 flex flex-col gap-3 bg-white">
              <button onClick={() => setActiveDeadline(null)} className="w-full bg-[#f97415] text-white py-4 rounded-2xl text-[10px] font-[900] uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20 hover:bg-[#e0630b] transition-all">
                Enregistrer les modifications
              </button>
              <button className="w-full bg-white text-red-500 border border-red-50 py-4 rounded-2xl text-[10px] font-[900] uppercase tracking-[0.2em] hover:bg-red-50 transition-all">
                Annuler le devoir
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay pour fermer en cliquant à côté */}
      {activeDeadline && (
        <div className="fixed inset-0 bg-transparent z-40" onClick={() => setActiveDeadline(null)}></div>
      )}
    </div>
  );
};

const FilterButton = ({ label, active = false }) => (
  <button className={`
    flex items-center gap-3 px-6 py-3 rounded-full text-[10px] font-[800] uppercase tracking-[0.15em] transition-all border
    ${active 
      ? 'bg-[#f97415] border-[#f97415] text-white shadow-md' 
      : 'bg-white border-slate-200 text-slate-500 hover:border-orange-300 hover:text-orange-600'}
  `}>
    {label}
    <span className="material-symbols-outlined text-[18px]">expand_more</span>
  </button>
);

const TimelineGroup = ({ title, children }) => (
  <section>
    <div className="flex items-center gap-5 mb-8">
      <h3 className="text-slate-900 font-[900] text-sm uppercase tracking-[0.25em]">{title}</h3>
      <div className="h-[2px] bg-slate-100 flex-1"></div>
    </div>
    <div className="grid gap-5">
      {children}
    </div>
  </section>
);

const DeadlineItem = ({ data, onManage, isActive }) => {
  const isLate = data.status === 'late';
  
  return (
    <div className={`group bg-white rounded-[2rem] p-6 border transition-all duration-500 flex flex-col md:flex-row gap-8 items-start md:items-center cursor-pointer ${isActive ? 'border-orange-500 ring-4 ring-orange-50 shadow-none' : 'border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-100'}`}
         onClick={onManage}>
      
      {/* Date Badge */}
      <div className={`
        flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-3xl font-[800] transition-all duration-500
        ${isLate ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-[#f97415]'}
      `}>
        <span className="text-3xl tracking-tighter leading-none">{data.day}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] mt-1">{data.month}</span>
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h4 className="text-xl font-[900] text-slate-900 group-hover:text-[#f97415] transition-colors leading-snug">
            {data.title}
          </h4>
          <span className={`px-4 py-1 rounded-full text-[10px] font-[900] uppercase tracking-widest border ${isLate ? 'bg-red-50 border-red-100 text-red-500' : 'bg-orange-50 border-orange-100 text-orange-600'}`}>
            {isLate ? 'Retard' : 'Urgent'}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[11px] font-[700] uppercase tracking-widest text-slate-400">
          <span className="flex items-center gap-2 italic font-normal lowercase text-slate-500/80">
            <span className="material-symbols-outlined text-[18px]">school</span> {data.subject}
          </span>
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">groups</span> {data.promotion}
          </span>
        </div>
      </div>

      {/* Action Section */}
      <div className="flex items-center gap-4 self-end md:self-center">
         <button 
           onClick={(e) => { e.stopPropagation(); onManage(); }}
           className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-[10px] font-[900] uppercase tracking-widest transition-all shadow-lg active:scale-95 ${isActive ? 'bg-orange-500 text-white' : 'bg-slate-900 text-white hover:bg-[#f97415]'}`}>
           {isActive ? 'En gestion...' : 'Gérer l\'échéance'}
           <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
         </button>
      </div>
    </div>
  );
};

export default DeadlinesManagement;