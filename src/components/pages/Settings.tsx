import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "../../css/Settings.css";
import { useState } from "react";

export default function Settings() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [apiIsLoading, setApiIsLoading] = useState<boolean>(false);
  const [nicknameCharacters, setNicknameCharacters] = useState<string>("");

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/" />;
  }

  const updateNickname = async (newNickname: string) => {
    try {
      // Get the Management API access token
      const requestBody = {
        userId: user?.sub,
        newNickname: newNickname,
      };

      setApiIsLoading(true);

      await axios.put(
        "http://localhost:8080/api/update-nickname",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json", // Set content type to JSON
          },
        }
      );

      setApiIsLoading(false);
      alert(`Nickname updated to ${newNickname}`);
    } catch {
      setApiIsLoading(false);
      alert("Failed to update nickname.");
    }
  };

  const updatePfp = async (image: File) => {
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    if (image.size > maxFileSize) {
      alert(
        "File size exceeds 10MB. Current file is " + image.size + " bytes."
      );
      return;
    }
    if (!["image/jpeg", "image/jpg", "image/png"].includes(image.type)) {
      alert(
        "File type not supported. Please upload a .jpg, .jpeg, or .png file."
      );
      return;
    }

    setApiIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("userId", user?.sub || "");
      formData.append("file", image);

      await axios.put("http://localhost:8080/api/update-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setApiIsLoading(false);
      alert(`Picture updated successfully`);
      window.location.reload();
    } catch {
      setApiIsLoading(false);
      alert("Failed to update picture.");
    }
  };

  if (isLoading || apiIsLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bodyCont settingsPage">
      <img src={user?.picture} className="pfp"></img>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) updatePfp(e.target.files?.[0]);
        }}
      />
      <div>
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateNickname((e.target as HTMLInputElement).value);
            }
          }}
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            if (target.value.length > 15) {
              target.value = target.value.slice(0, 15);
            }
            setNicknameCharacters(target.value.length + "/15 characters");
          }}
          defaultValue={user?.nickname}
        />
        <p>{nicknameCharacters}</p>
      </div>
    </div>
  );
}
