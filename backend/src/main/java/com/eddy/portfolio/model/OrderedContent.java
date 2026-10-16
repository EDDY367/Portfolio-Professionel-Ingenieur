package com.eddy.portfolio.model;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

/**
 * Contenu affichable sur le site public : on peut le masquer sans le supprimer
 * ({@code published}) et choisir sa position ({@code displayOrder}).
 */
@MappedSuperclass
@Getter
@Setter
public abstract class OrderedContent extends BaseEntity {

    @Column(name = "is_published", nullable = false)
    private boolean published = true;

    @Column(name = "display_order", nullable = false)
    private int displayOrder = 0;
}
