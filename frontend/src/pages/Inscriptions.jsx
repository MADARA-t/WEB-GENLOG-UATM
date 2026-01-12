import React, { useState, useMemo } from 'react';

const EnrollmentManagement = () => {
  // --- ÉTATS ---
  const [view, setView] = useState('dashboard'); // dashboard, students, trainers, technicians, maintenance, promotions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // US 2.1, 2.2, 2.3, 2.5

  // --- DONNÉES (Simulées pour les US) ---
  const [promotions, setPromotions] = useState([
    { id: 1, name: "SIL3", year: "2025-2026", count: 24 },
    { id: 2, name: "M1-DS", year: "2025-2026", count: 18 }
  ]);

  const [users, setUsers] = useState([
    
  ]);

  // --- LOGIQUE FILTRES ---
  const inactiveUsers = useMemo(() => users.filter(u => !u.active), [users]);
  const students = useMemo(() => users.filter(u => u.role === "Étudiant"), [users]);
  const trainers = useMemo(() => users.filter(u => u.role === "Formateur"), [users]);
  const technicians = useMemo(() => users.filter(u => u.role === "Technicien"), [users]);

  // --- ACTIONS ---
  const handleRelance = (id) => {
    // US 4.1 : Envoi d'email de relance
    alert(`Email de relance envoyé à l'utilisateur ID: ${id}`);
  };

  const renderModalContent = () => {
    switch(modalType) {
      case 'PROMO': return <PromoForm on处onClose={() => setIsModalOpen(false)} />; // US 2.2
      case 'STUDENT': return <StudentForm promos={promotions} onClose={() => setIsModalOpen(false)} />; // US 2.3 & 2.4
      case 'TRAINER': return <TrainerForm onClose={() => setIsModalOpen(false)} />; // US 2.1
      case 'TECH': return <TechForm onClose={() => setIsModalOpen(false)} />; // US 2.5
      default: return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fffaf5] font-['Lexend',sans-serif] text-[#0f172a] antialiased">
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');` }} />

      {/* MODAL DYNAMIQUE (US 2.x) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-800">Configuration <span className="text-orange-500">Accès</span></h2>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-red-500 transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {renderModalContent()}
          </div>
        </div>
      )}

      {/* HEADER NAVIGATION */}
      <header className="px-10 py-10 bg-white border-b border-orange-100/50 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">
                Inscriptions <span className="text-orange-500">&</span> Maintenance
              </h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Portail d'administration US 2.0 - US 4.0</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <QuickAction icon="campaign" label="Maintenance" active={view === 'maintenance'} onClick={() => setView('maintenance')} color="red" />
              <QuickAction icon="school" label="Promotions" active={view === 'promotions'} onClick={() => setView('promotions')} color="blue" />
              <QuickAction icon="group" label="Utilisateurs" active={view === 'dashboard'} onClick={() => setView('dashboard')} color="orange" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <ActionButton label="Créer Promo" icon="add_card" onClick={() => {setModalType('PROMO'); setIsModalOpen(true);}} />
            <ActionButton label="Nouvel Étudiant" icon="person_add" onClick={() => {setModalType('STUDENT'); setIsModalOpen(true);}} />
            <ActionButton label="Nouveau Formateur" icon="record_voice_over" onClick={() => {setModalType('TRAINER'); setIsModalOpen(true);}} />
            <ActionButton label="Nouveau Technicien" icon="construction" onClick={() => {setModalType('TECH'); setIsModalOpen(true);}} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-10">
        
        {/* VUE MAINTENANCE (US 4.1, 4.3, 4.4) */}
        {view === 'maintenance' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <span className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center material-symbols-outlined">report</span>
                Comptes non-actifs <span className="text-red-500">({inactiveUsers.length})</span>
              </h2>
              <div className="flex gap-4">
                 <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">schedule_send</span> 
                    Relance Hebdomadaire (Auto: US 4.2)
                 </button>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-red-100 shadow-xl shadow-red-500/5 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-red-50/50 border-b border-red-100">
                  <tr>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-red-400">Utilisateur</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-red-400">Rôle</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-red-400">Dernière Relance</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-red-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-50">
                  {inactiveUsers.map(user => (
                    <tr key={user.id} className="hover:bg-red-50/20 transition-colors">
                      <td className="p-6">
                        <div className="font-bold text-slate-800">{user.name}</div>
                        <div className="text-[10px] text-slate-400 lowercase font-medium">{user.email}</div>
                      </td>
                      <td className="p-6">
                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-500">{user.role}</span>
                      </td>
                      <td className="p-6 text-[10px] font-bold text-slate-400">{user.lastRelance || "Jamais relancé"}</td>
                      <td className="p-6 text-right space-x-2">
                        <button onClick={() => handleRelance(user.id)} className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 material-symbols-outlined hover:bg-orange-500 hover:text-white transition-all">mail</button>
                        <button className="w-10 h-10 rounded-xl bg-red-50 text-red-500 material-symbols-outlined hover:bg-red-500 hover:text-white transition-all">delete_forever</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VUE DASHBOARD (ACCUEIL PAR RÔLES) */}
        {view === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in duration-500">
            {/* Colonne Étudiants */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Étudiants (US 2.3)</h3>
                <span className="text-xs font-black text-orange-500 bg-orange-50 px-2 py-1 rounded">{students.length}</span>
              </div>
              <div className="space-y-4">
                {students.map(s => <UserMiniCard key={s.id} user={s} sub={s.promo} />)}
              </div>
            </div>

            {/* Colonne Formateurs */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Experts (US 2.1)</h3>
                <span className="text-xs font-black text-blue-500 bg-blue-50 px-2 py-1 rounded">{trainers.length}</span>
              </div>
              <div className="space-y-4">
                {trainers.map(t => <UserMiniCard key={t.id} user={t} sub={t.expertise} color="blue" />)}
              </div>
            </div>

            {/* Colonne Techs */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Maintenance (US 2.5)</h3>
                <span className="text-xs font-black text-slate-500 bg-slate-50 px-2 py-1 rounded">{technicians.length}</span>
              </div>
              <div className="space-y-4">
                {technicians.map(tc => <UserMiniCard key={tc.id} user={tc} sub="Accès Système" color="slate" />)}
              </div>
            </div>
          </div>
        )}

        {/* VUE PROMOTIONS (US 2.2) */}
        {view === 'promotions' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in zoom-in-95 duration-300">
            {promotions.map(p => (
              <div key={p.id} className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm hover:border-blue-200 transition-all group">
                <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 material-symbols-outlined">folder_shared</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 group-hover:text-blue-500 transition-colors">{p.name}</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Année académique {p.year}</p>
                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">{p.count} Étudiants</span>
                  <button className="text-blue-500 material-symbols-outlined">arrow_forward</button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

// --- SOUS-COMPOSANTS (FORMULAIRES US 2.X) ---

const StudentForm = ({ promos, onClose }) => (
  <div className="space-y-5">
    <div className="grid grid-cols-2 gap-4">
      <input className="bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500" placeholder="Prénom" />
      <input className="bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500" placeholder="Nom" />
    </div>
    <input className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500" placeholder="Email institutionnel" />
    <select className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500 appearance-none">
      <option value="">Sélectionner Promotion (US 2.3)</option>
      {promos.map(p => <option key={p.id}>{p.name}</option>)}
    </select>
    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100 text-orange-600">
      <span className="material-symbols-outlined">info</span>
      <p className="text-[10px] font-bold uppercase">L'étudiant recevra un email d'activation automatique.</p>
    </div>
    <button className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-orange-200 mt-4">Inscrire l'étudiant</button>
  </div>
);

const PromoForm = ({ onClose }) => (
  <div className="space-y-5">
    <input className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nom de la promotion (ex: SIL3)" />
    <select className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500">
      <option>2025-2026</option>
      <option>2026-2027</option>
    </select>
    <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest mt-4">Créer la promotion</button>
  </div>
);

const TrainerForm = () => (
  <div className="space-y-5">
    <input className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nom complet de l'expert" />
    <input className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Email" />
    <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest mt-4">Ajouter l'expert</button>
  </div>
);

const TechForm = () => (
    <div className="space-y-5">
      <input className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-slate-500" placeholder="Nom du technicien" />
      <input className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-slate-500" placeholder="Email" />
      <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
        <p className="text-[10px] font-bold uppercase text-center italic">Accès technique complet au système</p>
      </div>
      <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest mt-4">Créer le compte technicien</button>
    </div>
);

// --- PETITS ÉLÉMENTS UI ---

const QuickAction = ({ icon, label, active, onClick, color }) => {
  const colors = {
    red: active ? 'bg-red-500 text-white' : 'bg-red-50 text-red-500',
    blue: active ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-500',
    orange: active ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-500'
  };
  return (
    <button onClick={onClick} className={`px-5 py-3 rounded-full flex items-center gap-2 transition-all scale-95 hover:scale-100 ${colors[color]}`}>
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
};

const ActionButton = ({ label, icon, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
    <span className="material-symbols-outlined text-orange-500 group-hover:scale-110 transition-transform">{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{label}</span>
  </button>
);

const UserMiniCard = ({ user, sub, color = "orange" }) => (
  <div className="p-4 bg-white rounded-2xl border border-slate-50 shadow-sm flex items-center justify-between group hover:shadow-lg transition-all">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl bg-${color}-50 text-${color}-500 flex items-center justify-center font-black text-xs`}>
        {user.name.charAt(0)}
      </div>
      <div>
        <h4 className="text-[11px] font-black text-slate-800 uppercase leading-none mb-1">{user.name}</h4>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
      </div>
    </div>
    {!user.active && <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>}
  </div>
);

export default EnrollmentManagement;