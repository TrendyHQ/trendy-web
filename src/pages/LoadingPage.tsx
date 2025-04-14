"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoadingPageProps {
  message?: string;
}

export default function LoadingPage({
  message = "Loading...",
}: LoadingPageProps) {
  const navigate = useNavigate();
  const showBackButton = window.location.pathname !== "/";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#242424] text-white p-4">
      <div className="w-full max-w-md mx-auto flex flex-col items-center space-y-8">
        {showBackButton && (
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="text-white hover:bg-[#ff583333] p-[8px] transition-colors duration-150"
              style={{ borderRadius: "10px" }}
            >
              <ArrowLeft className="h-8 w-8" />
            </button>
          </div>
        )}

        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#ff5733] to-[#ff8c33] opacity-75 blur-sm animate-pulse" />
            <div className="relative bg-[#212121] rounded-full p-4">
              <Loader2 className="h-12 w-12 animate-spin text-[#ff5733]" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {message}
            </h1>
            <p className="text-gray-400">
              Please wait while we prepare your content
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
