import React, { useState, useMemo } from 'react';

const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');`;

const LogsMaintenance = () => {
  // États pour la gestion des données et UI
  const [filter, setFilter] = useState('TOUS'); // 'TOUS' ou 'ERREURS'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedLog, setExpandedLog] = useState(null);

  const logsToday = [
    {
      id: 1,
      time: "06:42",
      type: "CRITIQUE",
      title: "Erreur de connexion Base de Données",
      desc: "Timeout connection to secondary replica DB-02. Retrying...",
      code: "Code: 504",
      icon: "dns",
      colorClass: "border-l-red-500",
      badgeClass: "text-red-500 bg-red-50",
      iconClass: "bg-red-50 text-red-500",
      details: "L'instance RDS 'db-prod-02' ne répond pas aux requêtes de synchronisation. Latence mesurée : 4500ms."
    },
    {
      id: 2,
      time: "07:38",
      type: "WARNING",
      title: "Charge CPU Élevée",
      desc: "Node-01 sustained CPU usage > 90% for 5 minutes.",
      code: "Server: Node-01",
      icon: "memory",
      colorClass: "border-l-orange-500",
      badgeClass: "text-orange-600 bg-orange-50",
      iconClass: "bg-orange-50 text-orange-500",
      details: "Processus incriminé : 'worker-process-v2'. Redémarrage automatique du conteneur planifié."
    },
    {
      id: 3,
      time: "07:15",
      type: "SÉCURITÉ",
      title: "Échec d'authentification multiple",
      desc: "3 failed login attempts for user 'admin' from unrecognized device.",
      code: "IP: 192.168.1.45",
      icon: "security",
      colorClass: "border-l-yellow-500",
      badgeClass: "text-yellow-700 bg-yellow-50",
      iconClass: "bg-yellow-50 text-yellow-600",
      details: "Origine : Browser Chrome 120.0. Location estimée : Paris, FR. Blocage IP temporaire activé."
    },
    {
      id: 4,
      time: "04:00",
      type: "INFO",
      title: "Sauvegarde Automatique Complétée",
      desc: "Daily incremental backup successfully stored to S3 bucket.",
      code: "Size: 4.2 GB",
      icon: "backup",
      colorClass: "border-l-blue-400",
      badgeClass: "text-blue-600 bg-blue-50",
      iconClass: "bg-blue-50 text-blue-500",
      details: "Backup-ID: bk-2025-01-05. Destination: s3://setice-backups/daily/."
    }
  ];

  // Filtrage des logs
  const filteredLogs = useMemo(() => {
    if (filter === 'ERREURS') {
      return logsToday.filter(log => ['CRITIQUE', 'WARNING'].includes(log.type));
    }
    return logsToday;
  }, [filter]);

  // Actions
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleExport = () => {
    alert("Génération du fichier CSV en cours...");
  };

  return (
    <div className="min-h-screen bg-[#f8f7f5] text-slate-900 antialiased font-['Lexend']">
      <style>{fontImport}</style>

      <main className="flex flex-col py-8 px-4 md:px-8 lg:px-20 xl:px-40 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full">

          {/* Banner */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white shadow-lg min-h-[200px] flex flex-col justify-end p-8 md:p-12">
            <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" 
                 style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop")' }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">Logs Serveur</h1>
                <p className="text-slate-300 max-w-lg text-sm md:text-base font-medium">Surveillance en temps réel des activités système.</p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-5 py-2.5 rounded-2xl backdrop-blur-sm border border-emerald-500/30 w-fit">
                <span className={`material-symbols-outlined text-lg ${isRefreshing ? 'animate-spin' : ''}`}>check_circle</span>
                <span className="text-xs font-black uppercase tracking-widest">Système Opérationnel</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard icon="dangerous" label="Erreurs Critiques (24h)" value="3" trend="+10%" color="red" />
            <StatCard icon="shield_lock" label="Tentatives d'Intrusion" value="12" trend="+2%" color="orange" />
            <StatCard icon="speed" label="Temps de Réponse" value="45ms" trend="-5ms" color="blue" isPositive />
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-2xl shadow-sm hover:bg-slate-50 border border-slate-100 transition-all font-bold text-sm">
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                Filtrer
              </button>
              <div className="h-8 w-px bg-slate-200 mx-2"></div>
              <button 
                onClick={() => setFilter('TOUS')}
                className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${filter === 'TOUS' ? 'bg-[#f97415] text-white shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:bg-white'}`}
              >
                Tous
              </button>
              <button 
                onClick={() => setFilter('ERREURS')}
                className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${filter === 'ERREURS' ? 'bg-[#f97415] text-white shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:bg-white'}`}
              >
                Erreurs
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleRefresh}
                className="flex items-center justify-center size-12 bg-white text-slate-500 rounded-2xl shadow-sm border border-slate-100 hover:text-[#f97415] transition-all group"
              >
                <span className={`material-symbols-outlined ${isRefreshing ? 'animate-spin' : 'group-active:rotate-180'} transition-transform duration-500`}>refresh</span>
              </button>
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-md hover:bg-[#f97415] transition-all font-black text-xs uppercase tracking-widest"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
                Exporter CSV
              </button>
            </div>
          </div>

          {/* Log Feed */}
          <div className="flex flex-col gap-4">
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] pl-2">Aujourd'hui ({filteredLogs.length})</h3>
            
            {filteredLogs.map(log => (
              <LogItem 
                key={log.id} 
                {...log} 
                isExpanded={expandedLog === log.id}
                onToggle={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
              />
            ))}

            {filteredLogs.length === 0 && (
              <div className="py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-bold tracking-tight">Aucun log ne correspond à ce filtre.</p>
              </div>
            )}
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
    <div className="flex flex-col justify-between p-8 bg-white rounded-[2rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:-translate-y-1 transition-all cursor-default">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${bgColors[color]}`}>
          <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider ${trendBg}`}>{trend}</span>
      </div>
      <div>
        <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">{label}</p>
        <p className="text-slate-900 text-4xl font-black tracking-tight">{value}</p>
      </div>
    </div>
  );
};

const LogItem = ({ time, type, title, desc, code, icon, colorClass, badgeClass, iconClass, opacity = "", isExpanded, onToggle, details }) => (
  <div 
    onClick={onToggle}
    className={`group flex flex-col gap-4 p-6 bg-white rounded-[2rem] shadow-sm border-l-[6px] ${colorClass} border-y border-r border-slate-100 hover:shadow-lg transition-all cursor-pointer ${opacity} ${isExpanded ? 'shadow-xl' : ''}`}
  >
    <div className="flex flex-col md:flex-row md:items-center gap-5">
      <div className="flex items-center gap-5 min-w-[160px]">
        <div className={`flex-shrink-0 size-12 rounded-2xl flex items-center justify-center ${iconClass}`}>
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-900 font-black text-lg">{time}</span>
          <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg w-fit mt-1 uppercase tracking-widest ${badgeClass}`}>{type}</span>
        </div>
      </div>
      <div className="flex flex-col flex-1 gap-1">
        <h4 className={`text-slate-900 font-black text-lg tracking-tight transition-colors ${isExpanded ? 'text-[#f97415]' : 'group-hover:text-[#f97415]'}`}>{title}</h4>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
      </div>
      <div className="flex items-center gap-4 md:justify-end min-w-[220px]">
        <span className="font-bold text-[11px] bg-slate-50 text-slate-500 px-4 py-2 rounded-xl border border-slate-100">{code}</span>
        <button className={`size-10 flex items-center justify-center text-slate-300 group-hover:text-[#f97415] hover:bg-orange-50 rounded-xl transition-all ml-auto md:ml-0 ${isExpanded ? 'rotate-180 text-[#f97415]' : ''}`}>
          <span className="material-symbols-outlined">expand_more</span>
        </button>
      </div>
    </div>
    
    {/* Contenu expansible */}
    {isExpanded && (
      <div className="pt-4 mt-4 border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">
        <div className="bg-slate-50 p-5 rounded-2xl">
          <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Analyse technique détaillée</h5>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">{details}</p>
        </div>
      </div>
    )}
  </div>
);

export default LogsMaintenance;