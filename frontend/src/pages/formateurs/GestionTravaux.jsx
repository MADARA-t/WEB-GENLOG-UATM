import React from 'react';

const TeacherWorkManagement = () => {
  return (
    <div className="flex-1 bg-[#f8f7f5] min-h-screen font-['Lexend']">
      <div className="flex justify-center py-6 px-4 md:px-8 lg:px-12">
        <div className="w-full max-w-[1440px] flex flex-col gap-6">
          
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 items-center text-sm">
            <a className="text-[#9e6b47] hover:text-[#f97415] transition-colors font-medium" href="#">Accueil</a>
            <span className="text-[#9e6b47] font-medium">/</span>
            <a className="text-[#9e6b47] hover:text-[#f97415] transition-colors font-medium" href="#">Cours: UX Design</a>
            <span className="text-[#9e6b47] font-medium">/</span>
            <span className="text-[#1c130d] font-bold">Gestion des Travaux</span>
          </div>

          {/* Page Heading */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-[#1c130d] text-3xl md:text-4xl font-black tracking-[-0.033em]">Gestion des Travaux</h1>
              <p className="text-[#9e6b47] text-base md:text-lg">Créez des devoirs, suivez les rendus et notez vos étudiants.</p>
            </div>
            <div className="flex gap-3">
              <button className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#e9d9ce] text-[#1c130d] font-bold hover:bg-[#fcfaf8] transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[20px]">download</span>
                <span>Exporter les notes</span>
              </button>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
            
            {/* Left Column: Creation Form */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#f4ece6] sticky top-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-10 rounded-full bg-[#f97415]/10 flex items-center justify-center text-[#f97415]">
                    <span className="material-symbols-outlined fill-[1]">add_circle</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#1c130d]">Nouveau Devoir</h2>
                </div>
                
                <form className="flex flex-col gap-5">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-bold text-[#1c130d] ml-2">Titre du devoir</span>
                    <input 
                      className="w-full h-12 px-4 rounded-xl border border-[#e9d9ce] bg-[#f8f7f5] text-[#1c130d] placeholder:text-[#9e6b47]/70 focus:outline-none focus:ring-2 focus:ring-[#f97415]/20 focus:border-[#f97415] transition-all" 
                      placeholder="Ex: Analyse ergonomique..." 
                      type="text"
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-bold text-[#1c130d] ml-2">Début</span>
                      <input className="w-full h-12 px-4 rounded-xl border border-[#e9d9ce] bg-[#f8f7f5] text-[#1c130d] text-sm focus:ring-2 focus:ring-[#f97415]/20" type="date"/>
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-bold text-[#1c130d] ml-2">Date limite</span>
                      <input className="w-full h-12 px-4 rounded-xl border border-[#e9d9ce] bg-[#f8f7f5] text-[#1c130d] text-sm focus:ring-2 focus:ring-[#f97415]/20" type="date"/>
                    </label>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold text-[#1c130d] ml-2">Type de rendu</span>
                    <div className="flex p-1 bg-[#f8f7f5] rounded-full border border-[#e9d9ce]">
                      <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium bg-white text-[#f97415] shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">person</span> Individuel
                      </button>
                      <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium text-[#9e6b47]">
                        <span className="material-symbols-outlined text-[18px]">group</span> Groupe
                      </button>
                    </div>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-bold text-[#1c130d] ml-2">Consignes</span>
                    <textarea 
                      className="w-full min-h-[120px] p-4 rounded-2xl border border-[#e9d9ce] bg-[#f8f7f5] text-[#1c130d] placeholder:text-[#9e6b47]/70 focus:outline-none focus:ring-2 focus:ring-[#f97415]/20 focus:border-[#f97415] resize-y text-sm leading-relaxed" 
                      placeholder="Décrivez les objectifs..."
                    ></textarea>
                  </label>

                  <div className="border-2 border-dashed border-[#e9d9ce] rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2 bg-[#f8f7f5]/50 hover:bg-[#f8f7f5] hover:border-[#f97415]/50 transition-colors cursor-pointer group">
                    <span className="material-symbols-outlined text-[#9e6b47] group-hover:text-[#f97415] transition-colors text-3xl">cloud_upload</span>
                    <p className="text-xs font-medium text-[#9e6b47]">Glisser un fichier ou <span className="text-[#f97415] underline">parcourir</span></p>
                  </div>

                  <button className="mt-2 w-full h-12 bg-[#f97415] hover:bg-[#d65d0a] text-white font-bold rounded-full shadow-lg shadow-[#f97415]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">send</span> Publier le travail
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Tracking View */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Filters Tabs */}
              <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
                <button className="px-5 py-2 rounded-full bg-[#f97415] text-white font-bold text-sm shadow-md shadow-[#f97415]/20 whitespace-nowrap">Tous les travaux</button>
                <button className="px-5 py-2 rounded-full bg-white border border-[#e9d9ce] text-[#9e6b47] font-medium text-sm hover:bg-[#fcfaf8] whitespace-nowrap">En cours</button>
                <button className="px-5 py-2 rounded-full bg-white border border-[#e9d9ce] text-[#9e6b47] font-medium text-sm hover:bg-[#fcfaf8] whitespace-nowrap">À noter</button>
              </div>

              {/* Assignment Card 1 */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#f4ece6] flex flex-col gap-6">
                <div className="flex flex-wrap justify-between items-start gap-4 border-b border-[#f4ece6] pb-5">
                  <div className="flex gap-4">
                    <div className="size-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                      <span className="material-symbols-outlined text-[28px]">design_services</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-[#1c130d]">Prototype Mobile App</h3>
                        <span className="px-2.5 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">Actif</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-[#9e6b47]">
                        <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">calendar_today</span> 15 Oct, 23:59</div>
                        <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">group</span> Groupe</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 min-w-[140px]">
                    <span className="text-sm font-bold text-[#1c130d]">18 / 24 Rendus</span>
                    <div className="w-full h-2 bg-[#f4ece6] rounded-full overflow-hidden">
                      <div className="h-full bg-[#f97415] w-[75%] rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Student List */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-sm font-bold text-[#9e6b47] uppercase tracking-wider mb-1">Rendus Récents</h4>
                  
                  {[
                    { name: "Sophie Martin", time: "Rendu il y a 2h", file: "UX_Research.pdf", img: "24" },
                    { name: "Lucas Bernard", time: "Rendu hier", file: "Figma Link", img: "25" }
                  ].map((student, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#f8f7f5] transition-colors border border-transparent hover:border-[#e9d9ce]">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={`http://googleusercontent.com/profile/picture/${student.img}`} className="rounded-full size-12 border border-white shadow-sm" alt="" />
                          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white">
                            <span className="material-symbols-outlined text-white text-[10px] block font-bold">check</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-[#1c130d]">{student.name}</p>
                          <p className="text-xs text-[#9e6b47] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">schedule</span> {student.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">attachment</span> {student.file}
                        </div>
                        <button className="h-10 px-5 rounded-full bg-[#f97415] text-white text-sm font-bold shadow-md hover:bg-[#d65d0a] transition-colors">Noter</button>
                      </div>
                    </div>
                  ))}
                  
                  <button className="w-full py-3 mt-2 text-sm font-bold text-[#f97415] hover:bg-[#f97415]/5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <span>Voir tous les étudiants</span>
                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Closed */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#f4ece6] flex flex-col gap-4 opacity-90">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="size-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shadow-md">
                      <span className="material-symbols-outlined text-[24px]">menu_book</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#1c130d]">Dissertation: Histoire de l'art</h3>
                      <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">warning</span> Fermé • 5 non rendus
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-[#1c130d]">25</span>
                    <span className="text-sm font-medium text-[#9e6b47]">/ 30</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 border-t border-[#f4ece6] pt-8 pb-8 flex flex-col md:flex-row justify-between items-center text-sm text-[#9e6b47]">
            <p>© 2024 MADARA Éducation. Tous droits réservés.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a className="hover:text-[#f97415]" href="#">Besoin d'aide ?</a>
              <a className="hover:text-[#f97415]" href="#">Signaler un problème</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeacherWorkManagement;