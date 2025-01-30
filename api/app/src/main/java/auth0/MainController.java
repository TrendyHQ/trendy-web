package auth0;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import io.github.cdimascio.dotenv.Dotenv;
import kong.unirest.core.HttpResponse;
import kong.unirest.core.Unirest;
import trendData.RedditData;
import trendData.RedditData.RedditPost;
import java.util.concurrent.CompletableFuture;

@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
@RestController
@RequestMapping("/api") // Define the base URL for your endpoints
public class MainController {
    public static void main(String[] args) {
        SpringApplication.run(MainController.class, args);
    }

    Dotenv dotenv = Dotenv.load();

    final String DOMAIN = dotenv.get("VITE_AUTH0_DOMAIN");
    final String CLIENT_ID = dotenv.get("VITE_MANAGEMENT_AUTH0_CLIENT_ID");
    final String CLIENT_SECRET = dotenv.get("VITE_MANAGEMENT_AUTH0_CLIENT_SECRET");

    @PutMapping("/auth0/update-nickname")
    public ResponseEntity<String> publicEndpoint(@RequestBody UserUpdateRequest request) throws Exception {
        try {

            String user_id = request.getUserId();
            String newNickname = request.getNewNickname();

            String accessToken = getAccessToken();

            JsonObject requestBodyJson = new JsonObject();
            requestBodyJson.addProperty("nickname", newNickname);
            String requestBody = requestBodyJson.toString();

            setUserProperty(requestBody, accessToken, user_id);
            return ResponseEntity.ok("Nickname updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update nickname: " + e.getMessage());
        }
    }

    @PutMapping("/auth0/update-picture")
    public ResponseEntity<String> updatePicture(
            @RequestParam("userId") String userId,
            @RequestPart("file") MultipartFile file) throws Exception {
        try {
            String user_id = userId;
            MultipartFile newPicture = file;

            String fileUrl = new UploadFile().uploadToS3(newPicture);

            String accessToken = getAccessToken();

            JsonObject requestBodyJson = new JsonObject();
            requestBodyJson.addProperty("picture", fileUrl);
            String requestBody = requestBodyJson.toString();

            setUserProperty(requestBody, accessToken, user_id);

            return ResponseEntity.ok("Nickname updated successfully");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update nickname: " + e.getMessage());
        }

    }

    @PostMapping("/trendData/reddit")
    public ResponseEntity<String> getRedditData() {
        try {
            RedditData redditData = new RedditData();
            CompletableFuture<RedditPost[]> fashionFuture = CompletableFuture.supplyAsync(() -> redditData.getData("fashion"));
            CompletableFuture<RedditPost[]> technologyFuture = CompletableFuture.supplyAsync(() -> redditData.getData("technology"));
            CompletableFuture<RedditPost[]> foodFuture = CompletableFuture.supplyAsync(() -> redditData.getData("food"));
            CompletableFuture<RedditPost[]> entertainmentFuture = CompletableFuture.supplyAsync(() -> redditData.getData("entertainment"));
            CompletableFuture<RedditPost[]> socialMediaFuture = CompletableFuture.supplyAsync(() -> redditData.getData("socialmedia"));
            CompletableFuture<RedditPost[]> fitnessFuture = CompletableFuture.supplyAsync(() -> redditData.getData("fitness"));
            CompletableFuture<RedditPost[]> wellnessFuture = CompletableFuture.supplyAsync(() -> redditData.getData("wellness"));
            CompletableFuture<RedditPost[]> musicFuture = CompletableFuture.supplyAsync(() -> redditData.getData("music"));
            CompletableFuture<RedditPost[]> educationFuture = CompletableFuture.supplyAsync(() -> redditData.getData("education"));
            CompletableFuture<RedditPost[]> travelFuture = CompletableFuture.supplyAsync(() -> redditData.getData("travel"));
            CompletableFuture<RedditPost[]> scienceFuture = CompletableFuture.supplyAsync(() -> redditData.getData("science"));
            CompletableFuture<RedditPost[]> sportsFuture = CompletableFuture.supplyAsync(() -> redditData.getData("sports"));

            CompletableFuture.allOf(
                fashionFuture, technologyFuture, foodFuture, entertainmentFuture,
                socialMediaFuture, fitnessFuture, wellnessFuture, musicFuture,
                educationFuture, travelFuture, scienceFuture, sportsFuture
            ).join();

            RedditPost[] fashionData = fashionFuture.get();
            RedditPost[] technologyData = technologyFuture.get();
            RedditPost[] foodData = foodFuture.get();
            RedditPost[] entertainmentData = entertainmentFuture.get();
            RedditPost[] socialMediaData = socialMediaFuture.get();
            RedditPost[] fitnessData = fitnessFuture.get();
            RedditPost[] wellnessData = wellnessFuture.get();
            RedditPost[] musicData = musicFuture.get();
            RedditPost[] educationData = educationFuture.get();
            RedditPost[] travelData = travelFuture.get();
            RedditPost[] scienceData = scienceFuture.get();
            RedditPost[] sportsData = sportsFuture.get();

            RedditPost[][] data = {
                fashionData, technologyData, foodData, entertainmentData, socialMediaData,
                fitnessData, wellnessData, musicData, educationData, travelData, scienceData, sportsData
            };

            // Collect all posts into a single list
            List<RedditPost> allPosts = new ArrayList<>();
            for (RedditPost[] subredditData : data) {
                if (subredditData != null) { // Ensure that the subredditData is not null
                    Collections.addAll(allPosts, subredditData);
                }
            }

            // Sort posts by score in descending order
            allPosts.sort((p1, p2) -> {
                if (p1 != null && p2 != null) {
                    return Integer.compare(p2.getScore(), p1.getScore());
                }
                return 0; // If either p1 or p2 is null, consider them equal for sorting purposes
            });

            // Take top 6 posts or as many as are available
            RedditPost[] topPosts = new RedditPost[Math.min(6, allPosts.size())];
            for (int i = 0; i < topPosts.length; i++) {
                topPosts[i] = allPosts.get(i);
            }

            return ResponseEntity.ok(new Gson().toJson(topPosts));
        } catch (Exception e) {
            System.err.println(e);
            return ResponseEntity.badRequest().body("Failed to recieve data: " + e.getMessage());
        }
    }

    public static class UserUpdateRequest {
        private String userId;
        private String newNickname;

        public String getUserId() {
            return userId;
        }

        public String getNewNickname() {
            return newNickname;
        }
    }

    private String getAccessToken() throws Exception {

        String jsonBody = "{\"client_id\":\"" + CLIENT_ID + "\",\"client_secret\":\"" + CLIENT_SECRET
                + "\",\"audience\":\"https://" + DOMAIN + "/api/v2/\",\"grant_type\":\"client_credentials\"}";

        HttpResponse<String> response = Unirest.post("https://" + DOMAIN + "/oauth/token")
                .header("content-type", "application/json")
                .body(jsonBody)
                .asString();

        JsonObject jsonResponse = JsonParser.parseString(response.getBody()).getAsJsonObject();
        String accessToken = jsonResponse.get("access_token").getAsString();

        return accessToken;
    }

    private void setUserProperty(String requestBody, String accessToken, String user_id) throws Exception {
        @SuppressWarnings("unused")
        HttpResponse<String> auth0ApiResponse = Unirest
                .patch("https://" + DOMAIN + "/api/v2/users/" + user_id)
                .header("authorization", "Bearer " + accessToken)
                .header("Content-Type", "application/json")
                .header("cache-control", "no-cache")
                .body(requestBody)
                .asString();
    }

}
