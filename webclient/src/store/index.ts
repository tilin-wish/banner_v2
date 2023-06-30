import { create } from "zustand";

interface AppState {
  promptText?: string;
  taskId?: number;
  setPromptText: (text?: string) => void;
  setTaskId: (id: number) => void;
}

const useAppState = create<AppState>((set) => ({
  promptText: undefined,
  predicationId: undefined,
  setPromptText: (text?: string) =>
    set(() => ({
      promptText: text,
    })),
  setTaskId: (id: number) =>
    set(() => ({
      taskId: id,
    })),
}));

export default useAppState;
