import React from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useAuthStore } from '../stores/useAuthStore';
import { Settings, Volume2, Music, Sparkles, Smartphone, Lightbulb, LogOut } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    sound,
    music,
    animations,
    vibrations,
    showHints,
    toggleSound,
    toggleMusic,
    toggleAnimations,
    toggleVibrations,
    toggleHints,
  } = useSettingsStore();

  const { logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-24 md:pb-8 flex flex-col items-center">
      <div className="w-full max-w-xl flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-800 text-slate-300 border border-slate-700">
            <Settings size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-100">Paramètres</h2>
            <p className="text-xs text-slate-400">Personnalisez votre expérience de jeu</p>
          </div>
        </div>

        {/* Toggles */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col gap-4">
          {/* Sound */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 size={20} className="text-amber-400" />
              <div>
                <span className="text-sm font-bold text-slate-100 block">Effets Sonores</span>
                <span className="text-xs text-slate-400">Sons de cartes et jetons</span>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`w-12 h-6 rounded-full transition-colors p-1 ${
                sound ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                  sound ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          <div className="h-px bg-slate-800"></div>

          {/* Music */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music size={20} className="text-indigo-400" />
              <div>
                <span className="text-sm font-bold text-slate-100 block">Musique de Fond</span>
                <span className="text-xs text-slate-400">Ambiance casino lounge</span>
              </div>
            </div>
            <button
              onClick={toggleMusic}
              className={`w-12 h-6 rounded-full transition-colors p-1 ${
                music ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                  music ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          <div className="h-px bg-slate-800"></div>

          {/* Animations */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-emerald-400" />
              <div>
                <span className="text-sm font-bold text-slate-100 block">Animations Visuelles</span>
                <span className="text-xs text-slate-400">Retournement et distributions animées</span>
              </div>
            </div>
            <button
              onClick={toggleAnimations}
              className={`w-12 h-6 rounded-full transition-colors p-1 ${
                animations ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                  animations ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          <div className="h-px bg-slate-800"></div>

          {/* Vibrations */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone size={20} className="text-rose-400" />
              <div>
                <span className="text-sm font-bold text-slate-100 block">Vibrations Tactiles</span>
                <span className="text-xs text-slate-400">Retours haptiques sur mobile</span>
              </div>
            </div>
            <button
              onClick={toggleVibrations}
              className={`w-12 h-6 rounded-full transition-colors p-1 ${
                vibrations ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                  vibrations ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          <div className="h-px bg-slate-800"></div>

          {/* Hints */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lightbulb size={20} className="text-yellow-400" />
              <div>
                <span className="text-sm font-bold text-slate-100 block">Afficher les Conseil</span>
                <span className="text-xs text-slate-400">Recommandations en cours de jeu</span>
              </div>
            </div>
            <button
              onClick={toggleHints}
              className={`w-12 h-6 rounded-full transition-colors p-1 ${
                showHints ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                  showHints ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full py-4 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-bold text-sm border border-rose-800/60 transition flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          SE DÉCONNECTER DU COMPTE
        </button>
      </div>
    </div>
  );
};
