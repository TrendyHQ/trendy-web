import { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import { Trend } from "../types";
import { useAuth0 } from "@auth0/auth0-react";
import { currentFavoritePostIds, currentHotTrends } from "../Constants";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Navigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Search,
  FlameIcon as Fire,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function HotPage() {
  const { user, isLoading, isAuthenticated } = useAuth0();

  const [topTrends, setTopTrends] = useState<Trend[] | null>(
    currentHotTrends.value
  );
  const [hotTrendsLoading, setHotTrendsLoading] = useState<boolean>(false);

  const updateTrendsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const updateTopTrends = async () => {
    // Prevent a new update if one is already in progress
    if (hotTrendsLoading || !user) return;

    setHotTrendsLoading(true);

    try {
      const trendsRes = await axios.post(
        "http://localhost:8080/api/reddit/topReddit",
        { requestAmount: 50, userId: user.sub }
      );

      const savedTrendsRes = await axios.get(
        "http://localhost:8080/api/users/getSavedTrends",
        {
          params: {
            userId: user.sub,
          },
        }
      );

      currentFavoritePostIds.value = savedTrendsRes.data;

      setHotTrendsLoading(false);
      currentHotTrends.value = trendsRes.data;
      setTopTrends(trendsRes.data);
    } catch (error) {
      console.error("Error updating top trends:", error);
    }
  };

  useEffect(() => {
    if (currentHotTrends.value === null || currentHotTrends.value.length === 0)
      updateTopTrends();
    console.log(currentHotTrends.value);

    // Set up the interval if it's not already set
    if (updateTrendsIntervalRef.current === null) {
      updateTrendsIntervalRef.current = setInterval(() => {
        updateTopTrends();
      }, 180000); // 180,000ms = 3 minutes
    }

    // Clean up the interval on component unmount
    return () => {
      if (updateTrendsIntervalRef.current !== null) {
        clearInterval(updateTrendsIntervalRef.current);
      }
    };
  }, [user]);

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/" />;
  }

  if (hotTrendsLoading || isLoading) {
    return <LoadingPage />;
  }

  return (
    <main className="min-h-screen bg-[#121212] text-gray-100">
      <Header />
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#ff5733] to-[#ff8c33]">
          Trending Topics
        </h1>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Discover the most popular trends across various categories, updated in
          real-time
        </p>
        <MainComponent topTrends={topTrends || []} />
      </div>
      <Footer />
    </main>
  );
}

function MainComponent({ topTrends = [] }: { topTrends: Trend[] }) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);
  };

  // Calculate score percentage on a logarithmic scale for better visualization
  const calculateScorePercentage = (
    score: number,
    min: number,
    max: number
  ) => {
    // Using logarithmic scale to better visualize the range
    const logMin = Math.log(min);
    const logMax = Math.log(max);
    const logScore = Math.log(score);

    // Calculate percentage on log scale
    const percentage = ((logScore - logMin) / (logMax - logMin)) * 100;

    // Ensure it's between 0 and 100
    return Math.max(0, Math.min(100, percentage));
  };

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All",
    ...Array.from(new Set(topTrends.map((trend) => trend.category))),
  ];

  // Calculate min and max scores for visualization
  const minScore = useMemo(
    () => Math.min(...topTrends.map((t) => t.score)),
    []
  );
  const maxScore = useMemo(
    () => Math.max(...topTrends.map((t) => t.score)),
    []
  );

  const filteredTrends = topTrends.filter((trend) => {
    const matchesCategory =
      activeTab === "all" ||
      trend.category.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      trend.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trend.moreInfo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform !border-0 -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search trends..."
            className="pl-10 bg-[#252525] border-[#333333] text-gray-200 focus:border-[#ff5733] focus:ring-[#ff5733]/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs
          defaultValue="all"
          className="w-full md:w-auto"
          onValueChange={setActiveTab}
        >
          <TabsList className="bg-[#252525] p-1 rounded-lg">
            {categories.map((category) => (
              <TabsTrigger
                key={category.toLowerCase()}
                value={category.toLowerCase()}
                className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-[#ff5733] data-[state=active]:shadow-sm"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Score range:</span>
          <div className="h-2 w-32 bg-gradient-to-r from-[#ff573311] via-[#ff5733] to-[#ff8c33] rounded-full" />
          <span className="text-xs text-gray-500">
            {formatNumber(minScore)} - {formatNumber(maxScore)}
          </span>
        </div>
        <div className="text-sm text-gray-400">
          Showing{" "}
          <span className="text-white font-medium">
            {filteredTrends.length}
          </span>{" "}
          of <span className="text-white font-medium">{topTrends.length}</span>{" "}
          trends
        </div>
      </div>

      {filteredTrends.length === 0 ? (
        <div className="text-center py-20 bg-[#1e1e1e] rounded-xl 18.2.0border-[#333333]">
          <p className="text-gray-400 text-lg">
            No trends found matching your criteria
          </p>
          <Button
            variant="outline"
            className="mt-4 border-[#ff5733] text-[#ff5733] hover:bg-[#ff5733]/10"
            onClick={() => {
              setSearchQuery("");
              setActiveTab("all");
            }}
          >
            Reset filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrends.map((trend, index) => (
            <TrendCard
              key={trend.id}
              trend={trend}
              index={index}
              minScore={minScore}
              maxScore={maxScore}
              calculateScorePercentage={calculateScorePercentage}
              formatNumber={formatNumber}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const TrendCard = ({
  trend,
  index,
  minScore,
  maxScore,
  calculateScorePercentage,
  formatNumber,
}: {
  trend: Trend;
  index: number;
  minScore: number;
  maxScore: number;
  calculateScorePercentage: (score: number, min: number, max: number) => number;
  formatNumber: (num: number) => string;
}) => {
  const scorePercentage = calculateScorePercentage(
    trend.score,
    minScore,
    maxScore
  );

  // Determine heat level based on score percentile
  const getHeatLevel = () => {
    if (scorePercentage > 80)
      return "bg-gradient-to-r from-[#ff5733] to-[#ff8c33] text-white";
    if (scorePercentage > 60) return "bg-[#ff5733] text-white";
    if (scorePercentage > 40) return "bg-[#ff573333] text-[#ff8c33]";
    if (scorePercentage > 20) return "bg-[#ff573322] text-[#ff8c33]";
    return "bg-[#ff573311] text-[#ff8c33]";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="h-full"
      whileHover={{ y: -5 }}
    >
      <Link to={trend.link} className="block group h-full">
        <div className="bg-gradient-to-b from-[#1e1e1e] to-[#181818] border border-[#333333] rounded-xl p-6 hover:border-[#ff5733]/50 transition-all duration-300 h-full flex flex-col relative overflow-hidden hover:shadow-[0_5px_30px_rgba(255,87,51,0.25)] backdrop-blur-sm before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptNiAwaC00djFoNHYtMXptLTYtM2gtNHYxaDR2LTF6bTYgMGgtNHYxaDR2LTF6bS02LTNoLTR2MWg0di0xem0tNi0zaC00djFoNHYtMXptMTIgMGgtNHYxaDR2LTF6bS02IDBoLTR2MWg0di0xem0tNi0zaC00djFoNHYtMXptMTIgMGgtNHYxaDR2LTF6bS02IDBoLTR2MWg0di0xem0tNi0zaC00djFoNHYtMXptMTIgMGgtNHYxaDR2LTF6bS02IDBoLTR2MWg0di0xeiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+')] before:opacity-40 before:z-0">
          
          {/* Top trend badge */}
          {index < 3 && (
            <div className="absolute -top-2 -right-2 z-10">
              <div className="bg-gradient-to-r from-[#ff5733] to-[#ff8c33] text-white font-semibold py-1.5 px-3 text-xs rounded-md shadow-lg flex items-center gap-1.5 rotate-12 transform origin-top-right">
                <Fire className="h-3.5 w-3.5 animate-pulse" /> HOT TREND
              </div>
            </div>
          )}

          <div className="flex justify-between items-start mb-5 relative z-10">
            <Badge className={`${getHeatLevel()} border-none font-medium uppercase tracking-wide text-xs py-1 px-3`}>
              {trend.category}
            </Badge>
            <div className="flex items-center gap-1.5 text-sm font-semibold bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/5 shadow-inner">
              <Fire
                className={`h-4 w-4 ${
                  scorePercentage > 60 ? "text-[#ff5733]" : "text-[#ff8c33]"
                } ${scorePercentage > 80 ? 'animate-pulse' : ''}`}
              />
              <span className="text-gray-200 font-mono">{formatNumber(trend.score)}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-3 text-gray-100 group-hover:text-[#ff5733] transition-colors line-clamp-2">
            {trend.title}
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
            {trend.moreInfo}
          </p>

          <div className="mt-auto space-y-4">
            <div className="w-full bg-[#252525] rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ff5733] to-[#ff8c33]"
                style={{ width: `${scorePercentage}%` }}
              />
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#333333]">
              <span className="text-sm text-gray-400 flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5" />{" "}
                <span className="font-medium text-gray-300">{formatNumber(trend.moreRelevantValue)}</span>
              </span>
              <span className="text-[#ff5733] flex items-center gap-1.5 text-sm font-medium group-hover:translate-x-0 -translate-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                View details <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
