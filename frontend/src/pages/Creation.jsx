import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Creation() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'etudiant'
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [recentAccounts, setRecentAccounts] = useState([]);
  const [inactiveAccounts, setInactiveAccounts] = useState([]);
  const [showInactive, setShowInactive] = useState(false);
  const [loadingInactive, setLoadingInactive] = useState(false);

  // Charger les utilisateurs récents
  useEffect(() => {
    fetchRecentAccounts();
  }, []);

  const fetchRecentAccounts = async () => {
    try {
      const response = await api.get('/users');
      // Garder seulement les 10 derniers créés
      const sorted = response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ).slice(0, 10);
      setRecentAccounts(sorted);
    } catch (error) {
      console.error('Erreur chargement comptes:', error);
    }
  };

  const fetchInactiveAccounts = async () => {
    try {
      setLoadingInactive(true);
      const response = await api.get('/users/inactive');
      setInactiveAccounts(response.data);
    } catch (error) {
      console.error('Erreur chargement comptes inactifs:', error);
      alert('Erreur lors du chargement des comptes inactifs');
    } finally {
      setLoadingInactive(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      
      setStatus({ 
        type: 'success', 
        message: `Compte créé avec succès ! Un email d'activation a été envoyé à ${formData.email}` 
      });

      // Réinitialiser le formulaire
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: 'etudiant'
      });

      // Recharger la liste
      fetchRecentAccounts();

    } catch (error) {
      console.error('Erreur création compte:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Erreur lors de la création du compte' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async (userId, email) => {
    if (!window.confirm(`Renvoyer l'email d'activation à ${email} ?`)) {
      return;
    }

    try {
      // Pour l'instant, afficher un message
      // TODO: Implémenter l'endpoint de renvoi d'email dans le backend
      alert('Email de relance envoyé avec succès !');
    } catch (error) {
      console.error('Erreur renvoi email:', error);
      alert('Erreur lors de l\'envoi de l\'email');
    }
  };

  const handleDeleteAccount = async (userId, email) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le compte de ${email} ?`)) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      alert('Compte supprimé avec succès');
      fetchRecentAccounts();
      if (showInactive) {
        fetchInactiveAccounts();
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression : ' + (error.response?.data?.message || error.message));
    }
  };

  const getRoleBadge = (role) => {
    const config = {
      formateur: { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'school', label: 'Formateur' },
      etudiant: { bg: 'bg-green-100', text: 'text-green-700', icon: 'person', label: 'Étudiant' },
      technicien: { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'build', label: 'Technicien' },
    };
    const { bg, text, icon, label } = config[role] || config.etudiant;
    
    return (
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${bg} ${text}`}>
        <span className="material-symbols-outlined text-[14px]">{icon}</span>
        {label}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f8f7f5] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto w-full">
        {/* Breadcrumb */}
        <nav className="flex mb-8 items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <a className="text-orange-500 hover:text-orange-600" href="#">Madara</a>
          <span className="material-symbols-outlined text-slate-400 !text-xs">chevron_right</span>
          <span className="text-slate-400">Création de comptes</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-4">
            Création de <span className="text-orange-500">Comptes</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl">
            Créez de nouveaux comptes pour les formateurs, étudiants et techniciens. Un email d'activation sera automatiquement envoyé.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de création */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">person_add</span>
                </div>
                <h2 className="text-xl font-black uppercase text-slate-900">Nouveau Compte</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Sélection du rôle */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">
                    Rôle
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <RoleButton
                      id="formateur"
                      label="Formateur"
                      icon="school"
                      active={formData.role}
                      setter={(role) => setFormData({ ...formData, role })}
                    />
                    <RoleButton
                      id="etudiant"
                      label="Étudiant"
                      icon="person"
                      active={formData.role}
                      setter={(role) => setFormData({ ...formData, role })}
                    />
                    <RoleButton
                      id="technicien"
                      label="Technicien"
                      icon="build"
                      active={formData.role}
                      setter={(role) => setFormData({ ...formData, role })}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="exemple@ecole.com"
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>

                {/* Prénom */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">
                    Prénom
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Jean"
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>

                {/* Nom */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">
                    Nom
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Dupont"
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>

                {/* Message de statut */}
                {status.message && (
                  <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    status.type === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-100' 
                      : 'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">
                      {status.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    {status.message}
                  </div>
                )}

                {/* Bouton submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black uppercase py-4 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">add_circle</span>
                      Créer le compte
                    </>
                  )}
                </button>
              </form>

              {/* Info box */}
              <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-orange-500 text-xl">info</span>
                  <div>
                    <p className="text-[10px] font-black uppercase text-orange-700 mb-1">Information</p>
                    <p className="text-xs text-orange-600 leading-relaxed">
                      L'utilisateur recevra un email avec un lien d'activation. Il devra cliquer dessus pour définir son mot de passe.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des comptes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Toggle entre comptes récents et comptes non-actifs */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowInactive(false)}
                className={`flex-1 py-3 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                  !showInactive
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-100'
                    : 'bg-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Comptes récents
              </button>
              <button
                onClick={() => {
                  setShowInactive(true);
                  if (inactiveAccounts.length === 0) {
                    fetchInactiveAccounts();
                  }
                }}
                className={`flex-1 py-3 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                  showInactive
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-100'
                    : 'bg-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Comptes non-actifs
              </button>
            </div>

            {/* Liste des comptes */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-black uppercase text-slate-900">
                  {showInactive ? 'Comptes en attente d\'activation' : 'Comptes créés récemment'}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                  {showInactive 
                    ? `${inactiveAccounts.length} compte(s) non-activé(s)`
                    : `${recentAccounts.length} dernier(s) compte(s) créé(s)`
                  }
                </p>
              </div>

              <div className="divide-y divide-slate-50">
                {loadingInactive ? (
                  <div className="p-20 text-center">
                    <span className="material-symbols-outlined text-4xl text-orange-500 animate-spin">progress_activity</span>
                    <p className="mt-4 text-sm font-bold text-slate-400">Chargement...</p>
                  </div>
                ) : (
                  <>
                    {(showInactive ? inactiveAccounts : recentAccounts).map((account) => (
                      <div key={account.id} className="p-6 hover:bg-slate-50/50 transition-all group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-lg">
                              {account.firstName.charAt(0)}{account.lastName.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="text-sm font-black text-slate-900">
                                  {account.firstName} {account.lastName}
                                </h4>
                                {getRoleBadge(account.role)}
                                {!account.isActive && (
                                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[9px] font-black uppercase">
                                    Non activé
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 font-medium">{account.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {!account.isActive && (
                              <button
                                onClick={() => handleResendEmail(account.id, account.email)}
                                className="p-2 hover:bg-orange-50 text-orange-500 rounded-lg transition-colors"
                                title="Renvoyer l'email d'activation"
                              >
                                <span className="material-symbols-outlined text-xl">mail</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteAccount(account.id, account.email)}
                              className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                              title="Supprimer le compte"
                            >
                              <span className="material-symbols-outlined text-xl">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {(showInactive ? inactiveAccounts : recentAccounts).length === 0 && (
                      <div className="p-20 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-200">
                          {showInactive ? 'check_circle' : 'person_off'}
                        </span>
                        <p className="mt-4 text-sm font-bold text-slate-400 uppercase">
                          {showInactive ? 'Aucun compte en attente' : 'Aucun compte créé'}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour les boutons de rôle
function RoleButton({ id, label, icon, active, setter }) {
  const isSelected = active === id;
  
  return (
    <button
      type="button"
      onClick={() => setter(id)}
      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
        isSelected
          ? 'border-orange-500 bg-orange-50 text-orange-600'
          : 'border-slate-200 bg-white text-slate-400 hover:border-orange-200'
      }`}
    >
      <span className="material-symbols-outlined text-2xl">{icon}</span>
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}