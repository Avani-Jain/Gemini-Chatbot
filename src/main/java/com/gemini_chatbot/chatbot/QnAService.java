package com.gemini_chatbot.chatbot; ////package com.gemini_chatbot.chatbot;
////
////import org.springframework.beans.factory.annotation.Value;
////import org.springframework.stereotype.Service;
////import org.springframework.web.reactive.function.client.WebClient;
////
////import java.util.Map;
////
////@Service
////public class QnAService {
////    @Value("${gemini.api.url}")
////    private String geminiAPIUrl;
////    @Value("${gemini.api.key}")
////    private final WebClient webclient;
////
////    private String geminiAPIKey;
////
////    public QnAService(WebClient.Builder webclient) {
////        this.webclient = webclient.build();
////    }
////
////    //web flux is an HTTP client for making requests. Web client can therefore be created using it.
////    public String getAnswer(String question) {
////        //construct a request payload for which we need api key and URL [Gemini]
////        Map<String, Object> requestBody = Map.of("contests", new Object[]{
////                Map.of("parts", new Object[]{
////                        Map.of("text", question)
////                })
////        });
////
////
////        //make api calls
////
////
////        return webclient.post().uri(geminiAPIUrl + geminiAPIKey).header("Content-Type", "application/json").bodyValue(requestBody).retrieve().bodyToMono(String.class).block();
////        //return response
////    }
////}
//
//package com.ai.gemini_chat;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.web.reactive.function.client.WebClient;
//
//import java.util.Map;
//
//@Service
//public class QnAService {
//    // Access to APIKey and URL [Gemini]
//    @Value("${gemini.api.url}")
//    private String geminiApiUrl;
//
//    @Value("${gemini.api.key}")
//    private String geminiApiKey;
//
//    private final WebClient webClient;
//
//    public QnAService(WebClient.Builder webClient) {
//        this.webClient = webClient.build();
//    }
//
//    public String getAnswer(String question) {
//        // Construct the request payload
//        Map<String, Object> requestBody = Map.of(
//                "contents", new Object[] {
//                        Map.of("parts", new Object[] {
//                                Map.of("text", question)
//                        } )
//                }
//        );
//
//        // Make API Call
//        String response = webClient.post()
//                .uri(geminiApiUrl + geminiApiKey)
//                .header("Content-Type","application/json")
//                .bodyValue(requestBody)
//                .retrieve()
//                .bodyToMono(String.class)
//                .block();
//
//        // Return response
//        return response;
//    }
//}

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class QnAService {
    // Access to APIKey and URL [Gemini]
    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final WebClient webClient;

    public QnAService(WebClient.Builder webClient) {
        this.webClient = webClient.build();
    }

    public String getAnswer(String question) {
        // Construct the request payload
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[] {
                        Map.of("parts", new Object[] {
                                Map.of("text", question)
                        } )
                }
        );

        // Make API Call
        String response = webClient.post()
                .uri(geminiApiUrl + geminiApiKey)
                .header("Content-Type","application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        try {
            // Parse JSON and extract the answer text
            JsonNode root = objectMapper.readTree(response);
            JsonNode textNode = root.path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text");

            if (textNode.isMissingNode()) {
                return "Could not extract answer from response.";
            }

            return textNode.asText();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error processing Gemini response.";
        }
    }

}