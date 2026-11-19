package com.pethaven.backend.exception;

public class EmailAlreadyUsedException extends RuntimeException {
    public EmailAlreadyUsedException() {
        super("This email is already registered.");
    }
}