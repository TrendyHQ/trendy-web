import axios from "axios";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function AskAi() {
  const { user } = useAuth0();

  let userLocation: string = "";
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation =
          "Latitude:" +
          position.coords.latitude +
          ", Longitude:" +
          position.coords.longitude;
      },
      (error) => {
        console.error("Error getting location:", error.message);
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }

  useEffect(() => {
    const message: string = window.prompt("Ask me anything") || "";
    const userAge: string = user?.birthdate || "unknown";
    const userGender: string = user?.gender || "unknown";

    axios
      .post(
        "http://localhost:8080/api/ai/phi4",
        {
          message: message,
          userLocation: userLocation,
          userAge: userAge,
          userGender: userGender,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return <div></div>;
}
