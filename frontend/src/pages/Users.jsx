import React, { useState, useMemo } from 'react';

// --- Sous-composants ---
const PaginationButton = ({ icon, active, disabled, onClick }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center w-11 h-11 rounded-xl border-2 transition-all ${
      active ? 'border-orange-500 text-orange-500 bg-white shadow-sm' : 
      disabled ? 'border-slate-100 text-slate-200 cursor-not-allowed' : 
      'border-slate-100 text-slate-400 hover:border-orange-200 hover:text-orange-500'
    }`}
  >
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
  </button>
);

const Users = () => {
  // --- ÉTATS ---
  const [users, setUsers] = useState([
    { id: 1, name: "Amadou Diallo", email: "amadou.d@madara.edu", role: "Étudiant", promo: "Promo 2024", status: "Actif" },
    { id: 2, name: "Koffi Mensah", email: "k.mensah@madara.edu", role: "Professeur", promo: "—", status: "Actif" },
    { id: 3, name: "Fatoumata Traoré", email: "f.traore@madara.edu", role: "Admin", promo: "—", status: "Absent" },
    { id: 4, name: "Zekiba Bakayoko", email: "z.bakayoko@madara.edu", role: "Étudiant", promo: "Promo 2025", status: "Actif" },
    { id: 5, name: "Chinua Achebe", email: "c.achebe@madara.edu", role: "Étudiant", promo: "Promo 2024", status: "Suspendu" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tous les rôles");
  
  // États pour la Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: "", email: "", role: "Étudiant", promo: "", status: "Actif" });
  const [isEditing, setIsEditing] = useState(false);

  // --- LOGIQUE ---

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "Tous les rôles" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, roleFilter, users]);

  const handleOpenAddModal = () => {
    setCurrentUser({ name: "", email: "", role: "Étudiant", promo: "", status: "Actif" });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setCurrentUser(user);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer ce membre définitivement ?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setUsers(users.map(u => u.id === currentUser.id ? currentUser : u));
    } else {
      setUsers([...users, { ...currentUser, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const getAvatar = (name) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || "default")}&backgroundColor=ffdfbf,c0aede,d1d4f9,b6e3f4`;

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-10 bg-[#f8f7f5] scroll-smooth relative">
      
      {/* --- MODAL D'AJOUT / ÉDITION --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
                {isEditing ? "Modifier" : "Ajouter"} <span className="text-orange-500">Membre</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex justify-center mb-6">
                 <img className="h-20 w-20 rounded-2xl border-4 border-orange-50 shadow-md" src={getAvatar(currentUser.name)} alt="preview" />
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Nom Complet</label>
                <input required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange-500" 
                  value={currentUser.name} onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})} placeholder="ex: Jean Dupont" />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Email Académique</label>
                <input required type="email" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange-500" 
                  value={currentUser.email} onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})} placeholder="nom@madara.edu" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Rôle</label>
                  <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" 
                    value={currentUser.role} onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}>
                    <option>Étudiant</option>
                    <option>Professeur</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Statut</label>
                  <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold"
                    value={currentUser.status} onChange={(e) => setCurrentUser({...currentUser, status: e.target.value})}>
                    <option>Actif</option>
                    <option>Absent</option>
                    <option>Suspendu</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-orange-500 text-white font-black uppercase py-4 rounded-2xl shadow-xl shadow-orange-200 mt-4 active:scale-95 transition-all">
                {isEditing ? "Mettre à jour" : "Confirmer l'ajout"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1200px] flex flex-col gap-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm font-medium">
          <a className="text-[#f97415] hover:text-[#e0630b] transition-colors" href="#">Madara</a>
          <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
          <span className="text-slate-500">Annuaire utilisateurs</span>
        </nav>

        {/* Page Header */}
        <header className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 uppercase">
            Annuaire <span className="text-orange-500">Utilisateurs</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">
            Gérez les profils des étudiants et formateurs de l'académie Madara.
          </p>
        </header>

        {/* Toolbar */}
        <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
          <div className="relative flex-1 max-w-xl group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
              <span className="material-symbols-outlined text-slate-400">search</span>
            </div>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-2xl border-0 bg-white py-4 pl-14 pr-4 text-slate-900 font-bold text-sm ring-1 ring-inset ring-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 shadow-sm transition-all outline-none" 
              placeholder="Rechercher un membre..." 
              type="text"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white text-slate-700 pl-5 pr-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border-0 ring-1 ring-inset ring-slate-100 focus:ring-2 focus:ring-orange-500 shadow-sm outline-none appearance-none cursor-pointer"
            >
              <option>Tous les rôles</option>
              <option>Étudiant</option>
              <option>Professeur</option>
              <option>Admin</option>
            </select>
            <button onClick={handleOpenAddModal} className="flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 transition-all hover:scale-105 active:scale-95">
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              <span>Ajouter un membre</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Membre</th>
                  <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rôle</th>
                  <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Promotion</th>
                  <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Statut</th>
                  <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-orange-50/20 transition-all duration-300">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 flex-shrink-0 rounded-2xl bg-orange-50 overflow-hidden border-2 border-white shadow-sm transition-transform group-hover:scale-110">
                          <img className="h-full w-full object-cover" src={getAvatar(user.name)} alt={user.name} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 group-hover:text-orange-600 transition-colors tracking-tight">{user.name}</span>
                          <span className="text-xs text-slate-400 font-bold">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <span className={`inline-flex items-center rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border-2 ${
                        user.role === 'Professeur' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                        user.role === 'Admin' ? 'bg-slate-900 text-white border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-100'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-5 px-8">
                      <span className="text-xs font-black text-slate-600 tracking-wider uppercase">{user.promo}</span>
                    </td>
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-2.5">
                        <span className={`h-2.5 w-2.5 rounded-full ring-4 ${
                          user.status === 'Actif' ? 'bg-green-500 ring-green-100 animate-pulse' : 
                          user.status === 'Absent' ? 'bg-slate-300 ring-slate-100' : 'bg-red-400 ring-red-100'
                        }`} />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-700">{user.status}</span>
                      </div>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleOpenEditModal(user)} className="h-10 w-10 text-slate-300 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="h-10 w-10 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination simulée */}
          <div className="border-t border-slate-50 px-8 py-6 flex items-center justify-between bg-slate-50/30">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <span className="text-orange-500">01</span> — <span className="text-orange-500">{filteredUsers.length.toString().padStart(2, '0')}</span> sur <span className="text-slate-900">{users.length} Membres</span>
            </span>
            <div className="flex gap-2">
              <PaginationButton icon="chevron_left" disabled />
              <PaginationButton icon="chevron_right" active />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;