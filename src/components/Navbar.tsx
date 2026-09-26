import React from 'react';
import { User } from '../types';
import { LogOut, BookOpen, PlusCircle, Compass, HelpCircle } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  currentView: 'portal' | 'studio' | 'exercise';
  onNavigate: (view: 'portal' | 'studio') => void;
  onOpenGitHubHelp: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenGitHubHelp,
  onLogout,
}) => {
  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('portal')}
          className="text-left group cursor-pointer focus:outline-hidden"
        >
          <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
            AulaVirtual
          </span>
        </button>

        {/* Zone 2: 3-5 clean text navigation links */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onNavigate('portal')}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentView === 'portal'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1 -mb-1'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Ejercicios</span>
          </button>

          {currentUser.role === 'profesor' && (
            <button
              onClick={() => onNavigate('studio')}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentView === 'studio'
                  ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1 -mb-1'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Gestor del Profesor</span>
            </button>
          )}

          <button
            onClick={onOpenGitHubHelp}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Cómo publicar en GitHub Pages"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Guía GitHub Pages</span>
          </button>
        </nav>

        {/* Zone 3: User profile & primary action */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-slate-900 truncate max-w-40">
              {currentUser.name}
            </div>
            <div className="text-xs text-slate-500 capitalize">
              {currentUser.role === 'profesor' ? 'Profesor Docente' : 'Alumno'}
            </div>
          </div>

          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${
              currentUser.avatarColor || 'bg-indigo-600'
            }`}
          >
            {currentUser.name.charAt(0)}
          </div>

          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
