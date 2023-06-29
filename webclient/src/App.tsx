import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CanvasPage from "./components/CanvasPage";
import ImagePanel from "./components/ImagePanel";
import PromptPanel from "./components/PromptPanel";

const queryClient = new QueryClient();

function MainPage() {
  return (
    <div className="flex w-screen h-screen gap-1">
      <PromptPanel />
      <ImagePanel />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" Component={MainPage} />
          <Route path="/canvas" Component={CanvasPage} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
