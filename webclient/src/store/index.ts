import { create } from "zustand";

interface AppState {
  promptText?: string;
  taskId?: number;
  index?: number;
  setPromptText: (text?: string) => void;
  setTaskId: (id: number) => void;
  setIndex: (idx: number) => void;
}

const useAppState = create<AppState>((set) => ({
  promptText: undefined,
  predicationId: undefined,
  index: undefined,
  setPromptText: (text?: string) =>
    set(() => ({
      promptText: text,
    })),
  setTaskId: (id: number) =>
    set(() => ({
      taskId: id,
    })),
  setIndex: (idx: number) =>
    set(() => ({
      index: idx,
    })),
}));

export default useAppState;
