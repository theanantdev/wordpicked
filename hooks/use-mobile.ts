"use client";

import { useMemo, useSyncExternalStore } from "react";

export function useMobile(breakpoint = 768) {
    const query = useMemo(() => `(max-width: ${breakpoint - 1}px)`, [breakpoint]);

    return useSyncExternalStore(
        (onStoreChange) => {
            if (typeof window === "undefined") {
                return () => { };
            }

            const mediaQueryList = window.matchMedia(query);
            const handleChange = () => onStoreChange();

            mediaQueryList.addEventListener("change", handleChange);

            return () => mediaQueryList.removeEventListener("change", handleChange);
        },
        () => {
            if (typeof window === "undefined") {
                return false;
            }

            return window.matchMedia(query).matches;
        },
        () => false,
    );
}
