import React from 'react';

const TeacherPromotions = () => {
  // Données fictives pour les cartes
  const promotions = [
    {
      id: 1,
      code: "B3",
      title: "Bachelor 3 - Dév. Web",
      year: "Promotion 2023 - 2024",
      status: "En cours",
      statusColor: "bg-green-100 text-green-700",
      students: 24,
      modules: 5,
      subjects: ["React JS", "Node.js", "+3 autres"],
      progress: 75,
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      id: 2,
      code: "M1",
      title: "Master 1 - Cyber Sécu",
      year: "Promotion 2023 - 2024",
      status: "En cours",
      statusColor: "bg-green-100 text-green-700",
      students: 18,
      modules: 2,
      subjects: ["Cryptographie", "Pentest"],
      progress: 45,
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      id: 3,
      code: "B2",
      title: "Bachelor 2 - UI/UX",
      year: "Promotion 2023 - 2024",
      status: "Examen",
      statusColor: "bg-yellow-100 text-yellow-700",
      students: 32,
      modules: 4,
      subjects: ["Figma", "Design System", "+2"],
      progress: 90,
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8f7f5] min-h-screen font-['Lexend']">
      <div className="max-w-[1400px] mx-auto p-4 lg:p-10 flex flex-col gap-8">
        
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <a className="hover:text-[#f97415] transition-colors" href="#">Accueil</a>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <a className="hover:text-[#f97415] transition-colors" href="#">Formateur</a>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-medium text-gray-900">Promotions</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-[#1c130d]">Mes Promotions</h1>
              <p className="text-gray-500 max-w-2xl text-base">
                Gérez vos classes, suivez la progression académique et accédez aux listes d'étudiants.
              </p>
            </div>
            <button className="flex items-center gap-2 bg-[#f97415] hover:bg-orange-700 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg shadow-orange-500/30 active:scale-95">
              <span className="material-symbols-outlined">add</span>
              <span>Nouvelle ressource</span>
            </button>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex w-full lg:w-96 items-center bg-[#f8f7f5] rounded-full px-4 h-12 border border-transparent focus-within:border-[#f97415]/50 transition-all">
            <span className="material-symbols-outlined text-gray-400">search</span>
            <input 
              className="bg-transparent border-none focus:ring-0 text-sm w-full text-gray-800 placeholder-gray-400 ml-2" 
              placeholder="Rechercher une promotion..." 
              type="text"
            />
          </div>
          <div className="w-px h-8 bg-gray-200 hidden lg:block"></div>
          
          <div className="flex gap-2 w-full overflow-x-auto pb-2 lg:pb-0 no-scrollbar items-center">
            <button className="flex items-center gap-2 bg-[#1c130d] text-white px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-transform hover:scale-105">
              <span className="material-symbols-outlined text-[18px]">view_list</span> Toutes
            </button>
            <button className="flex items-center gap-2 bg-[#f8f7f5] hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors">
              <span className="material-symbols-outlined text-[18px] text-green-600">check_circle</span> Actives (4)
            </button>
            <button className="flex items-center gap-2 bg-[#f8f7f5] hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors">
              <span className="material-symbols-outlined text-[18px] text-gray-400">archive</span> Archivées
            </button>
          </div>
          
          <div className="flex-1 hidden lg:block"></div>
          
          <div className="flex gap-1 bg-[#f8f7f5] p-1 rounded-full hidden lg:flex">
            <button className="p-2 bg-white rounded-full shadow-sm text-[#f97415]">
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <span className="material-symbols-outlined text-[20px]">list</span>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <div key={promo.id} className="group bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 border border-transparent hover:border-[#f97415]/10 flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-gray-400 hover:text-[#f97415]">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>

              <div className="flex gap-4 items-start">
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${promo.gradient} flex items-center justify-center text-white shadow-lg shrink-0`}>
                  <span className="font-bold text-xl">{promo.code}</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`${promo.statusColor} text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wide`}>
                      {promo.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{promo.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{promo.year}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#f8f7f5] p-3 rounded-2xl flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px]">group</span> Étudiants
                  </div>
                  <span className="text-xl font-bold text-gray-900">{promo.students}</span>
                </div>
                <div className="bg-[#f8f7f5] p-3 rounded-2xl flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px]">book_2</span> Modules
                  </div>
                  <span className="text-xl font-bold text-gray-900">{promo.modules}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-500">Matières enseignées</p>
                <div className="flex flex-wrap gap-2">
                  {promo.subjects.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">{s}</span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1 mt-auto">
                <div className="flex justify-between text-xs font-medium text-gray-500">
                  <span>Progression semestrielle</span>
                  <span className="text-[#f97415]">{promo.progress}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#f97415] rounded-full transition-all duration-1000" 
                    style={{ width: `${promo.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">
                  Gérer
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#f97415] text-white text-sm font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 active:scale-95">
                  Voir liste
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <div className="group bg-transparent rounded-[2rem] p-6 border-2 border-dashed border-gray-300 hover:border-[#f97415] hover:bg-[#f97415]/5 transition-all duration-300 flex flex-col items-center justify-center gap-4 min-h-[350px] cursor-pointer">
            <div className="h-16 w-16 rounded-full bg-[#f97415]/10 flex items-center justify-center text-[#f97415] group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-3xl">add</span>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">Rejoindre une promotion</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-[200px]">Vous ne trouvez pas votre classe ? Faites une demande d'accès.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeacherPromotions;