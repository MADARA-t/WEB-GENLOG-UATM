import React from 'react';

const StudentDashboard = () => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#f8fafc] font-['Lexend']">
      
      {/* Header */}
      <header className="h-20 px-8 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-100/50">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-[#0f172a]">Bonjour, Mischael 👋</h2>
          <p className="text-sm text-[#64748b]">Prêt à apprendre quelque chose de nouveau aujourd'hui ?</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="size-10 rounded-full bg-white border border-slate-100 text-[#64748b] hover:text-[#ea580c] hover:border-[#ea580c]/30 flex items-center justify-center transition-all relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2.5 size-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-[#0f172a]">Thomas Dubois</p>
              <p className="text-xs text-[#64748b]">Étudiant L2</p>
            </div>
            <div className="size-10 rounded-full bg-slate-200 bg-cover bg-center border-2 border-white shadow-sm" style={{ backgroundImage: "url('https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas')" }}></div>
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          
          {/* Stats Row */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(234,88,12,0.15)] transition-all duration-300 group border border-transparent hover:border-[#ea580c]/10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined">menu_book</span>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> +2
                </span>
              </div>
              <h3 className="text-[#64748b] text-sm font-medium">Cours suivis</h3>
              <p className="text-3xl font-bold text-[#0f172a] mt-1">12</p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(234,88,12,0.15)] transition-all duration-300 group border border-transparent hover:border-[#ea580c]/10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#ea580c]/10 text-[#ea580c] rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined">assignment_turned_in</span>
                </div>
                <span className="text-xs font-bold text-[#ea580c] bg-orange-50 px-2 py-1 rounded-full">Top 10%</span>
              </div>
              <h3 className="text-[#64748b] text-sm font-medium">Devoirs rendus</h3>
              <p className="text-3xl font-bold text-[#0f172a] mt-1">85%</p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(234,88,12,0.15)] transition-all duration-300 group border border-transparent hover:border-[#ea580c]/10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> +0.5
                </span>
              </div>
              <h3 className="text-[#64748b] text-sm font-medium">Moyenne générale</h3>
              <p className="text-3xl font-bold text-[#0f172a] mt-1">15.4<span className="text-lg text-[#64748b] font-normal">/20</span></p>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* MAIN COLUMN */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ea580c]">play_circle</span> Mes Cours Récents
                </h3>
                <a className="text-sm font-medium text-[#ea580c] hover:text-orange-700 transition-colors" href="#">Voir tout</a>
              </div>

              {/* Course 1 */}
              <div className="bg-white p-5 rounded-[1.5rem] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all group">
                <div className="w-full md:w-48 h-32 md:h-auto rounded-lg bg-slate-200 shrink-0 relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1509228468518-180dd482180c?q=80&w=500')] bg-cover bg-center">
                   <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-[#0f172a] mb-1 group-hover:text-[#ea580c] transition-colors">Mathématiques Avancées</h4>
                      <p className="text-[#64748b] text-sm mb-4 line-clamp-2">Algèbre linéaire et introduction aux matrices complexes.</p>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">En cours</span>
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <div className="flex-1 max-w-xs">
                      <div className="flex justify-between text-xs mb-1.5 font-medium"><span className="text-[#64748b]">Progression</span><span className="text-[#ea580c]">75%</span></div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div className="bg-[#ea580c] h-2 rounded-full" style={{width: '75%'}}></div></div>
                    </div>
                    <button className="hidden md:flex items-center gap-1 text-sm font-bold text-[#ea580c] bg-[#ea580c]/5 px-4 py-2 rounded-full hover:bg-[#ea580c] hover:text-white transition-all">Continuer <span className="material-symbols-outlined text-[18px]">arrow_forward</span></button>
                  </div>
                </div>
              </div>

              {/* Course 2 */}
              <div className="bg-white p-5 rounded-[1.5rem] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all group">
                <div className="w-full md:w-48 h-32 md:h-auto rounded-lg bg-slate-200 shrink-0 relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=500')] bg-cover bg-center">
                   <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-[#0f172a] mb-1 group-hover:text-[#ea580c] transition-colors">Introduction au Droit</h4>
                      <p className="text-[#64748b] text-sm mb-4 line-clamp-2">Les fondements du système juridique français et européen.</p>
                    </div>
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-md">Retard</span>
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <div className="flex-1 max-w-xs">
                      <div className="flex justify-between text-xs mb-1.5 font-medium"><span className="text-[#64748b]">Progression</span><span className="text-[#ea580c]">40%</span></div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div className="bg-[#ea580c] h-2 rounded-full" style={{width: '40%'}}></div></div>
                    </div>
                    <button className="hidden md:flex items-center gap-1 text-sm font-bold text-[#ea580c] bg-[#ea580c]/5 px-4 py-2 rounded-full hover:bg-[#ea580c] hover:text-white transition-all">Continuer <span className="material-symbols-outlined text-[18px]">arrow_forward</span></button>
                  </div>
                </div>
              </div>

              {/* Course 3 */}
              <div className="bg-white p-5 rounded-[1.5rem] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all group opacity-80 hover:opacity-100">
                <div className="w-full md:w-48 h-32 md:h-auto rounded-lg bg-slate-200 shrink-0 relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1532187875605-186c63a96953?q=80&w=500')] bg-cover bg-center">
                   <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-[#0f172a] mb-1 group-hover:text-[#ea580c] transition-colors">Chimie Organique</h4>
                      <p className="text-[#64748b] text-sm mb-4 line-clamp-2">Étude des structures et réactions des composés organiques.</p>
                    </div>
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md">Nouveau</span>
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <div className="flex-1 max-w-xs">
                      <div className="flex justify-between text-xs mb-1.5 font-medium"><span className="text-[#64748b]">Progression</span><span className="text-[#ea580c]">5%</span></div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div className="bg-[#ea580c] h-2 rounded-full" style={{width: '5%'}}></div></div>
                    </div>
                    <button className="hidden md:flex items-center gap-1 text-sm font-bold text-[#ea580c] bg-[#ea580c]/5 px-4 py-2 rounded-full hover:bg-[#ea580c] hover:text-white transition-all">Démarrer <span className="material-symbols-outlined text-[18px]">arrow_forward</span></button>
                  </div>
                </div>
              </div>
            </div>

            {/* SIDEBAR COLUMN */}
            <div className="flex flex-col gap-6">
              {/* ALERTS */}
              <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] p-6 border border-slate-50 flex flex-col h-fit">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#0f172a] flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500">warning</span> Alertes Devoirs
                  </h3>
                  <button className="size-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-[#64748b]"><span className="material-symbols-outlined">more_horiz</span></button>
                </div>
                <div className="flex flex-col gap-4">
                  {/* Alert 1 */}
                  <div className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-orange-100 text-[#ea580c] shrink-0 font-bold">
                      <span className="text-xs uppercase">Oct</span><span className="text-lg leading-none">24</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-[#0f172a] truncate group-hover:text-[#ea580c]">Dissertation Philo</h4>
                        <span className="size-2 rounded-full bg-red-500 mt-1.5 animate-pulse"></span>
                      </div>
                      <p className="text-xs text-[#64748b] mt-0.5">Demain à 23:59</p>
                      <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-[#ea580c] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">Urgent</span>
                    </div>
                  </div>
                  {/* Alert 2 */}
                  <div className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-slate-100 text-slate-600 shrink-0 font-bold">
                      <span className="text-xs uppercase">Oct</span><span className="text-lg leading-none">26</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#0f172a] truncate group-hover:text-[#ea580c]">Quiz Anglais</h4>
                      <p className="text-xs text-[#64748b] mt-0.5">Dans 3 jours</p>
                      <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Normal</span>
                    </div>
                  </div>
                  {/* Alert 3 */}
                  <div className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-slate-100 text-slate-600 shrink-0 font-bold">
                      <span className="text-xs uppercase">Nov</span><span className="text-lg leading-none">02</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#0f172a] truncate group-hover:text-[#ea580c]">Projet Groupe Java</h4>
                      <p className="text-xs text-[#64748b] mt-0.5">Semaine prochaine</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-6 pt-4 text-center text-sm font-medium text-[#64748b] hover:text-[#ea580c] transition-colors border-t border-slate-100">Voir tous les devoirs</button>
              </div>

              {/* CALENDAR */}
              <div className="bg-gradient-to-br from-[#ea580c] to-orange-500 rounded-[1.5rem] shadow-lg p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/20 blur-2xl"></div>
                <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-1">Prochain examen</h3>
                  <div className="flex items-center gap-2 mb-4 opacity-90 text-sm">
                    <span className="material-symbols-outlined text-sm">event</span> Lundi, 28 Octobre
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                    <p className="text-xs font-medium opacity-80 uppercase tracking-widest mb-1">09:00 - 11:00</p>
                    <p className="font-bold text-xl">Macroéconomie</p>
                    <p className="text-sm opacity-90 mt-1">Salle B-204</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;