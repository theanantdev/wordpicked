"use server";

import { AUTH_SESSION_COOKIE, getAuthCookieOptions, serializeAuthSession } from "@/utils/auth-session";
import { getStaffByEmail } from "@/utils/server-staff";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginUser(prevState: { error: string }, formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
        return { error: "Email and password are required." };
    }

    try {
        const staff = await getStaffByEmail(email);

        if (!staff) {
            return { error: "No staff account found for this email." };
        }

        if (staff.password !== password) {
            return { error: "Invalid login credentials." };
        }

        const isAdmin = staff.is_admin === true || staff.role === "admin";

        if (staff.is_blocked) {
            return { error: "Your account is blocked. Contact support." };
        }

        if (!isAdmin) {
            return { error: "Unauthorized: admin access only." };
        }

        const cookieStore = await cookies();

        cookieStore.set(
            AUTH_SESSION_COOKIE,
            await serializeAuthSession({
                id: staff.id,
                name: staff.name,
                email: staff.email,
                role: "admin",
                isAdmin: true,
                is_admin: true,
            }),
            getAuthCookieOptions(),
        );

        redirect("/admin/dashboard");
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Staff lookup failed.",
        };
    }
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_SESSION_COOKIE);

    redirect("/account/v1/auth/login");
}
