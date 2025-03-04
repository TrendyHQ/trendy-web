import CategoryBox from "../components/CategoryBox";
import "../css/Categories.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Categories() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bodyCont">
      <Header />
      <div className="category-boxes-wrapper">
        <div className="box-container">
          <CategoryBox categoryName="fashion" />
          <CategoryBox categoryName="technology" />
          <CategoryBox categoryName="food" />
        </div>
        <div className="box-container">
          <CategoryBox categoryName="entertainment" />
          <CategoryBox categoryName="social" />
          <CategoryBox categoryName="fitness" />
        </div>
        <div className="box-container">
          <CategoryBox categoryName="health" />
          <CategoryBox categoryName="music" />
          <CategoryBox categoryName="politics" />
        </div>
        <div className="box-container">
          <CategoryBox categoryName="travel" />
          <CategoryBox categoryName="science" />
          <CategoryBox categoryName="sports" />
        </div>
      </div>
      <Footer />
    </div>
  );
}
