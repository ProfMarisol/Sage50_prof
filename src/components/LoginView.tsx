import React, { useState } from 'react';
import { User } from '../types';
import { getStoredUsers } from '../services/storage';
import { Lock, User as UserIcon, Eye, EyeOff, GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername || !password) {
      setError('Por favor, introduce tu usuario y contraseña.');
      return;
    }

    const users = getStoredUsers();
    const matchedUser = users.find(
      (u) => u.username.toLowerCase() === cleanUsername && u.password === password
    );

    if (matchedUser) {
      onLoginSuccess(matchedUser);
    } else {
      setError('Credenciales incorrectas. Comprueba el usuario y la contraseña.');
    }
  };

  const handleQuickDemo = (userParam: string, passParam: string) => {
    setUsername(userParam);
    setPassword(passParam);
    const users = getStoredUsers();
    const matchedUser = users.find(
      (u) => u.username.toLowerCase() === userParam.toLowerCase() && u.password === passParam
    );
    if (matchedUser) {
      onLoginSuccess(matchedUser);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-md mb-4">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          AulaVirtual
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
          Portal escolar para ejercicios interactivos y actividades docentes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-slate-700 mb-1"
              >
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ej. profesor o alumno1"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-1"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors cursor-pointer"
              >
                <span>Entrar al Aula</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Cuentas demo para probar:
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('profesor', 'aula2025')}
                className="w-full text-left px-3 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="font-semibold text-slate-800">Profesor:</span>{' '}
                  <span className="text-slate-600 font-mono">profesor</span> /{' '}
                  <span className="text-slate-600 font-mono">aula2025</span>
                </div>
                <span className="text-indigo-600 font-medium">Entrar como Docente →</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('alumno1', '1234')}
                className="w-full text-left px-3 py-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="font-semibold text-slate-800">Alumna:</span>{' '}
                  <span className="text-slate-600 font-mono">alumno1</span> /{' '}
                  <span className="text-slate-600 font-mono">1234</span>
                </div>
                <span className="text-emerald-600 font-medium">Entrar como Alumno →</span>
              </button>
            </div>

            <p className="mt-4 text-[11px] text-slate-400 text-center leading-relaxed">
              Compatible con GitHub Pages. Toda la información y contraseñas se almacenan de forma local en tu navegador.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
