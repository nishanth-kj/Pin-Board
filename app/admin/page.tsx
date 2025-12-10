"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Activity, Users, CreditCard } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import React from "react";

export default function AdminDashboard() {
    const [adsGlobal, setAdsGlobal] = React.useState(true);
    const [adsHeader, setAdsHeader] = React.useState(true);
    const [adsSidebar, setAdsSidebar] = React.useState(true);

    const handleAdToggle = (setter, value, key) => {
        setter(value);
        localStorage.setItem(key, value);
    };

    React.useEffect(() => {
        const load = (key, setter) => {
            const val = localStorage.getItem(key);
            if (val !== null) setter(val === 'true');
        };
        load('ads_global', setAdsGlobal);
        load('ads_header', setAdsHeader);
        load('ads_sidebar', setAdsSidebar);
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,234</div>
                        <p className="text-xs text-muted-foreground">+19% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">+201 since last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ad Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,234.89</div>
                        <p className="text-xs text-muted-foreground">+19% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12</div>
                        <p className="text-xs text-muted-foreground">+2 since last hour</p>
                    </CardContent>
                </Card>
            </div>

            {/* Settings / Controls */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Ad Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="ads-global" className="flex flex-col space-y-1">
                                <span>Global Ad Display</span>
                                <span className="font-normal text-xs text-muted-foreground">Turn off all ads across the platform instantly.</span>
                            </Label>
                            <Switch
                                id="ads-global"
                                checked={adsGlobal}
                                onCheckedChange={(v) => handleAdToggle(setAdsGlobal, v, 'ads_global')}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="ads-header" className="flex flex-col space-y-1">
                                <span>Header Banner</span>
                                <span className="font-normal text-xs text-muted-foreground">Show top banner on homepage.</span>
                            </Label>
                            <Switch
                                id="ads-header"
                                checked={adsHeader}
                                onCheckedChange={(v) => handleAdToggle(setAdsHeader, v, 'ads_header')}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="ads-sidebar" className="flex flex-col space-y-1">
                                <span>Sidebar / Inline Ads</span>
                                <span className="font-normal text-xs text-muted-foreground">Show ads within tool pages.</span>
                            </Label>
                            <Switch
                                id="ads-sidebar"
                                checked={adsSidebar}
                                onCheckedChange={(v) => handleAdToggle(setAdsSidebar, v, 'ads_sidebar')}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <Activity className="h-4 w-4 text-green-500 mr-2" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">New User Registration</p>
                                    <p className="text-sm text-muted-foreground">user@example.com</p>
                                </div>
                                <div className="ml-auto font-medium text-xs">Just now</div>
                            </div>
                            <div className="flex items-center">
                                <Activity className="h-4 w-4 text-blue-500 mr-2" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">High Volume Conversion</p>
                                    <p className="text-sm text-muted-foreground">300MB PDF Processed</p>
                                </div>
                                <div className="ml-auto font-medium text-xs">2m ago</div>
                            </div>
                             <div className="flex items-center">
                                <DollarSign className="h-4 w-4 text-yellow-500 mr-2" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Ad Click</p>
                                    <p className="text-sm text-muted-foreground">Header Banner</p>
                                </div>
                                <div className="ml-auto font-medium text-xs">5m ago</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-7">
                     <CardHeader>
                        <CardTitle>Universal Converter Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium">Allowed Input Types</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Switch id="input-img" defaultChecked />
                                        <Label htmlFor="input-img">Images (PNG, JPG, WEBP)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch id="input-pdf" defaultChecked />
                                        <Label htmlFor="input-pdf">Documents (PDF, DOCX)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch id="input-code" defaultChecked />
                                        <Label htmlFor="input-code">Code (MD, JSON, HTML)</Label>
                                    </div>
                                </div>
                            </div>

                             <div className="space-y-4">
                                <h4 className="text-sm font-medium">Monetization Controls</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Switch id="mon-limit" />
                                        <Label htmlFor="mon-limit">Limit Free Conversions (5/day)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch id="mon-watermark" defaultChecked />
                                        <Label htmlFor="mon-watermark">Watermark Free PDFs</Label>
                                    </div>
                                </div>
                            </div>

                             <div className="space-y-4">
                                <h4 className="text-sm font-medium">System Health</h4>
                                <div className="bg-muted p-4 rounded-lg text-xs font-mono space-y-1">
                                    <div className="flex justify-between">
                                        <span>WASM Engine:</span>
                                        <span className="text-green-500">ONLINE</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tauri Core:</span>
                                        <span className="text-green-500">READY</span>
                                    </div>
                                     <div className="flex justify-between">
                                        <span>Storage:</span>
                                        <span>45% Used</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
