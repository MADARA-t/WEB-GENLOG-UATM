import React from 'react';

const CourseView = ({ course, onBack }) => {
  // Données simulées pour le contenu du cours
  const modules = [
    { id: 1, title: "Introduction & Fondamentaux", duration: "1h 30min", lessons: 4, completed: true },
    { id: 2, title: "Analyse des besoins utilisateurs", duration: "2h 15min", lessons: 6, completed: false, active: true },
    { id: 3, title: "Prototypage Haute Fidélité", duration: "3h 00min", lessons: 8, completed: false },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#fcfcfd] font-['Lexend'] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Navigation de retour & Titre */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center gap-6">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors font-bold text-sm"
        >
          <span className="material-symbols-outlined bg-slate-100 group-hover:bg-orange-100 p-2 rounded-full transition-colors">arrow_back</span>
          Retour
        </button>
        <div className="h-8 w-[1px] bg-slate-200"></div>
        <h2 className="text-xl font-extrabold text-[#0f172a] tracking-tight">{course.title}</h2>
      </div>

      <div className="p-6 md:p-10 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Colonne Gauche : Contenu du cours */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-[#0f172a] mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-orange-600">tactic</span>
              Programme de formation
            </h3>

            <div className="space-y-4">
              {modules.map((module) => (
                <div 
                  key={module.id}
                  className={`group p-6 rounded-[1.5rem] border transition-all cursor-pointer ${
                    module.active 
                    ? "border-orange-200 bg-orange-50/30" 
                    : "border-slate-100 hover:border-orange-100 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`size-10 rounded-full flex items-center justify-center font-bold ${
                        module.completed ? "bg-green-100 text-green-600" : "bg-white border-2 border-slate-100 text-slate-400"
                      }`}>
                        {module.completed ? <span className="material-symbols-outlined">check</span> : module.id}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{module.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">{module.lessons} leçons • {module.duration}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-orange-600 transition-colors">expand_more</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Colonne Droite : Sidebar d'infos */}
        <div className="flex flex-col gap-6">
          {/* Carte Professeur */}
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm text-center">
            <div className="relative size-24 mx-auto mb-4">
              <div className="absolute inset-0 bg-orange-200 rounded-full blur-xl opacity-20"></div>
              <img src={course.teacherImg} className="relative rounded-full border-4 border-white shadow-md" alt="" />
            </div>
            <h4 className="font-extrabold text-slate-900">{course.teacher}</h4>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mt-1">Intervenant Expert</p>
            <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-slate-900/10">
              Contacter l'enseignant
            </button>
          </div>

          {/* Ressources */}
          <div className="bg-[#1e293b] rounded-[2rem] p-6 text-white">
            <h4 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest text-slate-400">
              <span className="material-symbols-outlined text-orange-500">folder_open</span>
              Ressources
            </h4>
            <ul className="space-y-3">
              {['Syllabus.pdf', 'Guide_Figma.zip', 'Ebook_UX.pdf'].map(file => (
                <li key={file} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">{file}</span>
                  <span className="material-symbols-outlined text-slate-500 group-hover:text-orange-500">download</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseView;