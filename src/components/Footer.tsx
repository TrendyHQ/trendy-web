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
        <p>&copy; 2025 Trendy. All rights reserved.</p>
        <p>
          Follow us on{" "}
          <a
            href="#"
            className="!text-blue-300 hover:!text-blue-100 underline px-2 py-1 transition duration-150"
          >
            Twitter
          </a>{" "}
          |{" "}
          <a
            href="#"
            className="!text-blue-300 hover:!text-blue-100 underline px-2 py-1 transition duration-150"
          >
            Facebook
          </a>{" "}
          |{" "}
          <a
            href="#"
            className="!text-blue-300 hover:!text-blue-100 underline px-2 py-1 transition duration-150"
          >
            Instagram
          </a>
        </p>
      </div>
    </footer>
  );
}
