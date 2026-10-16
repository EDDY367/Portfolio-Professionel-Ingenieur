package com.eddy.portfolio.service;

import com.eddy.portfolio.exception.ResourceNotFoundException;
import com.eddy.portfolio.model.OrderedContent;
import com.eddy.portfolio.repository.OrderedContentRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * CRUD commun aux contenus ordonnables. Les services concrets ne fournissent que ce qui change :
 * creation de l'entite, copie des champs, conversion en DTO et controles metier.
 *
 * @param <E> entite
 * @param <Q> DTO de requete
 * @param <R> DTO de reponse
 */
@Transactional(readOnly = true)
public abstract class OrderedContentService<E extends OrderedContent, Q, R> {

    private final OrderedContentRepository<E> repository;
    private final String label;

    protected OrderedContentService(OrderedContentRepository<E> repository, String label) {
        this.repository = repository;
        this.label = label;
    }

    protected abstract E newEntity();

    protected abstract void apply(Q request, E entity);

    protected abstract R toResponse(E entity);

    /** Controles metier avant enregistrement (unicite, coherence des dates...). */
    protected void validateBeforeSave(Q request, E entity) {
    }

    public List<R> listPublished() {
        return repository.findByPublishedTrueOrderByDisplayOrderAscIdAsc().stream().map(this::toResponse).toList();
    }

    public List<R> listAll() {
        return repository.findAllByOrderByDisplayOrderAscIdAsc().stream().map(this::toResponse).toList();
    }

    public R get(Long id) {
        return toResponse(find(id));
    }

    @Transactional
    public R create(Q request) {
        E entity = newEntity();
        validateBeforeSave(request, entity);
        apply(request, entity);
        return toResponse(repository.save(entity));
    }

    @Transactional
    public R update(Long id, Q request) {
        E entity = find(id);
        validateBeforeSave(request, entity);
        apply(request, entity);
        return toResponse(repository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException(label, id);
        }
        repository.deleteById(id);
    }

    protected E find(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException(label, id));
    }
}
