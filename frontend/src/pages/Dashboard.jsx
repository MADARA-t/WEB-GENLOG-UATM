import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('hebdo');
  const [selectedStat, setSelectedStat] = useState('Étudiants');
  const [activeCourse, setActiveCourse] = useState(null);
  const [notification, setNotification] = useState(null);

  // Structure de données étendue pour varier selon la catégorie ET la vue
  const chartData = {
    'Étudiants': {
      hebdo: { Info: "65%", Droit: "85%", Eco: "45%", Arts: "90%", Sci: "60%" },
      mensuel: { Info: "95%", Droit: "70%", Eco: "80%", Arts: "50%", Sci: "85%" }
    },
    'Promotions': {
      hebdo: { Info: "30%", Droit: "40%", Eco: "80%", Arts: "35%", Sci: "95%" },
      mensuel: { Info: "50%", Droit: "60%", Eco: "40%", Arts: "80%", Sci: "70%" }
    },
    'Espaces': {
      hebdo: { Info: "80%", Droit: "20%", Eco: "90%", Arts: "40%", Sci: "30%" },
      mensuel: { Info: "40%", Droit: "90%", Eco: "30%", Arts: "70%", Sci: "50%" }
    }
  };

  const triggerNotify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- CALCUL DU CHEMIN SVG ---
  const getCurvePath = (data) => {
    const values = Object.values(data).map(v => parseInt(v));
    const points = values.map((val, i) => ({
      x: (i / (values.length - 1)) * 100,
      y: 100 - val
    }));

    return points.reduce((acc, point, i, a) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const p1 = a[i - 1];
      const p2 = point;
      // Lissage par points de contrôle
      const cp1x = p1.x + (p2.x - p1.x) / 2;
      const cp2x = p1.x + (p2.x - p1.x) / 2;
      return `${acc} C ${cp1x},${p1.y} ${cp2x},${p2.y} ${p2.x},${p2.y}`;
    }, "");
  };

  // On récupère les données selon la stat ET la vue sélectionnée
  const currentData = chartData[selectedStat][view];
  const currentPath = getCurvePath(currentData);

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50 font-['Lexend']">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');`}
      </style>

      {notification && (
        <div className="fixed top-10 right-10 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 border-b-4 border-orange-500 transition-all">
          <p className="text-xs font-black uppercase tracking-widest">{notification}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-10">

        {/* --- BANNER BIENVENUE --- */}
        <section className="relative rounded-3xl overflow-hidden min-h-[180px] bg-orange-600 shadow-xl shadow-orange-200">
          <div className="absolute inset-0 p-8 flex flex-col justify-center bg-gradient-to-r from-orange-500 via-orange-600 to-orange-400">
            <h2 className="text-white text-3xl font-black uppercase tracking-tight">Bienvenue, Jean</h2>
            <p className="text-orange-50 text-lg font-medium max-w-2xl mt-2">
              Votre interface MADARA est prête. Vous avez <span className="text-white font-bold underline decoration-2">3 nouvelles demandes</span> aujourd'hui.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => triggerNotify("Chargement des rapports...")} className="bg-white text-orange-600 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md">Voir les rapports</button>
              <button onClick={() => navigate('/users')} className="bg-orange-400/30 text-white backdrop-blur-md border border-white/30 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all">Gérer les utilisateurs</button>
            </div>
          </div>
        </section>

        {/* --- SECTION DIRECTEUR --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-l-4 border-orange-500 pl-4">
            <h2 className="text-slate-800 text-2xl font-black uppercase tracking-tighter">Vue d'ensemble - {selectedStat}</h2>
            <div className="flex items-center gap-2 bg-slate-200 p-1 rounded-xl">
              <button onClick={() => setView('hebdo')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${view === 'hebdo' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}>Hebdomadaire</button>
              <button onClick={() => setView('mensuel')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${view === 'mensuel' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}>Mensuel</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon="groups" title="Étudiants" value="1,245" trend="+5%" active={selectedStat === 'Étudiants'} onClick={() => setSelectedStat('Étudiants')} />
            <StatCard icon="school" title="Promotions" value="12" trend="0%" active={selectedStat === 'Promotions'} onClick={() => setSelectedStat('Promotions')} />
            <StatCard icon="library_books" title="Espaces" value="84" trend="+12%" active={selectedStat === 'Espaces'} onClick={() => setSelectedStat('Espaces')} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-5">Analyse : {selectedStat} ({view})</h3>

              {/* --- BLOC GRAPHIQUE FIXE --- */}
              <div className="relative h-40 w-full mb-8">
                <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Surface remplie */}
                  <path d={`${currentPath} L 100,100 L 0,100 Z`} fill="url(#grad)" className="transition-all duration-700 ease-in-out" />
                  {/* Ligne de la courbe */}
                  <path d={currentPath} fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" className="transition-all duration-700 ease-in-out" />
                  
                  {/* Points sur la courbe */}
                  {Object.values(currentData).map((val, i, arr) => (
                    <circle 
                      key={i}
                      cx={(i / (arr.length - 1)) * 100}
                      cy={100 - parseInt(val)}
                      r="2"
                      className="fill-white stroke-orange-500 stroke-2 transition-all duration-700 ease-in-out"
                    />
                  ))}
                </svg>

                {/* Labels de l'axe X */}
                <div className="absolute -bottom-10 left-0 right-0 flex justify-between px-0">
                  {Object.keys(currentData).map((label) => (
                    <span key={label} className="text-[10px] font-black uppercase text-slate-400 w-12 text-center">{label}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Alertes Récentes</h3>
              <div className="space-y-4">
                <AlertItem icon="warning" title="Maintenance" desc="Prévue à 22h00" urgent />
                <AlertItem icon="person_add" title="Inscriptions" desc="5 dossiers en attente" onClick={() => navigate('/inscriptions')} />
                <AlertItem icon="check_circle" title="Export Terminé" desc="Rapport dispo" />
              </div>
            </div>
          </div>
        </div>

        {/* --- ESPACE ÉTUDIANT --- */}
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <h2 className="text-slate-800 text-2xl font-black uppercase tracking-tighter">Mon Apprentissage</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <CourseCard title="Introduction au Python" tag="Informatique" progress={75} active={activeCourse === 'python'} onClick={() => setActiveCourse(activeCourse === 'python' ? null : 'python')} />
              <CourseCard title="Droit Civil" tag="Droit" progress={30} active={activeCourse === 'droit'} onClick={() => setActiveCourse(activeCourse === 'droit' ? null : 'droit')} />
            </div>
            <div className="space-y-6">
              <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100 shadow-sm">
                <h3 className="text-xs font-black uppercase text-orange-800 mb-4">Prochains Devoirs</h3>
                <div className="space-y-4">
                  <DeadlineItem date="24" month="Oct" title="Analyse Financière" active onClick={() => triggerNotify("Devoir: Analyse Financière")} />
                  <DeadlineItem date="28" month="Oct" title="Dissertation Droit" onClick={() => triggerNotify("Devoir: Dissertation Droit")} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SOUS-COMPOSANTS --- */
const StatCard = ({ icon, title, value, trend, active, onClick }) => (
  <button onClick={onClick} className={`w-full text-left bg-white rounded-3xl p-6 shadow-sm border transition-all ${active ? 'border-orange-500 ring-4 ring-orange-50 scale-105 shadow-md' : 'border-slate-100 hover:border-orange-200'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-4 rounded-2xl ${active ? 'bg-orange-500 text-white shadow-lg' : 'bg-orange-50 text-orange-500'}`}><span className="material-symbols-outlined">{icon}</span></div>
      <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg">{trend}</span>
    </div>
    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
    <h3 className="text-3xl font-black text-slate-800 mt-1">{value}</h3>
  </button>
);

const AlertItem = ({ icon, title, desc, urgent, onClick }) => (
  <div onClick={onClick} className={`flex gap-3 p-3 rounded-2xl border cursor-pointer transition-all hover:translate-x-1 ${urgent ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100 hover:border-orange-200'}`}>
    <span className={`material-symbols-outlined text-lg ${urgent ? 'text-orange-600' : 'text-slate-400'}`}>{icon}</span>
    <div><p className="text-xs font-black uppercase text-slate-800 leading-none">{title}</p><p className="text-[10px] font-bold text-slate-500 mt-1">{desc}</p></div>
  </div>
);

const CourseCard = ({ title, tag, progress, active, onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-3xl border overflow-hidden cursor-pointer transition-all ${active ? 'ring-4 ring-orange-500 scale-[1.02] shadow-2xl' : 'border-slate-100 hover:border-orange-200'}`}>
    <div className={`h-32 relative transition-colors ${active ? 'bg-orange-600' : 'bg-orange-100'}`}>
      <div className="absolute top-4 left-4 bg-white text-orange-600 text-[9px] font-black uppercase px-2 py-1 rounded-lg shadow-sm border border-orange-100">{tag}</div>
      {active && <span className="absolute inset-0 flex items-center justify-center text-white font-black uppercase tracking-widest bg-black/20 backdrop-blur-[2px]">En cours</span>}
    </div>
    <div className="p-6">
      <h4 className="text-sm font-black uppercase text-slate-800 mb-4">{title}</h4>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div className="bg-orange-500 h-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="flex justify-between mt-3 font-black text-[10px] uppercase">
        <span className="text-slate-400">Progression</span>
        <span className="text-orange-600">{progress}%</span>
      </div>
    </div>
  </div>
);

const DeadlineItem = ({ date, month, title, active, onClick }) => (
  <div onClick={onClick} className="flex gap-4 items-center group cursor-pointer hover:translate-x-1 transition-transform">
    <div className={`flex flex-col items-center justify-center rounded-xl w-12 h-12 flex-shrink-0 font-black transition-all ${active ? 'bg-orange-500 text-white shadow-lg' : 'bg-white border border-orange-100 text-orange-500 group-hover:bg-orange-50'}`}>
      <span className="text-[9px] uppercase">{month}</span><span className="text-lg leading-none">{date}</span>
    </div>
    <div>
      <p className="text-xs font-black uppercase text-slate-800 leading-tight group-hover:text-orange-600 transition-colors">{title}</p>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Échéance Proche</p>
    </div>
  </div>
);

export default Dashboard;