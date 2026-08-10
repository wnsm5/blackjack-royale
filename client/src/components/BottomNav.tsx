import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dices, User, Award, BarChart2 } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'TABLE', icon: <Dices size={22} /> },
    { path: '/profile', label: 'PROFIL', icon: <User size={22} /> },
    { path: '/achievements', label: 'SUCCÈS', icon: <Award size={22} /> },
    { path: '/stats', label: 'STATS', icon: <BarChart2 size={22} /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-4 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all active:scale-95 ${
              isActive
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-400 font-black border border-amber-500/40 shadow-lg'
                : 'text-slate-400 font-semibold hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span className="text-[10px] tracking-wider font-extrabold uppercase">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
