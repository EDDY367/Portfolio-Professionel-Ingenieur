package com.eddy.portfolio.service;

import com.eddy.portfolio.dto.MessageDto;
import com.eddy.portfolio.dto.PageResponse;
import com.eddy.portfolio.exception.ResourceNotFoundException;
import com.eddy.portfolio.model.Message;
import com.eddy.portfolio.repository.MessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class MessageService {

    private static final Logger log = LoggerFactory.getLogger(MessageService.class);

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    /** Enregistre un message du formulaire de contact. Un robot (pot de miel rempli) est ignore sans erreur. */
    @Transactional
    public void submit(MessageDto.ContactRequest request) {
        if (request.website() != null && !request.website().isBlank()) {
            log.info("Message ignore : pot de miel renseigne");
            return;
        }
        Message message = new Message();
        message.setSenderName(request.name().trim());
        message.setSenderEmail(request.email().trim());
        message.setSubject(request.subject() == null || request.subject().isBlank() ? null : request.subject().trim());
        message.setBody(request.body().trim());
        messageRepository.save(message);
    }

    public PageResponse<MessageDto.Response> list(Pageable pageable) {
        return PageResponse.from(messageRepository.findAll(pageable).map(MessageDto.Response::from));
    }

    public MessageDto.UnreadCount countUnread() {
        return new MessageDto.UnreadCount(messageRepository.countByReadFalse());
    }

    @Transactional
    public MessageDto.Response markRead(Long id, boolean read) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message", id));
        message.setRead(read);
        return MessageDto.Response.from(messageRepository.save(message));
    }

    @Transactional
    public void delete(Long id) {
        if (!messageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Message", id);
        }
        messageRepository.deleteById(id);
    }
}
