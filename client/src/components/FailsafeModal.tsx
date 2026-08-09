import React, { useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../stores/useAuthStore';
import { LifeBuoy } from 'lucide-react';

interface FailsafeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FailsafeModal: React.FC<FailsafeModalProps> = ({ isOpen, onClose }) => {
  const { fetchProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFailsafe = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/profile/failsafe-reward');
      await fetchProfile();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du secours bankroll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border-2 border-rose-400 flex items-center justify-center">
          <LifeBuoy size={32} />
        </div>

        <h3 className="text-xl font-black text-slate-100 uppercase tracking-tight">
          Votre Bankroll est à 0 !
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Pas de panique ! Récupérez immédiatement 1 000 crédits virtuels gratuits pour vous remettre en jeu.
        </p>

        {error && (
          <p className="text-xs font-bold text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-800">
            {error}
          </p>
        )}

        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={handleFailsafe}
            disabled={loading}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-lg hover:from-emerald-400 transition"
          >
            {loading ? 'CHARGEMENT...' : 'RECEVOIR 1 000 CRÉDITS'}
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
