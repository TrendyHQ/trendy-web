import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";
import CategoryInDepth from "./pages/CategoryInDepth";
import AskAi from "./pages/AskAi";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/*" element={<CategoryInDepth />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/ask-ai" element={<AskAi />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
