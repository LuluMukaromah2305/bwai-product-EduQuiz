export interface QuizQuestion {
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface QuizData {
  isValid: boolean;
  validationErrorMessage?: string;
  recommendations?: string[];
  quizTitle: string;
  questions: QuizQuestion[];
  markdownContent: string;
}

export interface UserAnswer {
  questionIndex: number;
  selectedOption: 'A' | 'B' | 'C' | 'D';
}
