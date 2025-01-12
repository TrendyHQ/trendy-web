import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/pages/Home";
import Categories from "./components/pages/Categories";
import Profile from "./components/pages/Profile";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
