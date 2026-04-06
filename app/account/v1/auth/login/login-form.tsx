"use client";

import { useActionState } from "react";
import { loginUser } from "./actions";
import { Loader2, Mail, Lock, ShieldAlert, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const initialState = { error: "" };

export default function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginUser, initialState);

    return (
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#DDD7CC]/70 bg-[#1A1714]/88 p-8 shadow-2xl backdrop-blur-xl">
            {/* Decorative gradients */}
            <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-[#B5542A] via-[#A8812A] to-[#3A6648]" />
            <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-[#B5542A] opacity-25 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-[#3A6648] opacity-25 blur-3xl" />

            <div className="relative z-10">
                <div className="text-center mb-10">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B5542A]/20 text-[#F5F0E8] shadow-[0_0_32px_rgba(181,84,42,0.35)]">
                        <ShieldAlert size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-[#F5F0E8]">
                        Admin Portal
                    </h2>
                    <p className="mt-2 font-medium text-[#EDE7D9]/80">
                        Authorized access only
                    </p>
                </div>

                <form action={formAction} className="space-y-6">
                    {state?.error && (
                        <div className="flex items-center gap-3 rounded-xl border border-[#B5542A]/55 bg-[#B5542A]/14 p-4 text-sm font-medium text-[#F6C8B5]">
                            <ShieldAlert size={18} className="shrink-0" />
                            <p>{state.error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label
                                htmlFor="email"
                                className="ml-1 text-sm font-semibold tracking-wide text-[#F5F0E8]"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#EDE7D9]/55">
                                    <Mail size={20} />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="admin@wordpicked.com"
                                    className="w-full rounded-none border border-[#DDD7CC]/25 bg-[#F5F0E8]/6 py-3.5 pl-11 pr-4 text-[#F5F0E8] placeholder:text-[#EDE7D9]/35 transition-all duration-300 focus:border-[#A8812A] focus:outline-none focus:ring-2 focus:ring-[#A8812A]/45"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="password"
                                className="ml-1 text-sm font-semibold tracking-wide text-[#F5F0E8]"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#EDE7D9]/55">
                                    <Lock size={20} />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full rounded-none border border-[#DDD7CC]/25 bg-[#F5F0E8]/6 py-3.5 pl-11 pr-4 text-[#F5F0E8] placeholder:text-[#EDE7D9]/35 transition-all duration-300 focus:border-[#A8812A] focus:outline-none focus:ring-2 focus:ring-[#A8812A]/45"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="group mt-8 flex w-full items-center justify-center gap-2 rounded-none border-none bg-linear-to-r from-[#B5542A] to-[#3A6648] py-6 text-base font-semibold text-[#F5F0E8] shadow-[0_0_22px_rgba(181,84,42,0.35)] transition-all duration-300 hover:from-[#C96840] hover:to-[#4A7D5A] hover:shadow-[0_0_30px_rgba(168,129,42,0.4)]"
                    >
                        {isPending ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                Sign In to Dashboard
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>

                    <p className="mt-6 text-center text-xs text-[#EDE7D9]/50">
                        If you need staff access, please contact your administrator.
                        New registrations are currently disabled.
                    </p>
                </form>
            </div>
        </div>
    );
}
