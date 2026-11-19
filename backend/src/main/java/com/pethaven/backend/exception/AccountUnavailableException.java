package com.pethaven.backend.exception;

public class AccountUnavailableException extends RuntimeException {
    public AccountUnavailableException(String message) {
        super(message);
    }
}