import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../stores/useAuthStore';
import { DailyChallenge } from '../types';
import { Target, Gift, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ChallengesPage: React.FC = () => {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchProfile } = useAuthStore();

  const loadChallenges = () => {
    api.get('/challenges')
      .then(res => setChallenges(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  const handleClaim = async (challengeId: string) => {
    try {
      await api.post('/challenges/claim', { challengeId });
      confetti({ particleCount: 60, spread: 50 });
      await fetchProfile();
      loadChallenges();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur lors de la réclamation');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <span className="text-sm font-bold text-slate-400 animate-pulse">Chargement des défis...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-24 md:pb-8 flex flex-col items-center">
      <div className="w-full max-w-xl flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Target size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-100">Défis Quotidiens</h2>
            <p className="text-xs text-slate-400">Objectifs renouvelés chaque jour à minuit</p>
          </div>
        </div>

        {/* Challenges List */}
        <div className="flex flex-col gap-3">
          {challenges.map((ch) => {
            const progressPercent = Math.min(100, Math.floor((ch.progress / ch.targetAmount) * 100));

            return (
              <div
                key={ch.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{ch.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{ch.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-amber-400 block">+{ch.rewardCredits} CR</span>
                    <span className="text-[10px] font-bold text-indigo-400 block">+{ch.rewardXp} XP</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                  <div className="flex justify-between items-center text-[11px] font-bold mb-1">
                    <span className="text-slate-400">Progression</span>
                    <span className="text-slate-200">{ch.progress} / {ch.targetAmount}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Claim Button */}
                {ch.completed && !ch.claimed && (
                  <button
                    onClick={() => handleClaim(ch.id)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition shadow flex items-center justify-center gap-1.5"
                  >
                    <Gift size={16} />
                    RÉCLAMER LA RÉCOMPENSE
                  </button>
                )}

                {ch.claimed && (
                  <div className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-400 py-1">
                    <Check size={16} /> Récompensé
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
