import "../css/Header.css";
import { Link, useLocation } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import {
  ArrowLeft,
  CircleX,
  MessageCircleMore,
  TriangleAlert,
} from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import DropDown from "./DropDown";
import axios from "axios";

export default function Header() {
  const location = useLocation();
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } =
    useAuth0();
  const isDarkTheme: boolean = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const dropDownRef = useRef<HTMLDivElement>(null);
  const profileImgRef = useRef<HTMLImageElement>(null);
  //
  const [profileDown, setProfileDown] = useState<boolean>(false);
  const [userNickname, setUserNickname] = useState<string>(
    user?.nickname || ""
  );
  const [feedbackWindowOpen, setFeedbackWindowOpen] = useState<boolean>(false);
  const [currentFeedbackContent, setCurrentFeedbackContent] =
    useState<string>("default");
  const [isFading, setIsFading] = useState<boolean>(false);

  const iconSize: number = 26;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Don't close if the feedback window was clicked
      if (
        event.target instanceof Element &&
        event.target.closest(".feedbackWindow")
      ) {
        return;
      }
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node) &&
        profileImgRef.current &&
        !profileImgRef.current.contains(event.target as Node)
      ) {
        setProfileDown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    setUserNickname(user?.nickname || "");

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFeedback = () => {
    setFeedbackWindowOpen(true);
  };

  function handleFade(content: string) {
    setIsFading(true);
    setTimeout(() => {
      setCurrentFeedbackContent(content);
      setIsFading(false);
    }, 100); // length of the fade animation in ms
  }

  if (isLoading) {
    return (
      <header>
        <h1 className="logo">TRENDY</h1>
        <div className="loadingPfp loading"></div>
      </header>
    );
  }

  const handleSubmitFeedback = async (isReport: boolean) => {
    const feedbackTextarea = document.querySelector(
      ".feedback-textarea.active"
    ) as HTMLTextAreaElement;
    const feedback = feedbackTextarea?.value;


    if (!feedback || feedback.trim() === "" || !user) {
      alert("Feedback cannot be empty");
      return;
    }

    try {
      await axios.put("http://localhost:8080/api/data/addFeedbackToDatabase", {
        userId: user.sub,
        feedback: feedback,
        isReport: isReport,
      });
      alert("Feedback submitted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div
        className={`feedbackWindow ${feedbackWindowOpen ? "show" : ""}`}
        onClick={() => setFeedbackWindowOpen(false)}
      >
        <div className="feedbackBox" onClick={(e) => e.stopPropagation()}>
          <h2>Give Feedback</h2>
          <button
            className="feedback-close-button"
            onClick={() => setFeedbackWindowOpen(false)}
          >
            <CircleX
              size={40}
              color="grey"
              className="icon-close-button"
              strokeWidth={1.5}
            />
          </button>
          {currentFeedbackContent !== "default" && (
            <button
              className="back-button"
              onClick={() => handleFade("default")}
            >
              <ArrowLeft size={30} color="grey" />
            </button>
          )}
          <div className="feedback-header"></div>
          <div className={`feedback-content  ${isFading ? "fade" : ""}`}>
            {currentFeedbackContent === "default" && (
              <div className="feedback-buttons-wrapper">
                <button
                  className="feedback-button"
                  onClick={() => handleFade("suggest")}
                >
                  <div className="icon-wrapper">
                    <MessageCircleMore size={30} strokeWidth={1.5} />
                  </div>
                  <p className="text">Suggest Something</p>
                </button>
                <button
                  className="feedback-button"
                  onClick={() => handleFade("report")}
                >
                  <div className="icon-wrapper">
                    <TriangleAlert size={30} strokeWidth={1.5} />
                  </div>
                  <p className="text">Report an error</p>
                </button>
              </div>
            )}
            {currentFeedbackContent === "suggest" && (
              <div className="feedback-suggest">
                <h3>Suggest Something</h3>
                <textarea
                  className={`feedback-textarea ${
                    currentFeedbackContent === "suggest" ? "active" : ""
                  }`}
                  placeholder="What would you like to suggest?"
                ></textarea>
                <button
                  className="submit-button"
                  onClick={() => handleSubmitFeedback(false)}
                >
                  Submit
                </button>
              </div>
            )}
            {currentFeedbackContent === "report" && (
              <div className="feedback-report">
                <h3>Report an error</h3>
                <textarea
                  className={`feedback-textarea ${
                    currentFeedbackContent === "report" ? "active" : ""
                  }`}
                  placeholder="What error would you like to report?"
                ></textarea>
                <button
                  className="submit-button"
                  onClick={() => handleSubmitFeedback(true)}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <header className={!isAuthenticated ? "transparent" : ""}>
        <Link to="/" className={isAuthenticated ? "logo" : "logo big"}>
          <h1>TRENDY</h1>
        </Link>
        {isAuthenticated && (
          <img
            ref={profileImgRef}
            src={user?.picture}
            className="userImg"
            onClick={() => setProfileDown((prev) => !prev)}
            alt="User profile"
          />
        )}
        {!isAuthenticated && location.pathname !== "/signUp" && (
          <button onClick={() => loginWithRedirect()}>Sign Up</button>
        )}
      </header>
      {isAuthenticated && (
        <DropDown
          functions={{ handleFeedback, logout }}
          values={[iconSize, isDarkTheme, profileDown, userNickname]}
          dropDownRef={dropDownRef}
        />
      )}
    </>
  );
}
