import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AskAi() {
  const { user } = useAuth0();

  const [response, setResponse] = useState<string>("");
  let message: string;
  const [isFutureRequest, setIsFutureRequest] = useState<boolean | null>(null);

  function getUserLocation(): Promise<string> {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(
              `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`
            );
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
    const birthDate: string =
      (
        await axios.get("http://localhost:8080/api/auth0/getUserProperty", {
          params: {
            property: "birthDate",
            userId: user?.sub,
          },
        })
      ).data || "unknown";

    const userGender: string =
      (
        await axios.get("http://localhost:8080/api/auth0/getUserProperty", {
          params: {
            property: "gender",
            userId: user?.sub,
          },
        })
      ).data || "unknown";

    if (message !== "" && isFutureRequest !== null) {
      try {
        const location = (await getUserLocation()) || "unknown";

        const res = await axios.post(
          "http://localhost:8080/api/ai/AiModelRequest",
          {
            message: message,
            userLocation: location,
            userAge: birthDate,
            userGender: userGender,
            isFutureRequest: isFutureRequest,
          },
          {
            withCredentials: true,
          }
        );

        setResponse(res.data);
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

  return (
    <div className="bodyCont">
      <Header />
      <input
        type="text"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            message = e.currentTarget.value;
            getResponse();
            e.currentTarget.value = "";
          }
        }}
      />
      <br />
      <div>
        <label>
          <input
            type="radio"
            name="requestType"
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
      <p dangerouslySetInnerHTML={{ __html: markdownToHtml(response) }} />
      <br />
      <button onClick={() => setResponse("")}>Clear Response</button>
      <Footer />
    </div>
  );
}
