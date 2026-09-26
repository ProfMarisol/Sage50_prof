import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Globe, Terminal, FileCode } from 'lucide-react';

interface GitHubPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubPagesModal: React.FC<GitHubPagesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, stepId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepId);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const workflowYaml = `name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                Cómo Publicar en GitHub Pages
              </h2>
              <p className="text-xs text-slate-500">
                Tu aplicación está lista para funcionar de manera 100% estática y gratuita.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Summary */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 leading-relaxed">
            <span className="font-bold">¡Tu proyecto ya está preparado!</span> Hemos configurado la ruta base relativa (<code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">base: './'</code> en <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">vite.config.ts</code>) y el sistema de autenticación local, por lo que cargará perfectamente en cualquier repositorio de GitHub sin requerir ningún servidor adicional.
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Paso 1: Subir el proyecto a tu cuenta de GitHub
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      'git init\ngit add .\ngit commit -m "Aula Virtual inicial"\ngit branch -M main\ngit remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git\ngit push -u origin main',
                      'step1'
                    )
                  }
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copiedStep === 'step1' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedStep === 'step1' ? 'Copiado' : 'Copiar comandos'}</span>
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`git init
git add .
git commit -m "Aula Virtual inicial"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main`}
              </pre>
            </div>

            {/* Step 2 */}
            <div className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Paso 2: Activar GitHub Actions (Despliegue automático)
                </span>
                <button
                  onClick={() => copyToClipboard(workflowYaml, 'step2')}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copiedStep === 'step2' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedStep === 'step2' ? 'Copiado' : 'Copiar archivo YAML'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-600 mb-2">
                Crea un archivo en <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">.github/workflows/deploy.yml</code> en tu repositorio con este contenido para que cada vez que subas cambios, se compile y publique solo:
              </p>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-[11px] font-mono overflow-x-auto max-h-36">
                {workflowYaml}
              </pre>
            </div>

            {/* Step 3 */}
            <div className="border border-slate-200 rounded-xl p-4">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block mb-2">
                Paso 3: Activar GitHub Pages en la configuración del Repositorio
              </span>
              <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1">
                <li>Ve a tu repositorio en GitHub y haz clic en <strong>Settings</strong>.</li>
                <li>En el menú lateral izquierdo, haz clic en <strong>Pages</strong>.</li>
                <li>En <strong>Build and deployment &gt; Source</strong>, selecciona <strong>GitHub Actions</strong>.</li>
                <li>¡Listo! Tu sitio estará visible en pocos segundos en <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">https://tu-usuario.github.io/tu-repositorio/</code>.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Entendido, cerrar guía
          </button>
        </div>
      </div>
    </div>
  );
};
