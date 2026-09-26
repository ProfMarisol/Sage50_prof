import React, { useState, useEffect } from 'react';
import { ExercisePage, Submission, User } from '../types';
import { saveSubmission, getStoredSubmissions } from '../services/storage';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Clock,
  Sparkles,
  Award,
  ExternalLink,
  Info,
} from 'lucide-react';

interface ExercisePlayerProps {
  exercise: ExercisePage;
  currentUser: User;
  onBack: () => void;
}

export const ExercisePlayer: React.FC<ExercisePlayerProps> = ({
  exercise,
  currentUser,
  onBack,
}) => {
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [blankAnswers, setBlankAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [maxScore, setMaxScore] = useState<number>(10);
  const [startTime] = useState<number>(Date.now());
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);

  // Check if student has previous submissions
  const previousSubmissions = getStoredSubmissions().filter(
    (s) => s.exerciseId === exercise.id && s.userId === currentUser.id
  );

  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();

    const questions = exercise.content.questions || [];
    let earnedPoints = 0;
    let totalPossible = 0;

    questions.forEach((q) => {
      totalPossible += q.points;
      if (quizAnswers[q.id] === q.correctIndex) {
        earnedPoints += q.points;
      }
    });

    const calculatedMax = totalPossible > 0 ? totalPossible : 10;
    const normalizedScore = Number(((earnedPoints / calculatedMax) * 10).toFixed(1));
    const elapsed = Math.round((Date.now() - startTime) / 1000);

    setFinalScore(normalizedScore);
    setMaxScore(10);
    setTimeSpentSeconds(elapsed);
    setSubmitted(true);

    const submission: Submission = {
      id: `sub-${Date.now()}`,
      exerciseId: exercise.id,
      exerciseTitle: exercise.title,
      userId: currentUser.id,
      username: currentUser.username,
      studentName: currentUser.name,
      score: normalizedScore,
      maxScore: 10,
      percentage: Math.round((normalizedScore / 10) * 100),
      answers: quizAnswers,
      submittedAt: new Date().toISOString(),
      timeSpentSeconds: elapsed,
    };

    saveSubmission(submission);
  };

  const normalizeString = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const handleSubmitBlanks = (e: React.FormEvent) => {
    e.preventDefault();

    const blanks = exercise.content.blanks || [];
    let earnedPoints = 0;
    let totalPossible = 0;

    blanks.forEach((b) => {
      totalPossible += b.points;
      const studentAns = normalizeString(blankAnswers[b.id] || '');
      const expectedAns = normalizeString(b.blankAnswer);
      if (studentAns === expectedAns) {
        earnedPoints += b.points;
      }
    });

    const calculatedMax = totalPossible > 0 ? totalPossible : 10;
    const normalizedScore = Number(((earnedPoints / calculatedMax) * 10).toFixed(1));
    const elapsed = Math.round((Date.now() - startTime) / 1000);

    setFinalScore(normalizedScore);
    setMaxScore(10);
    setTimeSpentSeconds(elapsed);
    setSubmitted(true);

    const submission: Submission = {
      id: `sub-${Date.now()}`,
      exerciseId: exercise.id,
      exerciseTitle: exercise.title,
      userId: currentUser.id,
      username: currentUser.username,
      studentName: currentUser.name,
      score: normalizedScore,
      maxScore: 10,
      percentage: Math.round((normalizedScore / 10) * 100),
      answers: blankAnswers,
      submittedAt: new Date().toISOString(),
      timeSpentSeconds: elapsed,
    };

    saveSubmission(submission);
  };

  const handleReset = () => {
    setQuizAnswers({});
    setBlankAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Top back navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo de Ejercicios</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{exercise.subject}</span>
          <span aria-hidden="true">·</span>
          <span>{exercise.level}</span>
          <span aria-hidden="true">·</span>
          <span>Aprox. {exercise.estimatedTimeMin} min</span>
        </div>
      </div>

      {/* Main Card Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-6 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          {exercise.title}
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          {exercise.description}
        </p>

        {exercise.content.instructions && (
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2.5">
            <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <span className="font-semibold">Instrucciones del profesor:</span>{' '}
              {exercise.content.instructions}
            </div>
          </div>
        )}

        {previousSubmissions.length > 0 && !submitted && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Ya has realizado este ejercicio {previousSubmissions.length} vez/veces.
            </span>
            <span className="font-semibold text-slate-700">
              Mejor nota obtenida:{' '}
              {Math.max(...previousSubmissions.map((s) => s.score))}/10
            </span>
          </div>
        )}
      </div>

      {/* Result Banner if submitted */}
      {submitted && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${
                  finalScore >= 7
                    ? 'bg-emerald-100 text-emerald-700'
                    : finalScore >= 5
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {finalScore}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {finalScore >= 9
                    ? '¡Excelente trabajo!'
                    : finalScore >= 7
                    ? '¡Muy buen resultado!'
                    : finalScore >= 5
                    ? 'Aprobado, buen esfuerzo.'
                    : 'Necesitas repasar algunos conceptos.'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Puntuación: {finalScore} / {maxScore} ({Math.round((finalScore / maxScore) * 100)}%)
                  · Tiempo empleado: {Math.floor(timeSpentSeconds / 60)}m {timeSpentSeconds % 60}s
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reintentar</span>
              </button>
              <button
                onClick={onBack}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
              >
                Ver otros ejercicios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CASE 1: External Custom HTML Page uploaded by Teacher */}
      {exercise.type === 'external-html' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>Página interactiva del profesor</span>
              <span className="text-[11px] text-slate-400">Ejecución aislada y segura</span>
            </div>
            <div className="w-full bg-slate-900 min-h-[380px] p-1">
              <iframe
                title={exercise.title}
                srcDoc={exercise.content.htmlCode}
                className="w-full h-[460px] border-0 rounded-lg bg-white"
                sandbox="allow-scripts"
              />
            </div>
          </div>

          {/* Accompanying questions or completion form */}
          {exercise.content.questions && exercise.content.questions.length > 0 && (
            <form onSubmit={handleSubmitQuiz} className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Preguntas de comprensión sobre el simulador
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Usa el simulador superior para responder las siguientes preguntas.
                </p>

                <div className="space-y-6">
                  {exercise.content.questions.map((q, idx) => {
                    const isSelected = quizAnswers[q.id] !== undefined;
                    const isCorrect = isSelected && quizAnswers[q.id] === q.correctIndex;

                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-xl border transition-colors ${
                          submitted
                            ? isCorrect
                              ? 'border-emerald-200 bg-emerald-50/30'
                              : 'border-rose-200 bg-rose-50/30'
                            : 'border-slate-200 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span className="font-semibold text-sm text-slate-900">
                            {idx + 1}. {q.prompt}
                          </span>
                          <span className="text-xs font-mono text-slate-400 shrink-0">
                            {q.points} pts
                          </span>
                        </div>

                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const checked = quizAnswers[q.id] === optIdx;
                            return (
                              <label
                                key={optIdx}
                                className={`flex items-center gap-3 p-2.5 rounded-lg border text-sm cursor-pointer transition-colors ${
                                  checked
                                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-medium'
                                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                                } ${submitted ? 'pointer-events-none' : ''}`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  value={optIdx}
                                  checked={checked}
                                  disabled={submitted}
                                  onChange={() =>
                                    setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                                  }
                                  className="text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>{opt}</span>
                              </label>
                            );
                          })}
                        </div>

                        {submitted && (
                          <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-700">
                            <span className="font-semibold">Explicación:</span> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!submitted && (
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      Enviar respuestas y calificar
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      )}

      {/* CASE 2: Quiz / Test Form */}
      {exercise.type === 'quiz' && (
        <form onSubmit={handleSubmitQuiz} className="space-y-4">
          {exercise.content.questions?.map((q, idx) => {
            const isAnswered = quizAnswers[q.id] !== undefined;
            const isCorrect = isAnswered && quizAnswers[q.id] === q.correctIndex;

            return (
              <div
                key={q.id}
                className={`bg-white border rounded-xl p-5 sm:p-6 shadow-xs transition-colors ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-300'
                      : 'border-rose-300'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <h3 className="font-semibold text-sm sm:text-base text-slate-900 leading-snug">
                      {q.prompt}
                    </h3>
                  </div>

                  <span className="text-xs font-mono text-slate-400 shrink-0">
                    {q.points} pts
                  </span>
                </div>

                <div className="space-y-2.5 pl-8">
                  {q.options.map((option, optIdx) => {
                    const isSelected = quizAnswers[q.id] === optIdx;
                    const isThisCorrect = optIdx === q.correctIndex;

                    let optionStyle =
                      'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';

                    if (submitted) {
                      if (isThisCorrect) {
                        optionStyle =
                          'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium';
                      } else if (isSelected && !isThisCorrect) {
                        optionStyle =
                          'border-rose-400 bg-rose-50 text-rose-900 line-through';
                      }
                    } else if (isSelected) {
                      optionStyle =
                        'border-indigo-600 bg-indigo-50/60 text-indigo-950 font-medium';
                    }

                    return (
                      <label
                        key={optIdx}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-sm cursor-pointer transition-colors ${optionStyle} ${
                          submitted ? 'pointer-events-none' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={`quiz-${q.id}`}
                          value={optIdx}
                          checked={isSelected}
                          disabled={submitted}
                          onChange={() =>
                            setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                          }
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="flex-1">{option}</span>
                        {submitted && isThisCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {submitted && isSelected && !isThisCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </label>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-4 pt-3.5 pl-8 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-600">
                    <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">Solución: </strong>
                      {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {!submitted && (
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Corregir y enviar ejercicio
              </button>
            </div>
          )}
        </form>
      )}

      {/* CASE 3: Fill-in-the-blank Exercise */}
      {exercise.type === 'fill-blank' && (
        <form onSubmit={handleSubmitBlanks} className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
              Completa los espacios con la palabra o término adecuado
            </h3>

            {exercise.content.blanks?.map((b, idx) => {
              const currentInput = blankAnswers[b.id] || '';
              const isMatch =
                normalizeString(currentInput) === normalizeString(b.blankAnswer);

              return (
                <div
                  key={b.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    submitted
                      ? isMatch
                        ? 'border-emerald-300 bg-emerald-50/30'
                        : 'border-rose-300 bg-rose-50/30'
                      : 'border-slate-200 bg-slate-50/30'
                  }`}
                >
                  <div className="text-sm text-slate-800 leading-loose">
                    <span className="font-semibold text-indigo-600 mr-2">
                      {idx + 1}.
                    </span>
                    <span>{b.sentenceBefore}</span>
                    <input
                      type="text"
                      disabled={submitted}
                      value={currentInput}
                      onChange={(e) =>
                        setBlankAnswers((prev) => ({
                          ...prev,
                          [b.id]: e.target.value,
                        }))
                      }
                      placeholder="..."
                      className={`inline-block mx-2 px-3 py-1 text-sm font-semibold rounded-md border text-center transition-colors ${
                        submitted
                          ? isMatch
                            ? 'border-emerald-500 bg-emerald-100 text-emerald-900'
                            : 'border-rose-500 bg-rose-100 text-rose-900'
                          : 'border-slate-300 bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
                      }`}
                      style={{ minWidth: '140px' }}
                    />
                    <span>{b.sentenceAfter}</span>
                  </div>

                  {b.hint && !submitted && (
                    <div className="mt-2 text-xs text-slate-500 italic">
                      Pista: {b.hint}
                    </div>
                  )}

                  {submitted && !isMatch && (
                    <div className="mt-2 text-xs text-rose-700">
                      Respuesta esperada: <strong>{b.blankAnswer}</strong>
                    </div>
                  )}
                </div>
              );
            })}

            {!submitted && (
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Comprobar respuestas
                </button>
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
