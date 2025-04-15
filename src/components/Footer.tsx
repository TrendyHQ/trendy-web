import "../css/Footer.css";
import { useAuth0 } from "@auth0/auth0-react";

export default function Footer() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <footer></footer>;
  }

  return (
    <footer className="bg-[#353447] text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; 2025 T. All rights reserved.</p>
        <p>
          Follow us on{" "}
          <a href="#" className="text-blue-400">
            Twitter
          </a>{" "}
          |{" "}
          <a href="#" className="text-blue-400">
            Facebook
          </a>{" "}
          |{" "}
          <a href="#" className="text-blue-400">
            Instagram
          </a>
        </p>
      </div>
    </footer>
  );
}
