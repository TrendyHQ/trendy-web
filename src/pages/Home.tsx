import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/Home.css";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Clapperboard,
  CupSoda,
  Dumbbell,
  FlaskConical,
  Headset,
  HeartPulse,
  Icon,
  MessageCircle,
  Music,
  Plane,
  Shirt,
  Flag,
  Star,
  RefreshCcw,
} from "lucide-react";
import { football } from "@lucide/lab";
import { GoogleTrendsData, SavedTrendObject, Trend } from "../types";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  testing,
  currentTopTrends,
  currentHasSetUpAccount,
  currentFavoritePostIds,
  storedTopTrends,
} from "../Constants";
import TopTrend from "../components/TopTrend";
import SetUpPage from "./SetUpPage";
import ErrorPage from "./ErrorPage";

export default function Home() {
  const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0();

  const [topTrends, setTopTrends] = useState<Trend[] | null>(
    currentTopTrends.value
  );
  const [hotTrendsLoading, setHotTrendsLoading] = useState(false);
  const [configIsLoading, setConfigIsLoading] = useState<boolean>(true);
  const [hasSetUpAccount, setHasSetUpAccount] = useState<boolean | null>(
    currentHasSetUpAccount.value
  );
  const [savedTrends, setSavedTrends] = useState<SavedTrendObject[] | null>(
    currentFavoritePostIds.value
  );
  const [isError, setIsError] = useState<boolean>(false);
  const [topCategories, setTopCategories] = useState<GoogleTrendsData[]>(
    storedTopTrends.value
  );

  const nicknameInputRef = useRef<HTMLInputElement | null>(null);
  const updateTrendsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const birthDateInputRef = useRef<HTMLInputElement | null>(null);

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

  const fetchUserProperty = async (property: string) => {
    if (user) {
      setConfigIsLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:8080/api/users/getUserProperty",
          {
            params: {
              userId: user.sub,
              property: property,
            },
          }
        );
        if (property === "hasSetUpAccount") {
          setHasSetUpAccount(res.data);
          currentHasSetUpAccount.value = res.data;
        }
      } catch (error) {
        setIsError(true);
        console.error("Error fetching first login status:", error);
      } finally {
        setConfigIsLoading(false);
      }
    }
  };

  const updateTopTrends = async (load?: boolean) => {
    // Prevent a new update if one is already in progress
    if (hotTrendsLoading || !user) return;

    if (load != false) setHotTrendsLoading(true);

    try {
      const googleTrendInfo: { data: GoogleTrendsData[] } = await axios.get(
        "http://localhost:8080/api/google/info",
        {
          params: {
            location: await getUserLocation(),
          },
        }
      );

      const googleTrendData: GoogleTrendsData[] = googleTrendInfo.data;

      console.log(googleTrendData);
      googleTrendData.sort((a, b) => b.score - a.score);
      storedTopTrends.value = googleTrendData;
      setTopCategories(googleTrendData);

      const trendsRes = await axios.post(
        "http://localhost:8080/api/reddit/topReddit",
        { requestAmount: 6, userId: user.sub }
      );

      const savedTrendsRes = await axios.get(
        "http://localhost:8080/api/users/getSavedTrends",
        {
          params: {
            userId: user.sub,
          },
        }
      );

      setSavedTrends(savedTrendsRes.data);
      currentFavoritePostIds.value = savedTrendsRes.data;

      setHotTrendsLoading(false);
      currentTopTrends.value = trendsRes.data;
      setTopTrends(trendsRes.data);
    } catch (error) {
      console.error("Error updating top trends:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !testing) {
      try {
        // Perform an immediate update on component mount
        if (currentTopTrends.value == null) updateTopTrends();

        // Set up the interval if it's not already set
        if (updateTrendsIntervalRef.current === null) {
          updateTrendsIntervalRef.current = setInterval(() => {
            updateTopTrends(false);
          }, 180000); // 180,000ms = 3 minutes
        }
      } catch (e) {
        console.error(e);
      }

      // Clean up the interval on component unmount
      return () => {
        if (updateTrendsIntervalRef.current !== null) {
          clearInterval(updateTrendsIntervalRef.current);
        }
      };
    }
  }, [isAuthenticated, hasSetUpAccount]);

  useEffect(() => {
    try {
      if (currentHasSetUpAccount.value == false)
        fetchUserProperty("hasSetUpAccount");
    } catch (e) {
      setIsError(true);
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    console.log(user);
  }, [isAuthenticated]);

  const updateInformation = async () => {
    const nickname: string | null = nicknameInputRef.current?.value || null;
    const gender: string | null =
      (
        document.querySelector(
          'input[name="genderInput"]:checked'
        ) as HTMLInputElement
      )?.value || null;
    const birthDate: string | null = birthDateInputRef.current?.value || null;

    const jsonRequest = JSON.stringify({
      nickname: nickname,
      app_metadata: {
        hasSetUpAccount: true,
      },
      user_metadata: {
        gender: gender,
        birthDate: birthDate,
      },
    });

    if ((nickname || gender) && user) {
      try {
        await axios.patch(
          "http://localhost:8080/api/users/updateUserInformation",
          {
            userId: user.sub,
            toUpdate: jsonRequest,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setHasSetUpAccount(true);
      } catch (error) {
        console.error("Error updating user information:", error);
      }
    }
  };

  const getLoadingTrendElements = () => {
    const elements = [];
    for (let i = 0; i < 6; i++) {
      elements.push(
        <div key={"topTrend" + i} style={{ cursor: "default" }}>
          <div className="top-trend pl-2 pr-2 pt-1 pb-1 rounded-xl">
            <Star
              size={30}
              strokeWidth={1.5}
              color="grey"
              style={{ animationDelay: `${0.1 * i}s` }}
              className="textLoading"
            />
            <div className="vertical-divider"></div>
            <h2
              style={{ animationDelay: `${0.1 * i}s` }}
              className="top-trend-name textLoading"
            >
              Loading...
            </h2>
          </div>
          {i < 5 && (
            <div className="trend-divider rounded mt-[2px] mb-[2px]"></div>
          )}
        </div>
      );
    }
    return elements;
  };

  /**
   * Organizes the top categories into three balanced columns for display.
   *
   * This function divides the top categories into three columns based on predefined index ranges:
   * - Column 1: indices 0-3
   * - Column 2: indices 4-7
   * - Column 3: indices 8-12
   *
   * For each column, it filters categories that:
   * - Are not of type string
   * - Fall within the column's index range
   *
   * Each category is displayed with:
   * - Its rank number (based on index + 1)
   * - Its title
   * - A trending indicator (🔥) if applicable
   *
   * If a column has no valid categories, it displays "None".
   *
   * @returns {JSX.Element[]} An array of three column div elements containing the formatted categories
   */
  const getTopCategories = (): JSX.Element[] => {
    if (topCategories.length == 1)
      return [
        <div
          className="flex-1/3 h-full flex flex-col gap-[5px]"
          key={`topCategory-0`}
        >
          <div className="w-full bg-[#484848] flex-1/4 rounded">
            No available trends
          </div>
        </div>,
      ];
    // Define ranges for each column
    const columnRanges = [
      { min: 0, max: 3 }, // Column 1: indices 0-3
      { min: 4, max: 7 }, // Column 2: indices 4-7
      { min: 8, max: 12 }, // Column 3: indices 8-12
    ];

    return columnRanges.map((range, columnIndex) => {
      // Get valid categories for this column
      const categoryElements = topCategories
        .filter(
          (category, index) =>
            typeof category !== "string" &&
            index >= range.min &&
            index <= range.max
        )
        // Format and display each Google Trends category with ranking, title, and trending indicator
        .map((category, index) => (
          <div
            key={`category-${columnIndex}-${index}`}
            className={`w-full bg-[#484848] flex-1/4 rounded px-3 py-2.5 hover:bg-[#555555] transition-colors duration-200 flex items-center justify-between mb-1.5`}
          >
            <div className="flex items-center gap-2.5 max-w-[85%]">
              <span className="bg-[#333333] rounded-full h-6 w-6 flex items-center justify-center text-sm font-semibold">
                {topCategories.indexOf(category) + 1}
              </span>
              <span className="truncate text-gray-100">{category.title}</span>
            </div>
            {category.isTrending && (
              <span className="text-lg animate-pulse" aria-label="Trending">
                🔥
              </span>
            )}
          </div>
        ));

      return (
        <div
          key={`topCategory-${columnIndex}`}
          className="flex-1/3 h-full flex flex-col gap-[5px]"
        >
          {categoryElements.length > 0 ? (
            categoryElements
          ) : (
            <div className="w-full bg-[#484848] flex-1/4 rounded">None</div>
          )}
        </div>
      );
    });
  };

  if (hasSetUpAccount == false && !configIsLoading && !isError) {
    return (
      <SetUpPage
        functions={{ updateInformation }}
        refs={{ nicknameInputRef, birthDateInputRef }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="bodyCont">
        <div className="content bottom">
          <div className="header-wrapper">
            <div className="header-cont loading"></div>
          </div>
          <div className="body-wrapper">
            <div className="left-body-cont loading"></div>
            <div className="right-body-cont loading"></div>
          </div>
          <div className="body-wrapper">
            <div className="right-body-cont loading"></div>
            <div className="left-body-cont loading"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated && hasSetUpAccount && !isLoading && !isError) {
    return (
      <>
        <div className="bodyCont">
          <Header hasSetUpAccount={hasSetUpAccount} />
          <div className="content bottom">
            <div className="header-wrapper">
              <div className="header-cont">
                <div className="text">
                  <h1 className="section-title header">
                    Evaluate the trends of the world with a simple click, using
                    AI
                  </h1>
                  <p className="section-text header">
                    Explore current and upcoming trends to find all sorts of
                    statistics like relevancy, start date, and more.
                  </p>
                  <Link to="/ask-ai">
                    <button id="try-it-button">Try It Now</button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="body-wrapper">
              <div className="left-body-cont">
                <Link to="/categories">
                  <h1 className="section-title">Categories</h1>
                </Link>
                <div className="categories-wrapper">
                  <div className="button-wrapper">
                    <Link to="/category/fashion">
                      <button className="categoryButton fashion">
                        <Shirt size={42} />
                      </button>
                    </Link>
                    <Link to="/category/technology">
                      <button className="categoryButton technology">
                        <Headset size={42} />
                      </button>
                    </Link>
                    <Link to="/category/foodandbeverages">
                      <button className="categoryButton food">
                        <CupSoda size={42} />
                      </button>
                    </Link>
                    <Link to="/category/entertainment">
                      <button className="categoryButton entertainment">
                        <Clapperboard size={42} />
                      </button>
                    </Link>
                  </div>
                  <div className="button-wrapper">
                    <Link to="/category/socialmedia">
                      <button className="categoryButton social">
                        <MessageCircle size={42} />
                      </button>
                    </Link>
                    <Link to="/category/fitness">
                      <button className="categoryButton fitness">
                        <Dumbbell size={42} />
                      </button>
                    </Link>
                    <Link to="/category/health">
                      <button className="categoryButton health">
                        <HeartPulse size={42} />
                      </button>
                    </Link>
                    <Link to="/category/music">
                      <button className="categoryButton music">
                        <Music size={42} />
                      </button>
                    </Link>
                  </div>
                  <div className="button-wrapper">
                    <Link to="/category/politics">
                      <button className="categoryButton politics">
                        <Flag size={42} />
                      </button>
                    </Link>
                    <Link to="/category/travel">
                      <button className="categoryButton travel">
                        <Plane size={42} />
                      </button>
                    </Link>
                    <Link to="/category/science">
                      <button className="categoryButton science">
                        <FlaskConical size={42} />
                      </button>
                    </Link>
                    <Link to="/category/sports">
                      <button className="categoryButton sports">
                        <Icon iconNode={football} size={42} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="right-body-cont relative">
                <button
                  disabled={hotTrendsLoading}
                  className={
                    hotTrendsLoading ? "cursor-default" : "cursor-pointer"
                  }
                  onClick={() => updateTopTrends()}
                >
                  <RefreshCcw
                    className={`absolute right-5 top-4 ${
                      hotTrendsLoading ? "animate-spin" : ""
                    }`}
                    style={{
                      animationDuration: "800ms",
                      animationTimingFunction:
                        "cubic-bezier(0.55, 0.09, 0.41, 0.95)",
                      animationDirection: "reverse",
                      animationIterationCount: "infinite",
                    }}
                    color="#bdbdbd"
                    size={28}
                  ></RefreshCcw>
                </button>
                <Link
                  to="/hottrends"
                  className="w-fit"
                  style={{ textDecoration: "none" }}
                >
                  <h1 className="section-title">Hot 🔥🔥🔥</h1>
                </Link>
                <div className="top-trends-wrapper">
                  {topTrends &&
                    !hotTrendsLoading &&
                    topTrends.map((trend: Trend, index: number) => (
                      <TopTrend
                        key={index}
                        trend={trend}
                        index={index}
                        savedTrends={savedTrends}
                        total={topTrends.length}
                      />
                    ))}
                  {topTrends && !hotTrendsLoading && (
                    <Link to="/hottrends" className="view-more">
                      View More
                    </Link>
                  )}
                  {hotTrendsLoading && getLoadingTrendElements()}
                </div>
              </div>
            </div>
            <div className="body-wrapper">
              <div className="right-body-cont">
                <h1 className="section-title">Top Categories</h1>
                <div className="flex h-full gap-[20px] p-[20px] pt-[0]">
                  {getTopCategories()}
                </div>
              </div>
              <div className="left-body-cont">
                <Link to="/favorites">
                  <h1 className="section-title">Favorites</h1>
                </Link>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  if (!isLoading && isError) {
    return <ErrorPage />; // Render the ErrorPage component
  }

  if (isAuthenticated === false && !isLoading) {
    return (
      <div className="bodyCont">
        <div className="bg-container"></div>
        <Header />
        <div className="content">
          <div className="title">
            <h1 id="titleText">Sign up and discover the latest trends today</h1>
            <a onClick={() => loginWithRedirect()}>Sign Up</a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bodyCont">
      <div className="content bottom">
        <div className="header-wrapper">
          <div className="header-cont loading"></div>
        </div>
        <div className="body-wrapper">
          <div className="left-body-cont loading"></div>
          <div className="right-body-cont loading"></div>
        </div>
        <div className="body-wrapper">
          <div className="right-body-cont loading"></div>
          <div className="left-body-cont loading"></div>
        </div>
      </div>
    </div>
  );
}
