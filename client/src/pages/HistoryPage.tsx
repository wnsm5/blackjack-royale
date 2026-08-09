import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { History, ChevronDown, ChevronUp } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/game')
      .then(res => setGames(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <span className="text-sm font-bold text-slate-400 animate-pulse">Chargement de l'historique...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-24 md:pb-8 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <History size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-100">Historique des Parties</h2>
            <p className="text-xs text-slate-400">Revoir toutes vos mains passées</p>
          </div>
        </div>

        {/* History List */}
        {games.length === 0 ? (
          <div className="text-center p-8 bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 text-sm">
            Aucune partie jouée pour le moment.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {games.map((g) => {
              const isWin = g.result === 'WIN' || g.result === 'BLACKJACK';
              const isLoss = g.result === 'LOSS';
              const isExpanded = expandedId === g.id;
              const dateStr = new Date(g.createdAt).toLocaleString('fr-FR', {
                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
              });

              return (
                <div
                  key={g.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 transition hover:border-slate-700"
                >
                  <div
                    onClick={() => toggleExpand(g.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase ${
                        isWin ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        isLoss ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {g.result || 'TERMINÉ'}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-300 block">{dateStr}</span>
                        <span className="text-[11px] text-slate-500">Mise: {g.bet} CR</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`font-black text-sm ${g.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {g.netProfit >= 0 ? `+${g.netProfit}` : g.netProfit} CR
                      </span>
                      {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2 text-xs text-slate-300">
                      <div>
                        <span className="text-slate-500 block font-semibold mb-1">Croupier ({g.dealerScore} pts) :</span>
                        <span className="font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800 block">
                          {g.dealerCards}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-semibold mb-1">Actions effectuées :</span>
                        <div className="flex flex-wrap gap-1">
                          {g.actions?.map((act: any, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-bold text-amber-400">
                              {act.type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
