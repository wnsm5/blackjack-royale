import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Award, GraduationCap, BarChart2 } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'TABLE', icon: '🃏' },
    { path: '/profile', label: 'PROFIL', icon: '👤' },
    { path: '/achievements', label: 'SUCCÈS', icon: <Award size={20} /> },
    { path: '/learn', label: 'APPRENDRE', icon: <GraduationCap size={20} /> },
    { path: '/stats', label: 'STATS', icon: <BarChart2 size={20} /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2 flex items-center justify-around">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
              isActive
                ? 'bg-amber-500/10 text-amber-400 font-extrabold border border-amber-500/30 shadow-lg'
                : 'text-slate-400 font-medium hover:text-slate-200'
            }`}
          >
            <span className="text-lg leading-none">
              {typeof item.icon === 'string' ? item.icon : item.icon}
            </span>
            <span className="text-[10px] tracking-wider uppercase">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
