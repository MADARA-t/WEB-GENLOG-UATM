import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Auth() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !data) {
        setStatus({ type: 'error', text: "Identifiants incorrects." });
      } else {
        // --- STOCKAGE DYNAMIQUE ---
        // On stocke l'objet entier ou les clés nécessaires pour le Header et le Dashboard
        localStorage.setItem('user', JSON.stringify(data));
        
        setStatus({ type: 'success', text: `Bienvenue ${data.name} ! Redirection...` });

        // --- LOGIQUE DE REDIRECTION PAR RÔLE ---
        setTimeout(() => {
          switch (data.role) {
            case 'Directeur':
              navigate('/directeur/dashboard');
              break;
            case 'Étudiant':
              navigate('/etudiant/espaces');
              break;
            case 'Formateur':
              navigate('/formateur/espac');
              break;
            case 'Technicien':
              navigate('/technicien');
              break;
            default:
              navigate('/'); // Route par défaut
          }
        }, 1500);
      }
    } catch (err) {
      setStatus({ type: 'error', text: "Problème de connexion au serveur." });
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-['Inter',_sans-serif] text-black relative">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('http://googleusercontent.com/image_collection/image_retrieval/10877696622041872430_0')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]"></div>
      </div>

      <header className="flex w-full items-center justify-between border-b border-gray-100 bg-white/90 backdrop-blur-md px-6 sm:px-10 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="size-8 flex items-center justify-center rounded-lg bg-orange-500/10">
            <span className="material-symbols-outlined text-orange-600" style={{ fontSize: '24px' }}>school</span>
          </div>
          <h2 className="text-black text-xl font-black tracking-tight uppercase">SETICE</h2>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center justify-center py-12 px-4 relative z-10">
        <div className="w-full max-w-[500px] mx-auto bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-orange-500 text-white mb-6 shadow-lg shadow-orange-200">
                <span className="material-symbols-outlined !text-3xl">login</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight mb-2">Connexion</h1>
              <p className="text-gray-500 text-sm font-medium">Portail SETICE</p>
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <InputGroup label="Email" icon="mail" type="email" placeholder="nom@exemple.com" value={email} onChange={setEmail} />
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
                />
              </div>

              {status.text && (
                <div className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                  status.type === 'error' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-orange-50 border-orange-100 text-orange-600'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined !text-[18px]">
                      {status.type === 'error' ? 'error' : 'check_circle'}
                    </span>
                    {status.text}
                  </div>
                </div>
              )}

              <button type="submit" className="w-full mt-4 h-14 bg-orange-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 active:scale-95">
                Se connecter
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

function InputGroup({ label, icon, type, placeholder, value, onChange, hasToggle, onToggle, isShowing }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{label}</label>
      <div className="relative group">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors !text-[20px]">{icon}</span>
        <input 
          required
          type={type} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} 
          className="w-full bg-gray-50/50 border-gray-100 border-2 rounded-xl h-14 pl-12 pr-4 text-sm font-semibold text-black focus:bg-white focus:border-orange-500 outline-none transition-all"
        />
        {hasToggle && (
          <button type="button" onClick={onToggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
            <span className="material-symbols-outlined !text-[20px]">{isShowing ? 'visibility_off' : 'visibility'}</span>
          </button>
        )}
      </div>
    </div>
  );
}