import React from 'react';

const InstructorSpaces = () => {
  const courses = [
    {
      id: "WEB-301",
      title: "Développement Web Avancé",
      level: "Licence 3 • Groupe A",
      students: 24,
      semester: "Semestre 1",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8OkCJxJKL3tlSQ7OaBaPWNj5egR4Ou9zF6g_xHItPZdv3qd5vXseDjU6hxkiNLqh1HoeMR7Lr2hzWOhOwjT8QY7TGBKQymSWGapiv4IRQg8X9OznHQWq4wrPzfDsrN_U7EAK-1-CLK8c--6yRsT7TuNKgdjSIOBenE-mqk0YiOhFlDbJv1ulFbMUwFkgJT-yzVFOS9l6kEnNuaaSZIASrV-hfjwKlOHZotMs5Cag8k77c4MAiiTL2xKE0Y4WqfGLp6_bV3dliz-0",
      color: "orange",
      status: "active"
    },
    {
      id: "MKT-204",
      title: "Stratégie Marketing Digital",
      level: "Master 1 • Promo 2024",
      students: 45,
      semester: "Semestre 2",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6LkncZlz94tFXFA_qFZMNYBldB9M_rQWSasGSZQUcJDjiKIoJsK12jXIFNJiR0mW7z5ICjjBwNsdMkedyumIDZ43VGb4SHtTpGFEPXfCKwMkaYsyegYKTE0FJHP-i9XS1k7Cnqzc4KDK8c9CSubPf9xFE3lGtR6_fzjSVFwawThRSjX5NwOufiAQlJ-AW7MJkatBzo_uZ_lqKIKMXoiEik0bJAr4uYO_LiotDWO4EfWIp14JGqV7irm6poV2BXWGhEe8etsjHtfw",
      color: "blue",
      status: "active"
    },
    {
      id: "DES-102",
      title: "UX/UI Design Fundamentals",
      level: "Licence 2 • Groupe B",
      students: 18,
      semester: "Semestre 1",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcDl1KZTmbt_oOFJYwZRJRyyryw4A1xopf4NM8KSOw2ir0RuTYHoaK5HQ3JK1pUrI2uAgjST8hevU3CILc_2MHF0zcVkE76QTmrAq6tcRELo68-rrAoOouwtZeZabWMoxWA7iulawqLCRUKCFP_WwrlWosV4AS8ODUMxvoETN8goTonL37lLtpJio64-8ZsdHhjJ76imRl95taQUABHfMrpB3KTtTGuEk6JsNiPMdNx3DnxH3f49YV8YGwSOCjNQ1-815bZTNE7Ik",
      color: "orange",
      status: "active"
    },
    {
      id: "DATA-400",
      title: "Introduction à la Data Science",
      level: "Master 2 • Promo 2024",
      students: 32,
      semester: "Semestre 2",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAj6b3UK59VtEMLS6bUgPpDqEqMwSUjnK3K1eNUqnk-G7ZQlDAbrdHnUuWW3B__3dzcDUgk8Rs1P7NEIJ08GApwEszhzBEdipzI1vdM7RxRBg2Kybj-oCAkK9JzNBogbhwsb9_1wodrw1clS55vIMTiOk94jqoMLW3YdX6OBO9tejONbRJjo-SSYCs-VKxPlcFxyCZOWR-mJ656xZIKyfpv8Edc101ik3x2YlM6XuqGbzGpEZu-V3FO4re8AFjrQ99ZraI23fmiKBI",
      color: "blue",
      status: "soon"
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-[#f8fafc] font-['Lexend']">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Heading Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2 text-[#ea580c] text-sm font-bold uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-lg">school</span>
              <span>Année Académique 2023-2024</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Mes Espaces de Cours</h2>
            <p className="text-slate-500 text-lg mt-2 font-light">Gérez vos matières affectées, suivez la progression de vos étudiants et accédez rapidement à vos ressources pédagogiques.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-full shadow-sm border border-slate-200">
            <button className="p-2.5 rounded-full bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors">
              <span className="material-symbols-outlined fill-[1]">grid_view</span>
            </button>
            <button className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
              <span className="material-symbols-outlined">view_list</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-2 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              className="w-full h-14 pl-12 pr-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#ea580c]/50 text-slate-900 placeholder:text-slate-400 font-medium transition-shadow" 
              placeholder="Rechercher une matière, un code..." 
              type="text"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <select className="h-14 pl-4 pr-10 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#ea580c]/50 text-slate-900 font-medium cursor-pointer min-w-[160px]">
              <option value="">Tous les semestres</option>
              <option value="s1">Semestre 1</option>
              <option value="s2">Semestre 2</option>
            </select>
            <button className="h-14 px-6 bg-[#ea580c] text-white font-bold rounded-xl hover:bg-[#c2410c] transition-colors shadow-lg shadow-orange-500/30 flex items-center gap-2 whitespace-nowrap">
              <span className="material-symbols-outlined">filter_list</span>
              Filtrer
            </button>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <article 
              key={course.id} 
              className={`group bg-white rounded-xl p-2 shadow-sm border border-slate-100 flex flex-col h-full transition-all duration-300 hover:shadow-[0_20px_40px_rgba(234,88,12,0.1)] hover:-translate-y-1 ${course.status === 'soon' ? 'opacity-60 hover:opacity-100' : ''}`}
            >
              <div className={`relative h-48 rounded-[1.5rem] overflow-hidden bg-slate-900 ${course.status === 'soon' ? 'grayscale group-hover:grayscale-0' : ''}`}>
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-700" 
                  style={{ backgroundImage: `url(${course.img})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute top-4 left-4">
                  <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10">{course.id}</span>
                </div>

                {course.status === 'soon' && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Bientôt</span>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold leading-tight mb-1">{course.title}</h3>
                  <p className="text-sm text-slate-200 font-medium opacity-90">{course.level}</p>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-[18px]">group</span>
                    <span className="text-sm font-semibold">{course.students} {course.status === 'soon' ? 'Inscrits' : 'Étudiants'}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${course.color === 'orange' ? 'text-orange-600 bg-orange-50' : 'text-blue-600 bg-blue-50'}`}>
                    <span className="material-symbols-outlined text-[18px] fill-[1]">schedule</span>
                    <span className="text-sm font-bold">{course.semester}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                  {course.status === 'soon' ? (
                    <button className="col-span-2 flex items-center justify-center gap-2 h-11 bg-slate-200 text-slate-400 rounded-full font-bold text-sm cursor-not-allowed" disabled>
                      <span>Non ouvert</span>
                      <span className="material-symbols-outlined text-lg">lock</span>
                    </button>
                  ) : (
                    <>
                      <button className="col-span-2 flex items-center justify-center gap-2 h-11 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-full font-bold text-sm transition-colors shadow-lg shadow-orange-200">
                        <span>Voir l'espace</span>
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                      </button>
                      <button className="flex items-center justify-center gap-2 h-10 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-[#ea580c] rounded-full font-medium text-xs transition-colors border border-slate-100">
                        <span className="material-symbols-outlined text-[18px]">assignment</span>
                        Travaux
                      </button>
                      <button className="flex items-center justify-center gap-2 h-10 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-[#ea580c] rounded-full font-medium text-xs transition-colors border border-slate-100">
                        <span className="material-symbols-outlined text-[18px]">list_alt</span>
                        Promo
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}

          {/* Add New Card Button */}
          <div className="group h-full min-h-[400px] bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-4 hover:border-[#ea580c]/50 hover:bg-orange-50/30 transition-all cursor-pointer">
            <div className="size-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 group-hover:shadow-md">
              <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-[#ea580c] transition-colors">add</span>
            </div>
            <div className="text-center px-6">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#ea580c] transition-colors">Demander un espace</h3>
              <p className="text-sm text-slate-500 mt-1">Contactez l'administration pour ouvrir un nouveau cours.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 border-t border-slate-200 pt-8 pb-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <p>© 2024 MADARA Éducation. Tous droits réservés.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a className="hover:text-[#ea580c] transition-colors" href="#">Besoin d'aide ?</a>
            <a className="hover:text-[#ea580c] transition-colors" href="#">Guide Formateur</a>
            <a className="hover:text-[#ea580c] transition-colors" href="#">Signaler un problème</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSpaces;