import {
  ShoppingBag,
  Cpu,
  Utensils,
  Film,
  Share2,
  Dumbbell,
  Heart,
  Music,
  VoteIcon,
  Plane,
  FlaskRoundIcon as Flask,
  Trophy,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function Categories() {
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
    <main className="min-h-screen bg-[#0f0f12] text-zinc-100 overflow-hidden relative">
      <Header />
      {/* Sophisticated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,87,51,0.08)_0%,rgba(15,15,18,0)_70%)]"></div>

        {/* Hexagonal grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 17.32v34.64L30 60 0 51.96V17.32L30 0zm0 5.77L6.18 20.19v28.62L30 54.23l23.82-5.42V20.19L30 5.77z' fill='%23ff5733' fillOpacity='0.2' fillRule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        ></div>

        {/* Horizontal accent line */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff5733]/30 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
        {/* Header with refined styling */}
        <header className="mb-20 text-center relative">
          <div className="inline-block relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ff5733]/80 to-[#ff8c33]/80 blur-xl opacity-30 rounded-full"></div>
            <h1 className="!relative !text-7xl !md:text-8xl !font-bold !mb-4 !bg-clip-text !text-transparent !bg-gradient-to-r !from-[#ff5733] !to-[#ff8c33]">
              Trending Categories
            </h1>
          </div>
          <p className="text-zinc-400 !max-w-2xl !mx-auto !text-lg !mt-6">
            Explore what&apos;s trending across different categories
          </p>
          <div className="mt-8 mx-auto w-24 h-1 bg-gradient-to-r from-[#ff5733] to-[#ff8c33] rounded-full"></div>
        </header>

        {/* Refined grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 perspective-1000">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={`/category/${category.name.toLowerCase()}`}
              className="group !no-underline"
            >
              <div
                key={index}
                className="group relative transform transition-all duration-700 hover:scale-105 hover:z-10"
                style={{
                  animationDelay: `${index * 100}ms`,
                  transform: `translateZ(${(index % 3) * 5}px)`,
                }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff5733] to-[#ff8c33] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-700 -z-10"></div>

                {/* Main card with consistent styling */}
                <div className="relative h-full bg-[#1a1a20] backdrop-blur-sm border !border-[#ff5733]/10 rounded-2xl overflow-hidden shadow-lg shadow-black/30 transition-all duration-500">
                  {/* Top accent bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-[#ff5733] to-[#ff8c33]"></div>

                  <div className="p-8">
                    {/* Icon with consistent styling */}
                    <div className="mb-6 relative">
                      <div className="absolute -inset-3 bg-gradient-to-br from-[#ff5733]/20 to-[#ff8c33]/5 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="relative w-14 h-14 flex items-center justify-center bg-[#ff5733]/10 rounded-xl border !border-[#ff5733]/20">
                        <category.icon className="w-7 h-7 text-[#ff5733]" />
                      </div>
                    </div>

                    {/* Category name with consistent styling */}
                    <h3 className="text-2xl w-[300px] font-bold mb-3 text-white group-hover:text-[#ff5733] transition-colors duration-300">
                      {category.name}
                    </h3>

                    {/* Description with consistent styling */}
                    <p className="text-zinc-400 mb-6">{category.description}</p>

                    {/* Bottom accent with consistent styling */}
                    <div className="flex items-center justify-between">
                      <div className="h-[2px] w-12 bg-gradient-to-r from-[#ff5733] to-transparent"></div>
                      <span className="text-[#ff5733] text-xs font-semibold tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                        Trending
                      </span>
                    </div>

                    {/* Corner accent */}
                    <div className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-[#ff5733] to-[#ff8c33] transform rotate-45 translate-x-1/2 translate-y-1/2 opacity-30"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Floating accent elements with consistent styling */}
        <div className="absolute top-1/4 left-[10%] w-6 h-6 rounded-full bg-[#ff5733]/10 backdrop-blur-sm border !border-[#ff5733]/20 animate-float"></div>
        <div
          className="absolute bottom-1/3 right-[10%] w-8 h-8 rounded-full bg-[#ff5733]/10 backdrop-blur-sm border !border-[#ff5733]/20 animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-2/3 left-1/4 w-4 h-4 rounded-full bg-[#ff5733]/10 backdrop-blur-sm border !border-[#ff5733]/20 animate-float"
          style={{ animationDelay: "2.5s" }}
        ></div>
      </div>
      <Footer />
    </main>
  );
}
