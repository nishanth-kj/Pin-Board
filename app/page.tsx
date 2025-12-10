import Link from "next/link";
import { ArrowRight, QrCode, Image as ImageIcon, FileText, Code, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AdBanner } from "@/components/AdBanner";

export default function Home() {
  const tools = [
    {
      title: "Image Converter",
      description: "Convert images between PNG, JPG, WebP and more.",
      icon: <ImageIcon className="w-8 h-8 opacity-80" />,
      href: "/tools/image",
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "PDF Tools",
      description: "Merge, split, and compress PDF files securely.",
      icon: <FileText className="w-8 h-8 opacity-80" />,
      href: "/tools/pdf",
      color: "bg-red-500/10 text-red-500",
    },
    {
      title: "Markdown to HTML",
      description: "High-speed WASM conversion for technical writers.",
      icon: <Code className="w-8 h-8 opacity-80" />,
      href: "/tools/markdown",
      color: "bg-green-500/10 text-green-500",
      badge: "Wasm Powered"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-32 lg:px-8 bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-2xl text-center space-y-8">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
            <Zap className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
            <span className="text-muted-foreground">v2.0 - Client-Side Only</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Ultimate File<br />
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Conversion Hub
            </span>
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Secure, private, and lightning fast. Convert Images, PDFs, and Text right in your browser or desktop app without server uploads.
          </p>
          <div className="flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <Link href="/tools/image">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/tools/pdf">
                PDF Tools
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <AdBanner />

      {/* Tools Grid */}
      <section className="px-6 py-16 md:py-24 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center mb-12 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Powerful Tools</h2>
          <p className="text-muted-foreground max-w-[600px]">
            Everything you need to manage your files and data in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card key={tool.title} className={`group relative overflow-hidden transition-all hover:shadow-lg ${tool.disabled ? 'opacity-80' : 'hover:-translate-y-1'}`}>
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${tool.color}`}>
                  {tool.icon}
                </div>
                <CardTitle className="flex items-center justify-between">
                  {tool.title}
                  {tool.badge && (
                    <span className="text-[10px] font-medium bg-muted px-2 py-1 rounded-full uppercase tracking-wider text-muted-foreground">
                      {tool.badge}
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  {tool.description}
                </CardDescription>
              </CardHeader>
              {!tool.disabled && (
                <CardFooter>
                  <Link href={tool.href} className="text-sm font-medium text-primary flex items-center group-hover:underline">
                    Open Tool <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </CardFooter>
              )}
              {tool.disabled && (
                <div className="absolute inset-0 bg-background/50 cursor-not-allowed" />
              )}
            </Card>
          ))}
        </div>
      </section>

      <AdBanner />

      {/* Footer */}
      <footer className="border-t py-12 px-6 md:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-center text-sm leading-5 text-muted-foreground">
            &copy; 2024 ConvertHub. All rights reserved. Run locally with Tauri.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="/admin" className="hover:text-foreground">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}