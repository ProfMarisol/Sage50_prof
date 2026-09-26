import React, { useState, useEffect } from 'react';
import { User, ExercisePage } from './types';
import {
  getActiveSession,
  setActiveSession,
  getStoredExercises,
} from './services/storage';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { StudentPortal } from './components/StudentPortal';
import { ExercisePlayer } from './components/ExercisePlayer';
import { TeacherStudio } from './components/TeacherStudio';
import { GitHubPagesModal } from './components/GitHubPagesModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getActiveSession());
  const [currentView, setCurrentView] = useState<'portal' | 'studio' | 'exercise'>('portal');
  const [selectedExercise, setSelectedExercise] = useState<ExercisePage | null>(null);
  const [exercises, setExercises] = useState<ExercisePage[]>(() => getStoredExercises());
  const [showGitHubModal, setShowGitHubModal] = useState<boolean>(false);

  useEffect(() => {
    setExercises(getStoredExercises());
  }, []);

  const handleLoginSuccess = (user: User) => {
    setActiveSession(user);
    setCurrentUser(user);
    setCurrentView('portal');
  };

  const handleLogout = () => {
    setActiveSession(null);
    setCurrentUser(null);
    setSelectedExercise(null);
    setCurrentView('portal');
  };

  const handleSelectExercise = (exercise: ExercisePage) => {
    setSelectedExercise(exercise);
    setCurrentView('exercise');
  };

  const handleBackFromExercise = () => {
    setSelectedExercise(null);
    setCurrentView('portal');
  };

  const handleRefreshExercises = () => {
    setExercises(getStoredExercises());
  };

  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={(view) => {
          setSelectedExercise(null);
          setCurrentView(view);
        }}
        onOpenGitHubHelp={() => setShowGitHubModal(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {currentView === 'portal' && (
          <StudentPortal
            currentUser={currentUser}
            exercises={exercises}
            onSelectExercise={handleSelectExercise}
            onGoToTeacherStudio={
              currentUser.role === 'profesor'
                ? () => setCurrentView('studio')
                : undefined
            }
          />
        )}

        {currentView === 'studio' && currentUser.role === 'profesor' && (
          <TeacherStudio
            currentUser={currentUser}
            exercises={exercises}
            onRefreshExercises={handleRefreshExercises}
            onPreviewExercise={(ex) => {
              setSelectedExercise(ex);
              setCurrentView('exercise');
            }}
          />
        )}

        {currentView === 'exercise' && selectedExercise && (
          <ExercisePlayer
            exercise={selectedExercise}
            currentUser={currentUser}
            onBack={handleBackFromExercise}
          />
        )}
      </main>

      <footer className="py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AulaVirtual © 2026 — Plataforma Educativa Autónoma</span>
          <button
            onClick={() => setShowGitHubModal(true)}
            className="text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
          >
            Preparado para GitHub Pages
          </button>
        </div>
      </footer>

      <GitHubPagesModal
        isOpen={showGitHubModal}
        onClose={() => setShowGitHubModal(false)}
      />
    </div>
  );
}
