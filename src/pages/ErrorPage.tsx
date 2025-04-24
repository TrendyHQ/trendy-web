import { Bug } from "lucide-react";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function ErrorPage() {
  return (
    <div className="bodyCont">
      <Header />
      <div className="flex !min-h-[calc(100vh-76px)] flex-col gap-[20px] items-center justify-center">
        <Bug size={150} color="red" strokeWidth={1.5} />
        <h2 className="text-2xl font-bold text-red-600 mt-4">Oops! Something went wrong.</h2>
        <p className="text-gray-300 text-center max-w-md">
          An error has occurred. Please try reloading the page or contact support if the problem persists.
        </p>
      </div>
      <Footer />
    </div>
  );
}
