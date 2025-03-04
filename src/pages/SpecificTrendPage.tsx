import { Navigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { CommentObject, SpecificTrend } from "../types";
import { useAuth0 } from "@auth0/auth0-react";

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
          setTrendData(response.data);
          setLikes(response.data.otherInformation.likes);
          setHasLiked(response.data.otherInformation.userHasLiked);
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
    setHasLiked(newLikeState);
    setLikes((prev) => prev + (newLikeState ? 1 : -1));

    // Use a debounce mechanism to prevent rapid multiple requests
    const debounceTimeout = setTimeout(async () => {
      try {
        await axios.put(`http://localhost:8080/api/data/setLikesOnPost`, {
          like: newLikeState,
          postId: trendId,
          userId: user.sub,
        });
      } catch (error) {
        // Revert UI state if the request fails
        console.error("Like request failed:", error);
        setHasLiked(!newLikeState);
        setLikes((prev) => prev + (newLikeState ? -1 : 1));
      }
    }, 300); // 300ms

    // Clean up the timeout if component unmounts or function runs again
    return () => clearTimeout(debounceTimeout);
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
    <div className="bodyCont">
      <Header />
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
      )}
      <Footer />
    </div>
  );
}
