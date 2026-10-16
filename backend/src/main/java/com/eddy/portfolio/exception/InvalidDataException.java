package com.eddy.portfolio.exception;

/** Regle metier non respectee (par exemple une date de fin avant la date de debut). */
public class InvalidDataException extends RuntimeException {

    public InvalidDataException(String message) {
        super(message);
    }
}
