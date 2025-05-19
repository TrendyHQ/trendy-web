import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";
import CategoryInDepth from "./pages/CategoryInDepth";
import AskAi from "./pages/AskAi";
import FavoritesPage from "./pages/FavoritesPage";
import SpecificTrendPage from "./pages/SpecificTrendPage";
import HotPage from "./pages/HotPage";
import { useAuth0 } from "@auth0/auth0-react";

export default function Router() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (!isAuthenticated && !isLoading) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/*" element={<CategoryInDepth />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/ask-ai" element={<AskAi />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/trend/*" element={<SpecificTrendPage />} />
        <Route path="/hottrends" element={<HotPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
