import "../css/Categories.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function Categories() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/" />;
  }

  const categories = [
    {
      name: "Fashion",
      description: "Latest trends, styles, and fashion insights",
      icon: "👗",
    },
    {
      name: "Technology",
      description: "Gadgets, software, and tech innovations",
      icon: "💻",
    },
    {
      name: "Food & Beverages",
      description: "Recipes, restaurants, and culinary experiences",
      icon: "🍔",
    },
    {
      name: "Entertainment",
      description: "Movies, shows, and entertainment news",
      icon: "🎬",
    },
    {
      name: "Social Media",
      description: "News, journalism, and media coverage",
      icon: "📰",
    },
    {
      name: "Fitness",
      description: "Workouts, training tips, and fitness advice",
      icon: "💪",
    },
    {
      name: "Health",
      description: "Wellness, medical advice, and health tips",
      icon: "🏥",
    },
    {
      name: "Music",
      description: "Artists, albums, and music industry news",
      icon: "🎵",
    },
    {
      name: "Politics",
      description: "Political news, policies, and global affairs",
      icon: "🏛️",
    },
    {
      name: "Travel",
      description: "Destinations, travel guides, and adventures",
      icon: "✈️",
    },
    {
      name: "Science",
      description: "Research, discoveries, and scientific breakthroughs",
      icon: "🔬",
    },
    {
      name: "Sports",
      description: "Games, athletes, and sporting events",
      icon: "🏆",
    },
  ];

  return (
    <div className="min-h-screen bg-[#242424]">
      <Header />

      <main>
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4 text-white">
              Explore Categories
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Discover content across our diverse range of categories. Click on
              any category to explore more.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/category/${category.name.toLowerCase()}`}
                className="group !no-underline"
              >
                <Card 
                  className="!h-full !border-neutral-700 hover:!border-[#ff5733] !transition-all !duration-300 !overflow-hidden" 
                  style={{ 
                    background: `linear-gradient(
                      135deg,
                      #3a3a3a 0%,
                      #333333 25%,
                      #2e2e2e 50%,
                      #333333 75%,
                      #3a3a3a 100%
                    )`
                  }}
                >
                  <CardContent className="p-6">
                    <div className="!mb-4 !text-4xl">{category.icon}</div>
                    <h2 className="!text-xl !font-bold !mb-2 !text-[#ff5733] group-hover:!translate-x-1 !transition-transform !duration-300">
                      {category.name}
                    </h2>
                    <p className="!text-gray-400 !mb-4">{category.description}</p>
                    <div className="!flex !items-center !text-[#ff5733] !opacity-0 group-hover:!opacity-100 !transition-opacity !duration-300">
                      <span className="!mr-2">Explore</span>
                      <ArrowRight
                        size={16}
                        className="group-hover:!translate-x-1 !transition-transform !duration-300"
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
