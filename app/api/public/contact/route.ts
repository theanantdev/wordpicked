import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const firstName = (body.firstName || "").trim();
        const lastName = (body.lastName || "").trim();
        const email = (body.email || "").trim().toLowerCase();
        const subject = (body.subject || "").trim();
        const message = (body.message || "").trim();

        if (!firstName || !email || !subject || !message) {
            return NextResponse.json(
                { success: false, error: "First name, email, subject, and message are required." },
                { status: 400 },
            );
        }

        if (!email.includes("@")) {
            return NextResponse.json(
                { success: false, error: "A valid email is required." },
                { status: 400 },
            );
        }

        if (subject.length > 200 || message.length > 5000) {
            return NextResponse.json(
                { success: false, error: "Subject or message is too long." },
                { status: 400 },
            );
        }

        const supabase = createAdminClient();

        const { error } = await supabase
            .from("contact_messages")
            .insert([
                {
                    first_name: firstName,
                    last_name: lastName || null,
                    email,
                    subject,
                    message,
                },
            ]);

        if (error) throw new Error(error.message);

        return NextResponse.json({ success: true, message: "Message sent successfully." });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to submit message." },
            { status: 500 },
        );
    }
}
