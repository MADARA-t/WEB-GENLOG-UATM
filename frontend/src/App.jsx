import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Imports des composants communs
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Authentific from './pages/Auth';
import ResetPassword from './pages/ResetPassword'; // <--- AJOUTÉ

// Imports Directeur
import Dashboard from './pages/Dashboard';
import SubjectSpaces from './pages/SubjectSpaces';
import Creation from './pages/Creation';
import Inscriptions from './pages/Inscriptions';

// Imports Étudiants
import EtuSidebar from './components/etudiants/EtuSidebar';
import EtuHeader from './components/etudiants/Header';
import EtuSpaces from './pages/etudiants/EtuSpaces';
import EtuTravaux from './pages/etudiants/EtuTravaux';

// Imports Formateurs
import TeachSidebar from './components/TeachSidebar';
import TeachSpaces from './pages/formateurs/TeachSpaces';

// Imports Techniciens
import HeaderTechnic from './components/HeaderTechnic';
import AccountManagement from './pages/techniciens/AccountManagement';
import Maintenance from './pages/techniciens/Maintenance';
import ManageSystems from './pages/techniciens/ManageSystems';

// --- LAYOUTS ---
const DirecteurLayout = () => (
  <div className="flex h-screen overflow-hidden bg-slate-50">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto p-6 text-slate-900">
        <Outlet />
      </main>
    </div>
  </div>
);

const EtudiantLayout = () => (
  <div className="flex h-screen overflow-hidden bg-slate-50">
    <EtuSidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <EtuHeader />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

const FormateurLayout = () => (
  <div className="flex h-screen overflow-hidden bg-slate-50">
    <TeachSidebar />
    <div className="flex-1 flex flex-col overflow-hidden text-slate-900">
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  </div>
);

const TechnicienLayout = () => (
  <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
    <div className="flex-1 flex flex-col overflow-hidden">
      <HeaderTechnic />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
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
        
        {/* Route d'activation / reset mot de passe (accessible via le lien email) */}
        <Route path="/reset-password" element={<ResetPassword />} /> {/* <--- AJOUTÉ */}

        {/* Espace Directeur protégé */}
        <Route 
          path="/directeur" 
          element={
            <ProtectedRoute allowedRoles={['Directeur']}>
              <DirecteurLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} /> 
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="subjectspaces" element={<SubjectSpaces />} />
          <Route path="inscriptions" element={<Inscriptions />} />
          <Route path="creation" element={<Creation />} />
        </Route>

        {/* Espace Étudiant protégé */}
        <Route 
          path="/etudiant" 
          element={
            <ProtectedRoute allowedRoles={['Étudiant']}>
              <EtudiantLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EtuSpaces />} />
          <Route path="dashboard" element={<EtuSpaces />} />
          <Route path="espaces" element={<EtuSpaces />} />
          <Route path="travaux" element={<EtuTravaux />} />
        </Route>

        {/* Espace Formateur protégé */}
        <Route 
          path="/formateur" 
          element={
            <ProtectedRoute allowedRoles={['Formateur']}>
              <FormateurLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TeachSpaces />} />
          <Route path="espac" element={<TeachSpaces />} />
        </Route>

        {/* Espace Technicien protégé */}
        <Route 
          path="/technicien" 
          element={
            <ProtectedRoute allowedRoles={['Technicien']}>
              <TechnicienLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AccountManagement />} />
          <Route path="comptes" element={<AccountManagement />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="systemsmanager" element={<ManageSystems />} />
        </Route>

        {/* Page par défaut pour les erreurs d'URL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;