import React, { useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../stores/useAuthStore';
import { Gift, Sparkles, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REWARDS = [500, 750, 1000, 1250, 1500, 2000, 5000];

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ isOpen, onClose }) => {
  const { profile, fetchProfile } = useAuthStore();
  const [claiming, setClaiming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentStreak = profile?.consecutiveDailyDays || 0;

  const handleClaim = async () => {
    setClaiming(true);
    setMessage(null);
    try {
      const res = await api.post('/profile/daily-reward');
      confetti({ particleCount: 80, spread: 60 });
      setMessage(`Félicitations ! +${res.data.claimedAmount} CR ajoutés à votre solde.`);
      await fetchProfile();
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Impossible de réclamer la récompense');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border-2 border-amber-400 flex items-center justify-center">
          <Gift size={32} />
        </div>

        <h3 className="text-2xl font-black text-slate-100 uppercase tracking-tight">
          Récompense Quotidienne
        </h3>
        <p className="text-xs text-slate-400">
          Connectez-vous chaque jour pour débloquer des récompenses croissantes !
        </p>

        {/* 7 Day Grid */}
        <div className="grid grid-cols-7 gap-1.5 w-full my-2">
          {REWARDS.map((amount, idx) => {
            const dayNum = idx + 1;
            const isCurrent = dayNum === ((currentStreak % 7) + 1);
            return (
              <div
                key={dayNum}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400 animate-pulse'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <span>J{dayNum}</span>
                <span className="text-[10px] mt-1">{amount} CR</span>
              </div>
            );
          })}
        </div>

        {message && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-amber-300">
            {message}
          </div>
        )}

        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-sm shadow-lg hover:from-amber-400 hover:to-yellow-400 transition"
          >
            {claiming ? 'CHARGEMENT...' : 'RÉCLAMER MA RÉCOMPENSE'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
          >
            FERMER
          </button>
        </div>
      </div>
    </div>
  );
};
