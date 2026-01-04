import React, { useState } from 'react';

const StudentSpaces = () => {
  const [search, setSearch] = useState("");

  const courses = [
    {
      id: 1,
      title: "UX/UI Design Avancé",
      desc: "Maîtriser les principes de l'expérience utilisateur et les interfaces modernes.",
      tag: "Design",
      tagColor: "bg-orange-100 text-orange-600",
      teacher: "Mme. Dupuis",
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?q=80&w=500",
      teacherImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=MmeDupuis"
    },
    {
      id: 2,
      title: "Architecture React",
      desc: "Patterns avancés, hooks personnalisés et gestion d'état globale.",
      tag: "Développement",
      tagColor: "bg-blue-100 text-blue-600",
      teacher: "M. Martin",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=500",
      teacherImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
    },
    {
      id: 3,
      title: "Stratégie Digitale",
      desc: "Analyse de données, SEO et campagnes publicitaires en ligne.",
      tag: "Marketing",
      tagColor: "bg-emerald-100 text-emerald-600",
      teacher: "Mme. Bernard",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500",
      teacherImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=MmeBernard"
    },
    {
      id: 4,
      title: "Bases de Données",
      desc: "SQL, NoSQL, modélisation de données et optimisation.",
      tag: "Backend",
      tagColor: "bg-purple-100 text-purple-600",
      teacher: "M. Alami",
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=500",
      teacherImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
    },
    {
      id: 5,
      title: "Gestion de Projet Agile",
      desc: "Scrum, Kanban et méthodologies de gestion d'équipe.",
      tag: "Management",
      tagColor: "bg-amber-100 text-amber-600",
      teacher: "M. Thomas",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=500",
      teacherImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=MThomas"
    },
    {
      id: 6,
      title: "Business English",
      desc: "Vocabulaire professionnel, rédaction et communication orale.",
      tag: "Langues",
      tagColor: "bg-rose-100 text-rose-600",
      teacher: "Mrs. Smith",
      image: "https://images.unsplash.com/photo-1520970314890-1f9cb0481941?q=80&w=500",
      teacherImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=MrsSmith"
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#fcfcfd] font-['Lexend'] antialiased">
      
      <div className="p-6 md:p-10 lg:p-12 w-full max-w-[1440px] mx-auto flex flex-col gap-10">

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
              <span className="material-symbols-outlined text-lg">calendar_today</span>
              <p className="font-medium">Semestre 2 • Promotion 2023-2024</p>
              <span className="size-1 bg-slate-300 rounded-full"></span>
              <p className="text-orange-600 font-bold">{courses.length} cours actifs</p>
            </div>
          </div>

          {/* Premium Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-[1.5rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100">
            <div className="relative flex-1 min-w-[300px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50/50 border-none rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/10 focus:bg-white transition-all outline-none" 
                placeholder="Rechercher un module..." 
                type="text"
              />
            </div>
            <div className="h-8 w-[1px] bg-slate-100 hidden sm:block"></div>
            <select className="bg-transparent border-none text-slate-600 text-sm font-bold focus:ring-0 py-2 pl-2 pr-8 cursor-pointer outline-none">
              <option>Tous les semestres</option>
              <option>Semestre 2</option>
              <option>Semestre 1</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase())).map((course) => (
            <article 
              key={course.id}
              className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col overflow-hidden cursor-pointer"
            >
              {/* Image Container with Overlay */}
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                  style={{ backgroundImage: `url(${course.image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating Badge */}
                <div className={`absolute top-4 left-4 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${course.tagColor.replace('text', 'bg').replace('600', '500')} bg-opacity-90 text-white`}>
                  {course.tag}
                </div>

                {/* Quick Action Button on Image */}
                <div className="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="bg-white/20 backdrop-blur-xl p-2 rounded-full border border-white/30 text-white">
                    <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#0f172a] text-xl font-bold leading-tight group-hover:text-orange-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 font-medium">
                    {course.desc}
                  </p>
                </div>

                {/* Footer Content */}
                <div className="pt-5 mt-2 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative size-10">
                      <div className="absolute inset-0 bg-orange-200 rounded-full blur-[2px] opacity-0 group-hover:opacity-40 transition-opacity"></div>
                      <img 
                        className="relative w-full h-full object-cover rounded-full border-2 border-white shadow-sm" 
                        src={course.teacherImg || `https://ui-avatars.com/api/?name=${course.teacher}`} 
                        alt={course.teacher} 
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Intervenant</span>
                      <span className="text-sm font-bold text-slate-700">{course.teacher}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-orange-600 font-bold text-sm group/btn">
                    <span>Accéder</span>
                    <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">chevron_right</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentSpaces;