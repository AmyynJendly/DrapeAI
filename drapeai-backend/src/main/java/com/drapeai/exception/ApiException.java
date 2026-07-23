package com.drapeai.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ApiException extends RuntimeException {
    private final HttpStatus status;
    private final String message;

    public ApiException(String message, HttpStatus status) {
        super(message);
        this.message = message;
        this.status = status;
    }

    public ApiException(String message, HttpStatus status, Throwable cause) {
        super(message, cause);
        this.message = message;
        this.status = status;
    }
}
