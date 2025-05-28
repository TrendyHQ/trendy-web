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
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function Categories() {  const categories = [
    {
      name: "Fashion",
      icon: ShoppingBag,
      description: "Latest styles & trends",
      color: "#ff5733"
    },
    { 
      name: "Technology", 
      icon: Cpu, 
      description: "Gadgets & innovations",
      color: "#ff7f33"
    },
    {
      name: "Food & Beverages",
      icon: Utensils,
      description: "Culinary experiences",
      color: "#ffab33"
    },
    {
      name: "Entertainment",
      icon: Film,
      description: "Movies, shows & events",
      color: "#ff5733"
    },
    { 
      name: "Social Media", 
      icon: Share2, 
      description: "Platforms & content",
      color: "#ff7f33"
    },
    { 
      name: "Fitness", 
      icon: Dumbbell, 
      description: "Workouts & routines",
      color: "#ffab33"
    },
    { 
      name: "Health", 
      icon: Heart, 
      description: "Wellness & lifestyle",
      color: "#ff5733"
    },
    { 
      name: "Music", 
      icon: Music, 
      description: "Artists & releases",
      color: "#ff7f33"
    },
    { 
      name: "Politics", 
      icon: VoteIcon, 
      description: "News & developments",
      color: "#ffab33"
    },
    { 
      name: "Travel", 
      icon: Plane, 
      description: "Destinations & adventures",
      color: "#ff5733"
    },
    { 
      name: "Science", 
      icon: Flask, 
      description: "Discoveries & research",
      color: "#ff7f33"
    },
    { 
      name: "Sports", 
      icon: Trophy, 
      description: "Games & competitions",
      color: "#ffab33"
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_35px,rgba(255,87,51,0.1)_35px,rgba(255,87,51,0.1)_70px)]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          {/* Enhanced Header Section */}
          <div className="mb-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
              <span>Home</span>
              <ArrowUpRight className="w-3 h-3 rotate-45" />
              <span className="text-[#ff5733]">Categories</span>
            </div>

            {/* Main Title */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#ff5733]/20 via-transparent to-[#ff5733]/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-gray-900/50 backdrop-blur-sm border !border-gray-800/50 rounded-2xl p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#ff5733]/20 rounded-full blur-lg"></div>
                      <div className="relative bg-[#ff5733]/10 border !border-[#ff5733]/30 rounded-full p-3">
                        <Sparkles className="w-8 h-8 text-[#ff5733]" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-5xl font-bold bg-gradient-to-r from-[#ff5733] via-[#ff7f33] to-[#ffab33] bg-clip-text text-transparent">
                        Trending Categories
                      </h1>                      <p className="text-gray-300 text-lg mt-2">
                        Discover What&apos;s Hot
                      </p>
                    </div>
                  </div>
                  
                  {/* Live Stats Badge */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 bg-[#ff5733]/10 border !border-[#ff5733]/30 rounded-full px-4 py-2">
                      <div className="w-2 h-2 bg-[#ff5733] rounded-full animate-pulse"></div>
                      <span className="text-sm text-[#ff5733] font-medium">Live Data</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{categories.length}</div>
                      <div className="text-xs text-gray-400">Categories</div>
                    </div>
                  </div>
                </div>                <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
                  Explore trending topics across all major categories. From technology and entertainment 
                  to fashion and lifestyle, discover what&apos;s capturing the world&apos;s attention right now.
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/category/${category.name.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}`}
                className="group !no-underline"
              >
                <div
                  className="group relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border !border-gray-700/50 hover:!border-[#ff5733]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#ff5733]/10 rounded-2xl overflow-hidden h-full"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff5733]/5 via-transparent to-[#ff5733]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Top Accent Bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-[#ff5733] to-[#ff7f33]"></div>

                  <div className="p-6 relative">
                    {/* Icon with enhanced styling */}
                    <div className="mb-6 relative">
                      <div className="absolute -inset-3 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                           style={{ backgroundColor: `${category.color}20` }}></div>
                      <div className="relative w-16 h-16 flex items-center justify-center rounded-xl border !border-[#903733] transition-all duration-300"
                           style={{ 
                             backgroundColor: `${category.color}10`, 
                             borderColor: `${category.color}30` 
                           }}>
                        <category.icon className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" 
                                      style={{ color: category.color }} />
                      </div>
                    </div>                    {/* Category Info */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#ff5733] transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        {category.description}
                      </p>
                    </div>

                    {/* Action Area */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="h-[2px] w-12 bg-gradient-to-r from-[#ff5733] to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="flex items-center gap-2 text-[#ff5733] text-xs font-semibold tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                        <span>Explore</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute bottom-0 right-0 w-8 h-8 transform rotate-45 translate-x-1/2 translate-y-1/2 opacity-20 transition-opacity duration-300 group-hover:opacity-40"
                           style={{ backgroundColor: category.color }}></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Enhanced Stats Section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border !border-gray-700/50 rounded-2xl p-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff5733]/5 to-transparent rounded-xl"></div>
                <div className="relative">
                  <div className="text-4xl font-bold text-[#ff5733] mb-2">12</div>
                  <div className="text-gray-300 font-medium">Categories</div>
                  <div className="text-xs text-gray-400 mt-1">Available</div>
                </div>
              </div>
            </div>            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border !border-gray-700/50 rounded-2xl p-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff7f33]/5 to-transparent rounded-xl"></div>
                <div className="relative">
                  <div className="text-4xl font-bold text-[#ff7f33] mb-2">Real-time</div>
                  <div className="text-gray-300 font-medium">Trending Data</div>
                  <div className="text-xs text-gray-400 mt-1">From multiple sources</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border !border-gray-700/50 rounded-2xl p-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ffab33]/5 to-transparent rounded-xl"></div>
                <div className="relative">
                  <div className="text-4xl font-bold text-[#ffab33] mb-2">Live</div>
                  <div className="text-gray-300 font-medium">Real-time Data</div>
                  <div className="text-xs text-gray-400 mt-1">Updated continuously</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
