import React, { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { LogIn, UserPlus, Play } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, register, loginAsGuest, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'login') {
      await login(email, password);
    } else {
      await register(username, email, password);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background felt radial gradient glow */}
      <div className="absolute w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 mx-auto flex items-center justify-center text-slate-950 font-black text-3xl shadow-xl mb-3">
            ♠
          </div>
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
            Blackjack Royale
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Casino virtuel Web & Mobile PWA
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-2xl mb-6 border border-slate-800">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition ${
              tab === 'login'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Se Connecter
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition ${
              tab === 'register'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Créer un Compte
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Pseudo</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: Ewen"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {tab === 'login' ? 'Email ou Pseudo' : 'Email'}
            </label>
            <input
              type={tab === 'login' ? 'text' : 'email'}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={tab === 'login' ? 'ewen@example.com ou Ewen' : 'ewen@example.com'}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-base shadow-xl hover:from-amber-400 hover:to-yellow-400 active:scale-98 transition mt-2 flex items-center justify-center gap-2"
          >
            {tab === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
            {tab === 'login' ? 'SE CONNECTER' : 'S\'INSCRIRE'}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
          <span className="relative px-3 bg-slate-900 text-xs font-bold text-slate-500 uppercase">Ou</span>
        </div>

        <button
          onClick={() => loginAsGuest()}
          disabled={isLoading}
          className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition border border-slate-700/80 flex items-center justify-center gap-2"
        >
          <Play size={16} fill="currentColor" />
          JOUER EN TANT QUE INVITÉ (Accès immédiat)
        </button>
      </div>
    </div>
  );
};
