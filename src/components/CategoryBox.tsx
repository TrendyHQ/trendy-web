import { useNavigate } from "react-router-dom";

export default function CategoryBox({ categoryName }: { categoryName: string }) {
  const navigate = useNavigate();

  const getDescription = () => {
    switch (categoryName) {
      case "fashion":
        return "Stay updated with the latest fashion trends, styles, and tips. Discover new designers, seasonal collections, and fashion events.";
      case "technology":
        return "Discover the newest advancements and trends in technology. Learn about cutting-edge gadgets, software updates, and tech innovations.";
      case "food":
        return "Explore the latest food trends, recipes, and culinary tips. Find inspiration for your next meal and learn about new ingredients and cooking techniques.";
      case "entertainment":
        return "Get the scoop on the latest entertainment news and trends. Stay informed about new movies, TV shows, celebrity news, and cultural events.";
      case "social":
        return "Stay informed about the latest trends in social media and online communities. Learn about new platforms, viral content, and digital communication strategies.";
      case "fitness":
        return "Find out about the latest fitness trends, workouts, and health tips. Discover new exercise routines, fitness equipment, and wellness advice.";
      case "wellness":
        return "Learn about the latest trends in wellness, self-care, and mental health. Explore new practices for maintaining physical and emotional well-being.";
      case "music":
        return "Keep up with the latest music trends, artists, and releases. Discover new genres, albums, and music events happening around the world.";
      case "politics":
        return "Stay informed about the latest trends and developments in politics. Get insights into policy changes, governmental affairs, and political debates.";
      case "travel":
        return "Discover the latest travel trends, destinations, and tips. Get inspired for your next trip and learn about travel hacks and cultural experiences.";
      case "science":
        return "Explore the latest trends and discoveries in science. Stay updated on new research, scientific breakthroughs, and technological advancements.";
      case "sports":
        return "Get the latest updates on sports trends, events, and news. Learn about upcoming games, athlete achievements, and sports industry developments.";
      default:
        return "Stay updated with the latest trends.";
    }
  };

  return (
    <div className="category-box" onClick={() => navigate(`/category/${categoryName}`)}>
      <h2>{categoryName}</h2>
      <p>{getDescription()}</p>
    </div>
  );
}
