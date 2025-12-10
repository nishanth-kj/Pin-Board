"use client";

import React from "react";
import { AdBanner } from "@/components/AdBanner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function ToolShell({ title, description, icon: Icon, children, className = "" }) {
    return (
        <div className={`container mx-auto px-4 py-8 max-w-6xl animate-in fade-in duration-500 ${className}`}>
            <div className="mb-8">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Tools
                </Link>
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <Icon className="w-8 h-8 text-primary" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                        <p className="text-muted-foreground text-lg">{description}</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_300px] gap-8">
                <div className="space-y-6">
                    {children}
                </div>

                <aside className="space-y-6">
                    {/* Sidebar Ad */}
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-muted/30 rounded-lg p-4 border text-center">
                            <h3 className="font-semibold mb-2">Pro Tip</h3>
                            <p className="text-sm text-muted-foreground">
                                Did you know you can run this app offline? Download the desktop version for maximum speed.
                            </p>
                        </div>
                        <AdBanner className="min-h-[600px] my-0" />
                    </div>
                </aside>
            </div>
        </div>
    );
}
