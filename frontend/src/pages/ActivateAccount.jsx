import React, { useState, useEffect } from 'react';

const ActivateAccount = () => {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Récupérer le token depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    setToken(urlToken || '');
    setTokenValid(!!urlToken);
  }, []);

  const validatePassword = () => {
    if (!password || password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    setError('');
    return true;
  };

  const handleActivate = async () => {
    if (!validatePassword()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/auth/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'activation');
      }

      setSuccess(true);
      
      // Redirection après 2 secondes
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'activation');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-red-50 via-orange-50 to-red-50 flex items-center justify-center p-4 font-['Lexend',sans-serif]">
        <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');` }} />
        
        <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl text-center">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-5xl">error</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-4">
            Lien <span className="text-red-500">Invalide</span>
          </h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Ce lien d'activation est invalide ou a expiré. Veuillez contacter l'administrateur pour obtenir un nouveau lien.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase text-sm tracking-wide hover:bg-slate-800 transition-all"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 flex items-center justify-center p-4 font-['Lexend',sans-serif]">
        <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');` }} />
        
        <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl text-center animate-in zoom-in-95">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="material-symbols-outlined text-6xl">check_circle</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-4">
            Compte <span className="text-green-500">Activé !</span>
          </h1>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Votre compte a été activé avec succès. Vous allez être redirigé vers la page de connexion.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <div className="w-4 h-4 border-3 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
            Redirection en cours...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-slate-50 to-orange-50 flex items-center justify-center p-4 font-['Lexend',sans-serif]">
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');` }} />
      
      <div className="bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-200">
            <span className="material-symbols-outlined text-5xl text-white">vpn_key</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 mb-3">
            Activation de <span className="text-orange-500">Compte</span>
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed max-w-sm mx-auto">
            Bienvenue sur la plateforme SETICE. Veuillez définir un mot de passe sécurisé pour activer votre compte.
          </p>
        </div>

        {/* Formulaire */}
        <div className="space-y-6">
          
          {/* Mot de passe */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wide text-slate-700 mb-3">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 p-4 pr-12 rounded-2xl border-2 border-slate-200 font-semibold text-sm outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">info</span>
              Minimum 8 caractères
            </p>
          </div>

          {/* Confirmation */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wide text-slate-700 mb-3">
              Confirmer le mot de passe
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 font-semibold text-sm outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-2xl animate-in fade-in slide-in-from-top-2">
              <span className="material-symbols-outlined text-red-600 mt-0.5">error</span>
              <p className="text-sm font-semibold text-red-700 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Info sécurité */}
          <div className="p-5 bg-blue-50 border-2 border-blue-200 rounded-2xl">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600 mt-0.5">security</span>
              <div className="text-xs text-blue-800 leading-relaxed">
                <p className="font-bold mb-1">Conseils pour un mot de passe sécurisé :</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Utilisez au moins 8 caractères</li>
                  <li>• Mélangez majuscules et minuscules</li>
                  <li>• Incluez des chiffres et caractères spéciaux</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bouton d'activation */}
          <button
            onClick={handleActivate}
            disabled={loading || !password || !confirmPassword}
            className="w-full py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl shadow-orange-200 hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                Activation en cours...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">check_circle</span>
                Activer mon compte
              </>
            )}
          </button>

          {/* Lien retour */}
          <div className="text-center pt-4">
            <button
              onClick={() => window.location.href = '/'}
              className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
            >
              ← Retour à la page de connexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivateAccount;