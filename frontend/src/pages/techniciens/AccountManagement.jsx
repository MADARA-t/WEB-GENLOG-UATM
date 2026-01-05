import React from 'react';

const AccountManagement = () => {
  const users = [
    { id: 1, name: "Jean Dupont", email: "jean.dupont@madara.edu", role: "Enseignant", lastActive: "14 mois", initials: "JD", roleColor: "bg-slate-100 text-slate-600" },
    { id: 2, name: "Marie Curie", email: "m.curie@madara.edu", role: "Chercheur", lastActive: "18 mois", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_igBYsglqdjomOh0Xyw6DCUiJtnG_fhEsYCIwdrYXLw2HHpTxUEekTe2LdZmBscWyhPSDOvFx4dTFWOMsovBt5faXhn_mrnQ8CSUv6SjCoJWwcTPP6_rWmvLGqr6Uq_o6c_Wq1ALbKxzXqNJust1Dg-FQV-8gxC1PVbqsrjz2oLDM_7n1NvRY7kjiC5aYevCbdNCX2BkSILhEFRNsIj9nqamp_bC3nJB2kzNMRPUXbr95KB1Qdo7RCsxyBmA-8xenKxEirP7msl4", roleColor: "bg-purple-50 text-purple-600" },
    { id: 3, name: "Ada Lovelace", email: "ada.lovelace@madara.edu", role: "Étudiant", lastActive: "2 ans", initials: "AL", roleColor: "bg-blue-50 text-blue-600", initColor: "bg-indigo-100 text-indigo-500" },
    { id: 4, name: "Alan Turing", email: "a.turing@madara.edu", role: "Administrateur", lastActive: "13 mois", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyLUyj2-Bvdwefo3IPHcSWjxKKasd85ZQI3LdQcL4YWzjhHA-wNmBldGODRlq1GtX_fMa7GNK8jfFEszf7HMabueooU_ZMMBAY1426NL8xFjCcx6GPcWRZlktDsmedNnEbZ5ZvMaS2ktguBTfZdX7LoKRcAMDJlLCxNpNmm8zCLzkKRP9XgHEyn28KuOquYQmBUWpOT-GVj2ok7g24iPMG_aqDvZl7uhbAOyXwOajMIgCpc5DmaqQ_nKCdqjLN9SrZzMLmb6mmaak", roleColor: "bg-slate-100 text-slate-600" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Lexend'] text-slate-600">

      <main className="flex flex-col py-8 px-6 md:px-12 lg:px-20 max-w-[1440px] mx-auto w-full">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <a className="text-slate-400 hover:text-[#f97415] text-sm font-medium transition-colors" href="#">Accueil</a>
          <span className="text-slate-300 text-sm font-medium">/</span>
          <a className="text-slate-400 hover:text-[#f97415] text-sm font-medium transition-colors" href="#">Administration</a>
          <span className="text-slate-300 text-sm font-medium">/</span>
          <span className="text-[#f97415] text-sm font-medium">Gestion des Comptes</span>
        </div>

        {/* Page Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h1 className="text-slate-900 text-3xl md:text-4xl font-black tracking-tight">Gestion des Comptes</h1>
            <p className="text-slate-500 text-base">
              Surveillez l'activité des utilisateurs, gérez les permissions et optimisez l'espace disque en supprimant les comptes inactifs.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all active:scale-95">
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span>Nouveau compte</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon="group" label="Utilisateurs Actifs" value="1,245" trend="+12%" color="emerald" />
          <StatCard icon="hard_drive" label="Espace Disque" value="78%" subValue="/ 2TB" trend="Stable" color="blue" progress={78} />
          <StatCard icon="memory" label="Charge Système" value="12%" trend="-5%" color="indigo" />
          <StatCard icon="person_off" label="Comptes Inactifs (> 1 an)" value="42" trend="Action requise" color="orange" isWarning />
        </div>

        {/* User Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-[600px] overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-slate-100 flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">
            <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
              <div className="relative w-full sm:w-80">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined">search</span>
                <input className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-full text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#f97415]/50 text-sm font-medium shadow-inner" placeholder="Rechercher un compte..." type="text"/>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-end">
              <div className="bg-slate-50 p-1 rounded-full flex">
                <button className="px-5 py-2 rounded-full text-sm font-bold text-slate-500">Tous</button>
                <button className="px-5 py-2 rounded-full text-sm font-bold bg-white text-[#f97415] shadow-sm border border-slate-100 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#f97415] animate-pulse"></span>
                  Inactifs ({'>'} 1 an)
                </button>
              </div>
              <button className="flex items-center gap-2 bg-[#f97415] hover:bg-orange-700 text-white px-5 py-2.5 rounded-full font-bold shadow-md transition-all active:scale-95">
                <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                <span>Suppression massive (42)</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400">Utilisateur</th>
                  <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400">Rôle</th>
                  <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400">Dernière Activité</th>
                  <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400">Statut</th>
                  <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        {user.avatar ? (
                          <div className="bg-center bg-no-repeat bg-cover rounded-full size-10" style={{ backgroundImage: `url(${user.avatar})` }}></div>
                        ) : (
                          <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm ${user.initColor || 'bg-slate-200 text-slate-500'}`}>
                            {user.initials}
                          </div>
                        )}
                        <div>
                          <p className="text-slate-900 font-bold text-sm">{user.name}</p>
                          <p className="text-slate-400 text-xs font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${user.roleColor}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-[#f97415] font-medium">
                        <span className="material-symbols-outlined text-[16px]">history</span>
                        <span className="text-sm">Il y a {user.lastActive}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                        <span className="size-1.5 rounded-full bg-red-500"></span> Inactif
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-slate-400 hover:text-[#f97415] hover:bg-[#f97415]/10 p-2 rounded-full transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-auto p-6 border-t border-slate-100 flex items-center justify-between">
            <p className="text-slate-400 text-sm font-medium">Affichage de 1 à 4 sur 42 comptes</p>
            <div className="flex gap-2">
              <button className="size-9 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 hover:border-[#f97415] transition-colors">
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button className="size-9 rounded-full flex items-center justify-center bg-[#f97415] text-white font-bold">1</button>
              <button className="size-9 rounded-full flex items-center justify-center border border-slate-200 text-slate-500 hover:border-[#f97415] font-medium">2</button>
              <button className="size-9 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 hover:border-[#f97415]">
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
    <div className={`bg-white rounded-2xl p-6 shadow-sm border ${isWarning ? 'border-[#f97415]/20' : 'border-slate-100'} flex flex-col justify-between group hover:shadow-md transition-all relative overflow-hidden`}>
      {isWarning && <div className="absolute right-0 top-0 size-24 bg-[#f97415]/5 rounded-bl-full -mr-4 -mt-4"></div>}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`${colors[color] || colors.emerald} rounded-full p-3 flex items-center justify-center`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className={`${colors[color] || colors.emerald} px-2 py-1 rounded-full text-xs font-bold`}>{trend}</span>
      </div>
      <div className="relative z-10">
        <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
        <div className="flex items-end gap-2">
          <p className="text-slate-900 text-3xl font-bold tracking-tight">{value}</p>
          {subValue && <span className="text-slate-400 text-sm mb-1 font-medium">{subValue}</span>}
        </div>
        {progress && (
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountManagement;