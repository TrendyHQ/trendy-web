import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "../css/Settings.css";
import { useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Settings() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [apiIsLoading, setApiIsLoading] = useState<boolean>(false);
  const [nicknameCharacters, setNicknameCharacters] = useState<string>("");

  const nicknameInputRef = useRef<HTMLInputElement>(null);
  const birthDateInputRef = useRef<HTMLInputElement>(null);

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/" />;
  }

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

      await axios.put(
        "http://localhost:8080/api/auth0/update-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Send cookies
        }
      );
      setApiIsLoading(false);
      alert(`Picture updated successfully`);
      window.location.reload();
    } catch {
      setApiIsLoading(false);
      alert("Failed to update picture.");
    }
  };

  const updateUserInformation = async () => {
    setApiIsLoading(true);

    const nickname: string | null = nicknameInputRef.current?.value || null;
    const birthDate: string | null = birthDateInputRef.current?.value || null;
    const gender: string | null =
      (
        document.querySelector(
          'input[name="genderInput"]:checked'
        ) as HTMLInputElement
      )?.value || null;

    const jsonRequest = JSON.stringify({
      nickname: nickname,
      user_metadata: {
        gender: gender,
        birthDate: birthDate,
      },
    });

    if ((nickname || gender) && user) {
      try {
        await axios.patch(
          "http://localhost:8080/api/auth0/updateUserInformation",
          {
            userId: user.sub,
            toUpdate: jsonRequest,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setApiIsLoading(false);
        alert("User information updated successfully");
      } catch (error) {
        setApiIsLoading(false);
        console.error("Error updating user information:", error);
      }
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
      <Header />
      <img src={user?.picture} className="settingsPfp"></img>
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
          ref={nicknameInputRef}
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
        <br />
        <h3>Birth Date:</h3>
        <input type="date" ref={birthDateInputRef} />
        <br />
        <div>
          <label htmlFor="genderMale">Male</label>
          <input type="radio" name="genderInput" value="male" id="genderMale" />
          <label htmlFor="genderFemale">Female</label>
          <input
            type="radio"
            name="genderInput"
            value="female"
            id="genderFemale"
          />
          <label htmlFor="genderOther">Other</label>
          <input
            type="radio"
            name="genderInput"
            value="other"
            id="genderOther"
          />
          <br />
          <button onClick={updateUserInformation}>Update Information</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
