import { create } from "zustand";

export type ARISMode = 'error' | 'idle' | 'speaking' | 'listening' | 'thinking';

interface ARISModeStore {
  mode: ARISMode;
  setMode: (mode: ARISMode) => void;
}

export const useARISMode = create<ARISModeStore>((set) => ({
  mode: 'idle',
  setMode: (mode) => set({ mode }),
}));