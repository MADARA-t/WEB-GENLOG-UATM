import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const TeachSidebar = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(true);

    const navigationLinks = [
        { icon: 'school', label: 'Espaces pédagogiques', path: '/formateur/espac' },
    ];

    return (
        <>
            {/* Importation de la police Lexend */}
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap');
            </style>

            <aside 
                className={`h-screen sticky top-0 hidden xl:flex flex-col bg-white border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 transition-all duration-300 ease-in-out relative font-['Lexend']
                ${isCollapsed ? 'w-24 p-4' : 'w-80 p-6'}`}
            >
                {/* Bouton de réduction (Toggle) */}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-12 size-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-orange-600 hover:border-orange-200 shadow-sm transition-all z-20"
                >
                    <span className="material-symbols-outlined text-sm font-bold">
                        {isCollapsed ? 'chevron_right' : 'chevron_left'}
                    </span>
                </button>

                {/* Branding Section */}
                <div className={`flex items-center gap-3 mb-10 px-2 transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="flex-shrink-0 flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-[#ea580c] to-[#fb923c] text-white shadow-lg shadow-orange-200">
                        <span className="material-symbols-outlined text-2xl fill-[1]">school</span>
                    </div>
                    {!isCollapsed && (
                        <span className="text-2xl font-black tracking-tighter text-slate-900 animate-in fade-in duration-500">
                            SETICE
                        </span>
                    )}
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-1.5 flex-1">
                    {navigationLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            icon={link.icon}
                            label={link.label}
                            path={link.path}
                            badge={link.badge}
                            active={location.pathname === link.path}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </nav>

                {/* Bottom Actions & Profile */}
                <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-4">

                    {/* User Profile Summary */}
                    <div className={`flex items-center gap-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all ${isCollapsed ? 'p-1.5 justify-center' : 'p-3'}`}>
                        <div className="relative flex-shrink-0">
                            <div
                                className="bg-center bg-no-repeat bg-cover rounded-full size-10 shadow-sm border-2 border-white"
                                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80")' }}
                            ></div>
                            <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        
                        {!isCollapsed && (
                            <div className="flex flex-col min-w-0 flex-1 animate-in fade-in duration-500">
                                <h1 className="text-slate-900 text-sm font-bold leading-tight truncate">Dr. Jean-Pierre</h1>
                                <p className="text-[#ea580c] text-[12px] font-medium uppercase tracking-wider">Formateur</p>
                            </div>
                        )}
                    </div>

                    <button className={`flex items-center gap-2 h-12 rounded-xl bg-slate-100 text-slate-900 text-sm font-bold hover:bg-slate-200 transition-all ${isCollapsed ? 'justify-center w-full' : 'px-4 w-full'}`}>
                        <span className="material-symbols-outlined text-base">logout</span>
                        {!isCollapsed && <span className="animate-in fade-in duration-500">Déconnexion</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

const NavLink = ({ icon, label, path, active = false, badge = null, isCollapsed = false }) => (
    <Link
        to={path}
        className={`flex items-center rounded-xl transition-all group relative font-['Lexend'] ${isCollapsed ? 'justify-center p-3' : 'gap-4 px-4 py-3'} 
            ${active ? 'bg-orange-50 text-[#ea580c] shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-[#ea580c]'}`}
    >
        <span
            className={`material-symbols-outlined transition-colors ${active ? '' : 'text-slate-400 group-hover:text-[#ea580c]'}`}
            style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
        >
            {icon}
        </span>
        
        {!isCollapsed && (
            <div className="flex justify-between items-center w-full min-w-0 animate-in fade-in duration-500">
                <span className={`truncate ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
                {badge && (
                    <span className="bg-[#ea580c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {badge}
                    </span>
                )}
            </div>
        )}

        {isCollapsed && (
            <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {label}
            </div>
        )}
    </Link>
);

export default TeachSidebar;