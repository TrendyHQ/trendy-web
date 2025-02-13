import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";
import CategoryInDepth from "./pages/CategoryInDepth";
import AskAi from "./pages/AskAi";
import FavoritesPage from "./pages/FavoritesPage";
import SpecificTrendPage from "./pages/SpecificTrendPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/*" element={<CategoryInDepth />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/ask-ai" element={<AskAi />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/trend/*" element={<SpecificTrendPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
