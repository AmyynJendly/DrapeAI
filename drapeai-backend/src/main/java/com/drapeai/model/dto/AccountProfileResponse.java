package com.drapeai.model.dto;

import com.drapeai.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountProfileResponse {
    private String name;
    private String email;
    private String phone;
    private String preferredSize;
    private String stylePreference;
    private Boolean newsletterOptIn;
    private User.Role role;
}