import React, { useState, useMemo } from 'react';

// Importation de la police Lexend pour la cohérence
const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');`;

const AccountManagement = () => {
  // --- ÉTATS ---
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all" ou "inactive"
  const [users, setUsers] = useState([
    { id: 1, name: "Jean Dupont", email: "jean.dupont@madara.edu", role: "Enseignant", lastActive: "14 mois", initials: "JD", roleColor: "bg-slate-100 text-slate-600", status: "Inactif" },
    { id: 2, name: "Marie Curie", email: "m.curie@madara.edu", role: "Chercheur", lastActive: "18 mois", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop", roleColor: "bg-purple-50 text-purple-600", status: "Inactif" },
    { id: 3, name: "Ada Lovelace", email: "ada.lovelace@madara.edu", role: "Étudiant", lastActive: "2 ans", initials: "AL", roleColor: "bg-blue-50 text-blue-600", initColor: "bg-indigo-100 text-indigo-500", status: "Inactif" },
    { id: 4, name: "Alan Turing", email: "a.turing@madara.edu", role: "Administrateur", lastActive: "13 mois", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop", roleColor: "bg-slate-100 text-slate-600", status: "Inactif" },
  ]);

  // --- LOGIQUE DE FILTRAGE ---
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === "all" ? true : user.status === "Inactif";
      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab, users]);

  // --- ACTIONS ---
  const handleDeleteUser = (id) => {
    if (window.confirm("Supprimer ce compte définitivement ?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleMassDelete = () => {
    if (window.confirm(`Supprimer les ${filteredUsers.length} comptes affichés ?`)) {
      const filteredIds = filteredUsers.map(u => u.id);
      setUsers(users.filter(u => !filteredIds.includes(u.id)));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Lexend'] text-slate-600 antialiased">
      <style>{fontImport}</style>

      <main className="flex flex-col py-8 px-6 md:px-12 lg:px-20 max-w-[1440px] mx-auto w-full">

        {/* Page Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h1 className="text-slate-900 text-3xl md:text-4xl font-black tracking-tight">Gestion des Comptes</h1>
            <p className="text-slate-500 text-base font-medium">
              Surveillez l'activité des utilisateurs, gérez les permissions et optimisez l'espace disque.
            </p>
          </div>

          {/* Bouton Nouveau compte désactivé */}
          <button
            disabled
            className="flex items-center gap-2 bg-slate-300 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-none cursor-not-allowed opacity-70"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            Nouveau compte
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon="group" label="Utilisateurs Actifs" value="1,245" trend="+12%" color="emerald" />
          <StatCard icon="hard_drive" label="Espace Disque" value="78%" subValue="/ 2TB" trend="Stable" color="blue" progress={78} />
          <StatCard icon="memory" label="Charge Système" value="12%" trend="-5%" color="indigo" />
          <StatCard icon="person_off" label="Comptes Inactifs" value={users.length} trend="Action requise" color="orange" isWarning />
        </div>

        {/* User Table Card */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col min-h-[500px] overflow-hidden">

          {/* Toolbar */}
          <div className="p-8 border-b border-slate-50 flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">
            <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
              <div className="relative w-full sm:w-80">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined">search</span>
                <input
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#f97415]/20 text-sm font-bold shadow-inner outline-none"
                  placeholder="Rechercher par nom ou email..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-end">
              <div className="bg-slate-50 p-1.5 rounded-2xl flex">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "all" ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setActiveTab("inactive")}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === "inactive" ? 'bg-white text-[#f97415] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {activeTab === "inactive" && <span className="size-2 rounded-full bg-[#f97415] animate-pulse"></span>}
                  Inactifs ({users.length})
                </button>
              </div>

              {filteredUsers.length > 0 && (
                <button
                  onClick={handleMassDelete}
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                  Supprimer la sélection ({filteredUsers.length})
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Utilisateur</th>
                  <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rôle</th>
                  <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Dernière Activité</th>
                  <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Statut</th>
                  <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50/80 transition-all">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        {user.avatar ? (
                          <div className="bg-center bg-no-repeat bg-cover rounded-2xl size-12 shadow-sm" style={{ backgroundImage: `url(${user.avatar})` }}></div>
                        ) : (
                          <div className={`size-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${user.initColor || 'bg-slate-200 text-slate-500'}`}>
                            {user.initials}
                          </div>
                        )}
                        <div>
                          <p className="text-slate-900 font-black text-base">{user.name}</p>
                          <p className="text-slate-400 text-xs font-bold">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${user.roleColor}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-2 text-[#f97415] font-bold">
                        <span className="material-symbols-outlined text-[18px]">history</span>
                        <span className="text-sm">Il y a {user.lastActive}</span>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 border border-red-100">
                        <span className="size-2 rounded-full bg-red-500 animate-pulse"></span> Inactif
                      </span>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-slate-300 hover:text-red-500 hover:bg-red-50 size-10 rounded-xl transition-all"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="py-24 text-center">
                <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                  <span className="material-symbols-outlined text-4xl">search_off</span>
                </div>
                <p className="text-slate-400 font-bold">Aucun utilisateur trouvé {/* pour "{searchTerm}" */} </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-auto p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
              Affichage de {filteredUsers.length} sur {users.length} comptes
            </p>
            <div className="flex gap-2">
              <button className="size-11 rounded-xl flex items-center justify-center border border-slate-200 text-slate-400 hover:border-[#f97415] hover:text-[#f97415] transition-all bg-white">
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button className="size-11 rounded-xl flex items-center justify-center bg-slate-900 text-white font-black text-sm shadow-lg shadow-slate-900/20">1</button>
              <button className="size-11 rounded-xl flex items-center justify-center border border-slate-200 text-slate-400 hover:border-[#f97415] hover:text-[#f97415] transition-all bg-white">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sous-composant pour les cartes statistiques
const StatCard = ({ icon, label, value, trend, color, subValue, progress, isWarning }) => {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    orange: "bg-orange-50 text-[#f97415]"
  };

  return (
    <div className={`bg-white rounded-[2rem] p-8 shadow-sm border ${isWarning ? 'border-[#f97415]/20' : 'border-slate-100'} flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden cursor-default`}>
      {isWarning && <div className="absolute right-0 top-0 size-32 bg-[#f97415]/5 rounded-bl-full -mr-8 -mt-8"></div>}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`${colors[color] || colors.emerald} rounded-2xl p-4 flex items-center justify-center shadow-sm`}>
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        <span className={`${colors[color] || colors.emerald} px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider`}>{trend}</span>
      </div>
      <div className="relative z-10">
        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.15em] mb-2">{label}</p>
        <div className="flex items-end gap-2">
          <p className="text-slate-900 text-4xl font-black tracking-tight">{value}</p>
          {subValue && <span className="text-slate-400 text-sm mb-1.5 font-bold">{subValue}</span>}
        </div>
        {progress && (
          <div className="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden shadow-inner">
            <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountManagement;