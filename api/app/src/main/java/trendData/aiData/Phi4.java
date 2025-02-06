package trendData.aiData;

import java.util.Arrays;
import java.util.List;

import com.azure.ai.inference.ChatCompletionsClient;
import com.azure.ai.inference.ChatCompletionsClientBuilder;
import com.azure.ai.inference.models.ChatCompletions;
import com.azure.ai.inference.models.ChatCompletionsOptions;
import com.azure.ai.inference.models.ChatRequestMessage;
import com.azure.ai.inference.models.ChatRequestSystemMessage;
import com.azure.ai.inference.models.ChatRequestUserMessage;
import com.azure.core.credential.AzureKeyCredential;

import io.github.cdimascio.dotenv.Dotenv;

public class Phi4 {
    public String getPhi4Data(String message, String userLocation, String userAge, String userGender) {
        Dotenv dotenv = Dotenv.load();
        String key = dotenv.get("GITHUB_TOKEN");
        String endpoint = "https://models.inference.ai.azure.com";
        String model = "Phi-4";
        if(userLocation == null) {
            userLocation = "unknown";
        }

        ChatCompletionsClient client = new ChatCompletionsClientBuilder()
                .credential(new AzureKeyCredential(key))
                .endpoint(endpoint)
                .buildClient();

        List<ChatRequestMessage> chatMessages = Arrays.asList(
                new ChatRequestSystemMessage(
                        "You are an trend analyzer who only helps with giving data on current and future trends in the world. Give data relative to their location: "
                                + userLocation + ", age: " + userAge + ", and gender: " + userGender
                                + ". Do not include the user's location, age, or gender in your response. Only answer questions about trend data."),
                new ChatRequestUserMessage(message));

        ChatCompletionsOptions chatCompletionsOptions = new ChatCompletionsOptions(chatMessages);
        chatCompletionsOptions.setModel(model);

        ChatCompletions completions = client.complete(chatCompletionsOptions);

        return completions.getChoice().getMessage().getContent();
    }
}
