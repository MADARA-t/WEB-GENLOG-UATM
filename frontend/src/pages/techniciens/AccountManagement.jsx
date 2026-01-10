import React, { useState, useMemo, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION SUPABASE ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Importation de la police Lexend
const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');`;

const AccountManagement = () => {
  // --- ÉTATS ---
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- RÉCUPÉRATION DES DONNÉES RÉELLES ---
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Erreur:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIQUE DE FILTRAGE ---
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === "all" ? true : user.status === "Inactif";
      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab, users]);

  // --- ACTIONS RÉELLES ---
  const handleDeleteUser = async (id) => {
    if (window.confirm("Supprimer ce compte définitivement de la base de données ?")) {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (!error) setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleMassDelete = async () => {
    if (window.confirm(`Supprimer les ${filteredUsers.length} comptes affichés ?`)) {
      const ids = filteredUsers.map(u => u.id);
      const { error } = await supabase.from('users').delete().in('id', ids);
      if (!error) setUsers(users.filter(u => !ids.includes(u.id)));
    }
  };

  // --- HELPERS VISUELS ---
  const getRoleColor = (role) => {
    switch (role) {
      case 'Directeur': return "bg-rose-50 text-rose-600";
      case 'Formateur': return "bg-purple-50 text-purple-600";
      case 'Étudiant': return "bg-blue-50 text-blue-600";
      default: return "bg-slate-100 text-slate-600";
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

          <button
            disabled
            className="flex items-center gap-2 bg-slate-300 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-none cursor-not-allowed opacity-70"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            Nouveau compte
          </button>
        </div>

        {/* Stats Grid (Calculées sur les vraies datas) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon="group" label="Utilisateurs Actifs" value={users.filter(u => u.status === 'Actif').length} trend="+12%" color="emerald" />
          <StatCard icon="hard_drive" label="Espace Disque" value="78%" subValue="/ 2TB" trend="Stable" color="blue" progress={78} />
          <StatCard icon="memory" label="Charge Système" value="12%" trend="-5%" color="indigo" />
          <StatCard icon="person_off" label="Comptes Inactifs" value={users.filter(u => u.status === 'Inactif').length} trend="Action requise" color="orange" isWarning />
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
                  Inactifs ({users.filter(u => u.status === 'Inactif').length})
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
                        <div className={`size-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm bg-indigo-100 text-indigo-500`}>
                          {user.name?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-slate-900 font-black text-base">{user.name}</p>
                          <p className="text-slate-400 text-xs font-bold">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-2 text-[#f97415] font-bold">
                        <span className="material-symbols-outlined text-[18px]">history</span>
                        <span className="text-sm">{user.last_active}</span>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${user.status === 'Inactif' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        <span className={`size-2 rounded-full ${user.status === 'Inactif' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span> {user.status}
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

            {(loading || filteredUsers.length === 0) && (
              <div className="py-24 text-center">
                <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                  <span className="material-symbols-outlined text-4xl">{loading ? 'sync' : 'search_off'}</span>
                </div>
                <p className="text-slate-400 font-bold">{loading ? 'Chargement des données...' : 'Aucun utilisateur trouvé'}</p>
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

// Sous-composant StatCard conservé à l'identique
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