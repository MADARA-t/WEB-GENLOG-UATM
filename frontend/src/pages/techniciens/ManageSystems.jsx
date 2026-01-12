import React, { useState } from 'react';

const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');`;

const SystemsManager = () => {
  const [academicYears, setAcademicYears] = useState([
    
  ]);

  const [isAddingYear, setIsAddingYear] = useState(false);
  const [newYear, setNewYear] = useState("");
  
  // États pour la suppression
  const [yearToDelete, setYearToDelete] = useState(null);

  const handleAddYear = (e) => {
    e.preventDefault();
    if (!newYear) return;

    const yearObj = {
      id: Date.now(),
      label: newYear,
      created: new Date().toLocaleDateString()
    };

    setAcademicYears([...academicYears, yearObj]);
    setNewYear("");
    setIsAddingYear(false);
  };

  const confirmDelete = () => {
    setAcademicYears(academicYears.filter(year => year.id !== yearToDelete.id));
    setYearToDelete(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-['Lexend']">
      <style>{fontImport}</style>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestion du Système</h1>
            <p className="text-slate-500 font-medium">Configuration des socles académiques et maintenance.</p>
          </div>
          <button
            onClick={() => setIsAddingYear(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#f97415] transition-all shadow-lg shadow-slate-900/10"
          >
            <span className="material-symbols-outlined text-lg">calendar_add_on</span>
            Nouvelle Année Académique
          </button>
        </div>

        {/* Liste des Années - Pleine largeur */}
        <div className="space-y-4">
          <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Historique des années</h2>
          {academicYears.map((year) => (
            <div key={year.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all w-full">
              <div className="flex items-center gap-5">
                <div className="size-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center transition-colors group-hover:bg-orange-50 group-hover:text-[#f97415]">
                  <span className="material-symbols-outlined text-3xl">event_upcoming</span>
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-xl">{year.label}</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase">Créée le {year.created}</p>
                </div>
              </div>
              
              <button 
                onClick={() => setYearToDelete(year)}
                className="size-12 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}

          {academicYears.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
              <p className="text-slate-400 font-bold">Aucune année académique enregistrée.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modale d'ajout d'année */}
      {isAddingYear && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 text-slate-900">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black leading-tight">Nouvelle Année</h2>
              <button onClick={() => setIsAddingYear(false)} className="size-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddYear} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Format (ex: 2025-2026)</label>
                <input
                  type="text"
                  required
                  placeholder="xxxx-xxxx"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl font-black outline-none focus:ring-2 focus:ring-[#f97415]/20 mt-2"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#f97415] transition-all"
                >
                  Initialiser l'année
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingYear(false)}
                  className="px-6 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE DE CONFIRMATION DE SUPPRESSION */}
      {yearToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 text-slate-900">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="size-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl">warning</span>
            </div>
            <h2 className="text-2xl font-black mb-2">Supprimer l'année ?</h2>
            <p className="text-slate-500 text-sm font-medium mb-8">
              Vous êtes sur le point de supprimer l'année <span className="font-black text-slate-900">{yearToDelete.label}</span>. Cette action est irréversible.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all"
              >
                Oui, supprimer définitivement
              </button>
              <button
                onClick={() => setYearToDelete(null)}
                className="w-full py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemsManager;