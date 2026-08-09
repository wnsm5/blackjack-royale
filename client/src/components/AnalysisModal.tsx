import React from 'react';
import { useGameStore } from '../stores/useGameStore';
import { X, CheckCircle, AlertTriangle, Brain, Info } from 'lucide-react';

const ACTION_LABELS: Record<string, string> = {
  HIT: 'TIRER',
  STAND: 'RESTER',
  DOUBLE: 'DOUBLER',
  SPLIT: 'SÉPARER',
  SURRENDER: 'ABANDONNER',
};

export const AnalysisModal: React.FC = () => {
  const { isAnalysisModalOpen, activeAnalysis, closeAnalysis } = useGameStore();

  if (!isAnalysisModalOpen) return null;

  const analysis = activeAnalysis || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 max-h-[88vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <h3 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <Brain size={22} className="text-amber-400" />
            Analyse Stratégique
          </h3>
          <button
            onClick={closeAnalysis}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <X size={20} />
          </button>
        </div>

        {analysis.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
            <Info size={40} className="text-slate-600" />
            <p className="text-sm font-semibold text-center">
              Aucune décision enregistrée pour cette main.<br />
              <span className="text-xs text-slate-500">Les décisions sont analysées lors des actions Hit, Stand, Double, Split et Surrender.</span>
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {analysis.map((item: any, idx: number) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  item.isOptimal
                    ? 'bg-emerald-950/40 border-emerald-500/40'
                    : 'bg-amber-950/40 border-amber-500/40'
                }`}
              >
                {/* Decision header */}
                <div className="flex items-center gap-2 font-bold mb-3">
                  {item.isOptimal ? (
                    <CheckCircle size={20} className="text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle size={20} className="text-amber-400 shrink-0" />
                  )}
                  <span className={`text-sm ${item.isOptimal ? 'text-emerald-300' : 'text-amber-300'}`}>
                    {item.isOptimal ? 'Décision Optimale' : 'Décision Sous-Optimale'} — Action #{idx + 1}
                  </span>
                </div>

                {/* Situation grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl mb-3 border border-slate-800/60">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Votre main :</span>
                    <span className="font-bold text-slate-100 text-sm">
                      {item.playerScore}{item.isSoft ? ' (Soft)' : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Croupier montre :</span>
                    <span className="font-bold text-slate-100 text-sm">{item.dealerUpcardValue}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Votre choix :</span>
                    <span className={`font-black text-sm px-2 py-0.5 rounded-lg ${
                      item.isOptimal ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {ACTION_LABELS[item.actualAction] || item.actualAction}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Recommandé :</span>
                    <span className="font-black text-sm px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                      {ACTION_LABELS[item.recommendedAction] || item.recommendedAction}
                    </span>
                  </div>
                </div>

                {/* Explanation */}
                <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-1 text-xs text-slate-500 border-t border-slate-800">
          <span>{analysis.length} décision{analysis.length !== 1 ? 's' : ''} analysée{analysis.length !== 1 ? 's' : ''}</span>
          <span className="text-emerald-500 font-semibold">
            {analysis.filter((a: any) => a.isOptimal).length}/{analysis.length} optimales
          </span>
        </div>

        <button
          onClick={closeAnalysis}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition"
        >
          FERMER
        </button>
      </div>
    </div>
  );
};
