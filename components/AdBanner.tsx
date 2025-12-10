"use client";

import React from "react";

export function AdBanner({ slotId = "default", className = "" }) {
    // In a real implementation, this would load an AdSense unit or similar.
    // For now, it renders a placeholder in dev/production if no ID is present, 
    // or a configured ad unit.

    return (
        <div className={`w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-center min-h-[100px] my-6 ${className}`}>
            <div className="text-center text-muted-foreground text-sm">
                <p className="font-semibold">Advertisement</p>
                <p className="text-xs">Support us by disabling adblock</p>
                {/* <ins className="adsbygoogle" ... /> */}
            </div>
        </div>
    );
}
