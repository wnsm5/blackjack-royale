import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Statistics } from '../types';
import { BarChart2, Zap, Target, Shield, Activity } from 'lucide-react';

export const StatsPage: React.FC = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <span className="text-sm font-bold text-slate-400 animate-pulse">Chargement des statistiques...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 text-center text-slate-400">
        Aucune donnée statistique disponible.
      </div>
    );
  }

  const hits = stats.hitsCount || 0;
  const stands = stats.standsCount || 0;
  const doubles = stats.doublesCount || 0;
  const splits = stats.splitsCount || 0;
  const totalDecisions = hits + stands + doubles + splits;

  const getPercent = (count: number) => {
    if (totalDecisions === 0) return 0;
    return Math.round((count / totalDecisions) * 100);
  };

  const decisionsList = [
    { label: 'Tirer (Hit)', count: hits, color: 'bg-sky-500', textColor: 'text-sky-400', borderColor: 'border-sky-500/30' },
    { label: 'Rester (Stand)', count: stands, color: 'bg-emerald-500', textColor: 'text-emerald-400', borderColor: 'border-emerald-500/30' },
    { label: 'Doubler (Double)', count: doubles, color: 'bg-amber-500', textColor: 'text-amber-400', borderColor: 'border-amber-500/30' },
    { label: 'Séparer (Split)', count: splits, color: 'bg-indigo-500', textColor: 'text-indigo-400', borderColor: 'border-indigo-500/30' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-24 md:pb-8 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <BarChart2 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-100">Statistiques Détaillées</h2>
            <p className="text-xs text-slate-400">Analyse de vos performances sur la table</p>
          </div>
        </div>

        {/* Top KPIs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Parties Jouées</span>
            <span className="text-2xl font-black text-slate-100 mt-1">{stats.gamesPlayed}</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Taux de Victoire</span>
            <span className="text-2xl font-black text-emerald-400 mt-1">{stats.winRate}%</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Blackjacks</span>
            <span className="text-2xl font-black text-amber-400 mt-1">{stats.blackjacks}</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Profit Net</span>
            <span className={`text-2xl font-black mt-1 ${stats.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stats.netProfit >= 0 ? `+${stats.netProfit}` : stats.netProfit} CR
            </span>
          </div>
        </div>

        {/* Results Breakdown */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Répartition des Résultats</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/20">
              <span className="text-xs text-slate-400 block">Victoires</span>
              <span className="text-lg font-black text-emerald-400">{stats.wins}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-rose-500/20">
              <span className="text-xs text-slate-400 block">Défaites</span>
              <span className="text-lg font-black text-rose-400">{stats.losses}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/20">
              <span className="text-xs text-slate-400 block">Égalités</span>
              <span className="text-lg font-black text-amber-400">{stats.pushes}</span>
            </div>
          </div>
        </div>

        {/* Financial Records */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Records Financiers</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">Plus grosse mise</span>
              <span className="font-extrabold text-amber-400 text-sm mt-0.5 block">{stats.biggestBet} CR</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">Plus gros gain</span>
              <span className="font-extrabold text-emerald-400 text-sm mt-0.5 block">+{stats.biggestWin} CR</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">Plus grosse perte</span>
              <span className="font-extrabold text-rose-400 text-sm mt-0.5 block">-{stats.biggestLoss} CR</span>
            </div>
          </div>
        </div>

        {/* Histogramme des Décisions */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-amber-400" />
              Histogramme des Décisions
            </h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
              Total : {totalDecisions}
            </span>
          </div>

          {/* Visual Progress Bar Breakdown */}
          {totalDecisions > 0 && (
            <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden flex gap-0.5 p-0.5 border border-slate-800">
              {decisionsList.map((item, idx) => {
                const pct = getPercent(item.count);
                if (pct === 0) return null;
                return (
                  <div
                    key={idx}
                    className={`h-full ${item.color} rounded-sm transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                    title={`${item.label}: ${item.count} (${pct}%)`}
                  />
                );
              })}
            </div>
          )}

          {/* Detailed Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {decisionsList.map((item, idx) => {
              const pct = getPercent(item.count);
              return (
                <div key={idx} className={`bg-slate-950 p-3 rounded-xl border ${item.borderColor} flex flex-col gap-1`}>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">{item.label}</span>
                    <span className={`font-black text-[11px] ${item.textColor}`}>{pct}%</span>
                  </div>
                  <span className={`text-xl font-black ${item.textColor}`}>{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
