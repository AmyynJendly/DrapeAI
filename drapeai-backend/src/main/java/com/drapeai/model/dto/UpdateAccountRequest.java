package com.drapeai.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAccountRequest {
    private String name;
    private String phone;
    private String preferredSize;
    private String stylePreference;
    private Boolean newsletterOptIn;
}