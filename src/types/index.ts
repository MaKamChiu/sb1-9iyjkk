export interface User {
  id: string;
  email: string;
  displayName: string;
}

export interface Question {
  id: string;
  type: 'single-choice' | 'fill-in';
  text: string;
  required: boolean;
  options?: string[];
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  questions: Question[];
  responses: number;
}

export interface Response {
  id: string;
  surveyId: string;
  userId: string;
  answers: Record<string, string | string[]>;
  submittedAt: Date;
}