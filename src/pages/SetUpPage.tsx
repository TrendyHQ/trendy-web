import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import "../css/SetUpPage.css";

export default function SetUpPage({
  functions,
  refs,
}: {
  functions: { updateInformation: () => void };
  refs: {
    nicknameInputRef: React.RefObject<HTMLInputElement>;
    birthDateInputRef: React.RefObject<HTMLInputElement>;
  };
}) {
  const { updateInformation } = functions;
  const { nicknameInputRef, birthDateInputRef } = refs;
  const { logout } = useAuth0();
  const [selectedGender, setSelectedGender] = useState<string>("");
    
  return (
    <div className="setup-container">
      <div className="setup-card">
        <div className="setup-header">
          <h1 className="setup-title">Complete Your Profile</h1>
          <p className="setup-subtitle">Let&apos;s get to know you better</p>
        </div>

        <div className="setup-form">          <div className="form-group">
            <label className="form-label">Nickname</label>
            <input
              ref={nicknameInputRef}
              type="text"
              placeholder="Enter your nickname"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Gender</label>
            <div className="gender-options">
              <label className={`gender-option ${selectedGender === 'male' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="genderInput" 
                  value="male" 
                  id="genderMale"
                  onChange={(e) => setSelectedGender(e.target.value)}
                />
                <span>Male</span>
              </label>
              <label className={`gender-option ${selectedGender === 'female' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="genderInput" 
                  value="female" 
                  id="genderFemale"
                  onChange={(e) => setSelectedGender(e.target.value)}
                />
                <span>Female</span>
              </label>
              <label className={`gender-option ${selectedGender === 'other' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="genderInput" 
                  value="other" 
                  id="genderOther"
                  onChange={(e) => setSelectedGender(e.target.value)}
                />
                <span>Other</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Birth Date</label>
            <input 
              type="date" 
              ref={birthDateInputRef} 
              className="form-input date-input"
            />
          </div>
        </div>

        <div className="setup-actions">
          <button 
            onClick={updateInformation}
            className="btn-primary"
          >
            Continue
          </button>
          <button 
            onClick={() => logout()}
            className="btn-secondary"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
