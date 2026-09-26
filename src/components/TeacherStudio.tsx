import React, { useState } from 'react';
import { ExercisePage, ExerciseType, Submission, User } from '../types';
import {
  saveExercise,
  deleteExercise,
  saveUser,
  deleteUser,
  getStoredUsers,
  getStoredSubmissions,
  exportFullDataBackup,
} from '../services/storage';
import {
  Plus,
  Trash2,
  Edit3,
  Eye,
  CheckCircle,
  FileCode,
  Users,
  BookOpen,
  Award,
  Upload,
  Download,
  AlertCircle,
  Play,
  KeyRound,
  Code,
} from 'lucide-react';

interface TeacherStudioProps {
  currentUser: User;
  exercises: ExercisePage[];
  onRefreshExercises: () => void;
  onPreviewExercise: (ex: ExercisePage) => void;
}

export const TeacherStudio: React.FC<TeacherStudioProps> = ({
  currentUser,
  exercises,
  onRefreshExercises,
  onPreviewExercise,
}) => {
  const [activeTab, setActiveTab] = useState<'pages' | 'creator' | 'students' | 'grades'>('pages');

  // Creator state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSubject, setNewSubject] = useState('Matemáticas');
  const [newLevel, setNewLevel] = useState('1º ESO');
  const [newType, setNewType] = useState<ExerciseType>('quiz');
  const [newTimeMin, setNewTimeMin] = useState<number>(15);
  const [newHtmlCode, setNewHtmlCode] = useState<string>(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: sans-serif; padding: 20px; background: #f8fafc; }
    .box { background: white; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; }
    h2 { color: #1e293b; margin-top: 0; }
  </style>
</head>
<body>
  <div class="box">
    <h2>Mi Actividad Personalizada</h2>
    <p>Escribe aquí tu contenido HTML, CSS y JavaScript para tus alumnos.</p>
  </div>
</body>
</html>`);
  const [newInstructions, setNewInstructions] = useState('');

  // Questions builder for quiz
  const [questions, setQuestions] = useState<
    Array<{
      prompt: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }>
  >([
    {
      prompt: '¿Cuál es el planeta más cercano al Sol?',
      options: ['Mercurio', 'Venus', 'Tierra', 'Marte'],
      correctIndex: 0,
      explanation: 'Mercurio es el planeta más próximo al Sol en el Sistema Solar.',
    },
  ]);

  // Students state
  const [usersList, setUsersList] = useState<User[]>(getStoredUsers());
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentUsername, setNewStudentUsername] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('1º ESO');
  const [studentError, setStudentError] = useState<string | null>(null);

  // Submissions
  const submissions: Submission[] = getStoredSubmissions();

  // Create new page/exercise handler
  const handleSaveNewExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEx: ExercisePage = {
      id: `ex-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim() || 'Actividad creada por el docente.',
      subject: newSubject.trim() || 'General',
      level: newLevel.trim() || 'General',
      type: newType,
      published: true,
      authorName: currentUser.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      maxScore: 10,
      estimatedTimeMin: newTimeMin || 15,
      content: {
        instructions: newInstructions.trim() || undefined,
        htmlCode: newType === 'external-html' ? newHtmlCode : undefined,
        questions:
          newType === 'quiz' || newType === 'external-html'
            ? questions.map((q, i) => ({
                id: `q-${i + 1}`,
                prompt: q.prompt,
                options: q.options,
                correctIndex: q.correctIndex,
                explanation: q.explanation,
                points: Number((10 / questions.length).toFixed(1)),
              }))
            : undefined,
      },
    };

    saveExercise(newEx);
    onRefreshExercises();
    setActiveTab('pages');

    // Reset form
    setNewTitle('');
    setNewDescription('');
    setNewInstructions('');
  };

  // Add question to quiz
  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        prompt: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        explanation: '',
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  // Delete exercise
  const handleDeleteEx = (id: string) => {
    if (confirm('¿Seguro que deseas eliminar este ejercicio?')) {
      deleteExercise(id);
      onRefreshExercises();
    }
  };

  // Add student
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError(null);

    const cleanUser = newStudentUsername.trim().toLowerCase();
    if (!cleanUser || !newStudentPassword || !newStudentName.trim()) {
      setStudentError('Todos los campos son obligatorios.');
      return;
    }

    if (usersList.some((u) => u.username.toLowerCase() === cleanUser)) {
      setStudentError('Ese nombre de usuario ya existe. Elige otro.');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      username: cleanUser,
      password: newStudentPassword,
      name: newStudentName.trim(),
      role: 'alumno',
      gradeLevel: newStudentGrade,
      avatarColor: 'bg-indigo-600',
      createdAt: new Date().toISOString(),
    };

    saveUser(newUser);
    setUsersList(getStoredUsers());
    setNewStudentName('');
    setNewStudentUsername('');
    setNewStudentPassword('');
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('¿Eliminar este alumno del aula?')) {
      deleteUser(id);
      setUsersList(getStoredUsers());
    }
  };

  // Handle HTML file upload
  const handleHtmlFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setNewHtmlCode(text);
          setNewType('external-html');
          if (!newTitle) {
            setNewTitle(file.name.replace(/\.[^/.]+$/, ''));
          }
        }
      };
      reader.readAsText(file);
    }
  };

  // Download backup
  const handleExportJson = () => {
    const json = exportFullDataBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aulavirtual_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Studio Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              Área de Administración Docente
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Gestor del Profesor
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Sube páginas interactivas, diseña ejercicios, crea contraseñas para tus alumnos y revisa calificaciones.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Descargar copia de seguridad con todos los ejercicios y usuarios"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Respaldo</span>
            </button>
            <button
              onClick={() => setActiveTab('creator')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Subir / Diseñar Página</span>
            </button>
          </div>
        </div>

        {/* Studio Tabs */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pages')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'pages'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Páginas y Ejercicios ({exercises.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('creator')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'creator'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Editor / Subir Página</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'students'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Alumnos y Contraseñas ({usersList.filter((u) => u.role === 'alumno').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('grades')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'grades'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Calificaciones y Entregas ({submissions.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Pages & Exercises Management */}
      {activeTab === 'pages' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Páginas y actividades subidas
              </h2>
              <span className="text-xs text-slate-500">
                Los alumnos ven inmediatamente todas las páginas activas
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-indigo-600">
                        {ex.subject}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{ex.level}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {ex.type === 'external-html'
                          ? 'Página HTML Personalizada'
                          : ex.type === 'quiz'
                          ? 'Cuestionario Interactivo'
                          : 'Rellenar Espacios'}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base">
                      {ex.title}
                    </h3>
                    <p className="text-xs text-slate-600 max-w-2xl line-clamp-1">
                      {ex.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => onPreviewExercise(ex)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      title="Probar como alumno"
                    >
                      <Play className="w-3 h-3 text-indigo-600" />
                      <span>Probar</span>
                    </button>

                    <button
                      onClick={() => handleDeleteEx(ex.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar actividad"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Exercise & Page Creator */}
      {activeTab === 'creator' && (
        <form onSubmit={handleSaveNewExercise} className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
            <h2 className="text-lg font-bold text-slate-900">
              Datos generales de la página o ejercicio
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Título de la Actividad
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ej. Ecuaciones de Primer Grado / Simulador de Gravedad"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Asignatura / Materia
                </label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="ej. Matemáticas, Física, Ciencias, Lengua..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nivel o Curso
                </label>
                <input
                  type="text"
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value)}
                  placeholder="ej. 1º ESO, 2º Primaria..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tipo de Actividad
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as ExerciseType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white"
                >
                  <option value="quiz">Cuestionario con Preguntas y Respuestas</option>
                  <option value="external-html">
                    Página Web Completa (HTML / CSS / Canvas que subas tú)
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Descripción para los alumnos
              </label>
              <textarea
                rows={2}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Breve explicación de los objetivos del ejercicio..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* If External HTML Page */}
          {newType === 'external-html' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Código de la Página Web (HTML, CSS y JS)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pega tu código HTML completo o sube un archivo <code className="bg-slate-100 px-1 rounded">.html</code> desde tu ordenador.
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer transition-colors shrink-0">
                  <Upload className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Cargar archivo .html</span>
                  <input
                    type="file"
                    accept=".html,.htm"
                    onChange={handleHtmlFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <textarea
                  rows={10}
                  value={newHtmlCode}
                  onChange={(e) => setNewHtmlCode(e.target.value)}
                  className="w-full font-mono text-xs p-3 border border-slate-300 rounded-lg bg-slate-900 text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Live Preview */}
              <div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Vista Previa en Vivo:
                </div>
                <div className="border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                  <iframe
                    title="Previsualización de página subida"
                    srcDoc={newHtmlCode}
                    className="w-full h-64 border-0 bg-white"
                    sandbox="allow-scripts"
                  />
                </div>
              </div>
            </div>
          )}

          {/* If Quiz Builder */}
          {newType === 'quiz' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Preguntas del Cuestionario
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configura las opciones y marca la respuesta correcta.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Pregunta</span>
                </button>
              </div>

              <div className="space-y-6">
                {questions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-4 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-700 uppercase">
                        Pregunta #{qIdx + 1}
                      </span>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="text-slate-400 hover:text-rose-600 text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Enunciado de la pregunta:
                      </label>
                      <input
                        type="text"
                        required
                        value={q.prompt}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQuestions((prev) =>
                            prev.map((item, i) =>
                              i === qIdx ? { ...item, prompt: val } : item
                            )
                          );
                        }}
                        placeholder="ej. ¿Cuánto es 15 × 4?"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Opciones de respuesta (selecciona el círculo de la correcta):
                      </label>
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qIdx}`}
                              checked={q.correctIndex === optIdx}
                              onChange={() =>
                                setQuestions((prev) =>
                                  prev.map((item, i) =>
                                    i === qIdx
                                      ? { ...item, correctIndex: optIdx }
                                      : item
                                  )
                                )
                              }
                              className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <input
                              type="text"
                              required
                              value={opt}
                              onChange={(e) => {
                                const val = e.target.value;
                                setQuestions((prev) =>
                                  prev.map((item, i) => {
                                    if (i !== qIdx) return item;
                                    const newOpts = [...item.options];
                                    newOpts[optIdx] = val;
                                    return { ...item, options: newOpts };
                                  })
                                );
                              }}
                              placeholder={`Opción ${optIdx + 1}`}
                              className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Explicación / Retroalimentación al corregir:
                      </label>
                      <input
                        type="text"
                        value={q.explanation}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQuestions((prev) =>
                            prev.map((item, i) =>
                              i === qIdx ? { ...item, explanation: val } : item
                            )
                          );
                        }}
                        placeholder="ej. Porque 15 multiplicado por 4 da exactamente 60."
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('pages')}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Guardar y Publicar en el Aula
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: Students & Passwords Management */}
      {activeTab === 'students' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* New Student Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs h-fit">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Añadir Nuevo Alumno
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Crea las credenciales de acceso para un nuevo alumno.
            </p>

            <form onSubmit={handleAddStudent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="ej. Daniel Navarro"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Usuario de inicio de sesión
                </label>
                <input
                  type="text"
                  required
                  value={newStudentUsername}
                  onChange={(e) => setNewStudentUsername(e.target.value)}
                  placeholder="ej. alumno4"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Contraseña de acceso
                </label>
                <input
                  type="text"
                  required
                  value={newStudentPassword}
                  onChange={(e) => setNewStudentPassword(e.target.value)}
                  placeholder="ej. clave123"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Curso / Grupo
                </label>
                <input
                  type="text"
                  value={newStudentGrade}
                  onChange={(e) => setNewStudentGrade(e.target.value)}
                  placeholder="ej. 1º ESO - Grupo A"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {studentError && (
                <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-lg">
                  {studentError}
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Crear Alumno
              </button>
            </form>
          </div>

          {/* Students List */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Listado de Cuentas y Contraseñas
                </h3>
                <p className="text-xs text-slate-500">
                  Todas las credenciales activas para el inicio de sesión.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3 text-left">Alumno</th>
                    <th className="px-5 py-3 text-left">Usuario</th>
                    <th className="px-5 py-3 text-left">Contraseña</th>
                    <th className="px-5 py-3 text-left">Curso</th>
                    <th className="px-5 py-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 font-medium text-slate-900 flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                            u.avatarColor || 'bg-slate-600'
                          }`}
                        >
                          {u.name.charAt(0)}
                        </div>
                        <span>{u.name}</span>
                        {u.role === 'profesor' && (
                          <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-semibold ml-1">
                            Docente
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-600">
                        {u.username}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-600">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                          {u.password}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {u.gradeLevel || 'Docencia'}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {u.role === 'alumno' && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Grades & Submissions */}
      {activeTab === 'grades' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Registro de Entregas y Calificaciones
              </h3>
              <p className="text-xs text-slate-500">
                Puntuaciones obtenidas por cada alumno al enviar un ejercicio.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Total entregas: {submissions.length}
            </span>
          </div>

          {submissions.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Aún no hay entregas de ejercicios registradas.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3 text-left">Alumno</th>
                    <th className="px-5 py-3 text-left">Ejercicio Realizado</th>
                    <th className="px-5 py-3 text-left">Nota</th>
                    <th className="px-5 py-3 text-left">Tiempo</th>
                    <th className="px-5 py-3 text-right">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {submissions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        {s.studentName} ({s.username})
                      </td>
                      <td className="px-5 py-3.5 text-slate-800">
                        {s.exerciseTitle}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`font-bold font-mono px-2 py-0.5 rounded text-xs ${
                            s.score >= 7
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.score >= 5
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {s.score} / {s.maxScore}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-mono">
                        {Math.floor(s.timeSpentSeconds / 60)}m {s.timeSpentSeconds % 60}s
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-right">
                        {new Date(s.submittedAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
