import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/Home.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Star } from "lucide-react";
import { GoogleTrendsData, ListTrend, SavedTrendObject, Trend } from "../types";
import axios from "axios";
import { JSX, RefObject, useEffect, useRef, useState } from "react";
import {
  testing,
  currentTopTrends,
  currentHasSetUpAccount,
  currentFavoritePostIds,
  storedTopTrends,
  currentFavorites,
} from "../Constants";
import SetUpPage from "./SetUpPage";
import ErrorPage from "./ErrorPage";

// Component imports
import HeroSection from "../components/home/HeroSection";
import CategoriesSection from "../components/home/CategoriesSection";
import HotTrendsSection from "../components/home/HotTrendsSection";
import TopCategoriesSection from "../components/home/TopCategoriesSection";
import FavoritesSection from "../components/home/FavoritesSection";
import LoadingHomeContent from "../components/loading/LoadingHomeContent";
import LandingContent from "../components/home/LandingContent";

// Utility imports
import { getUserLocation } from "../utils/locationUtils";

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth0();

  const [topTrends, setTopTrends] = useState<Trend[] | null>(
    currentTopTrends.value
  );
  const [hotTrendsLoading, setHotTrendsLoading] = useState<boolean>(false);
  const [favoriteTrendsLoading, setFavoriteTrendsLoading] =
    useState<boolean>(false);
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
  const [listOfFavorites, setListOfFavorites] = useState<ListTrend[]>(
    currentFavorites.value
  );
  const [hasLoggedInBefore, setHasLoggedInBefore] = useState<boolean>(
    localStorage.getItem("hasLoggedInBefore") === "true"
  );

  const nicknameInputRef = useRef<HTMLInputElement | null>(null);
  const updateTrendsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const birthDateInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isAuthenticated && !hasLoggedInBefore && !isLoading) {
      localStorage.setItem("hasLoggedInBefore", "true");
      setHasLoggedInBefore(true);
    } else if (!isAuthenticated && !isLoading) {
      localStorage.setItem("hasLoggedInBefore", "false");
      setHasLoggedInBefore(false);
    }
  }, [isAuthenticated, isLoading]);

  /**
   * Fetches a specified property for the current user from the backend API.
   *
   * @param property - The user property to fetch (e.g., "hasSetUpAccount")
   * @returns Promise<void> - Does not return a value but updates state based on the response
   * @throws Will set isError state to true and log the error if the API call fails
   * @remarks
   * - Requires authenticated user (checks if user exists)
   * - Sets configIsLoading state while fetching
   * - For "hasSetUpAccount" property, updates both state and a ref value
   */
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
          console.log(res.data);
          if (res.data !== null && res.data !== undefined) {
            setHasSetUpAccount(res.data);
            currentHasSetUpAccount.value = res.data;
          } else {
            setHasSetUpAccount(false);
            currentHasSetUpAccount.value = false;
          }
        }
      } catch {
        setIsError(true);
      } finally {
        setConfigIsLoading(false);
      }
    }
  };

  /**
   * Updates the top trending topics from Google Trends and Reddit.
   *
   * This function fetches trending data from Google based on the user's location,
   * sorts it by score, and stores it. It also fetches top Reddit posts related to
   * these trends and the user's saved trends.
   *
   * @param {boolean} [load] - Optional flag to control loading state behavior.
   *                          If false, loading state won't be set to true.
   *                          Defaults to undefined (loading state will be set).
   * @returns {Promise<void>} A promise that resolves when the trends are updated.
   *
   * @throws Will log an error if API requests fail.
   * @remarks Will exit early if already loading or if no user is authenticated.
   */
  const updateTopTrends = async (load?: boolean): Promise<void> => {
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
        if (
          currentFavorites.value.length == 0 ||
          currentFavorites.value == null
        )
          fetchFavorites();

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

  /**
   * Fetches the user's favorite trends and saved trends from the server.
   */
  async function fetchFavorites() {
    if (user?.sub) {
      setFavoriteTrendsLoading(true);

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

        currentFavorites.value = response.data.sort(
          (a: { title: string }, b: { title: string }) =>
            a.title.localeCompare(b.title)
        );
        setListOfFavorites(
          response.data.sort((a: { title: string }, b: { title: string }) =>
            a.title.localeCompare(b.title)
          )
        );
      } catch (e) {
        console.error(e);
      } finally {
        setFavoriteTrendsLoading(false);
      }
    }
  }

  useEffect(() => {
    try {
      if (currentHasSetUpAccount.value == false)
        fetchUserProperty("hasSetUpAccount");
    } catch (e) {
      setIsError(true);
      console.error(e);
    }
  }, [user]);

  /**
   * Updates user information in the database.
   */
  const updateInformation = async (): Promise<void> => {
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
        setTimeout(() => {
          window.location.reload(); // Reload to apply changes
        }, 100);
      } catch (error) {
        console.error("Error updating user information:", error);
      }
    }
  };

  /**
   * Generates loading placeholder elements for trends display
   */
  const getLoadingTrendElements = (): JSX.Element[] => {
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

  // First account setup
  if (hasSetUpAccount == false && !configIsLoading && !isError) {
    return (
      <SetUpPage
        functions={{ updateInformation }}
        refs={{
          nicknameInputRef: nicknameInputRef as RefObject<HTMLInputElement>,
          birthDateInputRef: birthDateInputRef as RefObject<HTMLInputElement>,
        }}
      />
    );
  }

  // Loading state when user has logged in before
  if (isLoading && hasLoggedInBefore) {
    return <LoadingHomeContent hasSetUpAccount={hasSetUpAccount} />;
  }

  // Main authenticated content
  if (isAuthenticated && hasSetUpAccount && !isLoading && !isError) {
    return (
      <>
        <div className="bodyCont">
          <Header hasSetUpAccount={hasSetUpAccount} />
          <div className="content bottom">
            <div className="header-wrapper">
              <HeroSection />
            </div>
            <div className="body-wrapper">
              <CategoriesSection />
              <HotTrendsSection
                topTrends={topTrends}
                hotTrendsLoading={hotTrendsLoading}
                savedTrends={savedTrends}
                updateTopTrends={() => updateTopTrends()}
                getLoadingTrendElements={getLoadingTrendElements}
              />
            </div>
            <div className="body-wrapper">
              <TopCategoriesSection topCategories={topCategories} />
              <FavoritesSection
                listOfFavorites={listOfFavorites}
                savedTrends={savedTrends}
                favoriteTrendsLoading={favoriteTrendsLoading}
                getLoadingTrendElements={getLoadingTrendElements}
              />
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  // Error state
  if (!isLoading && isError) {
    return <ErrorPage />;
  }

  // Not authenticated or first visit
  if ((isAuthenticated === false && !isLoading) || !hasLoggedInBefore) {
    return <LandingContent />;
  }

  // Default loading state
  return <LoadingHomeContent hasSetUpAccount={hasSetUpAccount} />;
}
