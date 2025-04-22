import axios from "axios";
import { currentFavoritePostIds, currentHasSetUpAccount, currentFavorites, currentTopTrends, storedTopTrends } from "../Constants";
import { getUserLocation } from "./locationUtils";
import { GoogleTrendsData, ListTrend, SavedTrendObject, Trend } from "../types";

/**
 * Fetches a specified property for the current user from the backend API.
 *
 * @param property - The user property to fetch (e.g., "hasSetUpAccount")
 * @param userId - The ID of the user
 * @param setHasSetUpAccount - State setter for hasSetUpAccount
 * @param setConfigIsLoading - State setter for configIsLoading
 * @param setIsError - State setter for isError
 * @returns Promise<void> - Does not return a value but updates state based on the response
 */
export const fetchUserProperty = async (
  property: string,
  userId: string,
  setHasSetUpAccount: (value: boolean) => void,
  setConfigIsLoading: (value: boolean) => void,
  setIsError: (value: boolean) => void
) => {
  setConfigIsLoading(true);
  try {
    const res = await axios.get(
      "http://localhost:8080/api/users/getUserProperty",
      {
        params: {
          userId: userId,
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
};

/**
 * Updates the top trending topics from Google Trends and Reddit.
 *
 * @param userId - The ID of the user
 * @param setHotTrendsLoading - State setter for hotTrendsLoading
 * @param setTopCategories - State setter for topCategories
 * @param setSavedTrends - State setter for savedTrends
 * @param setTopTrends - State setter for topTrends
 * @param load - Optional flag to control loading state
 * @returns Promise<void>
 */
export const updateTopTrends = async (
  userId: string,
  setHotTrendsLoading: (value: boolean) => void,
  setTopCategories: (value: GoogleTrendsData[]) => void,
  setSavedTrends: (value: SavedTrendObject[] | null) => void,
  setTopTrends: (value: Trend[] | null) => void,
  load?: boolean
): Promise<void> => {
  if (load !== false) setHotTrendsLoading(true);

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
      { requestAmount: 6, userId: userId }
    );

    const savedTrendsRes = await axios.get(
      "http://localhost:8080/api/users/getSavedTrends",
      {
        params: {
          userId: userId,
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
    setHotTrendsLoading(false);
  }
};

/**
 * Fetches the user's favorite trends from the server.
 *
 * @param userId - The ID of the user
 * @param setFavoriteTrendsLoading - State setter for favoriteTrendsLoading
 * @param setListOfFavorites - State setter for listOfFavorites
 * @param setSavedTrends - State setter for savedTrends
 */
export async function fetchFavorites(
  userId: string,
  setFavoriteTrendsLoading: (value: boolean) => void,
  setListOfFavorites: (value: ListTrend[]) => void,
  setSavedTrends: (value: SavedTrendObject[] | null) => void
) {
  setFavoriteTrendsLoading(true);

  try {
    const response = await axios.get(
      `http://localhost:8080/api/users/getUsersTrends`,
      {
        params: {
          userId: userId,
        },
        withCredentials: true,
      }
    );

    const savedTrendsRes = await axios.get(
      `http://localhost:8080/api/users/getSavedTrends`,
      {
        params: {
          userId: userId,
        },
      }
    );

    setSavedTrends(savedTrendsRes.data);
    currentFavoritePostIds.value = savedTrendsRes.data;

    const sortedFavorites = response.data.sort(
      (a: { title: string }, b: { title: string }) =>
        a.title.localeCompare(b.title)
    );
    
    currentFavorites.value = sortedFavorites;
    setListOfFavorites(sortedFavorites);
  } catch (e) {
    console.error(e);
  } finally {
    setFavoriteTrendsLoading(false);
  }
}

/**
 * Updates user information in the database.
 *
 * @param userId - The ID of the user
 * @param nicknameRef - Reference to nickname input
 * @param birthDateRef - Reference to birth date input
 * @param setHasSetUpAccount - State setter for hasSetUpAccount
 * @returns Promise<void>
 */
export const updateInformation = async (
  userId: string,
  nicknameRef: React.RefObject<HTMLInputElement>,
  birthDateRef: React.RefObject<HTMLInputElement>,
  setHasSetUpAccount: (value: boolean) => void
): Promise<void> => {
  const nickname: string | null = nicknameRef.current?.value || null;
  const gender: string | null =
    (
      document.querySelector(
        'input[name="genderInput"]:checked'
      ) as HTMLInputElement
    )?.value || null;
  const birthDate: string | null = birthDateRef.current?.value || null;

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

  if ((nickname || gender) && userId) {
    try {
      await axios.patch(
        "http://localhost:8080/api/users/updateUserInformation",
        {
          userId: userId,
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
