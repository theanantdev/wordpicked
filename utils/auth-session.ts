import type { CookieSerializeOptions } from "next/dist/compiled/@edge-runtime/cookies";

export type StaffRole = "admin" | "staff";

export interface AuthSession {
    id: string;
    name: string;
    email: string;
    role: StaffRole;
    isAdmin: boolean;
}

export const AUTH_SESSION_COOKIE = "wordpicked_auth_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSessionSecret() {
    const secret = process.env.SESSION_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!secret) {
        throw new Error("SESSION_SECRET or SUPABASE_SERVICE_ROLE_KEY is required for auth sessions.");
    }

    return secret;
}

function getWebCrypto() {
    if (!globalThis.crypto?.subtle) {
        throw new Error("Web Crypto is required for auth sessions.");
    }

    return globalThis.crypto;
}

function base64UrlEncode(value: string) {
    const bytes = new TextEncoder().encode(value);
    let binary = "";

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/");
    const normalized = padded + "=".repeat((4 - (padded.length % 4)) % 4);
    const binary = atob(normalized);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

async function signPayload(payload: string) {
    const cryptoApi = getWebCrypto();
    const key = await cryptoApi.subtle.importKey(
        "raw",
        new TextEncoder().encode(getSessionSecret()),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
    );
    const signature = await cryptoApi.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
    const signatureBytes = new Uint8Array(signature);
    let binary = "";

    for (const byte of signatureBytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function serializeAuthSession(session: AuthSession) {
    const payload = base64UrlEncode(JSON.stringify(session));
    const signature = await signPayload(payload);

    return `${payload}.${signature}`;
}

export async function parseAuthSession(cookieValue?: string | null): Promise<AuthSession | null> {
    if (!cookieValue) {
        return null;
    }

    const [payload, signature] = cookieValue.split(".");

    if (!payload || !signature) {
        return null;
    }

    const expectedSignature = await signPayload(payload);

    if (expectedSignature !== signature) {
        return null;
    }

    try {
        return JSON.parse(base64UrlDecode(payload)) as AuthSession;
    } catch {
        return null;
    }
}

export function getAuthCookieOptions(): CookieSerializeOptions {
    return {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_MAX_AGE,
    };
}
