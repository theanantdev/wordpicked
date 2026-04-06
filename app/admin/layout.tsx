import { AUTH_SESSION_COOKIE, parseAuthSession } from "@/utils/auth-session";
import { cookies } from "next/headers";
import { DashboardShell } from "./_components/dashboard-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const session = await parseAuthSession(cookieStore.get(AUTH_SESSION_COOKIE)?.value);

    return <DashboardShell session={session}>{children}</DashboardShell>;
}
