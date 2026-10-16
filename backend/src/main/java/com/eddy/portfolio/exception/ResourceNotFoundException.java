package com.eddy.portfolio.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String label, Object identifier) {
        super(label + " introuvable : " + identifier);
    }
}
