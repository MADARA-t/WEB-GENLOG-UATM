import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Imports des composants communs
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Authentific from './pages/Auth';

// Imports Directeur
import Dashboard from './pages/Dashboard';
import Promotions from './pages/Promotions';
import Users from './pages/Users';
import SubjectSpaces from './pages/SubjectSpaces';
import Assignments from './pages/Assignments';

// Imports Étudiants
import EtuSidebar from './components/etudiants/EtuSidebar';
import EtuDashboard from './pages/etudiants/etudashboard';
import EtuSpaces from './pages/etudiants/EtuSpaces';
import EtuTravaux from './pages/etudiants/EtuTravaux';

// Imports Formateurs
import TeachSidebar from './components/TeachSidebar';
import TeachSpaces from './pages/formateurs/TeachSpaces';
import GestionTravaux from './pages/formateurs/GestionTravaux';
import TeachPromotions from './pages/formateurs/TeachPromotions';

// Imports Techniciens
import HeaderTechnic from './components/HeaderTechnic';
import AccountManagement from './pages/techniciens/AccountManagement';
import Maintenance from './pages/techniciens/Maintenance';

// --- LAYOUTS (Les structures de page) ---

const DirecteurLayout = () => (
  <div className="flex h-screen overflow-hidden bg-slate-50">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet /> {/* Les pages Directeur s'afficheront ici */}
      </main>
    </div>
  </div>
);

const EtudiantLayout = () => (
  <div className="flex h-screen overflow-hidden bg-slate-50">
    <EtuSidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <Outlet /> {/* Les pages Étudiant s'afficheront ici */}
      </main>
    </div>
  </div>
);

const FormateurLayout = () => (
  <div className="flex h-screen overflow-hidden bg-slate-50">
    <TeachSidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <Outlet /> {/* Les pages Formateur s'afficheront ici */}
      </main>
    </div>
  </div>
);

const TechnicienLayout = () => (
  <div className="flex h-screen overflow-hidden bg-slate-50">
    <div className="flex-1 flex flex-col overflow-hidden">
      <HeaderTechnic />
      <main className="flex-1 overflow-y-auto">
        <Outlet /> {/* Les pages Formateur s'afficheront ici */}
      </main>
    </div>
  </div>
);

// --- COMPOSANT APP PRINCIPAL ---

function App() {
  return (
    <Router>
      <Routes>
        {/* Route publique */}
        <Route path="/" element={<Authentific />} />

        {/* Espace Directeur */}
        <Route path="/directeur" element={<DirecteurLayout />}>
          <Route index element={<Dashboard />} /> {/* /directeur */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="promotions" element={<Promotions />} />
          <Route path="users" element={<Users />} />
          <Route path="subjectspaces" element={<SubjectSpaces />} />
          <Route path="assignments" element={<Assignments />} />
        </Route>

        {/* Espace Étudiant */}
        <Route path="/etudiant" element={<EtudiantLayout />}>
          <Route index element={<EtuDashboard />} />
          <Route path="dashboard" element={<EtuDashboard />} />
          <Route path="espaces" element={<EtuSpaces />} />
          <Route path="travaux" element={<EtuTravaux />} />
        </Route>

        {/* Espace Formateur */}
        <Route path="/formateur" element={<FormateurLayout />}>
          <Route index element={<TeachSpaces />} />
          <Route path="espac" element={<TeachSpaces />} />
          <Route path="travaux" element={<GestionTravaux />} />
          <Route path="promotions" element={<TeachPromotions />} />
        </Route>

        {/* Espace Technicien */}
        <Route path="/technicien" element={<TechnicienLayout />}>
          <Route index element={<AccountManagement />} />
          <Route path="comptes" element={<AccountManagement />} />
          <Route path="maintenance" element={<Maintenance />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;