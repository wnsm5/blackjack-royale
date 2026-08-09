import React from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Coins, User, Settings, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, profile } = useAuthStore();
  const navigate = useNavigate();

  const credits = profile?.credits ?? 10000;
  const level = profile?.level ?? 1;

  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 sticky top-0 z-40 flex items-center justify-between">
      {/* Brand */}
      <div
        onClick={() => navigate('/')}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg group-hover:scale-105 transition">
          ♠
        </div>
        <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
          Blackjack Royale
        </span>
      </div>

      {/* Stats & Profile Widget */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Credits Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-black shadow-inner">
          <Coins size={16} />
          <span>{credits.toLocaleString()} CR</span>
        </div>

        {/* Level Badge */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
          <Award size={14} />
          <span>Niveau {level}</span>
        </div>

        {/* Profile Avatar button */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 p-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition"
        >
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 font-bold text-xs">
            <User size={18} />
          </div>
          <span className="hidden md:inline text-xs font-bold text-slate-200 pr-2">
            {user?.username || 'Joueur'}
          </span>
        </button>

        {/* Settings button */}
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};
