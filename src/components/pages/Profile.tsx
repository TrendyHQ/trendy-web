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
        userId: user?.sub,
        newNickname: newNickname,
      };

      await axios.put(
        "http://localhost:8080/api/update-nickname",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json", // Set content type to JSON
          },
        }
      );
      alert(`Nickname updated to ${newNickname}`);
    } catch (error) {
      console.error("Error updating nickname:", error);
      alert("Failed to update nickname.");
    }
  };

  const updatePfp = async (image: File) => {
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    if (image.size > maxFileSize) {
      alert('File size exceeds 10MB. Current file is ' + image.size + ' bytes.');
      return;
    }

    try {
      const formData = new FormData();

      formData.append("userId", user?.sub || "");
      formData.append("file", image);

      await axios.put("http://localhost:8080/api/update-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(`Picture updated successfully`);
    } catch (error) {
      console.error("Error updating pciture:", error);
      alert("Failed to update picture.");
    }
  };

  return (
    <div>
      <img src={user?.picture} className="pfp"></img>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) updatePfp(e.target.files?.[0]);
        }}
      />
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
