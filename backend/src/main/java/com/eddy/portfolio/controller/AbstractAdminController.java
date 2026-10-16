package com.eddy.portfolio.controller;

import com.eddy.portfolio.dto.HasId;
import com.eddy.portfolio.model.OrderedContent;
import com.eddy.portfolio.service.OrderedContentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/**
 * CRUD d'administration commun. Chaque controleur concret ne declare que son {@code @RequestMapping}.
 * Aucune logique metier ici : le controleur recoit, delegue, repond.
 */
public abstract class AbstractAdminController<E extends OrderedContent, Q, R extends HasId> {

    private final OrderedContentService<E, Q, R> service;

    protected AbstractAdminController(OrderedContentService<E, Q, R> service) {
        this.service = service;
    }

    @GetMapping
    public List<R> list() {
        return service.listAll();
    }

    @GetMapping("/{id}")
    public R detail(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    public ResponseEntity<R> create(@Valid @RequestBody Q request) {
        R created = service.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{id}")
    public R update(@PathVariable Long id, @Valid @RequestBody Q request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
