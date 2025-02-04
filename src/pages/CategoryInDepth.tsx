import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function CategoryInDepth() {
  const location = useLocation();

  const checkCategory = () => {
    const path = location.pathname;
    const category = path.split("/")[2];
    return category;
  };

  const getTrendsForCategory = () => {
    try {
      axios
        .post(
          "http://localhost:8080/api/reddit/topTrendsForCategory",
          {
            category: checkCategory(),
          },
          { withCredentials: true }
        )
        .then((res) => {
          console.log(res.data);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTrendsForCategory();
  }, []);

  return (
    <div>
      <h1>Category In Depth {checkCategory()}</h1>
    </div>
  );
}
