package trendData.reddit;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import io.github.cdimascio.dotenv.Dotenv;

public class TrendAnalyzer {
    Dotenv dotenv = Dotenv.load();

    private final String DB_URL = dotenv.get("DB_URL");
    private final String USER = dotenv.get("DB_USER");
    private final String PASSWORD = dotenv.get("DB_PASSWORD");

    public boolean isPostGoingUp(String postId) throws SQLException {
        String query = "SELECT score, num_comments, date FROM post_trends WHERE post_id = ? ORDER BY date DESC LIMIT 2";

        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setString(1, postId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                int latestScore = rs.getInt("score");
                int latestComments = rs.getInt("num_comments");
                rs.next(); // Move to the previous day's record

                int previousScore = rs.getInt("score");
                int previousComments = rs.getInt("num_comments");

                return latestScore > previousScore && latestComments > previousComments;
            }
        }
        return false; // No data or trend isn't going up
    }
}
