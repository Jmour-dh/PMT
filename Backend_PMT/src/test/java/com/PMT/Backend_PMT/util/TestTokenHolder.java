package com.PMT.Backend_PMT.util;

public final class TestTokenHolder {
    private static String token;

    private TestTokenHolder() {} // Empêche l'instanciation

    public static synchronized String getToken() {
        return token;
    }

    public static synchronized void setToken(String newToken) {
        token = newToken;
    }
}