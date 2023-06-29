import { create } from "zustand";

interface AppState {
  promptText?: string;
  setPromptText: (text: string) => void;
}

const useAppState = create<AppState>((set) => ({
  promptText: "this is an exmaple",
  setPromptText: (text: string) =>
    set(() => ({
      promptText: text,
    })),
}));

export default useAppState;
