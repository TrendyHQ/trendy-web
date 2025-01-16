package auth0;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
public class Auth0Application {
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();

        String keyId = dotenv.get("AWS_ACCESS_KEY_ID");
        String secretKey = dotenv.get("AWS_SECRET_ACCESS_KEY");

        System.setProperty("AWS_ACCESS_KEY_ID", keyId);
        System.setProperty("AWS_SECRET_ACCESS_KEY", secretKey);
        
        SpringApplication.run(Auth0Application.class, args);
    }
}
