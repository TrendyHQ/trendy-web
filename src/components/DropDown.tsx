import { useAuth0 } from "@auth0/auth0-react";
import { LogOut, MessageSquareWarning, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function DropDown({functions, values, dropDownRef} : {
    functions: {handleFeedback: () => void, logout: () => void},
    values: [number, boolean, boolean, string],
    dropDownRef: React.RefObject<HTMLDivElement>
}) {
    const {handleFeedback, logout} = functions;
    const [iconSize, isDarkTheme, profileDown, userNickname] = values;

    const { user } = useAuth0();

    return(
        <div
        ref={dropDownRef}
        className={`dropDown ${profileDown ? "show" : ""}`}
        tabIndex={0}
      >
        <div className="upperQuadrant">
          <div className="profileShowcase">
            <img src={user?.picture} alt="Picture of User" className="pfp" />
            <h3 className="userName">{userNickname}</h3>
          </div>
        </div>
        <div className="lowerQuadrant">
          <div className="buttons">
            <Link to="/settings">
              <button>
                <div className="greyCircle">
                  <Settings
                    size={iconSize}
                    color={isDarkTheme ? "#f0f0f0" : "#333333"}
                  />
                </div>
                Settings
              </button>
            </Link>
            <button onClick={handleFeedback}>
              <div className="greyCircle">
                <MessageSquareWarning
                  size={iconSize}
                  color={isDarkTheme ? "#f0f0f0" : "#333333"}
                />
              </div>
              Give Feedback
            </button>
            <button onClick={() => logout()}>
              <div className="greyCircle">
                <LogOut
                  size={iconSize}
                  color={isDarkTheme ? "#f0f0f0" : "#333333"}
                />
              </div>
              Logout
            </button>
          </div>
        </div>
      </div>
    )
}