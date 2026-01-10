import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION SUPABASE ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');

  const userEmail = searchParams.get('email');

  useEffect(() => {
    const fetchUserName = async () => {
      if (userEmail) {
        const { data, error } = await supabase
          .from('users')
          .select('name')
          .eq('email', userEmail)
          .maybeSingle(); // Utilisation de maybeSingle pour éviter les erreurs si vide
        
        if (data) setUserName(data.name);
      }
    };
    fetchUserName();
  }, [userEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });

    if (password !== confirmPassword) {
      return setStatus({ type: 'error', text: "Les mots de passe ne correspondent pas." });
    }

    if (password.length < 6) {
      return setStatus({ type: 'error', text: "Le mot de passe doit faire au moins 6 caractères." });
    }

    if (!userEmail) {
      return setStatus({ type: 'error', text: "Email manquant dans le lien d'activation." });
    }

    setLoading(true);

    try {
      // 1. MISE À JOUR FORCEE DU STATUT ET DU PASSWORD
      const { data, error } = await supabase
        .from('users')
        .update({ 
          password: password,
          status: 'Actif',    // On force la valeur 'Actif'
          active: true        // On force true
        })
        .eq('email', userEmail)
        .select(); // On demande le retour des données pour vérifier

      if (error) {
        console.error("Erreur Supabase:", error);
        setStatus({ type: 'error', text: "Erreur base de données : " + error.message });
      } else if (data && data.length > 0) {
        setStatus({ 
          type: 'success', 
          text: "Compte activé ! Statut mis à jour en 'Actif'. Redirection..." 
        });
        
        // Redirection vers le login (racine)
        setTimeout(() => navigate('/'), 3000);
      } else {
        setStatus({ type: 'error', text: "Utilisateur non trouvé dans la base." });
      }
    } catch (err) {
      setStatus({ type: 'error', text: "Une erreur réseau est survenue." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-['Inter',_sans-serif] text-black relative">
      <div className="absolute inset-0 z-0" style={{
          backgroundImage: "url('http://googleusercontent.com/image_collection/image_retrieval/10877696622041872430_0')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]"></div>
      </div>

      <header className="flex w-full items-center justify-between border-b border-gray-100 bg-white/90 backdrop-blur-md px-6 sm:px-10 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="size-8 flex items-center justify-center rounded-lg bg-orange-500/10">
            <span className="material-symbols-outlined text-orange-600">school</span>
          </div>
          <h2 className="text-black text-xl font-black tracking-tight uppercase">
            {"SETICE"}
          </h2>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center justify-center py-12 px-4 relative z-10">
        <div className="w-full max-w-[500px] mx-auto bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-orange-600 text-white mb-6 shadow-lg shadow-orange-200">
                <span className="material-symbols-outlined !text-3xl">lock_reset</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight mb-2">Activation</h1>
              <p className="text-gray-500 text-sm font-medium">
                Activation du compte <span className="text-orange-600 font-bold">{userName}</span>
              </p>
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <InputGroup 
                  label="Définir mot de passe" 
                  icon="lock" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={setPassword}
                  hasToggle 
                  onToggle={() => setShowPassword(!showPassword)} 
                  isShowing={showPassword} 
                />
                
                <InputGroup 
                  label="Confirmation" 
                  icon="enhanced_encryption" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                />
              </div>

              {status.text && (
                <div className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                  status.type === 'error' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-600'
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
                disabled={loading}
                type="submit" 
                className="w-full mt-4 h-14 bg-black text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-orange-700 transition-all shadow-xl active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Activation en cours...' : 'Activer mon compte'}
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