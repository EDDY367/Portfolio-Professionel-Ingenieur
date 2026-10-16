package com.eddy.portfolio.controller;

import com.eddy.portfolio.dto.MessageDto;
import com.eddy.portfolio.dto.PageResponse;
import com.eddy.portfolio.service.MessageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/messages")
@Tag(name = "Admin - Messages")
public class AdminMessageController {

    private final MessageService messageService;

    public AdminMessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping
    public PageResponse<MessageDto.Response> list(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return messageService.list(pageable);
    }

    @GetMapping("/unread-count")
    public MessageDto.UnreadCount unreadCount() {
        return messageService.countUnread();
    }

    @PatchMapping("/{id}/read")
    public MessageDto.Response markRead(@PathVariable Long id, @RequestBody MessageDto.ReadRequest request) {
        return messageService.markRead(id, request.read());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        messageService.delete(id);
    }
}
