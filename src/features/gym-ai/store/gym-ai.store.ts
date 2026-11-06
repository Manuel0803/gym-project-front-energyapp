import { create } from 'zustand';
import { ChatMessage } from '../interfaces/gym-ai.interface';

interface GymAIStoreState {
  isOpen: boolean;
  messages: ChatMessage[];
  setOpen: (isOpen: boolean) => void;
  toggleOpen: () => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
}

// Estado en memoria (no persistido en localStorage): sobrevive a la navegación
// entre /dashboard y /admin, que remonta GymAIChat al cruzar de layout.
export const useGymAIStore = create<GymAIStoreState>((set) => ({
  isOpen: false,
  messages: [],
  setOpen: (isOpen) => set({ isOpen }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
}));
