import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { User, Award, Flame, Snowflake, BarChart2, History, Target, Trophy, LogOut } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile, fetchProfile, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const level = profile?.level || 1;
  const xp = profile?.xp || 0;
  const xpNeeded = Math.floor(100 * Math.pow(level + 1, 1.5));
  const xpCurrentLevel = Math.floor(100 * Math.pow(level, 1.5));
  const progressPercent = Math.min(100, Math.max(0, Math.floor(((xp - xpCurrentLevel) / (xpNeeded - xpCurrentLevel)) * 100)));

  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-24 md:pb-8 flex flex-col items-center">
      <div className="w-full max-w-xl flex flex-col gap-6">
        
        {/* Profile Card Header */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-amber-500/50 flex items-center justify-center text-amber-400 text-3xl shadow-xl mb-3">
            <User size={48} />
          </div>

          <h2 className="text-2xl font-black text-slate-100">{user?.username || 'Joueur'}</h2>
          <span className="text-xs font-semibold text-amber-400 mt-0.5">
            {user?.isGuest ? 'Compte Invité' : 'Compte Officiel'}
          </span>

          {/* Level Progress */}
          <div className="w-full max-w-sm mt-4 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-indigo-400 flex items-center gap-1">
                <Award size={14} /> Niveau {level}
              </span>
              <span className="text-slate-400">{xp} / {xpNeeded} XP</span>
            </div>
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Balance & Streaks Grid */}
          <div className="grid grid-cols-2 gap-3 w-full mt-4">
            <div className="bg-slate-950 p-3 rounded-2xl border border-amber-500/30 flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Solde</span>
              <span className="text-xl font-extrabold text-amber-400 mt-0.5">
                {(profile?.credits || 0).toLocaleString()} CR
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Série Actuelle</span>
              <div className="flex items-center gap-1.5 mt-0.5 font-black text-lg">
                {(profile?.winStreak || 0) > 0 ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <Flame size={18} /> {profile?.winStreak} W
                  </span>
                ) : (profile?.loseStreak || 0) > 0 ? (
                  <span className="text-blue-400 flex items-center gap-1">
                    <Snowflake size={18} /> {profile?.loseStreak} L
                  </span>
                ) : (
                  <span className="text-slate-500">-</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Menu Links */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/stats')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition flex items-center gap-3 text-slate-200 font-bold text-sm"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <BarChart2 size={20} />
            </div>
            <span>Statistiques</span>
          </button>

          <button
            onClick={() => navigate('/history')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition flex items-center gap-3 text-slate-200 font-bold text-sm"
          >
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <History size={20} />
            </div>
            <span>Historique</span>
          </button>

          <button
            onClick={() => navigate('/achievements')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition flex items-center gap-3 text-slate-200 font-bold text-sm"
          >
            <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400">
              <Trophy size={20} />
            </div>
            <span>Succès</span>
          </button>

          <button
            onClick={() => navigate('/challenges')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition flex items-center gap-3 text-slate-200 font-bold text-sm"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Target size={20} />
            </div>
            <span>Défis Quotidiens</span>
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full py-4 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-bold text-sm border border-rose-800/60 transition flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          SE DÉCONNECTER
        </button>
      </div>
    </div>
  );
};
