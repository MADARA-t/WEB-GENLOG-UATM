import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ActivateAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    // Récupérer le token depuis l'URL
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setStatus({ 
        type: 'error', 
        message: 'Token manquant. Veuillez utiliser le lien complet reçu par email.' 
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    // Validation du mot de passe
    if (password.length < 6) {
      setStatus({ 
        type: 'error', 
        message: 'Le mot de passe doit contenir au moins 6 caractères' 
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ 
        type: 'error', 
        message: 'Les mots de passe ne correspondent pas' 
      });
      return;
    }

    if (!token) {
      setStatus({ 
        type: 'error', 
        message: 'Token invalide. Veuillez utiliser le lien reçu par email.' 
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/activate', {
        token: token,
        password: password,
      });

      setStatus({ 
        type: 'success', 
        message: response.data.message || 'Compte activé avec succès ! Redirection...' 
      });

      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Erreur activation:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Erreur lors de l\'activation du compte' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-['Inter',_sans-serif] text-black">
      {/* Header */}
      <header className="flex w-full items-center justify-between border-b border-gray-100 bg-white px-6 sm:px-10 py-4">
        <div className="flex items-center gap-3">
          <div className="size-8 flex items-center justify-center rounded-lg bg-orange-500/10">
            <span className="material-symbols-outlined text-orange-600" style={{ fontSize: '24px' }}>school</span>
          </div>
          <h2 className="text-black text-xl font-black tracking-tight uppercase">MADARA</h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="hidden sm:block text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            Retour à la connexion
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col items-center justify-center py-12 px-4 relative bg-[#f9f9f9]">
        {/* Background blurs */}
        <div className="absolute inset-0 overflow-hidden -z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[40%] h-[40%] rounded-full bg-orange-500/5 blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[30%] h-[30%] rounded-full bg-orange-500/5 blur-[100px]"></div>
        </div>

        {/* Card principale */}
        <div className="z-10 w-full max-w-[580px] mx-auto bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-10">
            {/* Titre */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-500 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-4xl">check_circle</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight mb-2">
                Activez votre compte
              </h1>
              <p className="text-gray-500 text-sm font-medium">
                Définissez votre mot de passe pour accéder à la plateforme
              </p>
            </div>

            {/* Formulaire */}
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Mot de passe */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Nouveau mot de passe
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors !text-[20px]">
                    lock
                  </span>
                  <input 
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    placeholder="••••••••" 
                    className="w-full bg-gray-50 border-gray-100 border rounded-lg h-12 pl-10 pr-12 text-sm font-semibold text-black focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                  >
                    <span className="material-symbols-outlined !text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <p className="text-xs text-gray-400 ml-2">
                  Minimum 6 caractères
                </p>
              </div>

              {/* Confirmer mot de passe */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Confirmer le mot de passe
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors !text-[20px]">
                    lock_reset
                  </span>
                  <input 
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={6}
                    placeholder="••••••••" 
                    className="w-full bg-gray-50 border-gray-100 border rounded-lg h-12 pl-10 pr-12 text-sm font-semibold text-black focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                  >
                    <span className="material-symbols-outlined !text-[20px]">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Message de statut */}
              {status.message && (
                <div className={`p-4 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                  status.type === 'error' 
                  ? 'bg-red-50 border-red-100 text-red-600' 
                  : 'bg-green-50 border-green-100 text-green-600'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined !text-[18px]">
                      {status.type === 'error' ? 'error' : 'check_circle'}
                    </span>
                    {status.message}
                  </div>
                </div>
              )}

              {/* Bouton submit */}
              <button 
                type="submit" 
                disabled={loading || !token}
                className="w-full mt-2 h-12 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-lg transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Activation en cours...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">check</span>
                    Activer mon compte
                  </>
                )}
              </button>
            </form>

            {/* Info supplémentaire */}
            <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-100">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-orange-500 text-xl">info</span>
                <div>
                  <p className="text-[10px] font-black uppercase text-orange-700 mb-1">Information</p>
                  <p className="text-xs text-orange-600 leading-relaxed">
                    Une fois votre compte activé, vous pourrez vous connecter avec votre email et le mot de passe que vous venez de définir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lien retour */}
        <button 
          onClick={() => navigate('/')}
          className="mt-8 text-sm text-gray-500 hover:text-orange-500 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Retour à la connexion
        </button>
      </main>
    </div>
  );
}