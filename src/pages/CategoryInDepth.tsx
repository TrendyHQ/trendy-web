import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Trend } from "../types";
import { API_BASE_URL } from "../Constants";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingPage from "./LoadingPage";
import {
  Flame,
  TrendingUp,
  Activity,
  TrendingDown,
  BarChart3,
  ExternalLink,
  Filter,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CategoryInDepth() {
  const location = useLocation();

  const [trends, setTrends] = useState<Trend[]>([]);
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"score" | "value">("score");

  const formatScore = (score: number) => {
    if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}k`;
    }
    return score.toString();
  };  const checkCategory = useCallback(() => {
    const path = location.pathname;
    const category = path.split("/")[2];
    return category;
  }, [location.pathname]);

  const getCategoryDisplayName = useCallback(() => {
    const category = checkCategory();
    return category ? category.charAt(0).toUpperCase() + category.slice(1) : "Category";
  }, [checkCategory]);

  const sortedTrends = [...trends].sort((a, b) => {
    if (sortBy === "score") return b.score - a.score;
    return b.moreRelevantValue - a.moreRelevantValue;
  });  const getScoreColor = (score: number) => {
    if (score >= 1000) return "text-[#ff5733]";
    if (score >= 500) return "text-[#ff7f33]";
    if (score >= 250) return "text-[#ffab33]";
    return "text-gray-400";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 1000) return <Flame className="w-5 h-5 text-[#ff5733]" />;
    if (score >= 500) return <TrendingUp className="w-5 h-5 text-[#ff7f33]" />;
    return <Activity className="w-5 h-5 text-[#ffab33]" />;
  };
  const getTrendDirection = (value: number) => {
    if (value === 1) {
      return <TrendingUp className="w-5 h-5 text-[#ff5733]" />;
    } else if (value === -1) {
      return <TrendingDown className="w-5 h-5 text-red-400" />;
    }
    return <Activity className="w-5 h-5 text-gray-400" />;
  };

  const getTrendStatus = (value: number) => {
    if (value === 1) {
      return { 
        label: "Trending Up", 
        color: "text-[#ff5733]", 
        bgColor: "bg-[#ff5733]/10",
        description: "Currently gaining momentum"
      };
    } else if (value === -1) {
      return { 
        label: "Trending Down", 
        color: "text-red-400", 
        bgColor: "bg-red-400/10",
        description: "Decreasing in popularity"
      };
    }
    return { 
      label: "Stable", 
      color: "text-gray-400", 
      bgColor: "bg-gray-400/10",
      description: "No significant change"
    };
  };const getTrendsForCategory = useCallback(() => {
    setPageIsLoading(true);
    axios
      .post(
        `${API_BASE_URL}/api/reddit/topTrendsForCategory`,
        { categoryName: checkCategory() },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setTrends(res.data);
      })
      .catch((_error) => {
        // Log error to external service in production
        // Error handling for failed API request
      })
      .finally(() => {
        setPageIsLoading(false);
      });
  }, [checkCategory]);
  useEffect(() => {
    getTrendsForCategory();
  }, [getTrendsForCategory]);

  if (pageIsLoading || trends.length === 0) {
    return <LoadingPage />;
  }
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_35px,rgba(255,87,51,0.1)_35px,rgba(255,87,51,0.1)_70px)]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          {/* Enhanced Header Section */}
          <div className="mb-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <span>Home</span>
              <ArrowUpRight className="w-3 h-3 rotate-45" />
              <span>Categories</span>
              <ArrowUpRight className="w-3 h-3 rotate-45" />
              <span className="text-[#ff5733]">{getCategoryDisplayName()}</span>
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
                        <BarChart3 className="w-8 h-8 text-[#ff5733]" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-5xl font-bold bg-gradient-to-r from-[#ff5733] via-[#ff7f33] to-[#ffab33] bg-clip-text text-transparent">
                        {getCategoryDisplayName()}
                      </h1>
                      <p className="text-gray-300 text-lg mt-2">
                        Trending Analysis & Insights
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
                      <div className="text-2xl font-bold text-white">{trends.length}</div>
                      <div className="text-xs text-gray-400">Active Trends</div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl">
                  Discover the latest trending topics and emerging patterns in the{" "}
                  <span className="text-[#ff5733] font-medium">{getCategoryDisplayName().toLowerCase()}</span> sector.
                  Real-time insights powered by advanced analytics.
                </p>

                {/* Enhanced Sort Controls */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">Sort by:</span>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant={sortBy === "score" ? "default" : "outline"}
                      onClick={() => setSortBy("score")}
                      className={`${
                        sortBy === "score"
                          ? "bg-gradient-to-r from-[#ff5733] to-[#ff7f33] hover:from-[#e64a2e] hover:to-[#e66b2e] text-white !border-none shadow-lg shadow-[#ff5733]/25"
                          : "bg-gray-800/50 !border-gray-600/50 text-gray-300 hover:bg-[#ff5733]/10 hover:!border-[#ff5733]/30 hover:text-[#ff5733] backdrop-blur-sm"
                      } transition-all duration-300 px-6 py-2.5 rounded-xl font-medium`}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Trend Score
                    </Button>
                    <Button
                      variant={sortBy === "value" ? "default" : "outline"}
                      onClick={() => setSortBy("value")}
                      className={`${
                        sortBy === "value"
                          ? "bg-gradient-to-r from-[#ff5733] to-[#ff7f33] hover:from-[#e64a2e] hover:to-[#e66b2e] text-white !border-none shadow-lg shadow-[#ff5733]/25"
                          : "bg-gray-800/50 !border-gray-600/50 text-gray-300 hover:bg-[#ff5733]/10 hover:!border-[#ff5733]/30 hover:text-[#ff5733] backdrop-blur-sm"
                      } transition-all duration-300 px-6 py-2.5 rounded-xl font-medium`}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Relevance
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>          {/* Enhanced Trends Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {sortedTrends.map((trend, index) => {
              const trendStatus = getTrendStatus(trend.moreRelevantValue);
              return (
                <Card
                  key={trend.id}
                  className="group relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border !border-gray-700/50 hover:!border-[#ff5733]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#ff5733]/10 rounded-2xl overflow-hidden"
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff5733]/5 via-transparent to-[#ff5733]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Rank Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center gap-2">
                      {getScoreIcon(trend.score)}
                      <Badge className="bg-gray-800/80 text-gray-200 !border-gray-600/50 hover:bg-gray-700/80 backdrop-blur-sm px-3 py-1 rounded-full">
                        #{index + 1}
                      </Badge>
                    </div>
                  </div>

                  {/* Score Display */}
                  <div className="absolute top-4 right-4 text-right">
                    <div className={`text-3xl font-bold ${getScoreColor(trend.score)} group-hover:scale-110 transition-transform duration-300`}>
                      {formatScore(trend.score)}
                    </div>
                    <div className="text-xs text-gray-400 font-medium">TREND SCORE</div>
                  </div>

                  <CardHeader className="pt-20 pb-4 px-6">
                    <CardTitle className="text-xl text-white leading-tight line-clamp-2 group-hover:text-[#ff5733] transition-colors duration-300">
                      {trend.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6 p-6 pt-0">
                    {/* Trend Status Indicator */}
                    <div className={`flex items-center justify-between p-4 rounded-xl border ${trendStatus.bgColor} !border-gray-700/30`}>
                      <div className="flex items-center gap-3">
                        {getTrendDirection(trend.moreRelevantValue)}
                        <div>
                          <span className="text-sm text-gray-300 font-medium">Trend Status</span>
                          <div className={`text-xs ${trendStatus.color} font-semibold`}>
                            {trendStatus.label}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${trendStatus.color}`}>
                          {trend.moreRelevantValue === 1 ? "↗" : trend.moreRelevantValue === -1 ? "↘" : "→"}
                        </div>
                        <div className="text-xs text-gray-400">{trendStatus.description}</div>
                      </div>
                    </div>

                    {/* Trend Momentum Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Trend Momentum</span>
                        <span>{trendStatus.label}</span>
                      </div>
                      <div className="relative w-full bg-gray-800/50 rounded-full h-3 border !border-gray-700/50 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
                            trend.moreRelevantValue === 1 
                              ? "bg-gradient-to-r from-[#ff5733] to-[#ff7f33] w-full" 
                              : trend.moreRelevantValue === -1 
                              ? "bg-gradient-to-r from-red-500 to-red-400 w-2/3" 
                              : "bg-gradient-to-r from-gray-500 to-gray-400 w-1/3"
                          }`}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                        </div>
                      </div>
                    </div>                    {/* Description */}
                    {trend.moreInfo && trend.moreInfo.trim() !== "" ? (
                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                        {trend.moreInfo}
                      </p>
                    ) : (
                      <p className="text-gray-400 text-sm leading-relaxed italic">
                        No additional information available for this trend.
                      </p>
                    )}

                    {/* Enhanced Action Button */}
                    <Button
                      variant="outline"
                      className="w-full bg-transparent !border-[#ff5733]/30 text-[#ff5733] hover:bg-[#ff5733] hover:text-white hover:!border-[#ff5733] transition-all duration-300 rounded-xl py-3 font-medium group-hover:shadow-lg group-hover:shadow-[#ff5733]/25"
                      onClick={() => window.open(trend.link, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Explore Trend
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Enhanced Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border !border-gray-700/50 rounded-2xl overflow-hidden">
              <CardContent className="p-6 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff5733]/5 to-transparent"></div>
                <div className="relative">
                  <div className="text-4xl font-bold text-[#ff5733] mb-2">
                    {trends.length}
                  </div>
                  <div className="text-gray-300 font-medium">Total Trends</div>
                  <div className="text-xs text-gray-400 mt-1">Active now</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border !border-gray-700/50 rounded-2xl overflow-hidden">
              <CardContent className="p-6 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff7f33]/5 to-transparent"></div>
                <div className="relative">
                  <div className="text-4xl font-bold text-[#ff7f33] mb-2">
                    {Math.round(
                      trends.reduce((acc, trend) => acc + trend.score, 0) / trends.length
                    )}
                  </div>
                  <div className="text-gray-300 font-medium">Avg Score</div>
                  <div className="text-xs text-gray-400 mt-1">Trend strength</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border !border-gray-700/50 rounded-2xl overflow-hidden">
              <CardContent className="p-6 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ffab33]/5 to-transparent"></div>
                <div className="relative">
                  <div className="text-4xl font-bold text-[#ffab33] mb-2">
                    {trends.filter((trend) => trend.score >= 1000).length}
                  </div>
                  <div className="text-gray-300 font-medium">Hot Trends</div>
                  <div className="text-xs text-gray-400 mt-1">Score ≥ 1000</div>
                </div>
              </CardContent>
            </Card>            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border !border-gray-700/50 rounded-2xl overflow-hidden">
              <CardContent className="p-6 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff5733]/5 to-transparent"></div>
                <div className="relative">
                  <div className="text-4xl font-bold text-[#ff5733] mb-2">
                    {trends.filter((trend) => trend.moreRelevantValue === 1).length}
                  </div>
                  <div className="text-gray-300 font-medium">Trending Up</div>
                  <div className="text-xs text-gray-400 mt-1">Growing trends</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
