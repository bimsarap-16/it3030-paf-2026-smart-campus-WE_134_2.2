package com.smartcampus.backend.util;

import java.util.regex.Pattern;

public class PasswordValidator {
    // At least 8 characters, one uppercase, one lowercase
    private static final String PASSWORD_PATTERN = "^(?=.*[a-z])(?=.*[A-Z]).{8,}$";
    private static final Pattern pattern = Pattern.compile(PASSWORD_PATTERN);

    public static boolean isValid(String password) {
        if (password == null) {
            return false;
        }
        return pattern.matcher(password).matches();
    }

    public static String getValidationErrorMessage() {
        return "Password must be at least 8 characters long and contain at least one uppercase letter and one lowercase letter.";
    }
}
