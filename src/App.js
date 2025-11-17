import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthScreen from './components/auth/AuthScreen';
import Navigation from './components/common/Navigation';
import WordListsView from './components/lists/WordListsView';
import QuizView from './components/quiz/QuizView';
import OCRView from './components/ocr/OCRView';
import StatsView from './components/stats/StatsView';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="flex-1 max-w-7xl mx-auto w-full p-4">
        <Routes>
          <Route path="/lists" element={<WordListsView />} />
          <Route path="/quiz" element={<QuizView />} />
          <Route path="/ocr" element={<OCRView />} />
          <Route path="/stats" element={<StatsView />} />
          <Route path="*" element={<Navigate to="/lists" replace />} />
        </Routes>
      </main>
      <footer className="text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} Kobun Vocabulary Learner
      </footer>
    </div>
  );
}

function App() {
  // Remove hardcoded token setting - let authentication handle it

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthScreen />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <AppShell />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
