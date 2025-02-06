import axios from "axios";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function AskAi() {
  const { user } = useAuth0();

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

  useEffect(() => {
    async function getResponse() {
      const message: string = window.prompt("Ask me anything") || "";
      const userAge: string = user?.birthdate || "unknown";
      const userGender: string = user?.gender || "unknown";

      try {
        const location = await getUserLocation() || "unknown";

        axios
          .post(
            "http://localhost:8080/api/ai/AiModelRequest",
            {
              message: message,
              userLocation: location,
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
      } catch (error) {
        console.error(error);
      }
    }

    getResponse();
  }, []);

  return <div></div>;
}
