import static spark.Spark.*;

public class Server {
    public static void main(String[] args) {
        port(4567); // Set the server port
        get("/hello", (req, res) -> "Hello World!");
        System.out.println("Server is running on http://localhost:4567");
    }
}
