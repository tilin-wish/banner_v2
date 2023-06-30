import { create } from "zustand";

interface AppState {
  promptText?: string;
  slogan?: string;
  taskId?: number;
  index?: number;
  setPromptText: (text?: string) => void;
  setTaskId: (id: number) => void;
  setIndex: (idx: number) => void;
  setSlogan: (slogan: string) => void;
}

const useAppState = create<AppState>((set) => ({
  promptText: undefined,
  predicationId: undefined,
  index: undefined,
  slogan: undefined,
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
  setSlogan: (slogan: string) =>
    set(() => ({
      slogan,
    })),
}));

export default useAppState;
