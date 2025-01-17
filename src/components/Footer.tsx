import "../css/Footer.css";
import { useAuth0 } from "@auth0/auth0-react";

export default function Footer() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <footer>
        <p>&copy; 2025</p>
      </footer>
    );
  }

  return (
    <>
      {isAuthenticated && (
        <footer>
          <p>&copy; 2025</p>
        </footer>
      )}
    </>
  );
}
