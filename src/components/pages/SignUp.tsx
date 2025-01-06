import "../../css/SignUp.css";
import Header from "../Header";
import Footer from "../Footer";
import bg from "../../assets/background.svg";

export default function SignUp() {
  return (
    <div className="bodyCont signUp">
      <Header />
      <h1>Sign Up</h1>
      <img className="homeBackground" src={bg} alt="geometric shapes" />
      <form id="signUpForm">
        <label htmlFor="userName">User Name</label>
        <input id="userName" type="text" />
        <label htmlFor="display">Display Name</label>
        <input id="display" type="text" />
        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="user@example.com" />
        <label htmlFor="pass">Password</label>
        <input id="pass" type="password" />
        <label htmlFor="confirm">Confirm Password</label>
        <input id="confirm" type="password" />
        <button>Sign Up</button>
        <p className="divider">OR</p>
      </form>
      <Footer />
    </div>
  );
}
