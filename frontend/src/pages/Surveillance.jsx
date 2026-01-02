import React, { useState, useMemo } from 'react';

const InactiveUsers = () => {
  const getAvatar = (name) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=ffdfbf,c0aede,d1d4f9,b6e3f4`;

  // --- ÉTATS ---
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [selectedUser, setSelectedUser] = useState(null); // Pour la vue "Détails"
  
  const [inactives, setInactives] = useState([
    { id: 1, name: "Ibrahim Soglo", info: "Bachelor Design - Année 2", lastSeen: "Il y a 2 mois", date: "14 Octobre 2024", status: "INACTIF", type: "default", email: "i.soglo@madara.edu" },
    { id: 2, name: "Awa Diop", info: "Master Marketing - Année 1", lastSeen: "Il y a 4 mois", date: "12 Août 2024", status: "SUSPENDU", type: "critical", email: "a.diop@madara.edu" },
    { id: 3, name: "Modibo Keïta", info: "Bachelor Design - Année 3", lastSeen: "Il y a 1 mois", date: "22 Novembre 2024", status: "RELANCE J-7", type: "info", email: "m.keita@madara.edu" },
    { id: 4, name: "Zainab Mensah", info: "MSc Finance - Année 1", lastSeen: "Il y a 3 mois", date: "10 Septembre 2024", status: "INACTIF", type: "default", email: "z.mensah@madara.edu" },
    { id: 5, name: "Tunde Adenuga", info: "MSc Finance - Année 2", lastSeen: "Il y a 14 mois", date: "05 Juillet 2023", status: "À SUPPRIMER", type: "warning", email: "t.adenuga@madara.edu" },
  ]);

  // --- LOGIQUE DE FILTRAGE ---
  const filteredInactives = useMemo(() => {
    return inactives.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           user.info.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        activeFilter === "Tous" || 
        (activeFilter === "Inactif > 3 mois" && (user.lastSeen.includes("mois") && parseInt(user.lastSeen.match(/\d+/)) >= 3)) ||
        (activeFilter === "Relance envoyée" && user.status.includes("RELANCE"));

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter, inactives]);

  // --- ACTIONS ---
  
  // US 4.3 : Relance individuelle
  const handleRelance = (user) => {
    const updated = inactives.map(u => 
      u.id === user.id ? { ...u, status: "RELANCÉ", type: "info" } : u
    );
    setInactives(updated);
    alert(`Un email de réengagement automatique a été envoyé à ${user.name} (${user.email}).`);
  };

  // US 4.4 : Suppression après 1 an d'inactivité
  const handleDelete = (id, name) => {
    if (window.confirm(`Confirmez-vous la suppression définitive du compte de ${name} ? Cette action est irréversible (Maintenance annuelle).`)) {
      setInactives(inactives.filter(u => u.id !== id));
    }
  };

  const handleLaunchCampaign = () => {
    alert(`Lancement d'une campagne massive pour les ${filteredInactives.length} utilisateurs filtrés.`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50/50">
      
      {/* MODAL DE DÉTAILS DU PROFIL (Simulation US 4.3) */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <img src={getAvatar(selectedUser.name)} className="w-16 h-16 rounded-2xl shadow-lg" alt="" />
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{selectedUser.name}</h2>
                  <p className="text-orange-500 font-bold">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>
            </div>
            <div className="space-y-4 bg-slate-50 p-6 rounded-3xl mb-8">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase">Dernière activité</span>
                <span className="text-sm font-bold text-slate-700">{selectedUser.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase">Cursus</span>
                <span className="text-sm font-bold text-slate-700">{selectedUser.info}</span>
              </div>
            </div>
            <button 
              onClick={() => { handleRelance(selectedUser); setSelectedUser(null); }}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-500 transition-colors"
            >
              Envoyer un message direct
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-20">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm font-medium">
          <a className="text-[#f97415] hover:text-[#e0630b] transition-colors" href="#">Madara</a>
          <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
          <a className="text-[#f97415] hover:text-[#e0630b] transition-colors" href="#">Communauté</a>
          <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
          <span className="text-slate-500">Surveillance et Relances</span>
        </nav>

        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase leading-none">
              Surveillance & <span className="text-orange-500">Relances</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Gestion des comptes inactifs et pilotage des campagnes de réengagement pour l'académie Madara.
            </p>
          </div>
          <button 
            onClick={handleLaunchCampaign}
            className="bg-orange-500 hover:bg-orange-600 text-white h-14 px-8 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-wider shadow-xl shadow-orange-200 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <span className="material-symbols-outlined">campaign</span>
            <span>Lancer une campagne</span>
          </button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon="person_off" label="Comptes Inactifs" value={inactives.length} trend="+5%" color="orange" />
          <StatCard icon="pending_actions" label="Relances en attente" value={inactives.filter(u => u.type === 'warning' || u.type === 'critical').length} trend="Urgences" color="blue" />
          <StatCard icon="mark_email_read" label="Taux de réponse" value="12%" trend="-2%" color="purple" />
        </div>

        {/* Filters & Table */}
        <section className="flex flex-col gap-6 mt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              <FilterButton label="Tous" active={activeFilter === "Tous"} onClick={() => setActiveFilter("Tous")} />
              <FilterButton label="Inactif > 3 mois" active={activeFilter === "Inactif > 3 mois"} onClick={() => setActiveFilter("Inactif > 3 mois")} />
              <FilterButton label="Relance envoyée" active={activeFilter === "Relance envoyée"} onClick={() => setActiveFilter("Relance envoyée")} />
            </div>
            <div className="flex-1"></div>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">search</span>
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 pl-12 pr-6 rounded-2xl border-none bg-white text-sm font-bold shadow-sm focus:ring-2 focus:ring-orange-500 w-full sm:w-80 transition-all outline-none" 
                placeholder="Rechercher un étudiant..." 
                type="text"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/30">
                    <th className="py-6 px-8 text-xs font-black tracking-widest text-slate-400 uppercase">Utilisateur</th>
                    <th className="py-6 px-8 text-xs font-black tracking-widest text-slate-400 uppercase">Dernière Connexion</th>
                    <th className="py-6 px-8 text-xs font-black tracking-widest text-slate-400 uppercase">Statut Actuel</th>
                    <th className="py-6 px-8 text-xs font-black tracking-widest text-orange-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredInactives.length > 0 ? (
                    filteredInactives.map((user) => (
                      <tr key={user.id} className="hover:bg-orange-50/20 transition-colors group">
                        <td className="py-5 px-8">
                          <div className="flex items-center gap-4">
                            <img 
                              src={getAvatar(user.name)} 
                              alt={user.name} 
                              className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-sm group-hover:scale-110 transition-transform" 
                            />
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{user.name}</span>
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">{user.info}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-8">
                          <div className="flex flex-col">
                            <span className={`text-sm font-bold ${user.lastSeen.includes('14') ? 'text-red-500' : 'text-slate-700'}`}>{user.lastSeen}</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase">{user.date}</span>
                          </div>
                        </td>
                        <td className="py-5 px-8">
                          <StatusBadge label={user.status} type={user.type} />
                        </td>
                        <td className="py-5 px-8 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <ActionButton 
                              icon="notifications" 
                              primary 
                              onClick={() => handleRelance(user)} 
                              title="Envoyer une relance"
                            />
                            <ActionButton 
                              icon="visibility" 
                              onClick={() => setSelectedUser(user)}
                              title="Voir le profil" 
                            />
                            <ActionButton 
                              icon="delete" 
                              onClick={() => handleDelete(user.id, user.name)}
                              title="Supprimer (Maintenance annuelle)" 
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
                        Aucun utilisateur inactif trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// --- SOUS-COMPOSANTS ---

const StatCard = ({ icon, label, value, trend, color }) => {
  const colors = {
    orange: "text-orange-500 bg-orange-50",
    blue: "text-blue-500 bg-blue-50",
    purple: "text-purple-500 bg-purple-50"
  };
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700 ${colors[color].split(' ')[1]}`} />
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]}`}>
          <span className="material-symbols-outlined !text-[28px]">{icon}</span>
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</span>
      </div>
      <div className="flex items-baseline gap-3">
        <p className="text-4xl font-black text-slate-900">{value}</p>
        <span className="text-xs font-bold text-emerald-500">{trend}</span>
      </div>
    </div>
  );
};

const StatusBadge = ({ label, type }) => {
  const styles = {
    critical: "bg-red-50 text-red-600 border-red-100",
    info: "bg-blue-50 text-blue-600 border-blue-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
    default: "bg-slate-100 text-slate-500 border-slate-200"
  };
  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${styles[type] || styles.default}`}>
      {label}
    </span>
  );
};

const FilterButton = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`h-10 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
    active ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
  }`}>
    {label}
  </button>
);

const ActionButton = ({ icon, primary, onClick, title }) => (
  <button 
    title={title}
    onClick={onClick}
    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
    primary ? 'bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
  }`}>
    <span className="material-symbols-outlined !text-[20px]">{icon}</span>
  </button>
);

export default InactiveUsers;