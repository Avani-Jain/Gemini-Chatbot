package com.gemini_chatbot.chatbot;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@RestController
@AllArgsConstructor //generate a constructor with all arguments which will help us in autowiring.
@RequestMapping("/qna")
//@CrossOrigin(origins = "http://localhost:3000")
public class AIController {

    private final QnAService qnaService;
     @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/ask")
    public String askQuestion(@RequestBody Map<String, String> payload){
        String question = payload.get("question");
        String answer = qnaService.getAnswer(question);
        return answer;
    }

    @CrossOrigin(origins = "http://localhost:3000") // or "*" for all
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }

}
