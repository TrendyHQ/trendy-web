import React, { JSX } from "react";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { GoogleTrendsData } from "../../types";
import { Placeholder } from "react-bootstrap";

interface TopCategoriesSectionProps {
  topCategories: GoogleTrendsData[];
}

const TopCategoriesSection: React.FC<TopCategoriesSectionProps> = ({
  topCategories,
}) => {
  const getTopCategories = (): JSX.Element[] => {
    // If there are no categories, create placeholder columns
    if (topCategories.length === 0) {
      const placeholderColumns = [1, 2, 3].map((columnIndex) => (
        <div
          key={`topCategory-placeholder-${columnIndex}`}
          className="flex-1/3 h-full flex flex-col gap-[5px]"
        >
          {[1, 2, 3, 4].map((cardIndex) => (
            <Card
              key={`placeholder-card-${columnIndex}-${cardIndex}`}
              className="relative overflow-hidden bg-neutral-700 text-white border-0 pt-[12px] no-underline transition-colors duration-200"
            >
              <Badge
                className="absolute right-1 top-1 bg-neutral-800 text-[10px] w-fit h-4 text-white border-0"
                variant="outline"
                style={{ borderRadius: "50%", aspectRatio: 1, padding: "12px" }}
              >
                {(columnIndex - 1) * 4 + cardIndex}
              </Badge>
              <CardContent>
                <div className="text-sm font-medium line-clamp-2 pl-2 no-underline mb-[1rem]">
                  <Placeholder as="span" animation="glow">
                    <Placeholder
                      xs={8}
                      className="rounded-full"
                      bg="secondary"
                    />
                  </Placeholder>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t border-[#262626] p-1">
                <div className="flex items-center text-gray-400 pt-1 pb-1">
                  <TrendingUp className="mr-0.5 h-2.5 w-2.5" />
                  <span className="text-[10px] no-underline">
                    Discover trends
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ));

      return placeholderColumns;
    }

    if (topCategories.length === 1)
      return [
        <div
          className="flex-1/3 h-full flex flex-col gap-[5px]"
          key={`topCategory-0`}
        >
          <div className="w-full bg-[#484848] flex-1/4 rounded">
            No available trends
          </div>
        </div>,
      ];
      
    // Define ranges for each column
    const columnRanges = [
      { min: 0, max: 3 }, // Column 1: indices 0-3
      { min: 4, max: 7 }, // Column 2: indices 4-7
      { min: 8, max: 12 }, // Column 3: indices 8-12
    ];

    return columnRanges.map((range, columnIndex) => {
      // Get valid categories for this column
      const categoryElements = topCategories
        .filter(
          (category, index) =>
            typeof category !== "string" &&
            index >= range.min &&
            index <= range.max
        )
        // Format and display each Google Trends category with ranking, title, and trending indicator
        .map((category, index) => (
          <Link
            to={`/category/${checkCategory(category.title)}`}
            style={{ textDecoration: "none" }}
            key={index}
          >
            <Card className="relative overflow-hidden bg-neutral-700 text-white border-0 pt-[12px] no-underline transition-colors duration-200 hover:bg-neutral-600">
              <Badge
                className="absolute right-1 top-1 bg-neutral-800 text-[10px] w-fit h-4 text-white border-0"
                variant="outline"
                style={{ borderRadius: "50%", aspectRatio: 1, padding: "12px" }}
              >
                {topCategories.indexOf(category) + 1}
              </Badge>
              <CardContent>
                <div className="text-sm font-medium line-clamp-2 pl-2 no-underline mb-[1rem]">
                  {category.title}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t border-[#262626] p-1">
                {category.isTrending ? (
                  <div className="flex items-center text-[#ff5733] pt-1 pb-1">
                    <TrendingUp className="mr-0.5 h-2.5 w-2.5" />
                    <span className="text-[10px] no-underline">Trending</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-400 pt-1 pb-1 no-underline">
                    Not trending
                  </span>
                )}
              </CardFooter>
            </Card>
          </Link>
        ));

      return (
        <div
          key={`topCategory-${columnIndex}`}
          className="flex-1/3 h-full flex flex-col gap-[5px]"
        >
          {categoryElements.length > 0 ? (
            categoryElements
          ) : (
            <div className="w-full bg-[#484848] flex-1/4 rounded">None</div>
          )}
        </div>
      );
    });
  };

  function checkCategory(category: string): string {
    const lowerCategory = category.toLowerCase();

    // Map of Google Trends categories to our application categories
    const categoryMap: Record<string, string> = {
      fashion: "fashion",
      technology: "technology",
      food: "foodandbeverages",
      "food & drink": "foodandbeverages",
      entertainment: "entertainment",
      media: "socialmedia",
      fitness: "fitness",
      health: "health",
      music: "music",
      politics: "politics",
      travel: "travel",
      science: "science",
      sports: "sports",
    };

    // Check if the category or a subset of words in it matches our map
    for (const [key, value] of Object.entries(categoryMap)) {
      if (lowerCategory.includes(key)) {
        return value;
      }
    }

    // Default fallback - normalize the original category
    return category.replace(/ /g, "").toLowerCase();
  }

  return (
    <div className="right-body-cont2">
      <h1 className="section-title">Top Categories</h1>
      <div className="grid grid-cols-3 gap-2 p-[20px]">
        {getTopCategories()}
      </div>
    </div>
  );
};

export default TopCategoriesSection;
