export interface GymAIAnswer {
  success: boolean;
  answer: string;
  data: Record<string, unknown>[];
  sqlQuery?: string;
  gymUuid?: string;
  timestamp?: string;
}

export interface GymAIExamples {
  success: boolean;
  examples: string[];
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  data?: Record<string, unknown>[];
  isError?: boolean;
}
