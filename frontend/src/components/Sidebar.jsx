import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// --- STYLE ORANGE IDENTIQUE (DASHBOARD ET SOUS-MENUS) ---
const activeButtonStyle = "bg-orange-500 text-white shadow-lg shadow-orange-200";
const inactiveButtonStyle = "text-slate-500 hover:bg-slate-50 hover:text-slate-700";

const SubNavItem = ({ label, to }) => (
  <div className="px-2 w-full">
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center w-full px-5 py-3 rounded-xl transition-all duration-300 mb-1
        ${isActive ? activeButtonStyle : inactiveButtonStyle}
      `}
    >
      <span className="text-sm font-bold whitespace-nowrap">
        {label}
      </span>
    </NavLink>
  </div>
);

const NavGroup = ({ icon, label, isOpen, onClick, children, active }) => (
  <div className="mb-2 px-2">
    <button
      onClick={onClick}
      className={`flex items-center justify-between px-5 py-4 rounded-2xl w-full transition-all duration-300 ${active && !isOpen ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-50'
        }`}
    >
      <div className="flex items-center gap-4">
        <span className={`material-symbols-outlined !text-[24px] ${active ? 'text-orange-500' : 'text-slate-400'}`}>
          {icon}
        </span>
        <span className="text-sm font-bold">{label}</span>
      </div>
      <span className={`material-symbols-outlined text-[20px] transition-transform duration-500 ${isOpen ? 'rotate-180 text-orange-500' : 'text-slate-400'}`}>
        expand_more
      </span>
    </button>

    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-2 ml-4' : 'max-h-0 opacity-0'}`}>
      <div className="flex flex-col border-l-2 border-slate-100 ml-1">
        {children}
      </div>
    </div>
  </div>
);

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-80 flex-shrink-0 bg-white flex flex-col hidden md:flex sticky top-0 h-screen border-r border-slate-100">

      {/* LOGO */}
      <div className="p-8 mb-2">
        <div className="flex gap-4 items-center">
          <div className="bg-orange-500 rounded-2xl h-12 w-12 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <span className="material-symbols-outlined !text-[28px]">school</span>
          </div>
          <div>
            <h1 className="text-slate-900 text-xl font-black tracking-tight leading-none">SETICE</h1>
            <p className="text-orange-500 text-[10px] font-bold uppercase tracking-[0.1em] mt-1">Admin Panel</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 overflow-y-auto no-scrollbar">
        <nav className="mt-4">
          <NavLink
            to="/directeur/dashboard"
            className={({ isActive }) => `
                flex items-center gap-4 px-5 py-4 rounded-2xl w-full mb-2 transition-all duration-300
                ${isActive ? activeButtonStyle : inactiveButtonStyle}
              `}
          >
            <span className="material-symbols-outlined !text-[24px]">grid_view</span>
            <span className="text-sm font-bold">Tableau de bord</span>
          </NavLink>

          <NavLink 
            className={({ isActive }) => `
              flex items-center gap-4 px-5 py-4 rounded-2xl w-full mb-2 transition-all duration-300
              ${isActive ? activeButtonStyle : inactiveButtonStyle}
            `} 
            to="/directeur/subjectspaces"
          >
            <span className="material-symbols-outlined !text-[24px]">library_books</span>
            <span className="text-sm font-bold">Espaces pédagogiques</span>
          </NavLink>

          <NavLink 
            className={({ isActive }) => `
              flex items-center gap-4 px-5 py-4 rounded-2xl w-full mb-2 transition-all duration-300
              ${isActive ? activeButtonStyle : inactiveButtonStyle}
            `} 
            to="/directeur/inscriptions"
          >
            <span className="material-symbols-outlined !text-[24px]">groups</span>
            <span className="text-sm font-bold">Inscriptions</span>
          </NavLink>

          <NavLink 
            className={({ isActive }) => `
              flex items-center gap-4 px-5 py-4 rounded-2xl w-full mb-2 transition-all duration-300
              ${isActive ? activeButtonStyle : inactiveButtonStyle}
            `} 
            to="/directeur/creation"
          >
            <span className="material-symbols-outlined !text-[24px]">task</span>
            <span className="text-sm font-bold">Travaux</span>
          </NavLink>
        </nav>
      </div>

      {/* DÉCONNEXION */}
      <div className="p-6 border-t border-slate-50">
        <NavLink to="/" className="flex items-center gap-4 w-full px-6 py-4 rounded-2xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all group">
          <span className="material-symbols-outlined !text-[24px] group-hover:rotate-12 transition-transform">logout</span>
          <span className="text-sm font-bold">Déconnexion</span>
        </NavLink>
      </div>
    </aside>
  );
}