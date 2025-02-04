package trendData.reddit;

import java.sql.SQLException;

import org.slf4j.LoggerFactory;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import net.dean.jraw.RedditClient;
import net.dean.jraw.models.Submission;
import net.dean.jraw.pagination.DefaultPaginator;
import net.dean.jraw.references.SubredditReference;
import net.dean.jraw.models.SubredditSort;

public class RedditData {
    public RedditPost[] getData(String subredditName, RedditClientManager redditClientManager) throws SQLException {

        // Disable logging for JRAW
        Logger jrawLogger = (Logger) LoggerFactory.getLogger("net.dean.jraw");
        jrawLogger.setLevel(Level.OFF);

        if (redditClientManager.getClient() == null) {
            redditClientManager.autherizeClient();
        }
        RedditClient redditClient = redditClientManager.getClient();

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
                String moreInfo = post.getSelfText();

                // Store updated post data
                if (!post.getTitle().contains("r/") && !post.isNsfw()) {
                    int moreRelevantValue = new TrendAnalyzer().isPostGoingUp(postId, post);

                    RedditDataStorage storage = new RedditDataStorage();
                    storage.storeRedditPostData(post);

                    for (int i = 0; i < posts.length; i++) {
                        if (posts[i] == null) {
                            posts[i] = new RedditPost(post.getTitle(), subredditName, moreRelevantValue, score, moreInfo);
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
        private String moreInfo;

        public RedditPost(String title, String category, int moreRelevantValue, int score, String moreInfo) {
            this.title = title;
            this.category = category;
            this.moreRelevantValue = moreRelevantValue;
            this.score = score;
            this.moreInfo = moreInfo;
        }

        public int getScore() {
            return score;
        }
    }
}
