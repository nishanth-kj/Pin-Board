"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Users, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }) {
    const pathname = usePathname();

    const nav = [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Analytics", href: "/admin/analytics", icon: BarChart },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-muted/40">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-background md:flex">
                <div className="p-6 border-b">
                    <h2 className="text-lg font-bold tracking-tight">Admin Console</h2>
                </div>
                <nav className="flex-1 space-y-1 p-4">
                    {nav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                                pathname === item.href ? "bg-muted text-foreground" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground">
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/">Exit Dashboard</Link>
                        </Button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
