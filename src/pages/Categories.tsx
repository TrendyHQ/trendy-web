import CategoryBox from "../components/CategoryBox";

export default function Categories() {


  return (
    <div className="bodyCont">
      <div className="categorys-wrapper">
        <CategoryBox categoryName="fashion" />
        <CategoryBox categoryName="technology" />
        <CategoryBox categoryName="food" />
        <CategoryBox categoryName="entertainment" />
        <CategoryBox categoryName="social" />
        <CategoryBox categoryName="fitness" />
        <CategoryBox categoryName="wellness" />
        <CategoryBox categoryName="music" />
        <CategoryBox categoryName="education" />
        <CategoryBox categoryName="travel" />
        <CategoryBox categoryName="science" />
        <CategoryBox categoryName="sports" />
      </div>
    </div>
  );
}
