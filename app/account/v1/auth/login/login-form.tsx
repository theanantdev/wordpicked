"use client";

import { useActionState } from "react";
import { loginUser } from "./actions";
import { Loader2, Mail, Lock, ShieldAlert, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const initialState = { error: "" };

export default function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginUser, initialState);

    return (
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#E3DAC8] bg-[#FFFFFF] p-8 shadow-2xl backdrop-blur-xl">
            {/* Decorative gradients */}
            <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-[#A8812A] via-[#DC2828] to-[#11412A]" />
            <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-[#A8812A] opacity-15 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-[#11412A] opacity-10 blur-3xl" />

            <div className="relative z-10">
                <div className="text-center mb-10">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#A8812A]/15 text-[#11412A] shadow-[0_0_32px_rgba(168,129,42,0.18)]">
                        <ShieldAlert size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold font-heading tracking-tight text-[#11412A]">
                        Admin Portal
                    </h2>
                    <p className="mt-2 font-medium text-[#A8812A]">
                        Authorized access only
                    </p>
                </div>

                <form action={formAction} className="space-y-6">
                    {state?.error && (
                        <div className="flex items-center gap-3 rounded-xl border border-[#DC2828]/25 bg-[#DC2828]/10 p-4 text-sm font-medium text-[#DC2828]">
                            <ShieldAlert size={18} className="shrink-0" />
                            <p>{state.error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label
                                htmlFor="email"
                                className="ml-1 text-sm font-semibold tracking-wide text-[#11412A]"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8812A]">
                                    <Mail size={20} />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="admin@wordpicked.com"
                                    className="w-full rounded-none border border-[#E3DAC8] bg-[#FDF9F2] py-3.5 pl-11 pr-4 text-[#11412A] placeholder:text-[#A8812A]/60 transition-all duration-300 focus:border-[#A8812A] focus:outline-none focus:ring-2 focus:ring-[#A8812A]/35"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="password"
                                className="ml-1 text-sm font-semibold tracking-wide text-[#11412A]"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8812A]">
                                    <Lock size={20} />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full rounded-none border border-[#E3DAC8] bg-[#FDF9F2] py-3.5 pl-11 pr-4 text-[#11412A] placeholder:text-[#A8812A]/60 transition-all duration-300 focus:border-[#A8812A] focus:outline-none focus:ring-2 focus:ring-[#A8812A]/35"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="group mt-8 flex w-full items-center justify-center gap-2 rounded-none border-none  bg-[#A8812A] py-6 text-base font-semibold text-[#FFFFFF] shadow-[0_0_22px_rgba(168,129,42,0.22)] transition-all duration-300 hover:from-[#B8943F] hover:to-[#1D5637] hover:shadow-[0_0_30px_rgba(17,65,42,0.18)]"
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

                    <p className="mt-6 text-center text-xs text-[#A8812A]">
                        If you need staff access, please contact your administrator.
                        New registrations are currently disabled.
                    </p>
                </form>
            </div>
        </div>
    );
}
