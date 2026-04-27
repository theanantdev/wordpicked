import { NextRequest, NextResponse } from "next/server";
import { AUTH_SESSION_COOKIE, parseAuthSession } from "@/utils/auth-session";
import { createAdminClient } from "@/utils/supabase/admin";

function isAdminSession(session: ReturnType<typeof parseAuthSession>) {
    if (!session) return false;
    return (session.isAdmin === true || session.is_admin === true) && session.role === "admin";
}

export async function GET(request: NextRequest) {
    try {
        const session = parseAuthSession(request.cookies.get(AUTH_SESSION_COOKIE)?.value);

        if (!isAdminSession(session)) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from("contact_messages")
            .select("id, first_name, last_name, email, subject, message, created_at")
            .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);

        return NextResponse.json({ success: true, data: data ?? [] });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to fetch contact messages." },
            { status: 500 },
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = parseAuthSession(request.cookies.get(AUTH_SESSION_COOKIE)?.value);

        if (!isAdminSession(session)) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required." }, { status: 400 });
        }

        const supabase = createAdminClient();
        const { error } = await supabase
            .from("contact_messages")
            .delete()
            .eq("id", id);

        if (error) throw new Error(error.message);

        return NextResponse.json({ success: true, message: "Message deleted." });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to delete message." },
            { status: 500 },
        );
    }
}
