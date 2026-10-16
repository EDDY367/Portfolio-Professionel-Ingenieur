package com.eddy.portfolio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Message envoye via le formulaire de contact. */
@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
public class Message extends BaseEntity {

    @Column(name = "sender_name", nullable = false, length = 120)
    private String senderName;

    @Column(name = "sender_email", nullable = false, length = 200)
    private String senderEmail;

    @Column(length = 200)
    private String subject;

    @Column(nullable = false, length = 4000)
    private String body;

    @Column(name = "is_read", nullable = false)
    private boolean read = false;
}
