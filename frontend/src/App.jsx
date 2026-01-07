import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';

// Layouts
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import EtuSidebar from './components/etudiants/EtuSidebar';
import TeachSidebar from './components/TeachSidebar';
import HeaderTechnic from './components/HeaderTechnic';

// Pages publiques
import Authentific from './pages/Auth';
import ActivateAccount from './pages/ActivateAccount';

// Pages Directeur
import Dashboard from './pages/Dashboard';
import Promotions from './pages/Promotions';
import Users from './pages/Users';
import SubjectSpaces from './pages/SubjectSpaces';
import Assignments from './pages/Assignments';
import Creation from './pages/Creation';
import Inscriptions from './pages/Inscriptions';

// Pages Étudiants
import EtuDashboard from './pages/etudiants/etudashboard';
import EtuSpaces from './pages/etudiants/EtuSpaces';
import EtuTravaux from './pages/etudiants/EtuTravaux';

// Pages Formateurs
import TeachSpaces from './pages/formateurs/TeachSpaces';
import GestionTravaux from './pages/formateurs/GestionTravaux';
import TeachPromotions from './pages/formateurs/TeachPromotions';

// Pages Techniciens
import AccountManagement from './pages/techniciens/AccountManagement';
import Maintenance from './pages/techniciens/Maintenance';

// Page 404
const NotFound = () => (
  <div className="flex items-center justify-center h-screen text-2xl font-bold text-red-600">
    Page introuvable
  </div>
);

// Layouts
const DirecteurLayout = () => (
  <div className="flex h-screen overflow-hidden bg-slate-50">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  </div>
);

const EtudiantLayout = () => (
  <div className="flex h-screen overflow-hidden bg-slate-50">
    <EtuSidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

const FormateurLayout = () => (
  <div className="flex h-screen overflow-hidden bg-slate-50">
    <TeachSidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

const TechnicienLayout = () => (
  <div className="flex h-screen overflow-hidden bg-slate-50">
    <div className="flex-1 flex flex-col overflow-hidden">
      <HeaderTechnic />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

// App principal
function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Authentific />} />
        <Route path="/activate" element={<ActivateAccount />} />

        {/* Espace Directeur */}
        <Route path="/directeur" element={<DirecteurLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="promotions" element={<Promotions />} />
          <Route path="users" element={<Users />} />
          <Route path="subjectspaces" element={<SubjectSpaces />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="creation" element={<Creation />} />
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

        {/* Redirection ou page introuvable */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;