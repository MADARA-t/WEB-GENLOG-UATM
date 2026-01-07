import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:3000/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', text: "Connexion réussie ! Redirection..." });
        
        // Sauvegarder le token et l'utilisateur
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirection selon le rôle
        const role = data.user.role.toLowerCase();
        
        setTimeout(() => {
          switch(role) {
            case 'directeur':
              navigate('/directeur/dashboard');
              break;
            case 'etudiant':
              navigate('/etudiant/dashboard');
              break;
            case 'formateur':
              navigate('/formateur/espac');
              break;
            case 'technicien':
              navigate('/technicien/comptes');
              break;
            default:
              navigate('/directeur/dashboard');
          }
        }, 1500);
      } else {
        setStatus({ type: 'error', text: data.message || "Identifiants incorrects." });
        setLoading(false);
      }
    } catch (error) {
      setStatus({ type: 'error', text: "Le serveur ne répond pas. Vérifie qu'il est lancé sur le port 3000." });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-['Inter',_sans-serif] text-black">
      
      <header className="flex w-full items-center justify-between border-b border-gray-100 bg-white px-6 sm:px-10 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="size-8 flex items-center justify-center rounded-lg bg-orange-500/10">
            <span className="material-symbols-outlined text-orange-600" style={{ fontSize: '24px' }}>school</span>
          </div>
          <h2 className="text-black text-xl font-black tracking-tight uppercase">MADARA</h2>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center justify-center py-12 px-4 relative bg-[#f9f9f9]">
        <div className="absolute inset-0 overflow-hidden -z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[40%] h-[40%] rounded-full bg-orange-500/5 blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[30%] h-[30%] rounded-full bg-orange-500/5 blur-[100px]"></div>
        </div>

        <div className="z-10 w-full max-w-[580px] mx-auto bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight mb-2">
                Content de vous revoir
              </h1>
              <p className="text-gray-500 text-sm font-medium">Gestion académique tout-en-un</p>
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <InputGroup 
                  label="Email" 
                  icon="mail" 
                  type="email" 
                  placeholder="nom@exemple.com" 
                  value={email} 
                  onChange={setEmail}
                  disabled={loading}
                />
                <InputGroup 
                  label="Mot de passe" 
                  icon="lock" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={setPassword}
                  hasToggle 
                  onToggle={() => setShowPassword(!showPassword)} 
                  isShowing={showPassword}
                  disabled={loading}
                />
              </div>

              {status.text && (
                <div className={`p-4 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                  status.type === 'error' 
                  ? 'bg-red-50 border-red-100 text-red-600' 
                  : 'bg-orange-50 border-orange-100 text-orange-600'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined !text-[18px]">
                      {status.type === 'error' ? 'error' : 'check_circle'}
                    </span>
                    {status.text}
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-2 h-12 bg-black text-white text-xs font-black uppercase tracking-[0.2em] rounded-lg hover:bg-zinc-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

function InputGroup({ label, icon, type, placeholder, value, onChange, hasToggle, onToggle, isShowing, disabled }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</label>
      <div className="relative group">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors !text-[20px]">{icon}</span>
        <input 
          required
          type={type} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-gray-50 border-gray-100 border rounded-lg h-12 pl-10 pr-4 text-sm font-semibold text-black focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {hasToggle && (
          <button 
            type="button" 
            onClick={onToggle} 
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black disabled:opacity-50"
          >
            <span className="material-symbols-outlined !text-[20px]">{isShowing ? 'visibility_off' : 'visibility'}</span>
          </button>
        )}
      </div>
    </div>
  );
}