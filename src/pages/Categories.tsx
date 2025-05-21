import "../css/Categories.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Cpu,
  Dumbbell,
  Film,
  Heart,
  Music,
  Plane,
  Share2,
  ShoppingBag,
  Trophy,
  Utensils,
  VoteIcon,
  FlaskRoundIcon as Flask,
} from "lucide-react";

export default function Categories() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/" />;
  }

  const categories = [
    {
      name: "Fashion",
      icon: ShoppingBag,
      description: "Latest styles & trends",
    },
    { name: "Technology", icon: Cpu, description: "Gadgets & innovations" },
    {
      name: "Food & Beverages",
      icon: Utensils,
      description: "Culinary experiences",
    },
    {
      name: "Entertainment",
      icon: Film,
      description: "Movies, shows & events",
    },
    { name: "Social Media", icon: Share2, description: "Platforms & content" },
    { name: "Fitness", icon: Dumbbell, description: "Workouts & routines" },
    { name: "Health", icon: Heart, description: "Wellness & lifestyle" },
    { name: "Music", icon: Music, description: "Artists & releases" },
    { name: "Politics", icon: VoteIcon, description: "News & developments" },
    { name: "Travel", icon: Plane, description: "Destinations & adventures" },
    { name: "Science", icon: Flask, description: "Discoveries & research" },
    { name: "Sports", icon: Trophy, description: "Games & competitions" },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden relative">
      <Header />
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-[#ff5733]/5 to-transparent blur-3xl"></div>
        <div className="absolute top-[60%] -right-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-[#ff5733]/5 to-transparent blur-3xl"></div>

        {/* Decorative lines */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[20%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff5733]/20 to-transparent"></div>
          <div className="absolute top-[80%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff5733]/20 to-transparent"></div>
          <div className="absolute top-0 left-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-[#ff5733]/20 to-transparent"></div>
          <div className="absolute top-0 left-[80%] w-[1px] h-full bg-gradient-to-b from-transparent via-[#ff5733]/20 to-transparent"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
        <header className="mb-16 text-center relative">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#ff5733] to-[#ff8c33]">
            Trending Categories
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Explore what&apos;s trending across different categories
          </p>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#ff5733] to-[#ff8c33]"></div>
        </header>

        <div className="relative">
          {/* Hexagonal grid layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {categories.map((category, index) => {
              // Calculate offset for staggered grid
              const isEvenRow = Math.floor(index / 4) % 2 === 0;
              const offsetClass = isEvenRow ? "md:translate-y-12" : "";

              return (
                <Link
                  key={category.name}
                  to={`/category/${category.name.toLowerCase()}`}
                  className="group !no-underline"
                >
                  <div key={index} className={`group relative ${offsetClass}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ff5733] to-[#ff8c33] rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>

                    <div className="relative bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg overflow-hidden transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-1">
                      {/* Decorative corner accent */}
                      <div className="absolute top-0 right-0 w-16 h-16">
                        <div className="absolute top-0 right-0 w-full h-full bg-[#ff5733] transform rotate-45 translate-x-1/2 -translate-y-1/2"></div>
                      </div>

                      <div className="p-6 relative z-10">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-[#ff5733]/20 rounded-md transform rotate-45"></div>
                            <category.icon className="w-6 h-6 text-[#ff5733] relative z-10" />
                          </div>
                          <h3 className="text-xl font-bold ml-3 tracking-tight">
                            {category.name}
                          </h3>
                        </div>

                        <p className="text-zinc-400 text-sm mb-4">
                          {category.description}
                        </p>

                        <div className="mt-2 flex justify-between items-center">
                          <div className="h-1 w-12 bg-gradient-to-r from-[#ff5733] to-transparent"></div>
                          <span className="text-[#ff5733] text-xs font-semibold tracking-widest uppercase">
                            Trending
                          </span>
                        </div>
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute bottom-0 left-0 w-8 h-8 bg-zinc-800/50 transform rotate-45 translate-x-[-50%] translate-y-[50%]"></div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-1/4 left-10 w-4 h-4 bg-[#ff5733]/30 rounded-full blur-sm animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-10 w-6 h-6 bg-[#ff5733]/20 rounded-full blur-sm animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-2/3 left-1/4 w-3 h-3 bg-[#ff5733]/40 rounded-full blur-sm animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
      <Footer />
    </main>
  );
}
