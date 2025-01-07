import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class ServerTest {
    @Test
    public void testAddition() {
        assertEquals("Hello World!", Server.hello());
    }
}
