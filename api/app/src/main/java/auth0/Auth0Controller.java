package auth0;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.HttpResponse;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@RestController
@RequestMapping("/api") // Define the base URL for your endpoints
public class Auth0Controller {

    // Define a GET endpoint
    @PutMapping("/update-nickname")
    public void publicEndpoint(@RequestBody UserUpdateRequest request) throws Exception {

        final String DOMAIN = System.getenv("VITE_AUTH0_DOMAIN");
        final String CLIENT_ID = System.getenv("VITE_MANAGEMENT_AUTH0_CLIENT_ID");
        final String CLIENT_SECRET = System.getenv("VITE_MANAGEMENT_AUTH0_CLIENT_SECRET");

        String user_id = request.getUserId();
        String newNickname = request.getNewNickname();
        
        HttpResponse<String> response = Unirest.post("https://" + DOMAIN + "/oauth/token")
                .header("content-type", "application/json")
                .body("{\"client_id\":" + CLIENT_ID + ",\"client_secret\":" + CLIENT_SECRET + ",\"audience\":\"https://dev-8a32t01frjlto3t2.us.auth0.com/api/v2/\",\"grant_type\":\"client_credentials\"}")
                .asString();

        JsonObject jsonResponse = JsonParser.parseString(response.getBody()).getAsJsonObject();
        String accessToken = jsonResponse.get("access_token").getAsString();

        String requestBody = "{ \"nickname\": \"" + newNickname + "\" }";

        @SuppressWarnings("unused")
        HttpResponse<String> auth0ApiResponse = Unirest
                .put("https://" + DOMAIN + "/api/v2/users/" + user_id)
                .header("Authorization", "Bearer " + accessToken) // Include the authorization token
                .header("Content-Type", "application/json")
                .body(requestBody) // Pass the new nickname in the request body
                .asString();

    }

    public static class UserUpdateRequest {
        private String userId;
        private String newNickname;
        private String accessToken;

        // Getters and setters for userId, newNickname, and accessToken
        public String getUserId() {
            return userId;
        }

        public String getNewNickname() {
            return newNickname;
        }

        public String getAccessToken() {
            return accessToken;
        }
    }
}