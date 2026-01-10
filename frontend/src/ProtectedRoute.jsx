import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    
    // 1. Récupération de l'utilisateur
    const savedUser = localStorage.getItem('user');
    const user = savedUser ? JSON.parse(savedUser) : null;

    // 2. Fonction interne pour créer la notification sans alerte
    const showAccessDeniedToast = (role) => {
        // On vérifie si un toast existe déjà pour ne pas les empiler
        if (document.getElementById('access-denied-toast')) return;

        const toast = document.createElement('div');
        toast.id = 'access-denied-toast';
        // Style du toast (Design sombre et moderne)
        toast.innerHTML = `
            <div style="position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 9999; 
                        background: #1e293b; color: white; padding: 16px 24px; border-radius: 16px; 
                        box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 12px;
                        border: 1px solid rgba(255,255,255,0.1); font-family: sans-serif; min-width: 300px;
                        animation: slideUp 0.4s ease-out">
                <div style="background: #ef4444; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-center: center;">
                    <span style="font-size: 20px">🔒</span>
                </div>
                <div>
                    <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #f87171">Accès Refusé</div>
                    <div style="font-size: 13px; font-weight: 500; color: #e2e8f0">Page réservée aux profils : ${allowedRoles.join(', ')}</div>
                </div>
            </div>
            <style>
                @keyframes slideUp { from { bottom: -100px; opacity: 0; } to { bottom: 30px; opacity: 1; } }
            </style>
        `;
        document.body.appendChild(toast);

        // Auto-suppression après 4 secondes
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s ease';
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    };

    // 3. Logique de protection
    if (!user) {
        return <Navigate to="/" replace />;
    }

    const hasPermission = allowedRoles.some(
        role => role.toLowerCase() === user.role.toLowerCase()
    );

    if (!hasPermission) {
        // Déclenchement de la notification
        showAccessDeniedToast(user.role);

        // Redirection vers le dashboard correspondant au rôle de l'utilisateur
        let redirectPath = '/';
        switch (user.role) {
            case 'Directeur': redirectPath = '/directeur/dashboard'; break;
            case 'Étudiant': redirectPath = '/etudiant/espaces'; break;
            case 'Formateur': redirectPath = '/formateur/espac'; break;
            case 'Technicien': redirectPath = '/technicien/comptes'; break;
        }
        
        return <Navigate to={redirectPath} replace />;
    }

    // 4. Si tout est OK
    return children;
};

export default ProtectedRoute;