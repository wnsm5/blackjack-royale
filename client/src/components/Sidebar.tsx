import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Award, GraduationCap, BarChart2, History, Target, Settings } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Table de Jeu', icon: '🃏' },
    { path: '/profile', label: 'Mon Profil', icon: <User size={20} /> },
    { path: '/stats', label: 'Statistiques', icon: <BarChart2 size={20} /> },
    { path: '/history', label: 'Historique', icon: <History size={20} /> },
    { path: '/achievements', label: 'Succès', icon: <Award size={20} /> },
    { path: '/challenges', label: 'Défis Quotidiens', icon: <Target size={20} /> },
    { path: '/learn', label: 'Apprendre le 21', icon: <GraduationCap size={20} /> },
    { path: '/settings', label: 'Paramètres', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-950/60 border-r border-slate-800/80 p-4 gap-2 min-h-screen">
      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
        Navigation
      </div>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              isActive
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-400 border border-amber-500/30 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <span className="text-xl">
              {typeof item.icon === 'string' ? item.icon : item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
};
