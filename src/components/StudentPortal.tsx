import React, { useState } from 'react';
import { ExercisePage, Submission, User } from '../types';
import { getStoredSubmissions } from '../services/storage';
import {
  Search,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BarChart2,
  Layers,
  GraduationCap,
} from 'lucide-react';

interface StudentPortalProps {
  currentUser: User;
  exercises: ExercisePage[];
  onSelectExercise: (exercise: ExercisePage) => void;
  onGoToTeacherStudio?: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentUser,
  exercises,
  onSelectExercise,
  onGoToTeacherStudio,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const submissions = getStoredSubmissions().filter(
    (s) => s.userId === currentUser.id
  );

  // Group submissions by exerciseId to find best score
  const scoreByExercise: Record<string, number> = {};
  submissions.forEach((s) => {
    if (
      scoreByExercise[s.exerciseId] === undefined ||
      s.score > scoreByExercise[s.exerciseId]
    ) {
      scoreByExercise[s.exerciseId] = s.score;
    }
  });

  // Extract subjects
  const subjects = ['todos', ...Array.from(new Set(exercises.map((e) => e.subject)))];

  // Filter exercises
  const filteredExercises = exercises.filter((ex) => {
    // Only published ones if student
    if (currentUser.role === 'alumno' && !ex.published) return false;

    const matchesSubject =
      selectedSubject === 'todos' || ex.subject === selectedSubject;
    const matchesQuery =
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesQuery;
  });

  const completedCount = Object.keys(scoreByExercise).length;
  const avgScore =
    completedCount > 0
      ? (
          Object.values(scoreByExercise).reduce((a, b) => a + b, 0) /
          completedCount
        ).toFixed(1)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Aula Virtual 2025/2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hola, {currentUser.name}
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-xl">
              {currentUser.role === 'profesor'
                ? 'Panel general de las actividades y páginas interactivas publicadas para tus alumnos.'
                : 'Accede a los ejercicios y páginas asignadas por tu profesor para practicar y evaluar tu aprendizaje.'}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-8">
            <div>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                {exercises.filter((e) => e.published).length}
              </div>
              <div className="text-xs text-slate-500">Ejercicios activos</div>
            </div>

            {currentUser.role === 'alumno' && (
              <>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600">
                    {completedCount}
                  </div>
                  <div className="text-xs text-slate-500">Realizados</div>
                </div>

                {avgScore && (
                  <>
                    <div className="h-8 w-px bg-slate-200" />
                    <div>
                      <div className="text-2xl font-bold font-mono tabular-nums text-indigo-600">
                        {avgScore}
                      </div>
                      <div className="text-xs text-slate-500">Nota media /10</div>
                    </div>
                  </>
                )}
              </>
            )}

            {currentUser.role === 'profesor' && onGoToTeacherStudio && (
              <div>
                <button
                  onClick={onGoToTeacherStudio}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  + Nueva Página / Ejercicio
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Subject Segmented Control */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {sub === 'todos' ? 'Todas las asignaturas' : sub}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar ejercicio..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Exercises Grid */}
      {filteredExercises.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-lg mx-auto">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 mb-1">
            No se encontraron ejercicios
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            No hay ejercicios que coincidan con la búsqueda o el filtro seleccionado.
          </p>
          <button
            onClick={() => {
              setSelectedSubject('todos');
              setSearchQuery('');
            }}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => {
            const hasCompleted = scoreByExercise[exercise.id] !== undefined;
            const bestScore = scoreByExercise[exercise.id];

            return (
              <div
                key={exercise.id}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-medium text-indigo-600">
                      {exercise.subject}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{exercise.level}</span>
                    <span aria-hidden="true">·</span>
                    <span>{exercise.estimatedTimeMin} min</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 leading-snug">
                    {exercise.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {exercise.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div>
                    {hasCompleted ? (
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-semibold text-slate-900">
                          Nota: {bestScore}/10
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">
                        {exercise.type === 'external-html'
                          ? 'Página Interactiva'
                          : 'Pendiente'}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectExercise(exercise)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <span>{hasCompleted ? 'Repasar' : 'Realizar'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
