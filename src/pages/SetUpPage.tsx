import { useAuth0 } from "@auth0/auth0-react";

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
    
  return (
    <div className="userSetup">
      <h1>Welcome to the User Setup!</h1>
      <p>Please complete your profile to get started.</p>
      <input
        ref={nicknameInputRef}
        type="text"
        placeholder="Enter your nickname"
      />
      <br />
      <h3>Gender:</h3>
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
        <input type="radio" name="genderInput" value="other" id="genderOther" />
      </div>
      <br />
      <h3>Birth Date:</h3>
      <input type="date" ref={birthDateInputRef} />
      <br />
      <button onClick={updateInformation}>Continue</button>
      <br />
      <button onClick={() => logout()}>Log Out</button>
    </div>
  );
}
