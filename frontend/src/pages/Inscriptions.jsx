import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';

const EnrollmentManagement = () => {
  const [view, setView] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'etudiant'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const showNotification = (message, type = 'success', details = null) => {
    setNotification({ message, type, details });
    setTimeout(() => setNotification(null), 8000);
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.map(u => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        role: u.role === 'etudiant' ? 'Étudiant' : u.role === 'formateur' ? 'Formateur' : 'Technicien',
        roleKey: u.role,
        active: u.isActive,
        promo: u.promotion?.name || 'Non affecté'
      })));
    } catch (error) {
      showNotification('Erreur lors du chargement des utilisateurs', 'error');
    }
  };

  const inactiveUsers = useMemo(() => users.filter(u => !u.active), [users]);
  const students = useMemo(() => users.filter(u => u.roleKey === 'etudiant'), [users]);
  const trainers = useMemo(() => users.filter(u => u.roleKey === 'formateur'), [users]);
  const technicians = useMemo(() => users.filter(u => u.roleKey === 'technicien'), [users]);
  const unassignedStudents = useMemo(() => 
    students.filter(s => s.active && s.promo === 'Non affecté').length, 
    [students]
  );

  const handleRelance = async (userId, email) => {
    if (!window.confirm(`Renvoyer l'email d'activation à ${email} ?`)) return;
    
    try {
      setLoading(true);
      await api.post(`/auth/resend-activation/${userId}`);
      showNotification(`Email de relance envoyé avec succès à ${email}`, 'success');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Erreur lors de l\'envoi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUser = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      showNotification('Veuillez remplir tous les champs', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role
      });

      const roleLabel = formData.role === 'etudiant' ? 'étudiant' : 
                        formData.role === 'formateur' ? 'formateur' : 'technicien';
      
      let details = null;
      if (formData.role === 'etudiant') {
        details = {
          title: "Prochaines étapes :",
          steps: [
            `1. L'étudiant va recevoir un email d'activation à ${formData.email}`,
            "2. Il devra cliquer sur le lien et définir son mot de passe",
            "3. Une fois activé, rendez-vous dans 'Promotions' pour l'affecter à une cohorte"
          ]
        };
      }

      showNotification(
        `✓ Compte ${roleLabel} créé avec succès pour ${formData.firstName} ${formData.lastName}`,
        'success',
        details
      );
      
      setIsModalOpen(false);
      setFormData({ email: '', firstName: '', lastName: '', role: 'etudiant' });
      fetchUsers();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Erreur lors de la création du compte', 'error');
    } finally {
      setLoading(false);
    }
  };

  const StudentForm = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <input 
          value={formData.firstName} 
          onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
          className="bg-slate-50 p-4 rounded-2xl border-none font-semibold text-sm outline-none focus:ring-2 focus:ring-orange-500" 
          placeholder="Prénom" 
        />
        <input 
          value={formData.lastName} 
          onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
          className="bg-slate-50 p-4 rounded-2xl border-none font-semibold text-sm outline-none focus:ring-2 focus:ring-orange-500" 
          placeholder="Nom" 
        />
      </div>
      <input 
        value={formData.email} 
        onChange={(e) => setFormData({...formData, email: e.target.value})} 
        type="email" 
        className="w-full bg-slate-50 p-4 rounded-2xl border-none font-semibold text-sm outline-none focus:ring-2 focus:ring-orange-500" 
        placeholder="Email institutionnel" 
      />
      <div className="flex items-start gap-3 p-5 bg-blue-50 rounded-2xl border border-blue-200">
        <span className="material-symbols-outlined text-blue-500 mt-0.5">info</span>
        <div className="text-xs text-blue-700 leading-relaxed">
          <p className="font-bold mb-2">Processus d'inscription</p>
          <ul className="space-y-1 text-blue-600">
            <li>• Un email d'activation sera envoyé automatiquement</li>
            <li>• L'étudiant devra activer son compte avant connexion</li>
            <li>• Vous pourrez ensuite l'affecter à une promotion</li>
          </ul>
        </div>
      </div>
      <button 
        onClick={handleSubmitUser}
        disabled={loading} 
        className="w-full py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-200 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Création en cours...' : '✓ Créer le compte étudiant'}
      </button>
    </div>
  );

  const TrainerForm = () => (
    <div className="space-y-5">
      <input 
        value={formData.firstName} 
        onChange={(e) => setFormData({...formData, firstName: e.target.value, role: 'formateur'})} 
        className="w-full bg-slate-50 p-4 rounded-2xl border-none font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500" 
        placeholder="Prénom" 
      />
      <input 
        value={formData.lastName} 
        onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
        className="w-full bg-slate-50 p-4 rounded-2xl border-none font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500" 
        placeholder="Nom" 
      />
      <input 
        value={formData.email} 
        onChange={(e) => setFormData({...formData, email: e.target.value})} 
        type="email" 
        className="w-full bg-slate-50 p-4 rounded-2xl border-none font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500" 
        placeholder="Email professionnel" 
      />
      <div className="flex items-start gap-3 p-5 bg-blue-50 rounded-2xl border border-blue-200">
        <span className="material-symbols-outlined text-blue-500 mt-0.5">badge</span>
        <p className="text-xs text-blue-700 leading-relaxed">
          Le formateur recevra un email d'activation pour configurer son accès à la plateforme et pourra immédiatement créer des espaces pédagogiques.
        </p>
      </div>
      <button 
        onClick={handleSubmitUser}
        disabled={loading} 
        className="w-full py-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
      >
        {loading ? 'Création en cours...' : '✓ Créer le compte formateur'}
      </button>
    </div>
  );

  const TechForm = () => (
    <div className="space-y-5">
      <input 
        value={formData.firstName} 
        onChange={(e) => setFormData({...formData, firstName: e.target.value, role: 'technicien'})} 
        className="w-full bg-slate-50 p-4 rounded-2xl border-none font-semibold text-sm outline-none focus:ring-2 focus:ring-slate-500" 
        placeholder="Prénom" 
      />
      <input 
        value={formData.lastName} 
        onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
        className="w-full bg-slate-50 p-4 rounded-2xl border-none font-semibold text-sm outline-none focus:ring-2 focus:ring-slate-500" 
        placeholder="Nom" 
      />
      <input 
        value={formData.email} 
        onChange={(e) => setFormData({...formData, email: e.target.value})} 
        type="email" 
        className="w-full bg-slate-50 p-4 rounded-2xl border-none font-semibold text-sm outline-none focus:ring-2 focus:ring-slate-500" 
        placeholder="Email professionnel" 
      />
      <div className="p-5 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300">
        <div className="flex items-center gap-3 text-slate-600">
          <span className="material-symbols-outlined">admin_panel_settings</span>
          <p className="text-xs font-bold">Accès technique complet au système</p>
        </div>
      </div>
      <button 
        onClick={handleSubmitUser}
        disabled={loading} 
        className="w-full py-5 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
      >
        {loading ? 'Création en cours...' : '✓ Créer le compte technicien'}
      </button>
    </div>
  );

  const renderModalContent = () => {
    switch(modalType) {
      case 'STUDENT': return <StudentForm />;
      case 'TRAINER': return <TrainerForm />;
      case 'TECH': return <TechForm />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50 font-['Lexend',sans-serif] text-slate-900 antialiased">
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');` }} />

      {/* Notification Toast Améliorée */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[120] p-6 rounded-2xl shadow-2xl animate-in slide-in-from-right-5 max-w-md ${
          notification.type === 'success' ? 'bg-white border-2 border-green-200' : 'bg-white border-2 border-red-200'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              notification.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              <span className="material-symbols-outlined">
                {notification.type === 'success' ? 'check_circle' : 'error'}
              </span>
            </div>
            <div className="flex-1">
              <p className={`text-sm font-bold leading-relaxed mb-2 ${
                notification.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>{notification.message}</p>
              
              {notification.details && (
                <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs font-black uppercase text-blue-700 mb-2">{notification.details.title}</p>
                  <ul className="space-y-1">
                    {notification.details.steps.map((step, idx) => (
                      <li key={idx} className="text-xs text-blue-600 leading-relaxed">{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800">
                Nouveau <span className="text-orange-500">Compte</span>
              </h2>
              <button 
                onClick={() => { 
                  setIsModalOpen(false); 
                  setFormData({ email: '', firstName: '', lastName: '', role: 'etudiant' }); 
                }} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {renderModalContent()}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="px-10 py-8 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight leading-none mb-2 bg-gradient-to-r from-slate-900 to-orange-600 bg-clip-text text-transparent">
                Gestion des Inscriptions
              </h1>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Création et maintenance des comptes utilisateurs</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <QuickAction icon="group" label="Utilisateurs" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
              <QuickAction icon="report" label="Maintenance" active={view === 'maintenance'} onClick={() => setView('maintenance')} badge={inactiveUsers.length} />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <ActionButton label="Nouvel Étudiant" icon="school" onClick={() => {setModalType('STUDENT'); setFormData({...formData, role: 'etudiant'}); setIsModalOpen(true);}} color="orange" />
            <ActionButton label="Nouveau Formateur" icon="person" onClick={() => {setModalType('TRAINER'); setFormData({...formData, role: 'formateur'}); setIsModalOpen(true);}} color="blue" />
            <ActionButton label="Nouveau Technicien" icon="engineering" onClick={() => {setModalType('TECH'); setFormData({...formData, role: 'technicien'}); setIsModalOpen(true);}} color="slate" />
          </div>

          {/* Alerte étudiants non affectés */}
          {unassignedStudents > 0 && (
            <div className="flex items-center gap-3 p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl">
              <span className="material-symbols-outlined text-amber-600">info</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-800">
                  {unassignedStudents} étudiant{unassignedStudents > 1 ? 's' : ''} actif{unassignedStudents > 1 ? 's' : ''} en attente d'affectation
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Rendez-vous dans "Promotions" pour les affecter à une cohorte
                </p>
              </div>
              <button 
                onClick={() => window.location.href = '/directeur/promotions'}
                className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-amber-700 transition-all"
              >
                Voir les promotions
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-10">
        
        {/* Vue Maintenance */}
        {view === 'maintenance' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">report</span>
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                  Comptes non activés
                </h2>
                <p className="text-sm text-slate-500 font-semibold">{inactiveUsers.length} compte(s) en attente d'activation</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
              {inactiveUsers.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                  </div>
                  <p className="text-slate-400 font-bold uppercase text-sm">Tous les comptes sont actifs</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-5 text-left text-xs font-black uppercase tracking-wider text-slate-500">Utilisateur</th>
                      <th className="p-5 text-left text-xs font-black uppercase tracking-wider text-slate-500">Rôle</th>
                      <th className="p-5 text-left text-xs font-black uppercase tracking-wider text-slate-500">Email</th>
                      <th className="p-5 text-right text-xs font-black uppercase tracking-wider text-slate-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inactiveUsers.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-5">
                          <div className="font-bold text-slate-900">{user.name}</div>
                        </td>
                        <td className="p-5">
                          <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold uppercase">
                            {user.role}
                          </span>
                        </td>
                        <td className="p-5 text-sm font-medium text-slate-600">{user.email}</td>
                        <td className="p-5 text-right">
                          <button 
                            onClick={() => handleRelance(user.id, user.email)} 
                            disabled={loading}
                            className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-bold uppercase flex items-center gap-2 ml-auto hover:bg-orange-600 transition-all disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-base">send</span>
                            Renvoyer l'email
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Vue Dashboard */}
        {view === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            <UserSection title="Étudiants" count={students.length} users={students} color="orange" showPromo={true} />
            <UserSection title="Formateurs" count={trainers.length} users={trainers} color="blue" showPromo={false} />
            <UserSection title="Techniciens" count={technicians.length} users={technicians} color="slate" showPromo={false} />
          </div>
        )}

      </main>
    </div>
  );
};

const QuickAction = ({ icon, label, active, onClick, badge }) => (
  <button 
    onClick={onClick} 
    className={`relative px-6 py-3 rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-wide transition-all ${
      active 
        ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' 
        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
    }`}
  >
    <span className="material-symbols-outlined text-lg">{icon}</span>
    {label}
    {badge > 0 && (
      <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-black">
        {badge}
      </span>
    )}
  </button>
);

const ActionButton = ({ label, icon, onClick, color }) => {
  const colors = {
    orange: 'border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-orange-600',
    blue: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-600',
    slate: 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
  };
  
  return (
    <button 
      onClick={onClick} 
      className={`flex items-center gap-3 px-6 py-4 bg-white border-2 rounded-2xl shadow-sm hover:shadow-md transition-all ${colors[color]}`}
    >
      <span className="material-symbols-outlined text-xl">{icon}</span>
      <span className="text-xs font-black uppercase tracking-wide">{label}</span>
    </button>
  );
};

const UserSection = ({ title, count, users, color, showPromo }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100">
      <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">{title}</h3>
      <span className={`text-xs font-black px-3 py-1.5 rounded-lg bg-${color}-100 text-${color}-600`}>
        {count}
      </span>
    </div>
    <div className="space-y-3">
      {users.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-xs font-bold uppercase text-slate-300">Aucun {title.toLowerCase()}</p>
        </div>
      ) : (
        users.map(user => <UserCard key={user.id} user={user} color={color} showPromo={showPromo} />)
      )}
    </div>
  </div>
);

const UserCard = ({ user, color, showPromo }) => (
  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className={`w-11 h-11 rounded-xl bg-${color}-100 text-${color}-600 flex items-center justify-center font-black text-sm`}>
          {user.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-black text-slate-900 uppercase mb-1">{user.name}</h4>
          {showPromo && (
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{user.promo}</p>
              {user.promo === 'Non affecté' && user.active && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-black uppercase">
                  À affecter
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {!user.active && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-red-600 uppercase">Inactif</span>
        </div>
      )}
    </div>
  </div>
);

export default EnrollmentManagement;