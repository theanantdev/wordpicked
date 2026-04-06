import { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
    title: "Admin Login - Wordpicked",
    description: "Administrative access for wordpicked officials",
};

export default function AdminLoginPage() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1A1714] p-4 md:bg-linear-to-br md:from-[#1A1714] md:via-[#241F1A] md:to-[#1A1714]">
            {/* Abstract background elements */}
            <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-[#B5542A]/20 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[#3A6648]/18 blur-[120px]" />
            <div className="pointer-events-none absolute right-[10%] top-[20%] h-[20%] w-[20%] rounded-full bg-[#A8812A]/16 blur-[80px]" />

            <div className="relative z-10 mx-auto w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    );
}
