import React, { useState, useMemo, useEffect } from 'react';
import api from '../services/api';

const EnrollmentManagement = () => {
  // --- ÉTATS ---
  const [view, setView] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- ÉTATS POUR LES CONFIRMATIONS ---
  const [confirmModal, setConfirmModal] = useState({ show: false, title: "", message: "", onConfirm: null });

  // --- GESTION ERREURS (TOASTS) ---
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
  const showToast = (msg, type = "error") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "error" }), 4000);
  };

  // --- DONNÉES ---
  const [users, setUsers] = useState([]);

  // --- CHARGEMENT DES DONNÉES ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const userResponse = await api.get('/users');
      const usersData = userResponse.data.map(u => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        role: u.role === 'etudiant' ? 'Étudiant' : u.role === 'formateur' ? 'Formateur' : 'Technicien',
        roleKey: u.role,
        active: u.isActive,
        status: u.isActive ? 'Actif' : 'Inactif',
      }));
      setUsers(usersData);

    } catch (err) {
      showToast("Erreur de chargement : " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- LOGIQUE FILTRES ---
  const inactiveUsers = useMemo(() => users.filter(u => !u.active), [users]);
  const students = useMemo(() => users.filter(u => u.roleKey === "etudiant"), [users]);
  const trainers = useMemo(() => users.filter(u => u.roleKey === "formateur"), [users]);
  const technicians = useMemo(() => users.filter(u => u.roleKey === "technicien"), [users]);

  // --- ACTIONS ---
  const handleDelete = async (id) => {
    setConfirmModal({
      show: true,
      title: "Suppression Utilisateur",
      message: "Êtes-vous sûr de vouloir supprimer cet utilisateur définitivement ? Cette action est irréversible.",
      onConfirm: async () => {
        try {
          await api.delete(`/users/${id}`);
          setUsers(users.filter(u => u.id !== id));
          showToast("Utilisateur supprimé avec succès", "success");
        } catch (err) {
          showToast("Impossible de supprimer : " + (err.response?.data?.message || err.message));
        }
        setConfirmModal({ show: false, title: "", message: "", onConfirm: null });
      }
    });
  };

  const handleRelance = async (userId) => {
    try {
      await api.post(`/auth/resend-activation/${userId}`);
      showToast(`Email de relance envoyé !`, "success");
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur lors de la relance");
    }
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'STUDENT': return <StudentForm onRefresh={fetchUsers} onClose={() => setIsModalOpen(false)} showToast={showToast} />;
      case 'TRAINER': return <TrainerForm onRefresh={fetchUsers} onClose={() => setIsModalOpen(false)} showToast={showToast} />;
      case 'TECH': return <TechForm onRefresh={fetchUsers} onClose={() => setIsModalOpen(false)} showToast={showToast} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fffaf5] font-['Lexend',sans-serif] text-[#0f172a] antialiased">
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');` }} />

      {/* --- TOAST --- */}
      {toast.show && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
          <span className="material-symbols-outlined">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
          <span className="text-[10px] font-black uppercase tracking-widest">{toast.message}</span>
        </div>
      )}

      {/* MODAL DE CONFIRMATION */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-lg font-black uppercase tracking-tight mb-2 text-slate-800">{confirmModal.title}</h3>
            <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">{confirmModal.message}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal({ show: false, title: "", message: "", onConfirm: null })} className="flex-1 py-3 rounded-xl font-black uppercase text-[10px] text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all">Annuler</button>
              <button onClick={confirmModal.onConfirm} className="flex-[2] py-3 rounded-xl font-black uppercase text-[10px] text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-100 transition-all">Confirmer</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DYNAMIQUE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-800">Nouveau <span className="text-orange-500">Compte</span></h2>
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
                Gestion des <span className="text-orange-500">Inscriptions</span>
              </h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Création et maintenance des comptes utilisateurs</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <QuickAction icon="group" label="Utilisateurs" active={view === 'dashboard'} onClick={() => setView('dashboard')} color="orange" />
              <QuickAction icon="campaign" label="Maintenance" active={view === 'maintenance'} onClick={() => setView('maintenance')} color="red" badge={inactiveUsers.length} />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <ActionButton label="Nouvel Étudiant" icon="person_add" onClick={() => { setModalType('STUDENT'); setIsModalOpen(true); }} />
            <ActionButton label="Nouveau Formateur" icon="record_voice_over" onClick={() => { setModalType('TRAINER'); setIsModalOpen(true); }} />
            <ActionButton label="Nouveau Technicien" icon="construction" onClick={() => { setModalType('TECH'); setIsModalOpen(true); }} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-10">
        {loading ? (
          <div className="flex justify-center p-20"><span className="animate-spin material-symbols-outlined text-orange-500 text-4xl">autorenew</span></div>
        ) : (
          <>
            {/* VUE MAINTENANCE */}
            {view === 'maintenance' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                    <span className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center material-symbols-outlined">report</span>
                    Comptes non-actifs <span className="text-red-500">({inactiveUsers.length})</span>
                  </h2>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-red-100 shadow-xl shadow-red-500/5 overflow-hidden">
                  {inactiveUsers.length === 0 ? (
                    <div className="p-20 text-center">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-4xl">check_circle</span>
                      </div>
                      <p className="text-slate-400 font-bold uppercase text-sm">Tous les comptes sont actifs ✓</p>
                    </div>
                  ) : (
                    <table className="w-full text-left">
                      <thead className="bg-red-50/50 border-b border-red-100">
                        <tr>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-red-400">Utilisateur</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-red-400">Rôle</th>
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
                            <td className="p-6 text-right space-x-2">
                              <button onClick={() => handleRelance(user.id)} className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 material-symbols-outlined hover:bg-orange-500 hover:text-white transition-all">mail</button>
                              <button onClick={() => handleDelete(user.id)} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 material-symbols-outlined hover:bg-red-500 hover:text-white transition-all">delete_forever</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* VUE DASHBOARD */}
            {view === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in duration-500">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b-2 border-orange-100 pb-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Étudiants</h3>
                    <span className="text-xs font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-lg">{students.length}</span>
                  </div>
                  <div className="space-y-4">
                    {students.length === 0 ? (
                      <div className="p-8 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <p className="text-xs font-bold uppercase text-slate-300">Aucun étudiant</p>
                      </div>
                    ) : (
                      students.map(s => (
                        <UserMiniCard key={s.id} user={s} onDelete={() => handleDelete(s.id)} />
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b-2 border-blue-100 pb-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Formateurs</h3>
                    <span className="text-xs font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-lg">{trainers.length}</span>
                  </div>
                  <div className="space-y-4">
                    {trainers.length === 0 ? (
                      <div className="p-8 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <p className="text-xs font-bold uppercase text-slate-300">Aucun formateur</p>
                      </div>
                    ) : (
                      trainers.map(t => (
                        <UserMiniCard key={t.id} user={t} color="blue" onDelete={() => handleDelete(t.id)} />
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Techniciens</h3>
                    <span className="text-xs font-black text-slate-500 bg-slate-50 px-3 py-1 rounded-lg">{technicians.length}</span>
                  </div>
                  <div className="space-y-4">
                    {technicians.length === 0 ? (
                      <div className="p-8 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <p className="text-xs font-bold uppercase text-slate-300">Aucun technicien</p>
                      </div>
                    ) : (
                      technicians.map(tc => (
                        <UserMiniCard key={tc.id} user={tc} color="slate" onDelete={() => handleDelete(tc.id)} />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

// --- FORMULAIRES ---

const StudentForm = ({ onClose, onRefresh, showToast }) => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email) {
      showToast("Veuillez remplir tous les champs");
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post('/auth/register', {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        role: 'etudiant'
      });

      showToast("Étudiant inscrit ! Email d'activation envoyé.", "success");
      onRefresh();
      onClose();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      if (errorMsg.includes('déjà utilisé') || errorMsg.includes('already')) {
        showToast("Cet email est déjà utilisé.");
      } else {
        showToast("Erreur : " + errorMsg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <input
          onChange={e => setForm({ ...form, firstName: e.target.value })}
          className="bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Prénom"
        />
        <input
          onChange={e => setForm({ ...form, lastName: e.target.value })}
          className="bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Nom"
        />
      </div>
      <input
        onChange={e => setForm({ ...form, email: e.target.value })}
        type="email"
        className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Email institutionnel"
      />
      
      <div className="flex items-start gap-3 p-5 bg-blue-50 rounded-2xl border border-blue-200">
        <span className="material-symbols-outlined text-blue-500 mt-0.5">info</span>
        <div className="text-xs text-blue-700 leading-relaxed">
          <p className="font-bold mb-2">Processus d'inscription</p>
          <ul className="space-y-1 text-blue-600">
            <li>• Un email d'activation sera envoyé automatiquement</li>
            <li>• L'étudiant devra activer son compte avant connexion</li>
          </ul>
        </div>
      </div>

      <button
        disabled={submitting}
        onClick={handleSubmit}
        className={`w-full py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-orange-200 hover:shadow-2xl transition-all ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {submitting ? 'Inscription en cours...' : "✓ Créer le compte étudiant"}
      </button>
    </div>
  );
};

const TrainerForm = ({ onClose, onRefresh, showToast }) => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email) {
      showToast("Veuillez remplir tous les champs");
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post('/auth/register', {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        role: 'formateur'
      });

      showToast("Formateur ajouté ! Email d'activation envoyé.", "success");
      onRefresh();
      onClose();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      if (errorMsg.includes('déjà utilisé') || errorMsg.includes('already')) {
        showToast("Cet email est déjà utilisé.");
      } else {
        showToast("Erreur : " + errorMsg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <input
        onChange={e => setForm({ ...form, firstName: e.target.value })}
        className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Prénom"
      />
      <input
        onChange={e => setForm({ ...form, lastName: e.target.value })}
        className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Nom"
      />
      <input
        onChange={e => setForm({ ...form, email: e.target.value })}
        type="email"
        className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Email professionnel"
      />
      
      <div className="flex items-start gap-3 p-5 bg-blue-50 rounded-2xl border border-blue-200">
        <span className="material-symbols-outlined text-blue-500 mt-0.5">badge</span>
        <p className="text-xs text-blue-700 leading-relaxed">
          Le formateur recevra un email d'activation pour configurer son accès et pourra créer des espaces pédagogiques.
        </p>
      </div>

      <button
        disabled={submitting}
        onClick={handleSubmit}
        className={`w-full py-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl hover:shadow-2xl transition-all ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {submitting ? 'Création en cours...' : "✓ Créer le compte formateur"}
      </button>
    </div>
  );
};

const TechForm = ({ onClose, onRefresh, showToast }) => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email) {
      showToast("Veuillez remplir tous les champs");
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post('/auth/register', {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        role: 'technicien'
      });

      showToast("Technicien créé ! Email d'activation envoyé.", "success");
      onRefresh();
      onClose();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      if (errorMsg.includes('déjà utilisé') || errorMsg.includes('already')) {
        showToast("Cet email est déjà utilisé.");
      } else {
        showToast("Erreur : " + errorMsg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <input
        onChange={e => setForm({ ...form, firstName: e.target.value })}
        className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-slate-500"
        placeholder="Prénom"
      />
      <input
        onChange={e => setForm({ ...form, lastName: e.target.value })}
        className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-slate-500"
        placeholder="Nom"
      />
      <input
        onChange={e => setForm({ ...form, email: e.target.value })}
        type="email"
        className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-slate-500"
        placeholder="Email professionnel"
      />
      
      <div className="p-5 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300">
        <div className="flex items-center gap-3 text-slate-600">
          <span className="material-symbols-outlined">admin_panel_settings</span>
          <p className="text-xs font-bold">Accès technique complet au système</p>
        </div>
      </div>

      <button
        disabled={submitting}
        onClick={handleSubmit}
        className={`w-full py-5 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl hover:shadow-2xl transition-all ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {submitting ? 'Création en cours...' : "✓ Créer le compte technicien"}
      </button>
    </div>
  );
};

// --- COMPOSANTS UI ---

const QuickAction = ({ icon, label, active, onClick, color, badge }) => {
  const colors = {
    red: active ? 'bg-red-500 text-white' : 'bg-red-50 text-red-500',
    blue: active ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-500',
    orange: active ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-500'
  };
  
  return (
    <button onClick={onClick} className={`relative px-5 py-3 rounded-full flex items-center gap-2 transition-all scale-95 hover:scale-100 ${colors[color]}`}>
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      {badge > 0 && (
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-black">
          {badge}
        </span>
      )}
    </button>
  );
};

const ActionButton = ({ label, icon, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
    <span className="material-symbols-outlined text-orange-500 group-hover:scale-110 transition-transform">{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{label}</span>
  </button>
);

const UserMiniCard = ({ user, color = "orange", onDelete }) => (
  <div className="p-4 bg-white rounded-2xl border border-slate-50 shadow-sm flex items-center justify-between group hover:shadow-lg hover:border-orange-100 transition-all">
    <div className="flex items-center gap-4 flex-1">
      <div className={`w-10 h-10 rounded-xl bg-${color}-50 text-${color}-500 flex items-center justify-center font-black text-xs`}>
        {user.name.charAt(0)}
      </div>
      <div className="flex-1">
        <h4 className="text-[11px] font-black text-slate-800 uppercase leading-none mb-1">{user.name}</h4>
        <p className="text-[9px] font-bold text-slate-400 lowercase">{user.email}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button onClick={onDelete} className="material-symbols-outlined text-slate-300 hover:text-red-500 text-sm transition-colors">delete</button>
      {!user.active && <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse ml-1"></span>}
    </div>
  </div>
);

export default EnrollmentManagement;