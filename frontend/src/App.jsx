import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Authentific from './pages/Auth';
import Dashboard from './pages/Dashboard'; 
import SubjectSpaces from './pages/SubjectSpaces'; 
import Assignments from './pages/Assignments'; 
import Promotions from './pages/Promotions'; 
import Users from './pages/Users'; 
import Surveillance from './pages/Surveillance'; 
import Inscriptions from './pages/Inscriptions'; 
import Creation from './pages/Creation'; 
import Sidebar from './components/Sidebar'; 
import Header from './components/Header'; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans">
        <Routes>
          {/* Page de connexion (Full Screen) */}
          <Route path="/" element={<Authentific />} />

          {/* Interface Applicative */}
          <Route path="/*" element={
            <div className="flex h-screen overflow-hidden">
              <Sidebar /> 

              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Note: Si ton composant Promotions a déjà un header interne, 
                    tu peux conditionner l'affichage du <Header /> global ici */}
                <Header />

                <main className="flex-1 overflow-y-auto">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/promotions" element={<Promotions />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/surveillance" element={<Surveillance />} />
                    <Route path="/subjectspaces" element={<SubjectSpaces />} />
                    <Route path="/inscriptions" element={<Inscriptions />} />
                    <Route path="/creation" element={<Creation />} />
                    <Route path="/assignments" element={<Assignments />} />
                  </Routes>
                </main>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;