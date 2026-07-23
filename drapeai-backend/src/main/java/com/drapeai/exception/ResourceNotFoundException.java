package com.drapeai.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends ApiException {
    public ResourceNotFoundException(String resource, String id) {
        super(String.format("%s not found with id: %s", resource, id), HttpStatus.NOT_FOUND);
    }
}
