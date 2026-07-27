package com.drapeai.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String phone;

    private String preferredSize;

    private String stylePreference;

    private Boolean newsletterOptIn;

    @Builder.Default
    private Role role = Role.USER;

    public enum Role {
        USER, ADMIN
    }
}
