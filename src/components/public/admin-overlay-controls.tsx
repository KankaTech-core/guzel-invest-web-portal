"use client";

import { useState } from "react";
import { AdminQuickActions } from "@/components/public/admin-quick-actions";
import { AdminFeedbackLayer } from "@/components/public/admin-feedback-layer";

export function AdminOverlayControls() {
    const [isHiddenUntilRefresh, setIsHiddenUntilRefresh] = useState(false);

    if (isHiddenUntilRefresh) {
        return null;
    }

    return (
        <>
            <AdminQuickActions onHideAll={() => setIsHiddenUntilRefresh(true)} />
            <AdminFeedbackLayer />
        </>
    );
}
