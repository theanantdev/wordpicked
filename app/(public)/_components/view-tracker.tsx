"use client";

import { useEffect, useRef } from "react";

interface ViewTrackerProps {
    articleId: string;
}

export function ViewTracker({ articleId }: ViewTrackerProps) {
    const hasTracked = useRef(false);

    useEffect(() => {
        if (hasTracked.current) return;
        hasTracked.current = true;

        // Use a simple session storage flag to avoid counting multiple times in one session
        // if the user navigates back and forth.
        const storageKey = `viewed_${articleId}`;
        const alreadyViewed = sessionStorage.getItem(storageKey);

        if (!alreadyViewed) {
            fetch("/api/articles/view", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ articleId }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        sessionStorage.setItem(storageKey, "true");
                    }
                })
                .catch(err => console.error("Failed to track view:", err));
        }
    }, [articleId]);

    return null;
}
