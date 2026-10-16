package com.eddy.portfolio.repository;

import com.eddy.portfolio.model.OrderedContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;

/** Requetes communes a tous les contenus ordonnables (projets, competences, etc.). */
@NoRepositoryBean
public interface OrderedContentRepository<E extends OrderedContent> extends JpaRepository<E, Long> {

    /** Contenu visible sur le site public. */
    List<E> findByPublishedTrueOrderByDisplayOrderAscIdAsc();

    /** Tout le contenu, pour l'administration. */
    List<E> findAllByOrderByDisplayOrderAscIdAsc();
}
