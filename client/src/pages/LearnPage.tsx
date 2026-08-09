import React, { useState } from 'react';
import { GraduationCap, BookOpen, HelpCircle, Check, X, ShieldAlert } from 'lucide-react';

interface QuizQuestion {
  id: number;
  playerHand: string;
  dealerUpcard: string;
  options: ('HIT' | 'STAND' | 'DOUBLE' | 'SPLIT' | 'SURRENDER')[];
  correct: 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT' | 'SURRENDER';
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    playerHand: '16 (Hard 16)',
    dealerUpcard: '10',
    options: ['HIT', 'STAND', 'SURRENDER'],
    correct: 'HIT',
    explanation: 'Face à un 10 du croupier, un 16 possède une espérance négative. Cependant, tirer (HIT) ou abandonner (SURRENDER) est statistiquement supérieur à rester (STAND). En absence de surrender, la décision mathématique reste HIT.',
  },
  {
    id: 2,
    playerHand: 'As + 7 (Soft 18)',
    dealerUpcard: '6',
    options: ['HIT', 'STAND', 'DOUBLE'],
    correct: 'DOUBLE',
    explanation: 'Le 6 du croupier est sa pire carte possible. Doubler avec un Soft 18 vous permet de maximiser votre gain car le croupier risque fortement de dépasser 21 (Bust).',
  },
  {
    id: 3,
    playerHand: '8 + 8 (Paire d\'As ou de 8)',
    dealerUpcard: '10',
    options: ['HIT', 'STAND', 'SPLIT'],
    correct: 'SPLIT',
    explanation: '16 est la pire main du jeu. Séparer une paire de 8 (SPLIT) permet de transformer une mauvaise main unique de 16 en deux mains de départ indépendantes de 8.',
  },
  {
    id: 4,
    playerHand: '11',
    dealerUpcard: '5',
    options: ['HIT', 'STAND', 'DOUBLE'],
    correct: 'DOUBLE',
    explanation: 'Un total initial de 11 face à une carte faible (5) est la meilleure opportunité du jeu pour DOUBLER sa mise.',
  },
];

export const LearnPage: React.FC = () => {
  const [tab, setTab] = useState<'rules' | 'quiz'>('rules');
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const q = QUIZ_QUESTIONS[currentQuizIdx];

  const handleAnswer = (ans: string) => {
    setSelectedAnswer(ans);
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setCurrentQuizIdx((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-24 md:pb-8 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <GraduationCap size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-100">Académie du Blackjack</h2>
            <p className="text-xs text-slate-400">Apprenez les règles et perfectionnez votre stratégie de base</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setTab('rules')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
              tab === 'rules' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen size={16} />
            GUIDE ET RÈGLES
          </button>
          <button
            onClick={() => setTab('quiz')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
              tab === 'quiz' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle size={16} />
            QUIZ INTERACTIF
          </button>
        </div>

        {tab === 'rules' ? (
          <div className="flex flex-col gap-4 text-xs sm:text-sm text-slate-300">
            
            {/* Card Values */}
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 flex flex-col gap-2">
              <h3 className="text-base font-bold text-amber-400">1. Valeur des Cartes</h3>
              <p className="leading-relaxed text-slate-400">
                • <strong>2 à 10 :</strong> valeur nominale.<br />
                • <strong>Valet, Dame, Roi :</strong> valent 10.<br />
                • <strong>As :</strong> vaut 1 ou 11 (selon ce qui est le plus avantageux sans dépasser 21).
              </p>
            </div>

            {/* Natural BJ */}
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 flex flex-col gap-2">
              <h3 className="text-base font-bold text-amber-400">2. Natural Blackjack</h3>
              <p className="leading-relaxed text-slate-400">
                Un Blackjack naturel est exclusivement composé d'un <strong>As + une carte valant 10</strong> (10, J, Q, K) reçues dès la distribution initiale de deux cartes.<br />
                Un Blackjack est payé <strong>3:2</strong> (1,5 fois la mise).
              </p>
            </div>

            {/* Rules of the Dealer */}
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 flex flex-col gap-2">
              <h3 className="text-base font-bold text-amber-400">3. Règle du Croupier</h3>
              <p className="leading-relaxed text-slate-400">
                Le croupier doit obligatoirement :<br />
                • <strong>Tirer (HIT)</strong> avec un total de 16 ou moins.<br />
                • <strong>Rester (STAND)</strong> avec un total de 17 ou plus (y compris Soft 17 : As + 6).
              </p>
            </div>

            {/* Player Actions */}
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 flex flex-col gap-2">
              <h3 className="text-base font-bold text-amber-400">4. Actions du Joueur</h3>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                <li><strong>Hit (Tirer) :</strong> demander une carte supplémentaire.</li>
                <li><strong>Stand (Rester) :</strong> conserver sa main actuelle et terminer son tour.</li>
                <li><strong>Double Down (Doubler) :</strong> doubler la mise pour recevoir exactement une seule carte supplémentaire.</li>
                <li><strong>Split (Séparer) :</strong> diviser une paire de cartes identiques en deux mains séparées.</li>
                <li><strong>Late Surrender (Abandon) :</strong> abandonner la main initiale pour récupérer 50% de sa mise.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col gap-5">
            <div className="flex justify-between items-center text-xs font-bold text-indigo-400">
              <span>Question #{currentQuizIdx + 1} / {QUIZ_QUESTIONS.length}</span>
              <span>Scénario de Stratégie</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center flex flex-col gap-2">
              <div className="text-xs text-slate-400">Vous possédez :</div>
              <div className="text-2xl font-black text-amber-400">{q.playerHand}</div>
              <div className="text-xs text-slate-400 mt-2">Le Croupier montre :</div>
              <div className="text-xl font-bold text-slate-100">{q.dealerUpcard}</div>
            </div>

            <div className="text-xs font-bold text-slate-300 text-center">Que devez-vous faire ?</div>

            {/* Options */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={selectedAnswer !== null}
                  className={`py-3 rounded-xl font-black text-xs transition ${
                    selectedAnswer === opt
                      ? opt === q.correct
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-rose-600 text-white'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Feedback */}
            {selectedAnswer && (
              <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                selectedAnswer === q.correct
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}>
                <div className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                  {selectedAnswer === q.correct ? (
                    <>
                      <Check size={18} className="text-emerald-400" />
                      Excellente réponse !
                    </>
                  ) : (
                    <>
                      <X size={18} className="text-rose-400" />
                      Réponse recommandée : {q.correct}
                    </>
                  )}
                </div>
                {q.explanation}
              </div>
            )}

            {selectedAnswer && (
              <button
                onClick={handleNextQuiz}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition mt-2"
              >
                QUESTION SUIVANTE
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
