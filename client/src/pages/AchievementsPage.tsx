import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Achievement } from '../types';
import { Trophy, CheckCircle2, Lock } from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/achievements')
      .then(res => setAchievements(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <span className="text-sm font-bold text-slate-400 animate-pulse">Chargement des succès...</span>
      </div>
    );
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-24 md:pb-8 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
              <Trophy size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-100">Succès & Trophées</h2>
              <p className="text-xs text-slate-400">Accomplissez des exploits pour gagner des récompenses</p>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-slate-900 border border-yellow-500/30 text-yellow-400 text-xs font-black">
            {unlockedCount} / {achievements.length} Débloqués
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between transition ${
                ach.unlocked
                  ? 'bg-slate-900 border-amber-500/40 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                    {ach.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">{ach.description}</p>
                </div>
                {ach.unlocked ? (
                  <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                ) : (
                  <Lock size={18} className="text-slate-600 shrink-0" />
                )}
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 text-xs">
                <span className="font-bold text-amber-400">+{ach.rewardCredits} CR</span>
                <span className="font-bold text-indigo-400">+{ach.rewardXp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
