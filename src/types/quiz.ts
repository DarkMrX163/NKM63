export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuestionCategory = 
  | 'neftegorsk' 
  | 'utevka' 
  | 'barinovka' 
  | 'samara_region' 
  | 'nature_and_rivers' 
  | 'museum_nkm';

export interface Question {
  id: string;
  level: Difficulty;
  category: QuestionCategory;
  categoryTitle: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  historicalFact: string;
  imageUrl?: string;
  imageCaption?: string;
  hint?: string;
}

export interface BlitzStatement {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
  topic: string;
}

export interface MapLocation {
  id: string;
  name: string;
  typeTitle: string;
  shortDesc: string;
  fullDesc: string;
  coords: { x: number; y: number }; // SVG map percentage coordinates
  category: 'architecture' | 'nature' | 'industry' | 'museum';
  imageUrl: string;
  funFact: string;
  quizQuestion: Question;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  streak: number;
  maxStreak: number;
  correctAnswers: number;
  totalQuestions: number;
  used5050: boolean;
  usedAiHint: boolean;
  selectedOption: number | null;
  isAnswered: boolean;
  isTimerActive: boolean;
  timeLeft: number;
  difficulty: Difficulty | 'mixed';
  answersHistory: Array<{
    questionId: string;
    isCorrect: boolean;
    timeSpent: number;
  }>;
}
