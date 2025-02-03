package trendData.reddit;

import java.sql.SQLException;

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
    public RedditPost[] getData(String subredditName) throws SQLException {
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
        UserAgent userAgent = new UserAgent("bot", "com.trendy.dataFetcher", "v1.0", username);

        // Authenticate with the Reddit API
        RedditClient redditClient = null;
        try {
            redditClient = OAuthHelper.automatic(new OkHttpNetworkAdapter(userAgent), credentials);
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (redditClient != null) {
            // Access a subreddit
            SubredditReference subreddit = redditClient.subreddit(subredditName);

            // Fetch top posts
            DefaultPaginator<Submission> topPosts = subreddit.posts()
                    .sorting(SubredditSort.HOT)
                    .limit(2) // Fetch top 2 posts
                    .build();

            // Collect the titles of the top posts
            RedditPost[] posts = new RedditPost[2];

            for (Submission post : topPosts.next()) {
                String postId = post.getId();
                int score = post.getScore();

                // Store updated post data
                if (!post.getTitle().contains("r/") && !post.isNsfw()) {
                    RedditDataStorage storage = new RedditDataStorage();
                    int moreRelevantValue = new TrendAnalyzer().isPostGoingUp(postId, post);

                    storage.storeRedditPostData(post);

                    for (int i = 0; i < posts.length; i++) {
                        if (posts[i] == null) {
                            posts[i] = new RedditPost(post.getTitle(), subredditName, moreRelevantValue, score);
                            break;
                        }
                    }
                }
            }

            return posts;
        }
        return null;
    }

    @SuppressWarnings("unused")
    public static class RedditPost {
        private int score;
        private String title;
        private String category;
        private int moreRelevantValue;

        public RedditPost(String title, String category, int moreRelevantValue, int score) {
            this.title = title;
            this.category = category;
            this.moreRelevantValue = moreRelevantValue;
            this.score = score;
        }

        public int getScore() {
            return score;
        }
    }
}
