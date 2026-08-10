import React from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Coins, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, profile } = useAuthStore();
  const navigate = useNavigate();

  const credits = profile?.credits ?? 10000;

  return (
    <header className="w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-3 py-2 sm:px-4 sm:py-3 sticky top-0 z-40 flex items-center justify-between pt-safe">
      {/* Brand */}
      <div
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg group-hover:scale-105 transition">
          ♠
        </div>
        <span className="font-extrabold text-sm sm:text-lg tracking-tight bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
          Blackjack
        </span>
      </div>

      {/* Stats & Profile Widget */}
      <div className="flex items-center gap-2">
        {/* Credits Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-amber-500/40 text-amber-400 text-xs font-black shadow-inner">
          <Coins size={14} />
          <span>{credits.toLocaleString()} CR</span>
        </div>

        {/* Profile Avatar button */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-1.5 p-1 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition"
        >
          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 font-bold text-xs">
            <User size={15} />
          </div>
        </button>

        {/* Settings button */}
        <button
          onClick={() => navigate('/settings')}
          className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition"
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
};
