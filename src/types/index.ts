export type UserRole = 'profesor' | 'alumno';

export interface User {
  id: string;
  username: string;
  password: string; // Stored securely in storage for client-side evaluation
  name: string;
  role: UserRole;
  avatarColor?: string;
  gradeLevel?: string;
  createdAt: string;
}

export type ExerciseType = 'quiz' | 'external-html' | 'fill-blank';

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

export interface FillBlankItem {
  id: string;
  sentenceBefore: string;
  blankAnswer: string;
  sentenceAfter: string;
  hint?: string;
  points: number;
}

export interface ExerciseContent {
  // For quiz type
  questions?: QuizQuestion[];
  // For fill-in-the-blank type
  blanks?: FillBlankItem[];
  // For custom HTML uploaded by the teacher
  htmlCode?: string;
  instructions?: string;
}

export interface ExercisePage {
  id: string;
  title: string;
  description: string;
  subject: string; // e.g. Matemáticas, Ciencias, Lengua, Informática, Historia
  level: string; // e.g. 1º ESO, 2º ESO, Primaria, General
  type: ExerciseType;
  content: ExerciseContent;
  published: boolean;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  maxScore: number;
  estimatedTimeMin: number;
}

export interface Submission {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  userId: string;
  username: string;
  studentName: string;
  score: number;
  maxScore: number;
  percentage: number;
  answers: Record<string, any>;
  submittedAt: string;
  timeSpentSeconds: number;
}
