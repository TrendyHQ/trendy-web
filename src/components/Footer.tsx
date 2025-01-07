import "../css/Footer.css";
import { loggedIn } from "../constants";

export default function Footer() {
  return (
    <>
      {loggedIn.value && (
        <footer>
          <p>&copy; 2025</p>
        </footer>
      )}
    </>
  );
}
