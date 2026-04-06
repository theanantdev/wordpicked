"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginUser(prevState: any, formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
        return { error: "Email and password are required." };
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    // Usually an admin auth check happens here. For example:
    // const { data: { user } } = await supabase.auth.getUser()
    // if (user.role !== 'admin') ... return { error: "Unauthorized" }

    redirect("/account/v1/dashboard");
}
