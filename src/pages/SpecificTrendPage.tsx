import { Navigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { CommentObject, SpecificTrend } from "../types";
import { useAuth0 } from "@auth0/auth0-react";
import { Star } from "lucide-react";
import { currentFavoritePostIds } from "../Constants";

export default function SpecificTrendPage() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();
  const trendId = location.pathname.split("/")[2];

  const [trendData, setTrendData] = useState<SpecificTrend>(
    {} as SpecificTrend
  );
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(true);
  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [hasDisliked, setHasDisliked] = useState<boolean>(false);
  const [trendSaved, setTrendSaved] = useState<boolean>(
    currentFavoritePostIds.value.some((trend) => trend.postId === trendId)
  );

  const getSpecificTrend = () => {
    if (user && isAuthenticated && !isLoading) {
      setPageIsLoading(true);
      axios
        .get(`http://localhost:8080/api/data/trend`, {
          params: {
            postId: trendId,
            userId: user.sub,
          },
        })
        .then((response) => {
          console.log(response.data);
          setTrendData(response.data);
          setLikes(response.data.otherInformation.likes);
          setHasLiked(response.data.otherInformation.userHasLiked);
          setHasDisliked(response.data.otherInformation.userHasDisliked);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setPageIsLoading(false);
        });
    }
  };

  const addComment = (comment: string) => {
    if (user?.sub) {
      const date = new Date().toLocaleDateString();

      const commentObject: CommentObject = {
        userId: user.sub,
        value: comment,
        datePublished: date,
        nick: user.nickname || "Anonymous",
      };

      try {
        axios
          .put(`http://localhost:8080/api/data/addCommentToPost`, {
            postId: trendId,
            comment: commentObject,
          })
          .then(() => {
            trendData.otherInformation.comments.push(commentObject);
            setTrendData({ ...trendData });
          });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleLike = () => {
    if (!user) return;

    const newLikeState: boolean = !hasLiked;
    const previousDislikes = hasDisliked;

    setHasLiked(newLikeState);
    setHasDisliked(false);

    // Calculate likes change based on previous state
    let likesChange = 0;
    if (newLikeState) {
      likesChange = previousDislikes ? 2 : 1; // If previously disliked, add 2 (+1 for removing dislike, +1 for adding like)
    } else {
      likesChange = -1; // Just remove the like
    }

    setLikes((prev) => prev + likesChange);

    // Use a debounce mechanism to prevent rapid multiple requests
    const debounceTimeout = setTimeout(async () => {
      try {
        await axios.put(`http://localhost:8080/api/data/setLikesOnPost`, {
          like: newLikeState ? 1 : 0, // 1 for like, 0 for neutral
          postId: trendId,
          userId: user.sub,
        });
      } catch (error) {
        // Revert UI state if the request fails
        console.error("Like request failed:", error);
        setHasLiked(!newLikeState);
        setHasDisliked(previousDislikes);
        setLikes((prev) => prev - likesChange);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  };

  const handleDislike = () => {
    if (!user) return;

    const newDislikeState: boolean = !hasDisliked;
    const previousLikes = hasLiked;

    setHasDisliked(newDislikeState);
    setHasLiked(false);

    // Calculate likes change based on previous state
    let likesChange = 0;
    if (newDislikeState) {
      likesChange = previousLikes ? -2 : -1; // If previously liked, subtract 2 (-1 for removing like, -1 for adding dislike)
    } else {
      likesChange = 1; // Just remove the dislike
    }

    setLikes((prev) => prev + likesChange);

    // Use a debounce mechanism to prevent rapid multiple requests
    const debounceTimeout = setTimeout(async () => {
      try {
        await axios.put(`http://localhost:8080/api/data/setLikesOnPost`, {
          like: newDislikeState ? -1 : 0, // -1 for dislike, 0 for neutral
          postId: trendId,
          userId: user.sub,
        });
      } catch (error) {
        // Revert UI state if the request fails
        console.error("Dislike request failed:", error);
        setHasDisliked(!newDislikeState);
        setHasLiked(previousLikes);
        setLikes((prev) => prev - likesChange);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  };

  const handleTrendSave = async () => {
    const newTrendState: boolean = !trendSaved;
    setTrendSaved(newTrendState);

    try {
      await axios.patch("http://localhost:8080/api/users/saveTrend", {
        userId: user?.sub,
        trendId: trendData.postId,
        saveTrend: newTrendState,
        trendCategory: trendData.subredditName,
      });

      if (newTrendState) {
        currentFavoritePostIds.value = [
          ...currentFavoritePostIds.value,
          {
            postId: trendData.postId,
            postCategory: trendData.subredditName,
          },
        ];
      } else {
        currentFavoritePostIds.value = currentFavoritePostIds.value.filter(
          (element) => element.postId !== trendData.postId
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSpecificTrend();
  }, [trendId, isAuthenticated, isLoading]);

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/" />;
  }

  if (pageIsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bodyCont relative">
      <Header />
      <Star
        size={30}
        color="#FFD700"
        strokeWidth={1.5}
        fill={trendSaved ? "#FFD700" : "none"}
        onClick={handleTrendSave}
        className="absolute right-5 top-20 cursor-pointer"
      />
      <h1>Specific Trend Page</h1>
      {trendData && (
        <div>
          <h2>{trendData.title}</h2>
          <p>{trendData.moreInfo}</p>
          <a
            href={trendData.link}
            target="_blank"
            className="text-blue-200 underline hover:text-blue-100 duration-100 ease-in-out"
          >
            {trendData.link}
          </a>
          <br />
          <div className="flex space-x-2">
            <button
              onClick={handleLike}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                hasLiked
                  ? "bg-blue-300 text-blue-800 cursor-pointer"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 cursor-pointer"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
              {hasLiked ? "Liked 👍" : "Like Post 👍"}
            </button>

            <button
              onClick={handleDislike}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                hasDisliked
                  ? "bg-red-300 text-red-800 cursor-pointer"
                  : "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 cursor-pointer"
              } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50`}
            >
              {hasDisliked ? "Disliked 👎" : "Dislike Post 👎"}
            </button>
          </div>

          <p>{likes} likes</p>
          <br />
          <label htmlFor="commentInput">New Comment: </label>
          <input
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                (e.target as HTMLInputElement).value.trim() !== ""
              ) {
                addComment((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = "";
              }
            }}
            type="text"
            id="commentInput"
            className="border-1 rounded"
          />
          <br />
          <h2>Comments:</h2>
          <div className="pl-[40px]">
            {trendData &&
              trendData.otherInformation.comments &&
              trendData.otherInformation.comments
                .slice()
                .reverse()
                .map((comment: CommentObject, index) => (
                  <div key={index}>
                    <p>{comment.nick}</p>
                    <p>
                      {comment.datePublished}: {comment.value}
                    </p>
                  </div>
                ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
