import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import "../../css/Profile.css";

export default function Profile() {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const updateNickname = async (nickname: string) => {
    try {
      const response = await fetch("http://localhost:4567/api/update-nickname", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user?.sub, nickname }),
      });

      const result = await response.json();
      console.log(result.message);
    } catch (err) {
      console.error("Error updating nickname:", err);
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
