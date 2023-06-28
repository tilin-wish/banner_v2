import { BrowserRouter, Route, Routes } from "react-router-dom";
import CanvasPage from "./components/CanvasPage";
import ImagePanel from "./components/ImagePanel";
import PromptPanel from "./components/PromptPanel";

const WithRouter = ({ children }: { children: React.ReactNode }) => {
  const basename = import.meta.env.VITE_ROUTER_BASE;
  return <BrowserRouter basename={basename}>{children}</BrowserRouter>;
};

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
    <WithRouter>
      <Routes>
        <Route path="/canvas" Component={CanvasPage} />
        <Route path="/" Component={MainPage} />
      </Routes>
    </WithRouter>
  );
}

export default App;
