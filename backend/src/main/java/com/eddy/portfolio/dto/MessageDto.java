package com.eddy.portfolio.dto;

import com.eddy.portfolio.model.Message;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public final class MessageDto {

    private MessageDto() {
    }

    /**
     * Formulaire de contact public. {@code website} est un champ « pot de miel » : invisible pour un humain,
     * rempli par les robots. S'il est renseigne, le message est ignore silencieusement.
     */
    public record ContactRequest(
            @NotBlank @Size(max = 120) String name,
            @NotBlank @Email @Size(max = 200) String email,
            @Size(max = 200) String subject,
            @NotBlank @Size(min = 10, max = 4000) String body,
            @Size(max = 200) String website) {
    }

    public record Response(Long id, String senderName, String senderEmail, String subject, String body,
                           boolean read, Instant createdAt) implements HasId {

        public static Response from(Message m) {
            return new Response(m.getId(), m.getSenderName(), m.getSenderEmail(), m.getSubject(), m.getBody(),
                    m.isRead(), m.getCreatedAt());
        }
    }

    public record ReadRequest(boolean read) {
    }

    public record UnreadCount(long unread) {
    }
}
