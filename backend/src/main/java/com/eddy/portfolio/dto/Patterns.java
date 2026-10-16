package com.eddy.portfolio.dto;

import java.util.Arrays;
import java.util.List;

/** Expressions regulieres de validation et petits utilitaires partages par les DTO. */
public final class Patterns {

    public static final String HTTP_URL = "^https?://\\S+$";
    public static final String SLUG = "^[a-z0-9]+(?:-[a-z0-9]+)*$";
    public static final String ICON_KEY = "^[a-z0-9-]{1,40}$";

    private Patterns() {
    }

    /** "a, b,c" -> ["a","b","c"] */
    public static List<String> splitCsv(String csv) {
        if (csv == null || csv.isBlank()) {
            return List.of();
        }
        return Arrays.stream(csv.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList();
    }

    public static String joinCsv(List<String> values) {
        if (values == null || values.isEmpty()) {
            return null;
        }
        return String.join(",", values.stream().map(String::trim).filter(s -> !s.isEmpty()).toList());
    }
}
