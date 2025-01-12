package auth0;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")  // Define the base URL for your endpoints
public class Auth0Controller {

    // Define a GET endpoint
    @GetMapping("/update-nickname")
    public String sayHello() {
        return "Hello, World!";
    }
}
