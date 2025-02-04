import CategoryBox from "../components/CategoryBox";
import "../css/Categories.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Categories() {
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
          <CategoryBox categoryName="wellness" />
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
