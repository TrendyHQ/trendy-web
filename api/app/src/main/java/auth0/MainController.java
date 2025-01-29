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
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import io.github.cdimascio.dotenv.Dotenv;
import kong.unirest.core.HttpResponse;
import kong.unirest.core.Unirest;
import trendData.RedditData;

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
    public ResponseEntity<String> updatePicture() {
        try {
            return ResponseEntity.ok(new RedditData().getData());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update nickname: " + e.getMessage());
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
