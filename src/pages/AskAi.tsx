import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Navigate } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";

export default function AskAi() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const [response, setResponse] = useState<string>("");
  let message: string;
  const [isFutureRequest, setIsFutureRequest] = useState<boolean | null>(false);

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

  async function getResponse() {
    if (message !== "" && isFutureRequest !== null) {
      try {
        const location = (await getUserLocation()) || "unknown";

        const res = await axios.post(
          "http://localhost:8080/api/ai/AiModelRequest",
          {
            message: message,
            userLocation: location,
            isFutureRequest: isFutureRequest,
            userId: user?.sub,
          },
          {
            withCredentials: true,
          }
        );

        const fullResponse = res.data;
        setResponse(""); // Clear any existing response

        const animateText = (text: string, i: number = 0) => {
          if (i <= text.length) {
            setResponse(text.substring(0, i));
            setTimeout(() => animateText(text, i + 1), 5);
          }
        };

        animateText(fullResponse);
      } catch (error) {
        console.error(error);
      }
    }
  }

  function markdownToHtml(text: string) {
    // The regex replaces all occurrences of **...** with <strong>...</strong>
    let newText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    newText = newText.replace(/(\d+\.)/g, "<br>$1");
    return newText;
  }

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bodyCont">
      <Header />
      <Form.Control
        aria-label="Input to enter queries for AI"
        data-bs-theme="dark"
        onKeyDown={(e) => {
          // Check if the key pressed is Enter
          // and call the getResponse function
          // if it is.
          if (e.key === "Enter") {
            message = e.currentTarget.value;
            getResponse();
            e.currentTarget.value = "";
          }
        }}
        className="w-75 mx-auto mt-5"
        type="text"
        placeholder="Enter your query here..."
      />
      <br />
      <div>
        <label>
          <input
            type="radio"
            name="requestType"
            defaultChecked={true}
            onChange={() => {
              setIsFutureRequest(false);
            }}
          />
          Current Trends
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="radio"
            name="requestType"
            onChange={() => {
              setIsFutureRequest(true);
            }}
          />
          Future Trends
        </label>
        <br />
      </div>
      <Alert
        variant="dark"
        data-bs-theme="dark"
        className="w-11/12 mx-auto"
      >
        <p dangerouslySetInnerHTML={{ __html: markdownToHtml(response) }} />
      </Alert>
      <br />
      <Button variant="danger" className="w-25 mx-auto" onClick={() => setResponse("")}>Clear Response</Button>
      <Footer />
    </div>
  );
}
