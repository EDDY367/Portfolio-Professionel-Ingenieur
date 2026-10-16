package com.eddy.portfolio.security;

import com.eddy.portfolio.exception.TooManyRequestsException;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Limiteur de tentatives en memoire (fenetre glissante) : protege la connexion contre le brute force
 * et le formulaire de contact contre le spam. Suffisant pour une instance unique ; avec plusieurs
 * instances, il faudrait un stockage partage (Redis).
 */
@Component
public class AttemptLimiter {

    private static final int MAX_TRACKED_KEYS = 10_000;

    private final Map<String, Deque<Instant>> hits = new ConcurrentHashMap<>();

    public void check(String key, int maxAttempts, Duration window) {
        if (hits.size() > MAX_TRACKED_KEYS) {
            hits.clear();
        }
        Instant now = Instant.now();
        Instant limit = now.minus(window);
        Deque<Instant> attempts = hits.computeIfAbsent(key, k -> new ArrayDeque<>());
        synchronized (attempts) {
            while (!attempts.isEmpty() && attempts.peekFirst().isBefore(limit)) {
                attempts.pollFirst();
            }
            if (attempts.size() >= maxAttempts) {
                throw new TooManyRequestsException();
            }
            attempts.addLast(now);
        }
    }
}
