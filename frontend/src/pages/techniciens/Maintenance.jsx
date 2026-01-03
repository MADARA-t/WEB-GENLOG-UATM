import React from 'react';

const LogsMaintenance = () => {
  const logsToday = [
    {
      id: 1,
      time: "10:42",
      type: "CRITIQUE",
      title: "Erreur de connexion Base de Données",
      desc: "Timeout connection to secondary replica DB-02. Retrying...",
      code: "Code: 504",
      icon: "dns",
      colorClass: "border-l-red-500",
      badgeClass: "text-red-500 bg-red-50",
      iconClass: "bg-red-50 text-red-500"
    },
    {
      id: 2,
      time: "10:38",
      type: "WARNING",
      title: "Charge CPU Élevée",
      desc: "Node-01 sustained CPU usage > 90% for 5 minutes.",
      code: "Server: Node-01",
      icon: "memory",
      colorClass: "border-l-orange-500",
      badgeClass: "text-orange-600 bg-orange-50",
      iconClass: "bg-orange-50 text-orange-500"
    },
    {
      id: 3,
      time: "10:15",
      type: "SÉCURITÉ",
      title: "Échec d'authentification multiple",
      desc: "3 failed login attempts for user 'admin' from unrecognized device.",
      code: "IP: 192.168.1.45",
      icon: "security",
      colorClass: "border-l-yellow-500",
      badgeClass: "text-yellow-700 bg-yellow-50",
      iconClass: "bg-yellow-50 text-yellow-600"
    },
    {
      id: 4,
      time: "09:00",
      type: "INFO",
      title: "Sauvegarde Automatique Complétée",
      desc: "Daily incremental backup successfully stored to S3 bucket.",
      code: "Size: 4.2 GB",
      icon: "backup",
      colorClass: "border-l-blue-400",
      badgeClass: "text-blue-600 bg-blue-50",
      iconClass: "bg-blue-50 text-blue-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f5] font-['Noto_Sans'] text-slate-900 antialiased">

      <main className="flex flex-col py-8 px-4 md:px-8 lg:px-20 xl:px-40 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-slate-500 font-['Space_Grotesk']">
            <a className="hover:text-[#f97415]" href="#">Tableau de bord</a>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-slate-900 font-medium">Logs & Maintenance</span>
          </div>

          {/* Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-lg min-h-[200px] flex flex-col justify-end p-8 font-['Space_Grotesk']">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBzJAVDWSAiQfPLfUQxKWccfZE72nkAqWCyOIEtK75wS4JR41aqfr5X0yZ-NV9dmqxAOyB4BiFfgX-NWwExyy2_Ch9x0obGQ2nTbW9rJua3ERg2qaGNAkJO58sZKz8cTggmSceu6bHxNWFHn-VAGDqzojzqiASSZus-PMF3DcQfnHUQeK2ISBJuvWK2EbVHm8dUKmxxwae8_VdkVFzKUViNBr-Tlj_3aVkj83Pinc_7IV3gx0uspaMlHvB5k4X_PU2JTbxkNVZVt8k")' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Logs Serveur</h1>
                <p className="text-slate-300 max-w-lg text-sm md:text-base">Surveillance en temps réel des activités système, erreurs critiques et tentatives d'accès.</p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full backdrop-blur-sm border border-emerald-500/30">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span className="text-sm font-bold">Système Opérationnel</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard icon="dangerous" label="Erreurs Critiques (24h)" value="3" trend="+10%" color="red" />
            <StatCard icon="shield_lock" label="Tentatives d'Intrusion" value="12" trend="+2%" color="orange" />
            <StatCard icon="speed" label="Temps de Réponse Moyen" value="45ms" trend="-5ms" color="blue" isPositive />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-2 font-['Space_Grotesk']">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 rounded-full shadow-sm hover:bg-slate-50 border border-slate-100 transition-colors whitespace-nowrap">
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                <span className="text-sm font-semibold">Filtrer</span>
              </button>
              <div className="h-8 w-px bg-slate-200 mx-1"></div>
              <button className="px-4 py-2 bg-[#f97415]/10 text-[#f97415] rounded-full font-bold text-sm">Tous</button>
              <button className="px-4 py-2 hover:bg-slate-100 text-slate-500 rounded-full font-medium text-sm transition-colors">Erreurs</button>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center justify-center size-10 bg-white text-slate-500 rounded-full shadow-sm border border-slate-100 hover:text-[#f97415] transition-colors">
                <span className="material-symbols-outlined">refresh</span>
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full shadow-md hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-[20px]">download</span>
                <span className="text-sm font-bold">Exporter CSV</span>
              </button>
            </div>
          </div>

          {/* Log Feed */}
          <div className="flex flex-col gap-4">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider pl-2 font-['Space_Grotesk']">Aujourd'hui</h3>
            {logsToday.map(log => (
              <LogItem key={log.id} {...log} />
            ))}
            
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider pl-2 mt-4 font-['Space_Grotesk']">Hier</h3>
            <LogItem 
              time="23:00" 
              type="MAINTENANCE" 
              title="Mise à jour système appliquée" 
              desc="Patch KB-2993 applied successfully. Reboot completed." 
              code="User: system" 
              icon="system_update" 
              colorClass="border-l-emerald-500" 
              badgeClass="text-emerald-600 bg-emerald-50" 
              iconClass="bg-emerald-50 text-emerald-500"
              opacity="opacity-80"
            />
          </div>

          {/* Load More */}
          <div className="flex justify-center py-6">
            <button className="group flex items-center gap-2 px-6 py-3 bg-white text-slate-500 rounded-full shadow-sm border border-slate-200 hover:border-[#f97415] hover:text-[#f97415] transition-all font-['Space_Grotesk']">
              <span className="text-sm font-bold">Charger plus d'entrées</span>
              <span className="material-symbols-outlined transition-transform group-hover:translate-y-1">arrow_downward</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, color, isPositive }) => {
  const bgColors = {
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600"
  };
  const trendBg = isPositive ? "bg-emerald-50 text-emerald-600" : bgColors[color];

  return (
    <div className="flex flex-col justify-between p-6 bg-white rounded-2xl shadow-sm border border-slate-100 group hover:shadow-md transition-all font-['Space_Grotesk']">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-full ${bgColors[color]}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendBg}`}>{trend}</span>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
        <p className="text-slate-900 text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
};

const LogItem = ({ time, type, title, desc, code, icon, colorClass, badgeClass, iconClass, opacity = "" }) => (
  <div className={`group flex flex-col md:flex-row md:items-center gap-4 p-5 bg-white rounded-xl shadow-sm border-l-4 ${colorClass} border-y border-r border-slate-100 hover:shadow-md transition-all ${opacity} hover:opacity-100`}>
    <div className="flex items-center gap-4 min-w-[140px]">
      <div className={`flex-shrink-0 size-10 rounded-full flex items-center justify-center ${iconClass}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-slate-900 font-bold font-mono">{time}</span>
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full w-fit mt-1 uppercase ${badgeClass}`}>{type}</span>
      </div>
    </div>
    <div className="flex flex-col flex-1 gap-1">
      <h4 className="text-slate-900 font-bold text-base">{title}</h4>
      <p className="text-slate-500 text-sm">{desc}</p>
    </div>
    <div className="flex items-center gap-4 md:justify-end min-w-[200px]">
      <span className="font-mono text-[11px] bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">{code}</span>
      <button className="p-2 text-slate-400 hover:text-[#f97415] hover:bg-slate-50 rounded-full transition-colors ml-auto md:ml-0">
        <span className="material-symbols-outlined">expand_more</span>
      </button>
    </div>
  </div>
);

export default LogsMaintenance;