import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('hebdo');
  const [selectedStat, setSelectedStat] = useState('Étudiants');
  const [notification, setNotification] = useState(null);

  const chartData = {
    'Étudiants': {
      hebdo: [65, 85, 45, 90, 60],
      mensuel: [95, 70, 80, 50, 85]
    },
    'Promotions': {
      hebdo: [30, 40, 80, 35, 95],
      mensuel: [50, 60, 40, 80, 70]
    },
    'Espaces': {
      hebdo: [80, 20, 90, 40, 30],
      mensuel: [40, 90, 30, 70, 50]
    }
  };

  const getCurvePath = (data) => {
    const points = data.map((val, i) => ({
      x: (i / (data.length - 1)) * 100,
      y: 100 - val
    }));

    return points.reduce((acc, point, i, a) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const p1 = a[i - 1];
      const p2 = point;
      const cp1x = p1.x + (p2.x - p1.x) / 2;
      const cp2x = p1.x + (p2.x - p1.x) / 2;
      return `${acc} C ${cp1x},${p1.y} ${cp2x},${p2.y} ${p2.x},${p2.y}`;
    }, "");
  };

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

        {/* --- BANNER BIENVENUE (Version Midnight Orange) --- */}
        <section className="relative rounded-[2.5rem] overflow-hidden min-h-[180px] shadow-2xl shadow-orange-900/10 group">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-orange-950 to-orange-800"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-orange-500/20 transition-all duration-700"></div>
          <div className="absolute bottom-0 left-1/2 w-40 h-40 bg-orange-600/10 rounded-full blur-2xl"></div>

          <div className="relative z-10 p-10 flex flex-col justify-center h-full">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-[2px] w-8 bg-orange-500"></span>
              <span className="text-orange-500 text-[10px] font-black uppercase tracking-[0.3em]">Tableau de bord</span>
            </div>
            <h2 className="text-white text-4xl font-black uppercase tracking-tighter leading-none">
              Bienvenue, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-100">Odalric</span>
            </h2>
            <p className="text-slate-300 text-sm font-medium max-w-xl mt-4 leading-relaxed tracking-wide">
              Votre interface <span className="text-white font-bold">MADARA</span> est synchronisée. Voici vos statistiques actuelles.
            </p>
          </div>
        </section>

        {/* --- SECTION STATS --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-l-4 border-orange-500 pl-4">
            <h2 className="text-slate-800 text-2xl font-black uppercase tracking-tighter">Analyse - {selectedStat}</h2>
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
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col min-h-[300px]">
              <h3 className="text-sm font-black uppercase tracking-[0.1em] text-slate-400 mb-10">Activité {selectedStat}</h3>

              <div className="relative flex-1 w-full mt-4">
                <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={`${currentPath} L 100,100 L 0,100 Z`} fill="url(#grad)" className="transition-all duration-700 ease-in-out" />
                  <path d={currentPath} fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" className="transition-all duration-700 ease-in-out" />

                  {currentData.map((val, i, arr) => (
                    <circle
                      key={i}
                      cx={(i / (arr.length - 1)) * 100}
                      cy={100 - val}
                      r="2.5"
                      className="fill-white stroke-orange-500 stroke-[1.5] transition-all duration-700 ease-in-out"
                    />
                  ))}
                </svg>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Alertes Récentes</h3>
              <div className="space-y-4">
                <AlertItem icon="warning" title="Maintenance" desc="Serveur pédagogique" urgent />
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
  <button onClick={onClick} className={`w-full text-left bg-white rounded-[2rem] p-6 shadow-sm border transition-all ${active ? 'border-orange-500 ring-4 ring-orange-50 scale-105 shadow-md' : 'border-slate-100 hover:border-orange-200'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-4 rounded-2xl ${active ? 'bg-slate-900 text-white shadow-lg' : 'bg-orange-50 text-orange-500'}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg tracking-wider">{trend}</span>
    </div>
    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">{title}</p>
    <h3 className="text-3xl font-black text-slate-800 mt-1">{value}</h3>
  </button>
);

const AlertItem = ({ icon, title, desc, urgent }) => (
  <div className={`flex gap-3 p-4 rounded-2xl border cursor-pointer transition-all hover:translate-x-1 ${urgent ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100'}`}>
    <span className={`material-symbols-outlined text-lg ${urgent ? 'text-orange-600' : 'text-slate-400'}`}>{icon}</span>
    <div>
      <p className="text-[11px] font-black uppercase text-slate-800 leading-none tracking-wider">{title}</p>
      <p className="text-[10px] font-bold text-slate-500 mt-1">{desc}</p>
    </div>
  </div>
);

export default Dashboard;