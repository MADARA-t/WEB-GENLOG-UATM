import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const TeachSidebar = () => {
    const location = useLocation();

    const navigationLinks = [
        { icon: 'school', label: 'Espaces pédagogiques', path: '/formateur/espac' },
        { icon: 'calendar_month', label: 'Gestion des travaux', path: '/formateur/travaux' },
        { icon: 'chat_bubble', label: 'Mes Promotions', path: '/formateur/promotions', badge: '3' },
    ];

    return (
        <aside className="w-80 h-screen sticky top-0 hidden xl:flex flex-col bg-white border-r border-slate-200 p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">

            {/* Branding Section (Logo + Nom) */}
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-[#ea580c] to-[#fb923c] text-white shadow-lg shadow-orange-200">
                    <span className="material-symbols-outlined text-2xl fill-[1]">school</span>
                </div>
                <span className="text-2xl font-black tracking-tighter text-slate-900">
                    MADARA
                </span>
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
                    />
                ))}
            </nav>

            {/* Bottom Actions & Profile */}
            <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-4">

                {/* User Profile Summary (À la place des paramètres) */}
                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="relative">
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-full size-11 shadow-sm border-2 border-white"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDk3SVFG8xodKk-XYjEy7J7MlFVr71EFGxKiJxKGFAYyjpoqAaZv36bpgkUz0fdfoQHt0hu2vfpPZgW9ulGreBUwYGbIrJC_dXiSW4vCqB8gNH9rE86lR64JYvk0XEyno5FrNwvOAUskS09YU9Ejv616CcG9hKZ_xX_MKRXMelievN04eFF2ZX8-6fQbthFkX0srybX6t2sUOY5KsCgSqUjxoUnOk7I_vaW_gzcdwe2d53cKbkH0l_IydMYynqDbkKb5lhhZZ4xbTA")' }}
                        ></div>
                        <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                        <h1 className="text-slate-900 text-sm font-bold leading-tight truncate">M. Anderson</h1>
                        <p className="text-[#ea580c] text-[12px] font-medium uppercase tracking-wider">Formateur</p>
                    </div>
                </div>

                <button className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-slate-100 text-slate-900 text-sm font-bold hover:bg-slate-200 transition-colors">
                    <span className="material-symbols-outlined text-base">logout</span>
                    Déconnexion
                </button>
            </div>
        </aside>
    );
};

const NavLink = ({ icon, label, path, active = false, badge = null }) => (
    <Link
        to={path}
        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${active
                ? 'bg-orange-50 text-[#ea580c] shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-[#ea580c]'
            }`}
    >
        <span
            className={`material-symbols-outlined transition-colors ${active ? '' : 'text-slate-400 group-hover:text-[#ea580c]'}`}
            style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
        >
            {icon}
        </span>
        <div className="flex justify-between items-center w-full min-w-0">
            <span className={`truncate ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
            {badge && (
                <span className="bg-[#ea580c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {badge}
                </span>
            )}
        </div>
    </Link>
);

export default TeachSidebar;