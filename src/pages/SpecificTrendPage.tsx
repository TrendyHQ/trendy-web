import { Navigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { CommentObject, SpecificTrend } from "../types";
import { useAuth0 } from "@auth0/auth0-react";
import { Star } from "lucide-react";
import { currentFavoritePostIds } from "../Constants";
import LoadingPage from "./LoadingPage";
import "../css/SpecificTrendPage.css";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        avatar: user.picture || "/placeholder.svg",
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
            dateSaved: new Date().toISOString(),
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
    return <LoadingPage />;
  }

  // return (
  //   <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col">
  //     <Header />

  //     <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
  //       <div className="relative">
  //         <Button
  //           variant="ghost"
  //           size="icon"
  //           className={`absolute right-0 top-0 transition-all duration-300 ${
  //             trendSaved ? "text-[#ff5733]" : "text-zinc-400 hover:text-[#ff5733]"
  //           }`}
  //           onClick={handleTrendSave}
  //         >
  //           <Star
  //             size={24}
  //             fill={trendSaved ? "#ff5733" : "none"}
  //             className={`trend-save-icon ${trendSaved ? "saved" : ""}`}
  //           />
  //           <span className="sr-only">Save trend</span>
  //         </Button>

  //         <h1 className="text-3xl font-bold mb-6 text-[#ff5733]">Trend Details</h1>
  //       </div>

  //       {trendData && (
  //         <Card className="bg-zinc-800 border-zinc-700 overflow-hidden shadow-lg">
  //           <CardHeader className="pb-2">
  //             <div className="flex justify-between items-start">
  //               <div>
  //                 <h2 className="text-2xl font-bold text-white mb-1">{trendData.title}</h2>
  //                 <Badge variant="outline" className="bg-[#ff5733]/10 text-[#ff5733] border-[#ff5733]/20">
  //                   Trending
  //                 </Badge>
  //               </div>
  //             </div>
  //           </CardHeader>

  //           <CardContent className="pt-4">
  //             <p className="text-zinc-300 mb-4 leading-relaxed">{trendData.moreInfo}</p>

  //             <a
  //               href={trendData.link}
  //               target="_blank"
  //               rel="noreferrer"
  //               className="inline-flex items-center gap-1.5 text-[#ff5733] hover:text-[#ff5733]/80 transition-colors group mb-6"
  //             >
  //               <ExternalLink size={16} />
  //               <span className="underline underline-offset-4">{trendData.link}</span>
  //             </a>

  //             <div className="flex items-center gap-3 mb-2">
  //               <Button
  //                 onClick={handleLike}
  //                 variant={hasLiked ? "default" : "outline"}
  //                 className={`transition-all ${
  //                   hasLiked
  //                     ? "bg-[#ff5733] hover:bg-[#ff5733]/90 text-white"
  //                     : "border-zinc-700 hover:border-[#ff5733] hover:text-[#ff5733]"
  //                 }`}
  //               >
  //                 <ThumbsUp size={18} className="mr-2" />
  //                 {hasLiked ? "Liked" : "Like"}
  //               </Button>

  //               <Button
  //                 onClick={handleDislike}
  //                 variant={hasDisliked ? "default" : "outline"}
  //                 className={`transition-all ${
  //                   hasDisliked
  //                     ? "bg-zinc-600 hover:bg-zinc-600/90 text-white"
  //                     : "border-zinc-700 hover:border-zinc-600 hover:text-zinc-300"
  //                 }`}
  //               >
  //                 <ThumbsDown size={18} className="mr-2" />
  //                 {hasDisliked ? "Disliked" : "Dislike"}
  //               </Button>

  //               <span className="text-zinc-400 text-sm">
  //                 {likes} {likes === 1 ? "like" : "likes"}
  //               </span>
  //             </div>
  //           </CardContent>

  //           <Separator className="bg-zinc-700" />

  //           <CardContent className="pt-6">
  //             <h3 className="text-xl font-semibold mb-4">Comments</h3>

  //             <div className="flex items-center gap-3 mb-6">
  //               <Input
  //                 value={comment}
  //                 onChange={(e) => setComment(e.target.value)}
  //                 onKeyDown={(e) => {
  //                   if (e.key === "Enter" && comment.trim() !== "") {
  //                     addComment()
  //                   }
  //                 }}
  //                 placeholder="Add a comment..."
  //                 className="bg-zinc-900 border-zinc-700 focus-visible:ring-[#ff5733] text-zinc-100"
  //               />
  //               <Button
  //                 onClick={addComment}
  //                 disabled={!comment.trim()}
  //                 size="icon"
  //                 className="bg-[#ff5733] hover:bg-[#ff5733]/90 text-white"
  //               >
  //                 <Send size={18} />
  //                 <span className="sr-only">Send comment</span>
  //               </Button>
  //             </div>

  //             <div className="space-y-4">
  //               {trendData.otherInformation.comments
  //                 .slice()
  //                 .reverse()
  //                 .map((comment, index) => (
  //                   <div key={index} className="flex gap-3 animate-in fade-in">
  //                     <Avatar>
  //                       <AvatarImage src={comment.avatar || "../assets/placeHolderAvatar.svg"} alt={comment.nick} />
  //                       <AvatarFallback className="bg-[#ff5733]/20 text-[#ff5733]">
  //                         {comment.nick.substring(0, 2).toUpperCase()}
  //                       </AvatarFallback>
  //                     </Avatar>
  //                     <div>
  //                       <div className="flex items-center gap-2">
  //                         <span className="font-medium text-zinc-200">{comment.nick}</span>
  //                         <span className="text-xs text-zinc-500">{comment.datePublished}</span>
  //                       </div>
  //                       <p className="text-zinc-300 mt-1">{comment.value}</p>
  //                     </div>
  //                   </div>
  //                 ))}
  //             </div>
  //           </CardContent>
  //         </Card>
  //       )}
  //     </main>

  //     <Footer />
  //   </div>
  // );

  return (
    <div className="trend-page">
      <Header />

      <main className="trend-content">
        <div className="trend-header">
          <h1 className="specifc-trend-h1">{trendData.title}</h1>
          <button
            className="save-button specifc-trend-button"
            onClick={handleTrendSave}
            aria-label={trendSaved ? "Unsave trend" : "Save trend"}
          >
            <Star
              size={24}
              strokeWidth={1.5}
              className={trendSaved ? "saved" : ""}
            />
          </button>
        </div>

        {trendData ? (
          <div className="trend-details">
            <div className="trend-card">
              {trendData.moreInfo ? (
                <div className="trend-description-content">
                  <p>{trendData.moreInfo}</p>
                  <p className="trend-metadata">
                    Category:{" "}
                    <span className="trend-category">
                      {trendData.subredditName || "General"}
                    </span>{" "}
                    • Posted:{" "}
                    <span className="trend-date">
                      {new Date().toLocaleDateString()}
                    </span>
                  </p>
                  <Separator className="mb-[10px] opacity-50 rounded-full" />
                  <div className="trend-additional-info mb-[20px]">
                    This trending topic has been gaining significant attention
                    recently. The information above provides a brief overview of
                    what&apos;s happening, but we recommend exploring the full
                    article for complete details and context.
                  </div>
                </div>
              ) : (
                <div className="trend-description-empty">
                  <p>
                    No additional information is currently available for this
                    trending topic. This might be because the trend is very
                    recent or because detailed information is still being
                    compiled. Please click the &quot;Read more&quot; link below
                    to visit the source website for the most up-to-date
                    information about this trend.
                  </p>
                </div>
              )}

              <a
                href={trendData.link}
                target="_blank"
                rel="noreferrer"
                className="trend-link specifc-trend-a"
              >
                Read more
              </a>
            </div>

            <div className="engagement-section">
              <div className="like-buttons">
                <button
                  onClick={handleLike}
                  className={`like-button ${hasLiked ? "active" : ""}`}
                >
                  {hasLiked ? "Liked 👍" : "Like 👍"}
                </button>

                <button
                  onClick={handleDislike}
                  className={`dislike-button ${hasDisliked ? "active" : ""}`}
                >
                  {hasDisliked ? "Disliked 👎" : "Dislike 👎"}
                </button>
              </div>

              <div className="likes-count">
                <span>{likes}</span> people found this helpful
              </div>
            </div>

            <div className="comments-section">
              <h3 className="specifc-trend-h3">Discussion</h3>

              <div className="comment-form">
                <input
                  type="text"
                  placeholder="Add your thoughts..."
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      (e.target as HTMLInputElement).value.trim() !== ""
                    ) {
                      addComment((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                  className="comment-input specifc-trend-input"
                />
                <span className="input-hint">Press Enter to post</span>
              </div>

              <div className="comments-list">
                {trendData.otherInformation.comments
                  .slice()
                  .reverse()
                  .map((comment, index) => (
                    <div key={index} className="comment">
                      <div className="comment-header">
                        <div className="flex gap-[10px] justify-content-center align-items-center">
                          <Avatar>
                            <AvatarImage
                              src={comment.avatar || "/placeholder.svg"}
                              alt={comment.nick}
                            />
                            <AvatarFallback className="bg-[#ff5733]/20 text-[#ff5733]">
                              {comment.nick.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="comment-author">{comment.nick}</span>
                        </div>
                        <span className="comment-date">
                          {comment.datePublished}
                        </span>
                      </div>
                      <p className="comment-text">{comment.value}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading trend data...</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
