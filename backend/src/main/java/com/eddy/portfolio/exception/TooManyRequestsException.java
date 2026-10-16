package com.eddy.portfolio.exception;

public class TooManyRequestsException extends RuntimeException {

    public TooManyRequestsException() {
        super("Trop de tentatives, reessayez plus tard");
    }
}
