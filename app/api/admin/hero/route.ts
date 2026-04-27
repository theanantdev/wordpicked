import { NextRequest, NextResponse } from "next/server";
import { AUTH_SESSION_COOKIE, parseAuthSession } from "@/utils/auth-session";
import { createAdminClient } from "@/utils/supabase/admin";

type HeroPayload = {
    eyebrow?: string;
    image_url?: string;
    mobile_image_url?: string;
    sort_order?: number;
    is_active?: boolean;
};

function isAdminSession(session: ReturnType<typeof parseAuthSession>) {
    if (!session) return false;
    return (session.isAdmin === true || session.is_admin === true) && session.role === "admin";
}

function validatePayload(payload: HeroPayload, forUpdate = false) {
    const eyebrow = (payload.eyebrow || "").trim();
    const imageUrl = (payload.image_url || "").trim();
    const mobileImageUrl = (payload.mobile_image_url || "").trim();

    if (!forUpdate || payload.eyebrow !== undefined) {
        if (!eyebrow) return "Eyebrow is required.";
        if (eyebrow.length > 100) return "Eyebrow must be 100 characters or less.";
    }

    if (!forUpdate || payload.image_url !== undefined) {
        if (!imageUrl) return "Desktop image URL is required.";
        if (imageUrl.length > 500) return "Desktop image URL is too long.";
    }

    if (!forUpdate || payload.mobile_image_url !== undefined) {
        if (!mobileImageUrl) return "Mobile image URL is required.";
        if (mobileImageUrl.length > 500) return "Mobile image URL is too long.";
    }

    if (payload.sort_order !== undefined) {
        if (!Number.isFinite(payload.sort_order) || payload.sort_order < 0 || payload.sort_order > 999) {
            return "Sort order must be between 0 and 999.";
        }
    }

    return null;
}

export async function GET(request: NextRequest) {
    try {
        const session = parseAuthSession(request.cookies.get(AUTH_SESSION_COOKIE)?.value);

        if (!isAdminSession(session)) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const supabase = createAdminClient();
        const { data, error } = await supabase
            .from("home_hero_slides")
            .select("id, eyebrow, image_url, mobile_image_url, sort_order, is_active, created_at, updated_at")
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: true });

        if (error) throw new Error(error.message);

        return NextResponse.json({ success: true, data: data ?? [] });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to fetch hero slides." },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = parseAuthSession(request.cookies.get(AUTH_SESSION_COOKIE)?.value);

        if (!isAdminSession(session)) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const payload = (await request.json()) as HeroPayload;
        const validationError = validatePayload(payload);

        if (validationError) {
            return NextResponse.json({ success: false, error: validationError }, { status: 400 });
        }

        const supabase = createAdminClient();
        const { data, error } = await supabase
            .from("home_hero_slides")
            .insert([
                {
                    eyebrow: payload.eyebrow!.trim(),
                    image_url: payload.image_url!.trim(),
                    mobile_image_url: payload.mobile_image_url!.trim(),
                    sort_order: payload.sort_order ?? 0,
                    is_active: payload.is_active ?? true,
                },
            ])
            .select("id, eyebrow, image_url, mobile_image_url, sort_order, is_active, created_at, updated_at")
            .single();

        if (error) throw new Error(error.message);

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to create hero slide." },
            { status: 500 },
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = parseAuthSession(request.cookies.get(AUTH_SESSION_COOKIE)?.value);

        if (!isAdminSession(session)) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { id, ...payload } = (await request.json()) as HeroPayload & { id?: string };

        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required." }, { status: 400 });
        }

        const validationError = validatePayload(payload, true);
        if (validationError) {
            return NextResponse.json({ success: false, error: validationError }, { status: 400 });
        }

        const updates: Record<string, unknown> = {};

        if (payload.eyebrow !== undefined) updates.eyebrow = payload.eyebrow.trim();
        if (payload.image_url !== undefined) updates.image_url = payload.image_url.trim();
        if (payload.mobile_image_url !== undefined) updates.mobile_image_url = payload.mobile_image_url.trim();
        if (payload.sort_order !== undefined) updates.sort_order = payload.sort_order;
        if (payload.is_active !== undefined) updates.is_active = payload.is_active;

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ success: false, error: "No fields to update." }, { status: 400 });
        }

        const supabase = createAdminClient();
        const { data, error } = await supabase
            .from("home_hero_slides")
            .update(updates)
            .eq("id", id)
            .select("id, eyebrow, image_url, mobile_image_url, sort_order, is_active, created_at, updated_at")
            .single();

        if (error) throw new Error(error.message);

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to update hero slide." },
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

        const { id } = (await request.json()) as { id?: string };

        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required." }, { status: 400 });
        }

        const supabase = createAdminClient();
        const { error } = await supabase
            .from("home_hero_slides")
            .delete()
            .eq("id", id);

        if (error) throw new Error(error.message);

        return NextResponse.json({ success: true, message: "Hero slide deleted." });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to delete hero slide." },
            { status: 500 },
        );
    }
}
