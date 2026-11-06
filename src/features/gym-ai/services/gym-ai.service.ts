import { httpClient } from '@/core/api/axios.adapter';
import { GymAIAnswer, GymAIExamples } from '../interfaces/gym-ai.interface';

export class GymAIService {
  private static readonly ENDPOINT = '/gym/bot';

  static async ask(query: string): Promise<GymAIAnswer> {
    return await httpClient.post<GymAIAnswer>(`${this.ENDPOINT}/ask`, {
      query,
    });
  }

  static async getExamples(): Promise<GymAIExamples> {
    return await httpClient.get<GymAIExamples>(`${this.ENDPOINT}/examples`);
  }

  static async clearHistory(): Promise<void> {
    await httpClient.post(`${this.ENDPOINT}/clear-history`);
  }
}
