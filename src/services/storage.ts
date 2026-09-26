import { ExercisePage, Submission, User } from '../types';

const USERS_KEY = 'aulavirtual_users_v1';
const EXERCISES_KEY = 'aulavirtual_exercises_v1';
const SUBMISSIONS_KEY = 'aulavirtual_submissions_v1';
const SESSION_KEY = 'aulavirtual_active_user_v1';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-teacher-1',
    username: 'profesor',
    password: 'aula2025',
    name: 'Prof. Carlos Morales',
    role: 'profesor',
    avatarColor: 'bg-indigo-600',
    createdAt: '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'user-student-1',
    username: 'alumno1',
    password: '1234',
    name: 'Lucía Gómez',
    role: 'alumno',
    avatarColor: 'bg-emerald-600',
    gradeLevel: '1º ESO - Grupo A',
    createdAt: '2026-09-01T08:30:00.000Z',
  },
  {
    id: 'user-student-2',
    username: 'alumno2',
    password: '1234',
    name: 'Mateo Fernández',
    role: 'alumno',
    avatarColor: 'bg-sky-600',
    gradeLevel: '1º ESO - Grupo A',
    createdAt: '2026-09-01T08:35:00.000Z',
  },
  {
    id: 'user-student-3',
    username: 'alumno3',
    password: '1234',
    name: 'Elena Ruiz',
    role: 'alumno',
    avatarColor: 'bg-amber-600',
    gradeLevel: '1º ESO - Grupo B',
    createdAt: '2026-09-01T08:40:00.000Z',
  },
];

export const INITIAL_EXERCISES: ExercisePage[] = [
  {
    id: 'ex-mat-1',
    title: 'Fracciones y Operaciones Básicas',
    description: 'Aprende y pon a prueba tus conocimientos sobre suma de fracciones con igual y distinto denominador.',
    subject: 'Matemáticas',
    level: '1º ESO',
    type: 'quiz',
    published: true,
    authorName: 'Prof. Carlos Morales',
    createdAt: '2026-09-10T10:00:00.000Z',
    updatedAt: '2026-09-10T10:00:00.000Z',
    maxScore: 10,
    estimatedTimeMin: 15,
    content: {
      questions: [
        {
          id: 'q1',
          prompt: '¿Cuál es el resultado simplificado de sumar 2/5 + 1/5?',
          options: ['3/10', '3/5', '2/25', '1/5'],
          correctIndex: 1,
          explanation: 'Al tener el mismo denominador (5), simplemente sumamos los numeradores: 2 + 1 = 3. El resultado es 3/5.',
          points: 2.5,
        },
        {
          id: 'q2',
          prompt: 'Calcula: 1/2 + 1/4 = ?',
          options: ['2/6', '1/8', '3/4', '2/4'],
          correctIndex: 2,
          explanation: 'El mínimo común múltiplo de 2 y 4 es 4. Convertimos 1/2 a 2/4. Luego 2/4 + 1/4 = 3/4.',
          points: 2.5,
        },
        {
          id: 'q3',
          prompt: 'Si en una tarta quedan 3/8 de las porciones, ¿qué fracción de la tarta se ha consumido?',
          options: ['5/8', '3/8', '1/8', '8/3'],
          correctIndex: 0,
          explanation: 'La tarta completa es 8/8. Restamos lo que queda: 8/8 - 3/8 = 5/8.',
          points: 2.5,
        },
        {
          id: 'q4',
          prompt: '¿Cuál de las siguientes fracciones es equivalente a 2/3?',
          options: ['4/9', '6/9', '3/2', '5/6'],
          correctIndex: 1,
          explanation: 'Si multiplicamos numerador y denominador por 3: (2×3)/(3×3) = 6/9.',
          points: 2.5,
        },
      ],
    },
  },
  {
    id: 'ex-cie-1',
    title: 'Ecosistemas, Fotosíntesis y Biodiversidad',
    description: 'Actividades de comprensión sobre el ciclo de la energía y los niveles tróficos en la naturaleza.',
    subject: 'Ciencias Naturales',
    level: '1º ESO',
    type: 'fill-blank',
    published: true,
    authorName: 'Prof. Carlos Morales',
    createdAt: '2026-09-12T11:30:00.000Z',
    updatedAt: '2026-09-12T11:30:00.000Z',
    maxScore: 10,
    estimatedTimeMin: 12,
    content: {
      blanks: [
        {
          id: 'b1',
          sentenceBefore: 'Las plantas son organismos ',
          blankAnswer: 'autotrofos',
          sentenceAfter: ' porque producen su propio alimento mediante la fotosíntesis.',
          hint: 'autótrofos o heterótrofos',
          points: 3.3,
        },
        {
          id: 'b2',
          sentenceBefore: 'El gas que absorben las plantas durante la fotosíntesis es el ',
          blankAnswer: 'dioxido de carbono',
          sentenceAfter: ' y expulsan oxígeno a la atmósfera.',
          hint: 'dióxido de carbono (CO2)',
          points: 3.3,
        },
        {
          id: 'b3',
          sentenceBefore: 'En una cadena trófica, los herbívoros ocupan el nivel de consumidores ',
          blankAnswer: 'primarios',
          sentenceAfter: ', alimentándose directamente de los productores.',
          hint: 'primarios, secundarios o terciarios',
          points: 3.4,
        },
      ],
    },
  },
  {
    id: 'ex-len-1',
    title: 'Ortografía: Acentuación y Reglas Generales',
    description: 'Identifica palabras agudas, llanas, esdrújulas y pon a prueba el uso correcto de la tilde.',
    subject: 'Lengua Castellana',
    level: '1º y 2º ESO',
    type: 'quiz',
    published: true,
    authorName: 'Prof. Carlos Morales',
    createdAt: '2026-09-15T09:15:00.000Z',
    updatedAt: '2026-09-15T09:15:00.000Z',
    maxScore: 10,
    estimatedTimeMin: 10,
    content: {
      questions: [
        {
          id: 'lq1',
          prompt: '¿Por qué la palabra "camión" lleva tilde?',
          options: [
            'Porque es llana terminada en vocal',
            'Porque es aguda terminada en "n"',
            'Porque es esdrújula',
            'No debería llevar tilde',
          ],
          correctIndex: 1,
          explanation: 'Las palabras agudas llevan tilde cuando terminan en vocal, "n" o "s". La fuerza de voz recae en la última sílaba.',
          points: 3.3,
        },
        {
          id: 'lq2',
          prompt: '¿Cuál de las siguientes palabras es esdrújula?',
          options: ['Reloj', 'Música', 'Árbol', 'Canción'],
          correctIndex: 1,
          explanation: '"Mú-si-ca" tiene el acento en la antepenúltima sílaba, por lo que es esdrújula y todas las esdrújulas llevan tilde siempre.',
          points: 3.3,
        },
        {
          id: 'lq3',
          prompt: 'La palabra "difícil" es llana y lleva tilde porque:',
          options: [
            'Termina en consonante distinta de "n" o "s"',
            'Termina en vocal',
            'Siempre llevan tilde',
            'Es aguda',
          ],
          correctIndex: 0,
          explanation: 'Las palabras llanas o graves llevan tilde cuando NO terminan en vocal, "n" ni "s". Como termina en "l", lleva tilde.',
          points: 3.4,
        },
      ],
    },
  },
  {
    id: 'ex-html-lab',
    title: 'Laboratorio de Geometría y Polígonos',
    description: 'Página web interactiva con Canvas creada por el profesor. Mueve los vértices para calcular áreas y perímetros en tiempo real.',
    subject: 'Geometría y Tecnología',
    level: 'General',
    type: 'external-html',
    published: true,
    authorName: 'Prof. Carlos Morales',
    createdAt: '2026-09-18T16:00:00.000Z',
    updatedAt: '2026-09-18T16:00:00.000Z',
    maxScore: 10,
    estimatedTimeMin: 15,
    content: {
      instructions: 'Interactúa con los controles numéricos y el simulador para responder las preguntas de observación geométrica.',
      htmlCode: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 18px;
      background: #f8fafc;
      color: #1e293b;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    h2 {
      margin-top: 0;
      color: #0f172a;
      font-size: 1.25rem;
    }
    .controls {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }
    label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #475569;
      display: block;
      margin-bottom: 4px;
    }
    input[type=range] {
      width: 100%;
    }
    .value-tag {
      font-size: 0.8rem;
      color: #2563eb;
      font-weight: bold;
    }
    canvas {
      background: #0f172a;
      border-radius: 8px;
      display: block;
      width: 100%;
      height: 220px;
    }
    .stats {
      display: flex;
      justify-content: space-around;
      margin-top: 14px;
      padding: 12px;
      background: #f1f5f9;
      border-radius: 8px;
      font-size: 0.9rem;
    }
    .stat-box strong {
      display: block;
      color: #0f172a;
      font-size: 1.1rem;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>Simulador Interactivo: Rectángulos y Escalas</h2>
    <p style="font-size: 0.875rem; color: #64748b; margin-bottom: 16px;">
      Modifica los deslizadores de base y altura para observar cómo cambian el área y el perímetro en el plano.
    </p>

    <div class="controls">
      <div>
        <label>Base (cm): <span id="baseVal" class="value-tag">8</span></label>
        <input type="range" id="baseSlider" min="2" max="18" value="8">
      </div>
      <div>
        <label>Altura (cm): <span id="heightVal" class="value-tag">5</span></label>
        <input type="range" id="heightSlider" min="2" max="14" value="5">
      </div>
    </div>

    <canvas id="geoCanvas" width="560" height="220"></canvas>

    <div class="stats">
      <div class="stat-box">
        <span>Perímetro:</span>
        <strong id="periOut">26 cm</strong>
      </div>
      <div class="stat-box">
        <span>Área Superficial:</span>
        <strong id="areaOut">40 cm²</strong>
      </div>
      <div class="stat-box">
        <span>Proporción (b/h):</span>
        <strong id="ratioOut">1.60</strong>
      </div>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('geoCanvas');
    const ctx = canvas.getContext('2d');
    const baseSlider = document.getElementById('baseSlider');
    const heightSlider = document.getElementById('heightSlider');
    const baseVal = document.getElementById('baseVal');
    const heightVal = document.getElementById('heightVal');
    const periOut = document.getElementById('periOut');
    const areaOut = document.getElementById('areaOut');
    const ratioOut = document.getElementById('ratioOut');

    function draw() {
      const b = parseFloat(baseSlider.value);
      const h = parseFloat(heightSlider.value);

      baseVal.textContent = b;
      heightVal.textContent = h;

      const peri = 2 * (b + h);
      const area = b * h;
      const ratio = (b / h).toFixed(2);

      periOut.textContent = peri + ' cm';
      areaOut.textContent = area + ' cm²';
      ratioOut.textContent = ratio;

      // Draw canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid background
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Rect
      const scale = 16;
      const pxWidth = b * scale;
      const pxHeight = h * scale;
      const startX = (canvas.width - pxWidth) / 2;
      const startY = (canvas.height - pxHeight) / 2;

      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;

      ctx.fillRect(startX, startY, pxWidth, pxHeight);
      ctx.strokeRect(startX, startY, pxWidth, pxHeight);

      // Labels on shape
      ctx.fillStyle = '#f8fafc';
      ctx.font = '12px sans-serif';
      ctx.fillText(b + ' cm', startX + pxWidth / 2 - 14, startY - 8);
      ctx.fillText(h + ' cm', startX + pxWidth + 8, startY + pxHeight / 2 + 4);
    }

    baseSlider.addEventListener('input', draw);
    heightSlider.addEventListener('input', draw);
    draw();
  </script>
</body>
</html>`,
      questions: [
        {
          id: 'hq1',
          prompt: 'Si configuras la base en 10 cm y la altura en 4 cm, ¿cuál es el perímetro total?',
          options: ['40 cm', '28 cm', '14 cm', '20 cm'],
          correctIndex: 1,
          explanation: 'Perímetro = 2 × (10 + 4) = 2 × 14 = 28 cm.',
          points: 5,
        },
        {
          id: 'hq2',
          prompt: 'Con base 12 cm y altura 6 cm, ¿qué área superficial ocupa el rectángulo?',
          options: ['72 cm²', '36 cm²', '18 cm²', '48 cm²'],
          correctIndex: 0,
          explanation: 'Área = base × altura = 12 × 6 = 72 cm².',
          points: 5,
        },
      ],
    },
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-demo-1',
    exerciseId: 'ex-mat-1',
    exerciseTitle: 'Fracciones y Operaciones Básicas',
    userId: 'user-student-1',
    username: 'alumno1',
    studentName: 'Lucía Gómez',
    score: 10,
    maxScore: 10,
    percentage: 100,
    answers: { q1: 1, q2: 2, q3: 0, q4: 1 },
    submittedAt: '2026-09-18T14:20:00.000Z',
    timeSpentSeconds: 245,
  },
  {
    id: 'sub-demo-2',
    exerciseId: 'ex-len-1',
    exerciseTitle: 'Ortografía: Acentuación y Reglas Generales',
    userId: 'user-student-2',
    username: 'alumno2',
    studentName: 'Mateo Fernández',
    score: 6.7,
    maxScore: 10,
    percentage: 67,
    answers: { lq1: 1, lq2: 1, lq3: 1 },
    submittedAt: '2026-09-19T10:10:00.000Z',
    timeSpentSeconds: 180,
  },
];

// Helper functions for LocalStorage
export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading users from storage', e);
    return INITIAL_USERS;
  }
}

export function saveUser(user: User): void {
  const users = getStoredUsers();
  const existingIdx = users.findIndex((u) => u.id === user.id);
  if (existingIdx >= 0) {
    users[existingIdx] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function deleteUser(id: string): void {
  const users = getStoredUsers().filter((u) => u.id !== id);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getStoredExercises(): ExercisePage[] {
  try {
    const raw = localStorage.getItem(EXERCISES_KEY);
    if (!raw) {
      localStorage.setItem(EXERCISES_KEY, JSON.stringify(INITIAL_EXERCISES));
      return INITIAL_EXERCISES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading exercises from storage', e);
    return INITIAL_EXERCISES;
  }
}

export function saveExercise(exercise: ExercisePage): void {
  const exercises = getStoredExercises();
  const existingIdx = exercises.findIndex((e) => e.id === exercise.id);
  if (existingIdx >= 0) {
    exercises[existingIdx] = exercise;
  } else {
    exercises.unshift(exercise);
  }
  localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
}

export function deleteExercise(id: string): void {
  const exercises = getStoredExercises().filter((e) => e.id !== id);
  localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
}

export function getStoredSubmissions(): Submission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    if (!raw) {
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
      return INITIAL_SUBMISSIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading submissions from storage', e);
    return INITIAL_SUBMISSIONS;
  }
}

export function saveSubmission(sub: Submission): void {
  const subs = getStoredSubmissions();
  subs.unshift(sub);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(subs));
}

export function getActiveSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setActiveSession(user: User | null): void {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function resetAllDataToDefault(): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(EXERCISES_KEY, JSON.stringify(INITIAL_EXERCISES));
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
}

export function exportFullDataBackup(): string {
  const data = {
    users: getStoredUsers(),
    exercises: getStoredExercises(),
    submissions: getStoredSubmissions(),
    exportedAt: new Date().toISOString(),
    version: '1.0',
  };
  return JSON.stringify(data, null, 2);
}

export function importFullDataBackup(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.users && Array.isArray(parsed.users)) {
      localStorage.setItem(USERS_KEY, JSON.stringify(parsed.users));
    }
    if (parsed.exercises && Array.isArray(parsed.exercises)) {
      localStorage.setItem(EXERCISES_KEY, JSON.stringify(parsed.exercises));
    }
    if (parsed.submissions && Array.isArray(parsed.submissions)) {
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(parsed.submissions));
    }
    return true;
  } catch (e) {
    console.error('Invalid backup JSON', e);
    return false;
  }
}
