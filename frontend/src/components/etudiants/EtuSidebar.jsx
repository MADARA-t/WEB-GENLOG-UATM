import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const EtuSidebar = () => {
    const location = useLocation(); 

    const menuItems = [
        { id: 'dash', label: 'Tableau de bord', icon: 'dashboard', path: '/etudiant/dashboard' },
        { id: 'courses', label: 'Espaces pédagogiques', icon: 'book_2', path: '/etudiant/espaces' },
        { id: 'homework', label: 'Travaux & Devoirs', icon: 'assignment', path: '/etudiant/travaux', badge: 3 },
    ];

    return (
        <aside className="w-72 h-full hidden lg:flex flex-col bg-white border-r border-slate-100 shadow-[2px_0_24px_rgba(0,0,0,0.02)] z-20">
            <div className="p-8 pb-4 flex items-center gap-3">
                <div className="size-10 rounded-full bg-orange-600/10 flex items-center justify-center text-orange-600">
                    <span className="material-symbols-outlined text-[24px]">school</span>
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">MADARA</h1>
                    {/* On pourrait utiliser location.pathname ici pour afficher dynamiquement le sous-titre */}
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {location.pathname.includes('settings') ? 'Paramètres' : 'Espace Étudiant'}
                    </p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-5 py-3.5 rounded-full transition-all ${isActive
                                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-orange-600 group'
                            }`
                        }
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span className="font-medium text-sm">{item.label}</span>
                        {item.badge && (
                            <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                {item.badge}
                            </span>
                        )}
                    </NavLink>
                ))}

                <div className="mt-auto pt-6 border-t border-slate-100">
                    <NavLink
                        to="/etudiant/settings"
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-5 py-3.5 rounded-full transition-colors ${isActive ? 'text-orange-600 bg-slate-50' : 'text-slate-500 hover:bg-slate-50'
                            }`
                        }
                    >
                        <span className="material-symbols-outlined">settings</span>
                        <span className="font-medium text-sm">Paramètres</span>
                    </NavLink>

                    <button className="flex items-center gap-4 px-5 py-3.5 rounded-full text-red-500 hover:bg-red-50 transition-colors w-full">
                        <span className="material-symbols-outlined">logout</span>
                        <span className="font-medium text-sm">Déconnexion</span>
                    </button>
                </div>
            </nav>
        </aside>
    );
};

export default EtuSidebar;