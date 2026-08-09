import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { AuthPage } from './pages/AuthPage';
import { TablePage } from './pages/TablePage';
import { ProfilePage } from './pages/ProfilePage';
import { StatsPage } from './pages/StatsPage';
import { HistoryPage } from './pages/HistoryPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { LearnPage } from './pages/LearnPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const { token, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token, fetchProfile]);

  if (!token) {
    return <AuthPage />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
        <Navbar />

        <div className="flex-1 flex w-full">
          <Sidebar />

          <main className="flex-1 w-full overflow-y-auto">
            <Routes>
              <Route path="/" element={<TablePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        <BottomNav />
      </div>
    </Router>
  );
};

export default App;
