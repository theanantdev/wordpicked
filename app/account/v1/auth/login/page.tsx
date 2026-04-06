import { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";
import { AUTH_SESSION_COOKIE, parseAuthSession } from "@/utils/auth-session";
import { cookies } from "next/headers";

export const metadata: Metadata = {
    title: "Admin Login - Wordpicked",
    description: "Administrative access for wordpicked officials",
};

export default async function AdminLoginPage() {
    const cookieStore = await cookies();
    const session = await parseAuthSession(cookieStore.get(AUTH_SESSION_COOKIE)?.value);

    const isAdminSession = session?.isAdmin === true || session?.is_admin === true;

    if (isAdminSession) {
        redirect("/admin/dashboard");
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FDF9F2] p-4 md:bg-linear-to-br md:from-[#FDF9F2] md:via-[#E3DAC8] md:to-[#FDF9F2]">
            {/* Abstract background elements */}
            <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-[#A8812A]/18 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[#11412A]/12 blur-[120px]" />
            <div className="pointer-events-none absolute right-[10%] top-[20%] h-[20%] w-[20%] rounded-full bg-[#DC2828]/8 blur-[80px]" />

            <div className="relative z-10 mx-auto w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    );
}
