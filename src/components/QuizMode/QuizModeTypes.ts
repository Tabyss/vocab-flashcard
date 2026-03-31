export interface Card {
  id: string | number;
  word: string;
  definition: string;
  sentence?: string;
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  type: number;
  question: string;
  sentenceContext?: string;
  options: QuizOption[];
  correctWord: string;
  correctDefinition: string;
  originalCard: Card;
}

export interface QuestionMetric {
  question: string;
  sentenceContext: string | null;
  correctAnswer: string;
  word: string;
  time: number;
  isCorrect: boolean;
  userAnswer: string;
  correctDefinition: string;
}

export interface QuizStats {
  avgTime: string;
  slowest: QuestionMetric;
}