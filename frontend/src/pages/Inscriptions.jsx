import React, { useState, useMemo, useEffect } from 'react';
import emailjs from '@emailjs/browser';

const EnrollmentManagement = () => {
  // --- ÉTATS ---
  const [view, setView] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- ÉTATS POUR LES CONFIRMATIONS ---
  const [confirmModal, setConfirmModal] = useState({ show: false, title: "", message: "", onConfirm: null });

  // --- GESTION ERREURS PROFESSIONNELLE (TOASTS) ---
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
  const showToast = (msg, type = "error") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ ...toast, show: false }), 4000);
  };

  // --- DONNÉES (Initialisées vides, chargées depuis postgres) ---
  const [promotions, setPromotions] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // --- CHARGEMENT DES DONNÉES ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: promoData, error: pError } = await postgres.from('promotions').select('*');
      const { data: userData, error: uError } = await postgres.from('users').select('*');

      if (pError) throw pError;
      if (uError) throw uError;

      if (promoData) setPromotions(promoData);
      if (userData) setUsers(userData);
    } catch (err) {
      showToast("Erreur de synchronisation : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- LOGIQUE FILTRES ---
  const inactiveUsers = useMemo(() => users.filter(u => !u.active), [users]);
  const students = useMemo(() => users.filter(u => u.role === "Étudiant"), [users]);
  const trainers = useMemo(() => users.filter(u => u.role === "Formateur"), [users]);
  const technicians = useMemo(() => users.filter(u => u.role === "Technicien"), [users]);

  const [selectedPromo, setSelectedPromo] = useState(null);

  // --- ACTIONS (Avec postgres) ---
  const handleDelete = async (id) => {
    setConfirmModal({
      show: true,
      title: "Suppression Utilisateur",
      message: "Êtes-vous sûr de vouloir supprimer cet utilisateur définitivement ? Cette action est irréversible.",
      onConfirm: async () => {
        try {
          const { error } = await postgres.from('users').delete().eq('id', id);
          if (error) throw error;
          setUsers(users.filter(u => u.id !== id));
          showToast("Utilisateur supprimé avec succès", "success");
        } catch (err) {
          showToast("Impossible de supprimer : " + err.message);
        }
        setConfirmModal({ ...confirmModal, show: false });
      }
    });
  };

  const handleDeletePromo = async (e, id, promoName) => {
    e.stopPropagation();
    
    // Vérification locale si la promo contient des étudiants (sécurité UI)
    const promoStudents = users.filter(u => u.promo === `${promotions.find(p => p.id === id)?.name} - ${promotions.find(p => p.id === id)?.year}`);
    
    setConfirmModal({
      show: true,
      title: "Suppression Promotion",
      message: `Voulez-vous supprimer la promotion ${promoName} ?`,
      onConfirm: async () => {
        try {
          // Tentative de suppression avec gestion d'erreur SQL
          const { error } = await postgres.from('promotions').delete().eq('id', id);
          
          if (error) {
            // Gestion spécifique des clés étrangères (Foreign Keys)
            if (error.code === '23503') {
              throw new Error(`Impossible de supprimer : cette promotion est liée à des matières ou des étudiants.`);
            }
            throw error;
          }

          setPromotions(promotions.filter(p => p.id !== id));
          showToast("Promotion supprimée avec succès", "success");
        } catch (err) {
          showToast(err.message);
        }
        setConfirmModal({ ...confirmModal, show: false });
      }
    });
  };

  const handleUpdateName = async (id, newName) => {
    try {
      setUsers(users.map(u => u.id === id ? { ...u, name: newName } : u));
      const { error } = await postgres.from('users').update({ name: newName }).eq('id', id);
      if (error) throw error;
    } catch (err) {
      showToast("Erreur de mise à jour nom");
    }
  };

  const handleRelance = async (id) => {
    try {
      const today = new Date().toLocaleDateString('fr-FR');
      const { error } = await postgres.from('users').update({ last_relance: today }).eq('id', id);
      if (error) throw error;
      showToast(`Email de relance envoyé !`, "success");
      fetchData();
    } catch (err) {
      showToast("Erreur lors de la relance");
    }
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'PROMO': return <PromoForm onRefresh={fetchData} onClose={() => setIsModalOpen(false)} showToast={showToast} />;
      case 'STUDENT': return <StudentForm promos={promotions} onRefresh={fetchData} onClose={() => setIsModalOpen(false)} showToast={showToast} />;
      case 'TRAINER': return <TrainerForm onRefresh={fetchData} onClose={() => setIsModalOpen(false)} showToast={showToast} />;
      case 'TECH': return <TechForm onRefresh={fetchData} onClose={() => setIsModalOpen(false)} showToast={showToast} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fffaf5] font-['Lexend',sans-serif] text-[#0f172a] antialiased">
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');` }} />

      {/* --- BANDEAU DE GESTION D'ERREUR (TOAST) --- */}
      {toast.show && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
          <span className="material-symbols-outlined">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
          <span className="text-[10px] font-black uppercase tracking-widest">{toast.message}</span>
        </div>
      )}

      {/* MODAL DE CONFIRMATION PERSONNALISÉ */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-lg font-black uppercase tracking-tight mb-2 text-slate-800">{confirmModal.title}</h3>
            <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">{confirmModal.message}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal({ ...confirmModal, show: false })} className="flex-1 py-3 rounded-xl font-black uppercase text-[10px] text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all">Annuler</button>
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
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Portail d'administration v2.0</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <QuickAction icon="campaign" label="Maintenance" active={view === 'maintenance'} onClick={() => setView('maintenance')} color="red" />
              <QuickAction icon="school" label="Promotions" active={view === 'promotions'} onClick={() => setView('promotions')} color="blue" />
              <QuickAction icon="group" label="Utilisateurs" active={view === 'dashboard'} onClick={() => setView('dashboard')} color="orange" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <ActionButton label="Créer Promo" icon="add_card" onClick={() => { setModalType('PROMO'); setIsModalOpen(true); }} />
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
                            {editingId === user.id ? (
                              <input
                                autoFocus
                                className="font-bold text-slate-800 bg-white border-b-2 border-orange-500 outline-none w-full"
                                value={user.name}
                                onChange={(e) => handleUpdateName(user.id, e.target.value)}
                                onBlur={() => setEditingId(null)}
                                onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                              />
                            ) : (
                              <div className="font-bold text-slate-800">{user.name}</div>
                            )}
                            <div className="text-[10px] text-slate-400 lowercase font-medium">{user.email}</div>
                          </td>
                          <td className="p-6">
                            <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-500">{user.role}</span>
                          </td>
                          <td className="p-6 text-[10px] font-bold text-slate-400">{user.last_relance || "Jamais relancé"}</td>
                          <td className="p-6 text-right space-x-2">
                            <button onClick={() => setEditingId(user.id)} className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 material-symbols-outlined hover:bg-blue-500 hover:text-white transition-all">edit</button>
                            <button onClick={() => handleRelance(user.id)} className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 material-symbols-outlined hover:bg-orange-500 hover:text-white transition-all">mail</button>
                            <button onClick={() => handleDelete(user.id)} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 material-symbols-outlined hover:bg-red-500 hover:text-white transition-all">delete_forever</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VUE DASHBOARD */}
            {view === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in duration-500">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Étudiants</h3>
                    <span className="text-xs font-black text-orange-500 bg-orange-50 px-2 py-1 rounded">{students.length}</span>
                  </div>
                  <div className="space-y-4">
                    {students.map(s => (
                      <UserMiniCard
                        key={s.id} user={s} sub={s.promo}
                        isEditing={editingId === s.id}
                        onEditClick={() => setEditingId(s.id)}
                        onNameChange={(val) => handleUpdateName(s.id, val)}
                        onFinishEdit={() => setEditingId(null)}
                        onDelete={() => handleDelete(s.id)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Experts</h3>
                    <span className="text-xs font-black text-blue-500 bg-blue-50 px-2 py-1 rounded">{trainers.length}</span>
                  </div>
                  <div className="space-y-4">
                    {trainers.map(t => (
                      <UserMiniCard
                        key={t.id} user={t} sub={t.role} color="blue"
                        isEditing={editingId === t.id}
                        onEditClick={() => setEditingId(t.id)}
                        onNameChange={(val) => handleUpdateName(t.id, val)}
                        onFinishEdit={() => setEditingId(null)}
                        onDelete={() => handleDelete(t.id)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Maintenance</h3>
                    <span className="text-xs font-black text-slate-500 bg-slate-50 px-2 py-1 rounded">{technicians.length}</span>
                  </div>
                  <div className="space-y-4">
                    {technicians.map(tc => (
                      <UserMiniCard
                        key={tc.id} user={tc} sub="Accès Système" color="slate"
                        isEditing={editingId === tc.id}
                        onEditClick={() => setEditingId(tc.id)}
                        onNameChange={(val) => handleUpdateName(tc.id, val)}
                        onFinishEdit={() => setEditingId(null)}
                        onDelete={() => handleDelete(tc.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VUE PROMOTIONS */}
            {view === 'promotions' && !selectedPromo && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in zoom-in-95 duration-300">
                {promotions.map(p => {
                  const studentCount = users.filter(u => u.promo === `${p.name} - ${p.year}`).length;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPromo(`${p.name} - ${p.year}`)}
                      className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm hover:border-blue-200 transition-all group cursor-pointer relative"
                    >
                      <button 
                        onClick={(e) => handleDeletePromo(e, p.id, p.name)}
                        className="absolute top-6 right-6 w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>

                      <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 material-symbols-outlined">folder_shared</div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 group-hover:text-blue-500 transition-colors">{p.name}</h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Année académique {p.year}</p>

                      <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">
                          {studentCount} {studentCount > 1 ? 'Étudiants' : 'Étudiant'}
                        </span>
                        <button className="text-blue-500 material-symbols-outlined">arrow_forward</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* LISTE DES ÉTUDIANTS DE LA PROMO SÉLECTIONNÉE */}
            {view === 'promotions' && selectedPromo && (
              <div className="animate-in slide-in-from-right duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <button
                    onClick={() => setSelectedPromo(null)}
                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center material-symbols-outlined text-slate-600 hover:bg-slate-200"
                  >
                    arrow_back
                  </button>
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">{selectedPromo}</h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Liste des étudiants inscrits</p>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border-2 border-slate-50 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Nom complet</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Email</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter(u => u.promo === selectedPromo)
                        .map(u => (
                          <tr key={u.id} className="border-t border-slate-50 hover:bg-slate-50/30 transition-colors">
                            <td className="p-6 text-sm font-bold text-slate-900">{u.name}</td>
                            <td className="p-6 text-sm text-slate-500">{u.email}</td>
                            <td className="p-6 text-sm">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.active ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'}`}>
                                {u.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {users.filter(u => u.promo === selectedPromo).length === 0 && (
                    <div className="p-20 text-center text-slate-400 font-bold italic">
                      Aucun étudiant inscrit dans cette promotion.
                    </div>
                  )}
                </div>
              </div>
            )}

          </>
        )}
      </main>
    </div>
  );
};

// --- SOUS-COMPOSANTS (FORMULAIRES AVEC LOGIQUE postgres) ---

const StudentForm = ({ promos, onClose, onRefresh, showToast }) => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', promo: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.promo) {
      showToast("Veuillez remplir tous les champs");
      return;
    }
    
    setSubmitting(true);
    const generatedPassword = Math.random().toString(36).slice(-8).toUpperCase();
    const fullName = `${form.firstName} ${form.lastName}`;

    const { error } = await postgres.from('users').insert([{
      name: fullName,
      email: form.email,
      role: 'Étudiant',
      promo: form.promo,
      active: false,
      status: 'Inactif',
      password: generatedPassword
    }]);

    if (!error) {
      const templateParams = {
        user_name: fullName,
        email: form.email,
        password: generatedPassword,
        link: `https://setice.onrender.com/reset-password?email=${form.email}`
      };

      emailjs.send('service_awup1tf', 'template_eruok3m', templateParams, 'o8hcXDCtM7yoX89pE')
        .then(() => {
          showToast("Étudiant inscrit et email envoyé !", "success");
          onRefresh();
          onClose();
        })
        .catch((err) => {
          showToast("Inscrit, mais erreur d'envoi mail");
          onRefresh();
          onClose();
        });
    } else {
      if (error.code === '23505') {
        showToast("Cet email est déjà utilisé par un autre compte.");
      } else {
        showToast("Erreur : " + error.message);
      }
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
        className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Email institutionnel"
      />
      <select
        onChange={e => setForm({ ...form, promo: e.target.value })}
        className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
      >
        <option value="">Sélectionner Promotion</option>
        {promos.map(p => (
          <option key={p.id} value={`${p.name} - ${p.year}`}>
            {p.name} - {p.year}
          </option>
        ))}
      </select>
      <button
        disabled={submitting}
        onClick={handleSubmit}
        className={`w-full py-5 bg-orange-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest mt-4 shadow-xl shadow-orange-200 ${submitting ? 'opacity-50' : ''}`}
      >
        {submitting ? 'Traitement...' : "Inscrire l'étudiant"}
      </button>
    </div>
  );
};

const PromoForm = ({ onClose, onRefresh, showToast }) => {
  const [form, setForm] = useState({ name: '', year: '2025-2026' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.name) return showToast("Nom de promo requis");
    
    setSubmitting(true);
    const { error } = await postgres.from('promotions').insert([form]);
    
    if (!error) { 
      showToast("Promotion créée !", "success");
      onRefresh(); 
      onClose(); 
    } else {
      if (error.code === '23505') {
        showToast("Cette promotion existe déjà pour cette année.");
      } else {
        showToast(error.message);
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <input onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nom de la promo (ex: SIL3)" />
      <select onChange={e => setForm({ ...form, year: e.target.value })} className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500">
        <option>2024-2025</option>
        <option>2025-2026</option>
        <option>2026-2027</option>
      </select>
      <button disabled={submitting} onClick={handleSubmit} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest mt-4">
        {submitting ? 'Création...' : 'Créer la promotion'}
      </button>
    </div>
  );
};

const TrainerForm = ({ onClose, onRefresh, showToast }) => {
  const [form, setForm] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email) return showToast("Champs manquants");
    setSubmitting(true);
    const generatedPassword = Math.random().toString(36).slice(-8).toUpperCase();

    const { error } = await postgres.from('users').insert([{
      name: form.name,
      email: form.email,
      role: 'Formateur',
      active: true,
      status: 'Actif',
      password: generatedPassword
    }]);

    if (!error) {
      const templateParams = {
        user_name: form.name,
        email: form.email,
        password: generatedPassword,
        link: `https://setice.onrender.com/reset-password?email=${form.email}`
      };

      emailjs.send('service_awup1tf', 'template_eruok3m', templateParams, 'o8hcXDCtM7yoX89pE')
        .then(() => {
          showToast("Expert ajouté !", "success");
          onRefresh();
          onClose();
        })
        .catch(() => {
          showToast("Expert ajouté (Erreur Mail)");
          onRefresh();
          onClose();
        });
    } else {
      if (error.code === '23505') {
        showToast("Cet email est déjà utilisé.");
      } else {
        showToast(error.message);
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <input
        onChange={e => setForm({ ...form, name: e.target.value })}
        className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Nom de l'expert"
      />
      <input
        onChange={e => setForm({ ...form, email: e.target.value })}
        className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Email"
      />
      <button
        disabled={submitting}
        onClick={handleSubmit}
        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest mt-4"
      >
        {submitting ? 'Chargement...' : "Ajouter l'expert"}
      </button>
    </div>
  );
};

const TechForm = ({ onClose, onRefresh, showToast }) => {
  const [form, setForm] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email) return showToast("Champs manquants");
    setSubmitting(true);
    const generatedPassword = Math.random().toString(36).slice(-8).toUpperCase();

    const { error } = await postgres.from('users').insert([{
      name: form.name,
      email: form.email,
      role: 'Technicien',
      active: false,
      status: 'Inactif',
      password: generatedPassword
    }]);
 
    if (!error) {
      const templateParams = {
        user_name: form.name,
        email: form.email,
        password: generatedPassword,
        link: `https://setice.onrender.com/reset-password?email=${form.email}`
      };

      emailjs.send('service_awup1tf', 'template_eruok3m', templateParams, 'o8hcXDCtM7yoX89pE')
        .then(() => {
          showToast("Compte technicien créé !", "success");
          onRefresh();
          onClose();
        })
        .catch(() => {
          showToast("Compte créé (Erreur Mail)");
          onRefresh();
          onClose();
        });
    } else {
      if (error.code === '23505') {
        showToast("Cet email est déjà utilisé.");
      } else {
        showToast(error.message);
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <input
        onChange={e => setForm({ ...form, name: e.target.value })}
        className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-slate-500"
        placeholder="Nom du tech"
      />
      <input
        onChange={e => setForm({ ...form, email: e.target.value })}
        className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-slate-500"
        placeholder="Email"
      />
      <button
        disabled={submitting}
        onClick={handleSubmit}
        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest mt-4"
      >
        {submitting ? 'Création...' : "Créer le compte"}
      </button>
    </div>
  );
};


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
  <button onClick={onClick} className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
    <span className="material-symbols-outlined text-orange-500 group-hover:scale-110 transition-transform">{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{label}</span>
  </button>
);

const UserMiniCard = ({ user, sub, color = "orange", isEditing, onEditClick, onNameChange, onFinishEdit, onDelete }) => (
  <div className="p-4 bg-white rounded-2xl border border-slate-50 shadow-sm flex items-center justify-between group hover:shadow-lg transition-all">
    <div className="flex items-center gap-4 flex-1">
      <div className={`w-10 h-10 rounded-xl bg-${color}-50 text-${color}-500 flex items-center justify-center font-black text-xs`}>
        {user.name.charAt(0)}
      </div>
      <div className="flex-1">
        {isEditing ? (
          <input
            autoFocus
            className="text-[11px] font-black text-slate-800 uppercase leading-none border-b border-orange-500 outline-none w-full"
            value={user.name}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={onFinishEdit}
            onKeyDown={(e) => e.key === 'Enter' && onFinishEdit()}
          />
        ) : (
          <h4 className="text-[11px] font-black text-slate-800 uppercase leading-none mb-1">{user.name}</h4>
        )}
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button onClick={onEditClick} className="material-symbols-outlined text-slate-300 hover:text-blue-500 text-sm">edit</button>
      <button onClick={onDelete} className="material-symbols-outlined text-slate-300 hover:text-red-500 text-sm">delete</button>
      {!user.active && <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse ml-1"></span>}
    </div>
  </div>
);

export default EnrollmentManagement;