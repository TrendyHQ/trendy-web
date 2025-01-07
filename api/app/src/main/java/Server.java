import static spark.Spark.*;

public class Server {
    public static void main(String[] args) {
        port(4567); // Set the server port
        get("/api", (req, res) -> {
            res.type("application/json");
            return "{\"message\": \"Hello World!\", \"status\": 200, \"code\": 0, \"error\": null}";
        });
        System.out.println("Server is running on http://localhost:4567");
    }

    public static String hello() {
        return "Hello World!";
    }
}
