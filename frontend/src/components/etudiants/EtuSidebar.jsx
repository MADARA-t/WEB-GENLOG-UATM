import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const EtuSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Hook pour la redirection
    const [isCollapsed, setIsCollapsed] = useState(true);

    const menuItems = [
        { id: 'courses', label: 'Espaces pédagogiques', icon: 'book_2', path: '/etudiant/espaces' },
    ];

    // --- FONCTION DE DÉCONNEXION ---
    const handleLogout = () => {
        // Supprime les données de l'utilisateur
        localStorage.removeItem('user');
        // Redirige vers le login (ajuste le chemin si nécessaire)
        navigate('/');
    };

    return (
        <>
            {/* Injection de la police Lexend */}
            <style dangerouslySetInnerHTML={{
                __html: `@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');`
            }} />

            <aside 
                className={`h-screen hidden lg:flex flex-col bg-white border-r border-slate-100 shadow-[2px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 relative z-[100] font-['Lexend']
                ${isCollapsed ? 'w-24' : 'w-80'}`}
            >
                {/* BOUTON TOGGLE */}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-12 size-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-orange-600 shadow-[0_2px_10px_rgba(0,0,0,0.1)] hover:scale-110 transition-all z-[110]"
                >
                    <span className="material-symbols-outlined text-[18px] font-black">
                        {isCollapsed ? 'chevron_right' : 'chevron_left'}
                    </span>
                </button>

                {/* LOGO SECTION */}
                <div className={`p-8 mb-4 flex items-center gap-4 transition-all ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="flex-shrink-0 size-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                        <span className="material-symbols-outlined text-[28px]">school</span>
                    </div>
                    {!isCollapsed && (
                        <div className="animate-in slide-in-from-left-2 duration-300">
                            <h1 className="text-xl font-black tracking-tighter text-slate-900 leading-none">
                                SETICE
                            </h1>
                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mt-1">
                                Espace Étudiant
                            </p>
                        </div>
                    )}
                </div>

                {/* NAVIGATION */}
                <nav className={`flex-1 flex flex-col gap-2 px-4`}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path || (location.pathname === '/etudiant' && item.id === 'courses');
                        
                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                className={`flex items-center rounded-2xl transition-all duration-300 group relative ${
                                    isCollapsed ? 'justify-center px-0 py-4' : 'gap-4 px-5 py-4'
                                } ${
                                    isActive
                                    ? 'bg-orange-500 text-white shadow-xl shadow-orange-200'
                                    : 'text-slate-500 hover:bg-orange-50 hover:text-orange-600'
                                }`}
                            >
                                <span className={`material-symbols-outlined flex-shrink-0 ${isCollapsed ? 'text-[26px]' : 'text-[24px]'}`}>
                                    {item.icon}
                                </span>
                                
                                {!isCollapsed && (
                                    <span className="font-bold text-sm tracking-tight whitespace-nowrap">
                                        {item.label}
                                    </span>
                                )}

                                {item.badge && (
                                    isCollapsed ? (
                                        <span className="absolute top-3 right-3 size-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                    ) : (
                                        <span className={`ml-auto text-[10px] font-black px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-orange-500' : 'bg-red-500 text-white'}`}>
                                            {item.badge}
                                        </span>
                                    )
                                )}

                                {isCollapsed && (
                                    <div className="absolute left-full ml-6 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-[120] shadow-2xl translate-x-2 group-hover:translate-x-0">
                                        {item.label}
                                    </div>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* FOOTER & DÉCONNEXION */}
                <div className="p-6 border-t border-slate-50">
                    <button 
                        onClick={handleLogout}
                        className={`flex items-center rounded-2xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all w-full group ${isCollapsed ? 'justify-center py-4' : 'gap-4 px-5 py-4'}`}
                    >
                        <span className="material-symbols-outlined flex-shrink-0 group-hover:rotate-12 transition-transform">logout</span>
                        {!isCollapsed && (
                            <span className="font-bold text-sm">Déconnexion</span>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default EtuSidebar;