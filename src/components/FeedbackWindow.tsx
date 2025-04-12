import {
  CircleX,
  ArrowLeft,
  Share2,
  TriangleAlert,
} from "lucide-react";

export default function FeedbackWindow({
  functions,
  values,
}: {
  functions: {
    handleFade: (arg0: string) => void;
    setFeedbackWindowOpen: (arg0: boolean) => void;
    handleSubmitFeedback: (arg0: boolean) => void;
  };
  values: [boolean, string, boolean];
}) {
  const { handleFade, setFeedbackWindowOpen, handleSubmitFeedback } = functions;
  const [feedbackWindowOpen, currentFeedbackContent, isFading] = values;

  return (
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
          <button className="back-button" onClick={() => handleFade("default")}>
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
                  <Share2 size={30} strokeWidth={1.5} />
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
  );
}
