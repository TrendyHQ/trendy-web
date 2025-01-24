package socialData;

import com.mashape.unirest.http.Unirest;
import io.github.cdimascio.dotenv.Dotenv;

import java.util.Base64;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;

public class RedditData {
    Dotenv dotenv = Dotenv.load();

    private final String CLIENT_ID = dotenv.get("REDDIT_CLIENT_ID");
    private final String CLIENT_SECRET = dotenv.get("REDDIT_CLIENT_SECRET");
    private final String USERNAME = dotenv.get("REDDIT_USERNAME");
    private final String PASSWORD = dotenv.get("REDDIT_PASSWORD");

    public String getData() throws Exception {

        String token = authenticate();

        HttpResponse<String> response = Unirest.get("https://oauth.reddit.com/api/trending_subreddits")
                .header("Authorization", "Bearer " + token)
                .header("User-Agent", "MyRedditApp/1.0")
                .asString();

        System.out.println(response.getBody());
        return response.getBody();
    }
    
    public String authenticate(String code) throws Exception {
        String auth = CLIENT_ID + ":" + CLIENT_SECRET;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
    
        HttpResponse<JsonNode> response = Unirest.post("https://www.reddit.com/api/v1/access_token")
                .header("Authorization", "Basic " + encodedAuth)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .field("grant_type", "authorization_code") // Add grant_type
                .field("code", code) // Use the authorization code
                .field("redirect_uri", REDIRECT_URI) // Redirect URI must match the one used during authorization
                .asJson();
    
        if (response.getStatus() == 200) {
            System.out.println(response.getBody());
            String accessToken = response.getBody().getObject().getString("access_token");
            System.out.println("Access Token: " + accessToken);
            return accessToken; // Return the access token
        } else {
            throw new RuntimeException("Failed to authenticate: " + response.getBody().toString());
        }
    }
    
    public static void main(String[] args) throws Exception {
        new RedditData().getData();
    }
}