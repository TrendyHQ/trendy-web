import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "../../css/Profile.css";

export default function Profile() {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const updateNickname = async (newNickname: string) => {
    try {
      // Get the Management API access token
      const requestBody = {
        user_id: user?.sub,
        newNickname: newNickname,
      }

      await axios.put('http://localhost:8080/api/update-nickname', requestBody, {
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
        }
      });
      alert(`Nickname updated to ${user?.nickname}`);
    } catch (error) {
      console.error("Error updating nickname:", error);
      alert("Failed to update nickname.");
    }
  };

  return (
    <div>
      <img src={user?.picture} className="pfp"></img>
      <input
        type="text"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            updateNickname((e.target as HTMLInputElement).value);
          }
        }}
        defaultValue={user?.nickname}
      />
    </div>
  );
}
