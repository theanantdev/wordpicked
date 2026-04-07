import { createHmac, timingSafeEqual } from 'crypto';

export type StaffRole = "admin" | "staff";

export interface AuthSession {
    id: string;
    name: string;
    email: string;
    role: StaffRole;
    isAdmin?: boolean;
    is_admin?: boolean;
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

function base64UrlEncode(value: string) {
    return Buffer.from(value, 'utf8').toString('base64url');
}

function base64UrlDecode(value: string) {
    return Buffer.from(value, 'base64url').toString('utf8');
}

function signPayload(payload: string) {
    return createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

export function serializeAuthSession(session: AuthSession) {
    const payload = base64UrlEncode(JSON.stringify(session));
    const signature = signPayload(payload);

    return `${payload}.${signature}`;
}

export function parseAuthSession(cookieValue?: string | null): AuthSession | null {
    if (!cookieValue) {
        return null;
    }

    const [payload, signature] = cookieValue.split(".");

    if (!payload || !signature) {
        return null;
    }

    const expectedSignature = signPayload(payload);
    const expectedBuffer = Buffer.from(expectedSignature);
    const actualBuffer = Buffer.from(signature);

    if (expectedBuffer.length !== actualBuffer.length) {
        return null;
    }

    if (!timingSafeEqual(expectedBuffer, actualBuffer)) {
        return null;
    }

    try {
        return JSON.parse(base64UrlDecode(payload)) as AuthSession;
    } catch {
        return null;
    }
}

export function getAuthCookieOptions() {
    return {
        httpOnly: true,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_MAX_AGE,
    };
}
