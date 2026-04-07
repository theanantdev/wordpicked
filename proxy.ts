import { NextRequest, NextResponse } from "next/server";
import { AUTH_SESSION_COOKIE, parseAuthSession } from "@/utils/auth-session";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session = await parseAuthSession(request.cookies.get(AUTH_SESSION_COOKIE)?.value);

    const isAdminArea = pathname.startsWith("/admin") || pathname.startsWith("/api/staff");

    if (!isAdminArea) {
        return NextResponse.next();
    }

    if (!session) {
        if (pathname.startsWith("/api/staff")) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const response = NextResponse.redirect(new URL("/account/v1/auth/login", request.url));
        response.cookies.delete(AUTH_SESSION_COOKIE);
        return response;
    }

    const isAdminSession = session.isAdmin === true || session.is_admin === true;

    if (!isAdminSession || session.role !== "admin") {
        if (pathname.startsWith("/api/staff")) {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        const response = NextResponse.redirect(new URL("/account/v1/auth/login", request.url));
        response.cookies.delete(AUTH_SESSION_COOKIE);
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/api/staff/:path*"],
};