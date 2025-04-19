import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Navigate } from "react-router-dom";
import { Loader2, Send, Sparkles, Trash2 } from "lucide-react";
import LoadingPage from "./LoadingPage";

export default function AskAi() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const [response, setResponse] = useState<string>("");
  const [displayedResponse, setDisplayedResponse] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isFutureRequest, setIsFutureRequest] = useState<boolean | null>(false);
  const [animationMode, setAnimationMode] = useState<"letter" | "word">(
    "letter"
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  const responseRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Enhanced typing animation effect
  useEffect(() => {
    if (response) {
      if (animationMode === "letter") {
        // Letter by letter animation
        let i = 0;
        const interval = setInterval(() => {
          setDisplayedResponse(response.substring(0, i));
          i++;

          // Scroll to bottom of response container
          if (responseRef.current) {
            responseRef.current.scrollTop = responseRef.current.scrollHeight;
          }

          if (i > response.length) {
            clearInterval(interval);
          }
        }, 10); // Faster speed for smoother animation

        return () => clearInterval(interval);
      } else {
        // Word by word animation
        const words = response.split(" ");
        let i = 0;
        const interval = setInterval(() => {
          setDisplayedResponse(words.slice(0, i).join(" "));
          i++;

          // Scroll to bottom of response container
          if (responseRef.current) {
            responseRef.current.scrollTop = responseRef.current.scrollHeight;
          }

          if (i > words.length) {
            clearInterval(interval);
          }
        }, 50); // Speed for word animation

        return () => clearInterval(interval);
      }
    }
  }, [response, animationMode]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  function getUserLocation(): Promise<string> {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(`${position.coords.latitude},${position.coords.longitude}`);
          },
          (error) => {
            reject(`Error getting location: ${error.message}`);
          }
        );
      } else {
        reject("Geolocation is not supported by this browser.");
      }
    });
  }

  async function getResponse() {
    if (inputValue.trim() === "") return;

    setIsSubmitting(true);
    try {
      const location = (await getUserLocation()) || "unknown";

      const res = await axios.post(
        "http://localhost:8080/api/ai/AiModelRequest",
        {
          message: inputValue,
          userLocation: location,
          isFutureRequest: isFutureRequest,
          userId: user?.sub,
        },
        {
          withCredentials: true,
        }
      );

      setResponse(res.data);
      setInputValue("");
    } catch (error) {
      console.error(error);
      setResponse(
        "Sorry, there was an error processing your request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function markdownToHtml(text: string) {
    // Enhanced markdown processing
    let newText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    newText = newText.replace(/(\d+\.)/g, "<br>$1");
    // Add support for italics
    newText = newText.replace(/\*(.*?)\*/g, "<em>$1</em>");
    return newText;
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !isSubmitting) {
      getResponse();
    }
  }

  function clearResponse() {
    setIsFadingOut(true);

    // Wait for animation to complete before clearing the response
    setTimeout(() => {
      setResponse("");
      setDisplayedResponse("");
      setIsFadingOut(false);
    }, 500); // Duration matches the CSS transition below
  }

  function toggleAnimationMode() {
    setAnimationMode((prev) => (prev === "letter" ? "word" : "letter"));
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-zinc-900 via-stone-900 to-neutral-900 text-white">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-[0.03] pointer-events-none"></div>

        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl relative z-10">
          <div className="mb-10">
            <div className="flex items-center justify-center mb-2">
              <Sparkles className="text-[#ff5733] mr-2" size={24} />
              <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-[#ff5733] to-amber-500 bg-clip-text text-transparent">
                Ask AI
              </h1>
            </div>
            <p className="text-center text-neutral-400 font-light">
              Discover insights on trends that shape our world
            </p>
          </div>

          {/* Query Input Section */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 shadow-xl !border-0 mb-8 transition-all">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff5733] to-amber-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative">
                <input
                  ref={inputRef}
                  aria-label="Input to enter queries for AI"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-black/70 text-white rounded-lg pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-[#ff5733]/50 transition-all placeholder:text-neutral-500"
                  type="text"
                  placeholder="What would you like to know?"
                  disabled={isSubmitting}
                />
                <button
                  onClick={getResponse}
                  disabled={isSubmitting || inputValue.trim() === ""}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ff5733] hover:text-amber-500 disabled:text-neutral-600 transition-colors"
                  aria-label="Send query"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Request Type Toggle */}
            <div className="mt-6 flex items-center justify-center">
              <div className="p-1 rounded-full flex bg-black/50 !border-0 shadow-inner">
                <button
                  onClick={() => setIsFutureRequest(false)}
                  className={`px-5 py-2 !rounded-full text-sm font-medium transition-all duration-300 ${
                    !isFutureRequest
                      ? "bg-gradient-to-r from-[#ff5733] to-amber-500 text-white shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Current Trends
                </button>
                <button
                  onClick={() => setIsFutureRequest(true)}
                  className={`px-5 py-2 !rounded-full text-sm font-medium transition-all duration-300 ${
                    isFutureRequest
                      ? "bg-gradient-to-r from-[#ff5733] to-amber-500 text-white shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Future Trends
                </button>
              </div>
            </div>
          </div>

          {/* Response Section */}
          <div className="relative group mb-6">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div
              ref={responseRef}
              className={`relative bg-black/30 backdrop-blur-sm rounded-xl p-8 shadow-xl min-h-[300px] max-h-[500px] overflow-y-auto !border-0 transition-opacity duration-500 ${
                isFadingOut ? "opacity-0" : "opacity-100"
              }`}
            >
              {displayedResponse ? (
                <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-amber-500">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: markdownToHtml(displayedResponse),
                    }}
                  />
                  {/* Blinking cursor effect at the end of the text */}
                  {response && displayedResponse.length < response.length && (
                    <span className="ml-[5px] inline-block w-2 h-5 bg-[#ff5733] animate-pulse"></span>
                  )}
                </div>
              ) : (
                <div className="text-neutral-500 text-center h-full flex flex-col items-center justify-center">
                  <Sparkles className="mb-3 text-[#ff5733]/30" size={32} />
                  <p>Your insights will appear here</p>
                  <p className="text-xs mt-2 text-neutral-600">
                    Ask a question to get started
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          {displayedResponse && (
            <div className="flex justify-center gap-4">
              <button
                onClick={clearResponse}
                className="flex items-center gap-2 px-6 py-2.5 bg-black/30 hover:bg-black/50 text-white !rounded-lg transition-colors shadow-md"
              >
                <Trash2 size={16} />
                Clear Response
              </button>

              <button
                onClick={toggleAnimationMode}
                className="flex items-center gap-2 px-6 py-2.5 bg-black/30 hover:bg-black/50 text-white !rounded-lg transition-colors shadow-md"
              >
                {animationMode === "letter"
                  ? "Switch to Word Mode"
                  : "Switch to Letter Mode"}
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
