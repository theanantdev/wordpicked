import { NextRequest, NextResponse } from "next/server";
import { AUTH_SESSION_COOKIE, parseAuthSession } from "@/utils/auth-session";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/staff")) {
        return NextResponse.next();
    }

    const session = await parseAuthSession(request.cookies.get(AUTH_SESSION_COOKIE)?.value);

    if (!session) {
        if (pathname.startsWith("/api/staff")) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const loginUrl = new URL("/account/v1/auth/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith("/admin/users") && !session.isAdmin) {
        const dashboardUrl = new URL("/admin/dashboard", request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/api/staff/:path*"],
};