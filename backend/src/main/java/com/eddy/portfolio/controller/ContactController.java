package com.eddy.portfolio.controller;

import com.eddy.portfolio.dto.MessageDto;
import com.eddy.portfolio.security.AttemptLimiter;
import com.eddy.portfolio.service.MessageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequestMapping("/api/v1/contact")
@Tag(name = "Public - Contact")
public class ContactController {

    private static final int MAX_MESSAGES = 5;
    private static final Duration WINDOW = Duration.ofHours(1);

    private final MessageService messageService;
    private final AttemptLimiter attemptLimiter;

    public ContactController(MessageService messageService, AttemptLimiter attemptLimiter) {
        this.messageService = messageService;
        this.attemptLimiter = attemptLimiter;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void send(@Valid @RequestBody MessageDto.ContactRequest request, HttpServletRequest http) {
        attemptLimiter.check("contact:" + http.getRemoteAddr(), MAX_MESSAGES, WINDOW);
        messageService.submit(request);
    }
}
