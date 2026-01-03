import React from 'react';

const StudentSpaces = () => {
  const courses = [
    {
      id: 1,
      title: "UX/UI Design Avancé",
      desc: "Maîtriser les principes de l'expérience utilisateur et les interfaces modernes.",
      tag: "Design",
      tagColor: "text-primary",
      teacher: "Mme. Dupuis",
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?q=80&w=500",
      teacherImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=MmeDupuis"
    },
    {
      id: 2,
      title: "Architecture React",
      desc: "Patterns avancés, hooks personnalisés et gestion d'état globale.",
      tag: "Développement",
      tagColor: "text-blue-600",
      teacher: "M. Martin",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=500",
      teacherImg: null
    },
    {
      id: 3,
      title: "Stratégie Digitale",
      desc: "Analyse de données, SEO et campagnes publicitaires en ligne.",
      tag: "Marketing",
      tagColor: "text-green-600",
      teacher: "Mme. Bernard",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500",
      teacherImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=MmeBernard"
    },
    {
      id: 4,
      title: "Bases de Données",
      desc: "SQL, NoSQL, modélisation de données et optimisation.",
      tag: "Backend",
      tagColor: "text-purple-600",
      teacher: "M. Alami",
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=500",
      teacherImg: null
    },
    {
      id: 5,
      title: "Gestion de Projet Agile",
      desc: "Scrum, Kanban et méthodologies de gestion d'équipe.",
      tag: "Management",
      tagColor: "text-amber-600",
      teacher: "M. Thomas",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=500",
      teacherImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=MThomas"
    },
    {
      id: 6,
      title: "Business English",
      desc: "Vocabulaire professionnel, rédaction et communication orale.",
      tag: "Langues",
      tagColor: "text-red-500",
      teacher: "Mrs. Smith",
      image: "https://images.unsplash.com/photo-1520970314890-1f9cb0481941?q=80&w=500",
      teacherImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=MrsSmith"
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#f8f7f5] scroll-smooth font-['Lexend']">
      
      <div className="p-6 md:p-10 lg:p-16 w-full max-w-[1400px] mx-auto flex flex-col gap-8">
        
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap gap-2 text-sm">
          <a className="text-slate-400 hover:text-[#f97415] transition-colors font-medium" href="#">Accueil</a>
          <span className="text-slate-300">/</span>
          <span className="text-[#f97415] font-medium">Mes Espaces</span>
        </nav>

        {/* Page Heading */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-slate-900 text-3xl md:text-4xl font-extrabold tracking-tight">Mes Espaces de Cours</h1>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="material-symbols-outlined text-[20px]">school</span>
              <p className="font-medium">Promotion 2023-2024 • Semestre 2</p>
            </div>
          </div>
        </header>

        {/* Filters & Search */}
        <section className="bg-white rounded-[1rem] p-2 shadow-sm flex flex-col md:flex-row gap-2 items-center">
          <div className="relative flex-1 w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
            <input 
              className="w-full bg-[#f8fafc] border-none rounded-full py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#f97415]/20 focus:bg-white transition-all outline-none" 
              placeholder="Rechercher un cours (ex: Algorithmique)..." 
              type="text"
            />
          </div>
          <div className="w-full md:w-auto flex items-center gap-2 bg-[#f8fafc] rounded-full px-4 py-1 border border-transparent focus-within:ring-2 focus-within:ring-[#f97415]/20">
            <span className="material-symbols-outlined text-slate-400">filter_list</span>
            <select className="bg-transparent border-none text-slate-700 font-medium focus:ring-0 py-2 pr-8 cursor-pointer outline-none">
              <option>Semestre 2 (Actuel)</option>
              <option>Semestre 1</option>
              <option>Archives 2022</option>
            </select>
          </div>
        </section>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <article 
              key={course.id}
              className="group bg-white rounded-[1.5rem] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(249,116,21,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 cursor-pointer"
            >
              <div className="relative w-full aspect-[16/9] rounded-[1rem] overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
                  style={{ backgroundImage: `url(${course.image})` }}
                ></div>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm text-[#f97415]">
                  {course.tag}
                </div>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                <div>
                  <h3 className="text-slate-900 text-xl font-bold leading-tight mb-1 group-hover:text-[#f97415] transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2">
                    {course.desc}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold overflow-hidden border border-slate-50">
                      {course.teacherImg ? (
                        <img className="w-full h-full object-cover" src={course.teacherImg} alt={course.teacher} />
                      ) : (
                        <span className="material-symbols-outlined text-[20px]">person</span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-600">{course.teacher}</span>
                  </div>
                  <button className="size-10 rounded-full bg-[#fff1e6] text-[#f97415] flex items-center justify-center hover:bg-[#f97415] hover:text-white transition-colors shadow-sm">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
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