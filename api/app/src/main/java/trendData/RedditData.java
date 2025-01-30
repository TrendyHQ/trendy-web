package trendData;

import java.util.HashMap;
import java.util.Map;

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
    public RedditPost[] getData(String subredditName) {
        // Load environment variables
        Dotenv dotenv = Dotenv.load();

        String username = dotenv.get("REDDIT_USERNAME");
        String password = dotenv.get("REDDIT_PASSWORD");
        String clientId = dotenv.get("REDDIT_CLIENT_ID");
        String clientSecret = dotenv.get("REDDIT_CLIENT_SECRET");

        final Map<String, PostData> postHistory = new HashMap<>();

        // Set up Reddit API credentials
        Credentials credentials = Credentials.script(
                username,
                password,
                clientId,
                clientSecret);

        // Create a UserAgent
        UserAgent userAgent = new UserAgent("bot", "com.example.redditapp", "v1.0", username);

        // Authenticate with the Reddit API
        // ! This is the line that throws an error often
        RedditClient redditClient = OAuthHelper.automatic(new OkHttpNetworkAdapter(userAgent), credentials);

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
            int numComments = post.getCommentCount();

            // Check if this post has been seen before
            boolean more_relevant = false;
            if (postHistory.containsKey(postId)) {
                PostData previousData = postHistory.get(postId);

                // Determine trend status
                boolean scoreIncreasing = score > previousData.score;
                boolean commentsIncreasing = numComments > previousData.numComments;

                // Post is "more relevant" if it's gaining score and engagement
                more_relevant = scoreIncreasing && commentsIncreasing;
            }

            // Store updated post data
            if (!post.getTitle().contains("r/") && !post.isNsfw()) {
                postHistory.put(postId, new PostData(score, numComments));
                for (int i = 0; i < posts.length; i++) {
                    if (posts[i] == null) {
                        posts[i] = new RedditPost(post.getTitle(), subredditName, more_relevant, score);
                        break;
                    }
                }
            }
            
            System.out.println("Post history contents:");
            for (Map.Entry<String, PostData> entry : postHistory.entrySet()) {
                System.out.println("ID: " + entry.getKey() + " | Score: " + entry.getValue().score + " | Comments: "
                        + entry.getValue().numComments);
            }

        }

        return posts;
    }

    private static class PostData {
        int score;
        int numComments;

        public PostData(int score, int numComments) {
            this.score = score;
            this.numComments = numComments;
        }
    }

    @SuppressWarnings("unused")
    public static class RedditPost {
        private int score;
        private String title;
        private String category;
        private boolean more_relevant;

        public RedditPost(String title, String category, boolean more_relevant, int score) {
            this.title = title;
            this.category = category;
            this.more_relevant = more_relevant;
            this.score = score;
        }

        public int getScore() {
            return score;
        }
    }
}
