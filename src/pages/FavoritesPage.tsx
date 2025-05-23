import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ListTrend, SavedTrendObject } from "../types";
import { currentFavoritePostIds, currentFavorites } from "../Constants";
import TopTrend from "../components/TopTrend";
import LoadingPage from "./LoadingPage";
import { ChevronDown, Filter, Search, Star } from "lucide-react";

export default function FavoritesPage() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const [listOfFavorites, setListOfFavorites] = useState<ListTrend[]>(
    currentFavorites.value
  );
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(false);
  const [savedTrends, setSavedTrends] = useState<SavedTrendObject[] | null>(
    currentFavoritePostIds.value
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("alphabetical");
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

  /**
   * Fetches the user's favorite trends and saved trends from the server.
   *
   * This function makes two API calls:
   * 1. Gets all trends created by the user (getUsersTrends)
   * 2. Gets all trends saved by the user (getSavedTrends)
   *
   * The fetched data is then:
   * - Sorted alphabetically by title
   * - Stored in the component's state
   * - Stored in shared reference values
   *
   * @async
   * @function fetchFavorites
   * @requires user - The authenticated user object with a sub property (user ID)
   * @throws {Error} If API requests fail
   */
  async function fetchFavorites() {
    if (user?.sub) {
      setPageIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/getUsersTrends`,
          {
            params: {
              userId: user.sub,
            },
            withCredentials: true,
          }
        );

        const savedTrendsRes = await axios.get(
          `http://localhost:8080/api/users/getSavedTrends`,
          {
            params: {
              userId: user.sub,
            },
          }
        );

        setSavedTrends(savedTrendsRes.data);
        currentFavoritePostIds.value = savedTrendsRes.data;

        const userFavorites = response.data.sort(
          (a: { title: string }, b: { title: string }) =>
            a.title.localeCompare(b.title)
        );

        userFavorites.forEach((element: ListTrend) => {
          const id = element.id;
          savedTrendsRes.data.forEach((savedElement: SavedTrendObject) => {
            if (savedElement.postId === id) {
              element.dateSaved = savedElement.dateSaved;
            }
          });
        });

        setPageIsLoading(false);

        currentFavorites.value = userFavorites;
        setListOfFavorites(userFavorites);
      } catch (e) {
        console.error(e);
        setPageIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (currentFavorites.value.length === 0) fetchFavorites();
  }, [user]);

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/" />;
  }

  if (pageIsLoading) {
    return <LoadingPage message="Loading your favorites..." />;
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (order: string) => {
    setSortOrder(order);
    const sortedList: ListTrend[] = [...listOfFavorites];

    if (order === "alphabetical") {
      sortedList.sort((a, b) => a.title.localeCompare(b.title));
    } else if (order === "recent") {
      sortedList.sort(
        (a, b) =>
          new Date(b?.dateSaved || 0).getTime() -
          new Date(a?.dateSaved || 0).getTime()
      );
    } else if (order === "category") {
      sortedList.sort((a, b) => a.category.localeCompare(b.category));
    }

    setListOfFavorites(sortedList);
  };

  const filteredFavorites = listOfFavorites.filter((trend) =>
    trend.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center p-10 bg-[#2a2a2a] rounded-lg mt-10 text-center">
      <Star size={60} className="text-[#ff5733] mb-4" />
      <h2 className="text-2xl font-bold mb-2">No Favorites Yet</h2>
      <p className="text-gray-400 mb-6 max-w-md">
        Your favorites list is empty. Browse our trending topics and start
        building your collection!
      </p>
      <a
        href="/hottrends"
        className="px-6 py-3 bg-[#ff5733] text-white rounded-md hover:bg-[#e04b2b] transition-colors"
      >
        Explore Hot Trends
      </a>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#1e1e1e]">
      <Header />

      <div className="flex-grow px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero section */}
          <div className="bg-gradient-to-r from-[#ff5733] to-[#ff8c33] rounded-lg p-8 mb-8 shadow-lg">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Your Favorites
            </h1>
            <p className="text-white/90 max-w-2xl">
              Keep track of trends that matter to you. Your personal collection
              of the most interesting topics.
            </p>
          </div>

          {/* Search and filters */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search your favorites..."
                  className="w-full bg-[#2a2a2a] !border !border-[#3a3a3a] rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#ff5733] focus:border-transparent transition-all"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>

              <div className="relative">
                <button
                  className="flex items-center gap-2 bg-[#2a2a2a] !border !border-[#3a3a3a] !rounded-md py-2 px-4 text-white hover:bg-[#3a3a3a] transition-colors"
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                >
                  <Filter size={18} />
                  <span>Sort</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${
                      isFiltersOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isFiltersOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#2a2a2a] !border !border-[#3a3a3a] rounded-md shadow-lg z-10 animate-fadeIn">
                    <ul className="p-0">
                      <li
                        className={`px-4 py-2 hover:bg-[#3a3a3a] cursor-pointer ${
                          sortOrder === "alphabetical"
                            ? "text-[#ff5733]"
                            : "text-white"
                        }`}
                        onClick={() => handleSort("alphabetical")}
                      >
                        Alphabetical
                      </li>
                      <li
                        className={`px-4 py-2 hover:bg-[#3a3a3a] cursor-pointer ${
                          sortOrder === "recent"
                            ? "text-[#ff5733]"
                            : "text-white"
                        }`}
                        onClick={() => handleSort("recent")}
                      >
                        Recent
                      </li>
                      <li
                        className={`px-4 py-2 hover:bg-[#3a3a3a] cursor-pointer ${
                          sortOrder === "category"
                            ? "text-[#ff5733]"
                            : "text-white"
                        }`}
                        onClick={() => handleSort("category")}
                      >
                        By Category
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {filteredFavorites.length > 0 && (
              <p className="text-gray-400">
                Showing {filteredFavorites.length} of {listOfFavorites.length}{" "}
                favorites
              </p>
            )}
          </div>

          {/* Content */}
          {filteredFavorites.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFavorites.map((trend, index) => (
                <div
                  key={trend.id}
                  className="bg-[#2a2a2a] rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="p-1 !h-[100%]">
                    <TopTrend
                      trend={trend}
                      index={index}
                      savedTrends={savedTrends}
                      total={1}
                      className="!h-[100%]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
