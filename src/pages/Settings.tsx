import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "../css/Settings.css";
import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingPage from "./LoadingPage";
import { Loader } from "lucide-react";

export default function Settings() {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [apiIsLoading, setApiIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [nicknameCharacters, setNicknameCharacters] = useState<string>("");
  const [activeSection, setActiveSection] = useState<string>("profile");
  const [formData, setFormData] = useState({
    nickname: user?.nickname || "",
    birthDate: "",
    gender: "",
    emailNotifications: true,
    pushNotifications: false,
    profileVisibility: "public",
    theme: "light",
  });

  const nicknameInputRef = useRef<HTMLInputElement>(null);
  const birthDateInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      // Initialize with user data if available
      setFormData((prev) => ({
        ...prev,
        nickname: user.nickname || "",
      }));

      // Set initial nickname character count
      if (user.nickname) {
        setNicknameCharacters(`${user.nickname.length}/15 characters`);
      }

      // Fetch user metadata from the API
      setApiIsLoading(true);
      axios
        .get("http://localhost:8080/api/users/getUserProperty", {
          params: {
            userId: user.sub,
            property: [
              "birthDate",
              "gender",
              "emailNotifications",
              "pushNotifications",
              "profileVisibility",
              "theme",
            ].join(","),
          },
        })
        .then((response) => {
          const metadata = response.data;
          if (metadata) {
            setFormData((prev) => ({
              ...prev,
              birthDate: metadata.birthDate || "",
              gender: metadata.gender || "",
              emailNotifications:
                metadata.emailNotifications !== undefined
                  ? metadata.emailNotifications
                  : true,
              pushNotifications:
                metadata.pushNotifications !== undefined
                  ? metadata.pushNotifications
                  : false,
              profileVisibility: metadata.profileVisibility || "public",
              theme: metadata.theme || "light",
            }));
          }
        })
        .catch((error) => {
          console.error("Error fetching user metadata:", error);
        })
        .finally(() => {
          setApiIsLoading(false);
        });
    }
  }, [user]);

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/" />;
  }

  const updatePfp = async (image: File) => {
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    if (image.size > maxFileSize) {
      alert(
        "File size exceeds 10MB. Current file is " +
          image.size / (1024 * 1024) +
          " MB."
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
        "http://localhost:8080/api/users/update-picture",
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
    setIsSaving(true);

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
        emailNotifications: formData.emailNotifications,
        pushNotifications: formData.pushNotifications,
        profileVisibility: formData.profileVisibility,
        theme: formData.theme,
      },
    });

    if (user) {
      try {
        await axios.patch(
          "http://localhost:8080/api/users/updateUserInformation",
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

        setIsSaving(false);
      } catch (error) {
        setIsSaving(false);
        console.error("Error updating user information:", error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      logout();
      try {
        await axios.delete("http://localhost:8080/api/users/deleteUser", {
          data: { userId: user?.sub },
          headers: {
            "Content-Type": "application/json",
          },
        });
        alert("Account deleted successfully.");
        window.location.href = "/";
      } catch {
        alert("Failed to delete account. Please try again later.");
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (isLoading || apiIsLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="bodyCont settingsPage">
      <Header />
      <div className="settings-container">
        <div className="settings-sidebar">
          <h2>Settings</h2>
          <ul>
            <li
              className={activeSection === "profile" ? "active" : ""}
              onClick={() => setActiveSection("profile")}
            >
              Profile
            </li>
            <li
              className={activeSection === "account" ? "active" : ""}
              onClick={() => setActiveSection("account")}
            >
              Account
            </li>
            <li
              className={activeSection === "notifications" ? "active" : ""}
              onClick={() => setActiveSection("notifications")}
            >
              Notifications
            </li>
            <li
              className={activeSection === "privacy" ? "active" : ""}
              onClick={() => setActiveSection("privacy")}
            >
              Privacy
            </li>
            <li
              className={activeSection === "appearance" ? "active" : ""}
              onClick={() => setActiveSection("appearance")}
            >
              Appearance
            </li>
          </ul>
        </div>

        <div className="settings-content">
          {activeSection === "profile" && (
            <div className="settings-section">
              <h1>Profile Settings</h1>
              <div className="profile-picture-section">
                <div className="profile-picture-container">
                  <img
                    src={user?.picture}
                    className="settings-profile-picture"
                    alt="Profile"
                  />
                  <button className="upload-btn" onClick={triggerFileInput}>
                    Change Picture
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden-file-input"
                    onChange={(e) => {
                      if (e.target.files?.[0]) updatePfp(e.target.files?.[0]);
                    }}
                  />
                </div>
                <div className="profile-info">
                  <h3>Personal Information</h3>
                  <div className="form-group">
                    <label htmlFor="nickname">Display Name</label>
                    <input
                      type="text"
                      id="nickname"
                      ref={nicknameInputRef}
                      name="nickname"
                      onChange={(e) => {
                        const target = e.target as HTMLInputElement;
                        if (target.value.length > 15) {
                          target.value = target.value.slice(0, 15);
                        }
                        setNicknameCharacters(
                          target.value.length + "/15 characters"
                        );
                        handleInputChange(e);
                      }}
                      defaultValue={user?.nickname}
                    />
                    <span className="character-count">
                      {nicknameCharacters}
                    </span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="birthDate">Birth Date</label>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      ref={birthDateInputRef}
                      onChange={handleInputChange}
                      value={formData.birthDate}
                    />
                  </div>

                  <div className="form-group">
                    <label>Gender</label>
                    <div className="radio-group">
                      <div className="radio-option">
                        <input
                          type="radio"
                          name="genderInput"
                          value="male"
                          id="genderMale"
                          checked={formData.gender === "male"}
                          onChange={() =>
                            setFormData({ ...formData, gender: "male" })
                          }
                        />
                        <label htmlFor="genderMale">Male</label>
                      </div>

                      <div className="radio-option">
                        <input
                          type="radio"
                          name="genderInput"
                          value="female"
                          id="genderFemale"
                          checked={formData.gender === "female"}
                          onChange={() =>
                            setFormData({ ...formData, gender: "female" })
                          }
                        />
                        <label htmlFor="genderFemale">Female</label>
                      </div>

                      <div className="radio-option">
                        <input
                          type="radio"
                          name="genderInput"
                          value="other"
                          id="genderOther"
                          checked={formData.gender === "other"}
                          onChange={() =>
                            setFormData({ ...formData, gender: "other" })
                          }
                        />
                        <label htmlFor="genderOther">Other</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="settings-section">
              <h1>Notification Preferences</h1>
              <div className="notification-options">
                <div className="form-group toggle-group">
                  <label htmlFor="emailNotifications">
                    Email Notifications
                    <p className="setting-description">
                      Receive updates, news, and important information via email
                    </p>
                  </label>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      name="emailNotifications"
                      checked={formData.emailNotifications}
                      onChange={handleInputChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="form-group toggle-group">
                  <label htmlFor="pushNotifications">
                    Push Notifications
                    <p className="setting-description">
                      Receive real-time notifications when someone interacts
                      with your content
                    </p>
                  </label>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      id="pushNotifications"
                      name="pushNotifications"
                      checked={formData.pushNotifications}
                      onChange={handleInputChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === "privacy" && (
            <div className="settings-section">
              <h1>Privacy Settings</h1>
              <div className="privacy-options">
                <div className="form-group">
                  <label htmlFor="profileVisibility">Profile Visibility</label>
                  <select
                    id="profileVisibility"
                    name="profileVisibility"
                    value={formData.profileVisibility}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profileVisibility: e.target.value,
                      })
                    }
                  >
                    <option value="public">
                      Public - Everyone can see your profile
                    </option>
                    <option value="friends">
                      Friends Only - Only friends can see your profile
                    </option>
                    <option value="private">
                      Private - Only you can see your profile
                    </option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === "appearance" && (
            <div className="settings-section">
              <h1>Appearance Settings</h1>
              <div className="theme-options">
                <div className="form-group">
                  <label>Theme</label>
                  <div className="theme-selector">
                    <div
                      className={`theme-option ${
                        formData.theme === "light" ? "active" : ""
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, theme: "light" })
                      }
                    >
                      <div className="theme-preview light-theme-preview"></div>
                      <span>Light</span>
                    </div>
                    <div
                      className={`theme-option ${
                        formData.theme === "dark" ? "active" : ""
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, theme: "dark" })
                      }
                    >
                      <div className="theme-preview dark-theme-preview"></div>
                      <span>Dark</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "account" && (
            <div className="settings-section">
              <h1>Account Settings</h1>
              <div className="account-info">
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user?.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Account Created:</span>
                  <span className="info-value">
                    {user?.updated_at
                      ? new Date(user.updated_at).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
              <div className="danger-zone">
                <h3>Danger Zone</h3>
                <button
                  className="delete-account-btn"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

          <div className="settings-actions">
            <button
              className={`save-settings-btn ${isSaving ? "!bg-[#be4126]" : ""}`}
              onClick={updateUserInformation}
              disabled={isSaving}
            >
              {isSaving ? <Loader className="animate-spin" /> : "Save Changes"}
            </button>
            <button
              className="cancel-btn"
              onClick={() => window.location.reload()}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
