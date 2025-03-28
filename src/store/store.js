import { create } from 'zustand';

export const useGameStore = create((set) => ({
  score: 0,
  increaseScore: () => set((state) => ({ score: state.score + 1 })),
  resetScore: () => set({ score: 0 }),
}));
