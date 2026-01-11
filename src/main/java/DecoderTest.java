
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

public class DecoderTest {
    public static void main(String[] args) {
        String[] inputs = {
                "Season 5 (Summer)",
                "Season+5+%28Summer%29",
                "Season 5 (Summer)=",
                "{\"name\":\"Season 5 (Summer)\"}",
                "S4+%28Jan+202"
        };

        for (String input : inputs) {
            System.out.println("Input: [" + input + "]");
            try {
                String decoded = URLDecoder.decode(input, StandardCharsets.UTF_8);
                System.out.println("Decoded: [" + decoded + "]");
                System.out.println("Replaced: [" + decoded.replace("=", "") + "]");
            } catch (Exception e) {
                System.out.println("Exception: " + e);
            }
            System.out.println("---");
        }
    }
}
