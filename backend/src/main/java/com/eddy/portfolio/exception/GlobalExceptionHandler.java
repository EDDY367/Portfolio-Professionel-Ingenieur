package com.eddy.portfolio.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.LinkedHashMap;
import java.util.Map;

/** Toutes les erreurs de l'API sont renvoyees au format RFC 7807 (ProblemDetail). */
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail notFound(ResourceNotFoundException ex) {
        return problem(HttpStatus.NOT_FOUND, "Ressource introuvable", ex.getMessage());
    }

    @ExceptionHandler(ConflictException.class)
    public ProblemDetail conflict(ConflictException ex) {
        return problem(HttpStatus.CONFLICT, "Conflit", ex.getMessage());
    }

    @ExceptionHandler(InvalidDataException.class)
    public ProblemDetail invalidData(InvalidDataException ex) {
        return problem(HttpStatus.BAD_REQUEST, "Donnees invalides", ex.getMessage());
    }

    @ExceptionHandler(TooManyRequestsException.class)
    public ProblemDetail tooManyRequests(TooManyRequestsException ex) {
        return problem(HttpStatus.TOO_MANY_REQUESTS, "Trop de requetes", ex.getMessage());
    }

    /** Message volontairement identique pour « inconnu » et « mauvais mot de passe ». */
    @ExceptionHandler(AuthenticationException.class)
    public ProblemDetail authentication(AuthenticationException ex) {
        return problem(HttpStatus.UNAUTHORIZED, "Non authentifie", "Identifiants invalides");
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ProblemDetail accessDenied(AccessDeniedException ex) {
        return problem(HttpStatus.FORBIDDEN, "Acces refuse", "Vous n'avez pas les droits necessaires");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ProblemDetail integrity(DataIntegrityViolationException ex) {
        log.warn("Violation d'integrite : {}", ex.getMostSpecificCause().getMessage());
        return problem(HttpStatus.CONFLICT, "Conflit", "L'operation viole une contrainte de donnees");
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail unexpected(Exception ex) {
        log.error("Erreur inattendue", ex);
        return problem(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur interne", "Une erreur inattendue est survenue");
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers,
                                                                  HttpStatusCode status,
                                                                  WebRequest request) {
        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(e -> errors.putIfAbsent(e.getField(), e.getDefaultMessage()));
        ProblemDetail pd = problem(HttpStatus.BAD_REQUEST, "Donnees invalides", "Certains champs sont invalides");
        pd.setProperty("errors", errors);
        return ResponseEntity.badRequest().body(pd);
    }

    private static ProblemDetail problem(HttpStatus status, String title, String detail) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detail);
        pd.setTitle(title);
        return pd;
    }
}
