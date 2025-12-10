"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Settings, Laptop, Menu } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function Navbar() {
    const pathname = usePathname();

    const routes = [
        {
            href: "/",
            label: "Home",
            active: pathname === "/",
        },
        {
            href: "/tools/image",
            label: "Image Tools",
            active: pathname === "/tools/image",
        },
        {
            href: "/tools/pdf",
            label: "PDF Tools",
            active: pathname === "/tools/pdf",
        },
        {
            href: "/tools/markdown",
            label: "Markdown",
            active: pathname === "/tools/markdown",
        },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto w-full max-w-7xl flex h-14 items-center px-4 sm:px-6 lg:px-8">
                {/* Left: Logo */}
                <div className="flex w-[200px] items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <LayoutGrid className="h-6 w-6" />
                        <span className="font-bold hidden sm:inline-block">
                            ConvertHub
                        </span>
                    </Link>
                </div>
                
                {/* Center: Navigation */}
                <div className="flex-1 flex justify-center">
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "transition-colors hover:text-foreground/80",
                                    route.active ? "text-foreground" : "text-foreground/60"
                                )}
                            >
                                {route.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right: Actions */}
                <div className="flex w-[200px] items-center justify-end space-x-2">
                    <div className="hidden md:flex items-center space-x-2">
                        <ModeToggle />
                        <Link href="/admin">
                            <Button variant="ghost" size="icon" title="Admin Dashboard" className="ghost">
                                <Settings className="h-4 w-4" />
                                <span className="sr-only">Admin</span>
                            </Button>
                        </Link>
                    </div>
                    
                    {/* Mobile Menu */}
                    <div className="md:hidden flex items-center space-x-2">
                         <ModeToggle />
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="ghost">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="">
                                <Link href="/" className="flex items-center space-x-2 mb-8">
                                    <LayoutGrid className="h-6 w-6" />
                                    <span className="font-bold">ConvertHub</span>
                                </Link>
                                <nav className="flex flex-col space-y-4">
                                    {routes.map((route) => (
                                        <Link
                                            key={route.href}
                                            href={route.href}
                                            className={cn(
                                                "text-sm font-medium transition-colors hover:text-foreground/80",
                                                route.active ? "text-foreground" : "text-foreground/60"
                                            )}
                                        >
                                            {route.label}
                                        </Link>
                                    ))}
                                    <div className="pt-4 mt-4 border-t">
                                         <Link href="/admin" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                                            <Settings className="h-4 w-4" />
                                            <span>Admin Dashboard</span>
                                        </Link>
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );

}
