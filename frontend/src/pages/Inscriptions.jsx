import React, { useState } from 'react';

const EnrollmentManagement = () => {
  const [view, setView] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Données
  const [students] = useState([
    { id: 1, name: "Amara Diop", email: "amara.d@madara.edu", promo: "Master 1 - Design", role: "Délégué", status: "online" },
    { id: 2, name: "Koffi Mensah", email: "koffi.m@madara.edu", promo: "Licence 3 - Info", role: "Étudiant", status: "offline" },
    { id: 3, name: "Fatoumata Keïta", email: "fatou.k@madara.edu", promo: "Master 2 - Market", role: "Attente", status: "pending" },
    { id: 4, name: "Ousmane Sow", email: "ousmane.s@madara.edu", promo: "Licence 3 - Info", role: "Suspendu", status: "suspended" },
    { id: 5, name: "Yasmine Touré", email: "yasmine.t@madara.edu", promo: "Master 1 - Design", role: "Étudiant", status: "online" },
    { id: 6, name: "Ibrahim Diallo", email: "ibrahim.d@madara.edu", promo: "Licence 2 - Dev", role: "Étudiant", status: "online" },
  ]);

  const [trainers] = useState([
    { id: 1, name: "Dr. Chinedu Okafor", email: "chinedu.o@madara.edu", expertise: "Intelligence Artificielle", load: 80, hours: "24h" },
    { id: 2, name: "Aïcha Diallo", email: "aicha.d@madara.edu", expertise: "UX Design", load: 40, hours: "12h" },
    { id: 3, name: "Kwame Appiah", email: "kwame.a@madara.edu", expertise: "Cyber Sécurité", load: 65, hours: "18h" },
  ]);

  // Détermination du label du bouton selon la vue
  const getButtonLabel = () => {
    if (view === 'students') return "Inscrire Étudiant";
    if (view === 'trainers') return "Ajouter Expert";
    return "Inscrire utilisateur";
  };

  return (
    <div className="min-h-screen w-full bg-[#fffaf5] font-['Lexend',sans-serif] text-[#0f172a] antialiased">
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');
        body { font-family: 'Lexend', sans-serif; }
      `}} />

      {/* MODAL DE CRÉATION (Simulé) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase text-slate-800">
                Nouveau {view === 'trainers' ? 'Expert' : 'Étudiant'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-slate-500 text-sm">Formulaire de création pour <strong>{view}</strong> en cours de chargement...</p>
              <div className="h-10 bg-slate-100 rounded-xl w-full animate-pulse"></div>
              <div className="h-10 bg-slate-100 rounded-xl w-full animate-pulse"></div>
              <button className="w-full py-4 bg-[#f97415] text-white font-bold rounded-2xl uppercase tracking-widest text-xs mt-4">Confirmer la création</button>
            </div>
          </div>
        </div>
      )}

      <header className="top-0 z-50 w-full px-6 py-8 md:px-12 bg-[#fffaf5]/80 backdrop-blur-md border-b border-orange-100/50">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
          <nav className="flex items-center gap-2 text-sm font-medium">
            <a className="text-[#f97415] hover:text-[#e0630b] transition-colors" href="#">Madara</a>
            <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
            <a className="text-[#f97415] hover:text-[#e0630b] transition-colors" href="#">Pédagogie</a>
            <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
            <span className="text-slate-500">Inscriptions & Rôles</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-2xl">
              <h1 className="text-slate-900 text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight">
                {view === 'dashboard' ? (<>Inscriptions <span className="text-[#f97415]">&</span> Rôles</>) :
                  view === 'students' ? "Annuaire Étudiants" : "Annuaire Formateurs"}
              </h1>
              <p className="text-slate-500 text-base md:text-lg leading-relaxed font-light">
                {view === 'dashboard' ? "Gérez les promotions, les rôles des étudiants et les formateurs." :
                  view === 'students' ? "Gérez les accès et les promotions des étudiants." :
                    "Gérez les accréditations et la charge de travail des experts."}
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-none flex items-center justify-center gap-2 bg-[#f97415] hover:bg-[#e0630b] text-white font-bold py-3.5 px-8 rounded-full shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1"
            >
              <span className="material-symbols-outlined">{view === 'trainers' ? 'person_add_check' : 'person_add'}</span>
              <span className="uppercase text-sm tracking-wider">{getButtonLabel()}</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 p-3 bg-white rounded-2xl shadow-sm border border-orange-100/50">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-900 focus:ring-2 focus:ring-[#f97415]/20 focus:bg-white transition-all text-sm font-medium" placeholder="Rechercher..." type="text" />
            </div>
            <div className="flex gap-2">
              <FilterButton icon="filter_list" label="Promotion" />
              <FilterButton icon="sort" label="Statut" />
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-6 py-12 md:px-12">
        <div className="max-w-7xl mx-auto">

          {view === 'dashboard' && (
            <div className="flex flex-col gap-20">
              <section className="flex flex-col gap-8">
                <div className="flex items-center justify-between border-b border-orange-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-xl text-[#f97415]"><span className="material-symbols-outlined">school</span></div>
                    <h2 className="text-2xl font-extrabold text-slate-800 uppercase tracking-tight">Étudiants Récents</h2>
                  </div>
                  <button onClick={() => setView('students')} className="text-[#f97415] font-black text-xs uppercase flex items-center gap-1 hover:gap-2 transition-all">
                    Voir tout l'annuaire <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {students.slice(0, 4).map(student => <StudentCard key={student.id} student={student} />)}
                </div>
              </section>

              <section className="flex flex-col gap-8 pb-20">
                <div className="flex items-center justify-between border-b border-orange-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-xl text-[#f97415]"><span className="material-symbols-outlined">history_edu</span></div>
                    <h2 className="text-2xl font-extrabold text-slate-800 uppercase tracking-tight">Nos Formateurs</h2>
                  </div>
                  <button onClick={() => setView('trainers')} className="text-[#f97415] font-black text-xs uppercase flex items-center gap-1 hover:gap-2 transition-all">
                    Voir tous les experts <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
                <div className="bg-white rounded-3xl shadow-sm border border-orange-50 overflow-hidden">
                  <table className="w-full text-left">
                    <tbody className="divide-y divide-slate-50">
                      {trainers.slice(0, 3).map(trainer => <TrainerRow key={trainer.id} trainer={trainer} />)}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {view === 'students' && (
            <section className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-4">
                <button onClick={() => setView('dashboard')} className="p-2 rounded-full hover:bg-white text-slate-400 hover:text-[#f97415] border border-transparent hover:border-orange-100 transition-all">
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Annuaire Complet Étudiants</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                {students.map(student => <StudentCard key={student.id} student={student} />)}
              </div>
            </section>
          )}

          {view === 'trainers' && (
            <section className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-4">
                <button onClick={() => setView('dashboard')} className="p-2 rounded-full hover:bg-white text-slate-400 hover:text-[#f97415] border border-transparent hover:border-orange-100 transition-all">
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Annuaire Complet Formateurs</h2>
              </div>
              <div className="bg-white rounded-3xl shadow-sm border border-orange-50 overflow-hidden mb-20">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr className="border-b border-slate-100">
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Formateur</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Expertise</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Charge</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {trainers.map(trainer => <TrainerRow key={trainer.id} trainer={trainer} />)}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

// --- Sous-composants ---
const FilterButton = ({ icon, label }) => (
  <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-orange-50 text-slate-600 transition-colors text-xs font-black uppercase tracking-widest">
    <span className="material-symbols-outlined text-[18px]">{icon}</span>
    <span>{label}</span>
  </button>
);

const StudentCard = ({ student }) => {
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(student.name)}&backgroundColor=ffdfbf,ffd5dc,d1d4f9`;
  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col gap-5 shadow-sm border border-transparent hover:border-orange-100 transition-all duration-300 hover:shadow-orange-200/20">
      <div className="flex justify-between items-center">
        <div className="relative">
          <img className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-50 shadow-sm" src={avatarUrl} alt={student.name} />
          {student.status === 'online' && <div className="absolute -top-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-4 border-white"></div>}
        </div>
        <button className="h-10 w-10 flex items-center justify-center rounded-full text-slate-300 hover:text-[#f97415] hover:bg-orange-50 transition-all">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>
      <div>
        <h3 className="text-slate-900 text-lg font-extrabold leading-tight">{student.name}</h3>
        <p className="text-slate-400 text-xs font-medium lowercase mt-1">{student.email}</p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Promotion</span>
          <span className="text-xs font-bold text-slate-700">{student.promo}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</span>
          <RoleBadge role={student.role} status={student.status} />
        </div>
      </div>
    </div>
  );
};

const RoleBadge = ({ role, status }) => {
  const styles = { suspended: "bg-red-50 text-red-500", pending: "bg-amber-50 text-amber-600", default: "bg-orange-50 text-[#f97415]" };
  const currentStyle = styles[status] || styles.default;
  return (
    <span className={`${currentStyle} px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider`}>
      {status === 'suspended' ? 'Suspendu' : role}
    </span>
  );
};

const TrainerRow = ({ trainer }) => {
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trainer.name)}&backgroundColor=b6e3f4,c0aede`;
  return (
    <tr className="group hover:bg-orange-50/30 transition-colors">
      <td className="p-6">
        <div className="flex items-center gap-4">
          <img className="w-10 h-10 rounded-xl border-2 border-white shadow-sm" src={avatarUrl} alt={trainer.name} />
          <div><div className="text-sm font-extrabold text-slate-900">{trainer.name}</div><div className="text-xs text-slate-400">{trainer.email}</div></div>
        </div>
      </td>
      <td className="p-6">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">{trainer.expertise}</span>
      </td>
      <td className="p-6">
        <div className="flex flex-col gap-2 w-32">
          <div className="flex justify-between text-[10px] font-black uppercase">
            <span className="text-slate-400">{trainer.hours}</span>
            <span className={trainer.load > 70 ? 'text-[#f97415]' : 'text-emerald-500'}>{trainer.load}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${trainer.load > 70 ? 'bg-[#f97415]' : 'bg-emerald-500'}`} style={{ width: `${trainer.load}%` }}></div>
          </div>
        </div>
      </td>
      <td className="p-6 text-right">
        <button className="h-10 w-10 text-slate-300 hover:text-[#f97415] transition-colors"><span className="material-symbols-outlined">settings</span></button>
      </td>
    </tr>
  );
};

export default EnrollmentManagement;