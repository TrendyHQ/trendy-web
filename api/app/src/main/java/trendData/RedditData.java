package trendData;

import io.github.cdimascio.dotenv.Dotenv;
import net.dean.jraw.RedditClient;
import net.dean.jraw.http.OkHttpNetworkAdapter;
import net.dean.jraw.http.UserAgent;
import net.dean.jraw.oauth.Credentials;
import net.dean.jraw.oauth.OAuthHelper;
import net.dean.jraw.models.Submission;
import net.dean.jraw.pagination.DefaultPaginator;
import net.dean.jraw.references.SubredditReference;
import net.dean.jraw.models.SubredditSort;

public class RedditData {
    public static void main(String[] args) {
        String data = getData();
        System.out.println(data);
    }

    public static String getData() {
        // Load environment variables
        Dotenv dotenv = Dotenv.load();

        String username = dotenv.get("REDDIT_USERNAME");
        String password = dotenv.get("REDDIT_PASSWORD");
        String clientId = dotenv.get("REDDIT_CLIENT_ID");
        String clientSecret = dotenv.get("REDDIT_CLIENT_SECRET");

        // Set up Reddit API credentials
        Credentials credentials = Credentials.script(
                username,
                password,
                clientId,
                clientSecret);

        // Create a UserAgent
        UserAgent userAgent = new UserAgent("bot", "com.example.redditapp", "v1.0", username);

        // Authenticate with the Reddit API
        RedditClient redditClient = OAuthHelper.automatic(
                new OkHttpNetworkAdapter(userAgent),
                credentials);

        // Access a subreddit
        SubredditReference subreddit = redditClient.subreddit("fashion");

        // Fetch top posts
        DefaultPaginator<Submission> topPosts = subreddit.posts()
                .sorting(SubredditSort.HOT)
                .limit(5) // Fetch top 5 posts
                .build();

        // Collect the titles of the top posts
        StringBuilder result = new StringBuilder("Top posts from /r/fashion:\n");
        for (Submission post : topPosts.next()) {
            result.append("- ").append(post.getTitle()).append("\n");
        }

        return result.toString();
    }
}
