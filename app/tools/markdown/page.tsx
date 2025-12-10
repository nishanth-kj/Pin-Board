"use client";

import React, { useState, useEffect } from "react";
import { ToolShell } from "@/components/tools/ToolShell";
import { Code, FileCode, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function MarkdownTool() {
    const [input, setInput] = useState("# Hello World\nStart typing markdown...");
    const [html, setHtml] = useState("");
    const [wasmModule, setWasmModule] = useState(null);

    useEffect(() => {
        // Dynamic import to load WASM module on client side only
        const loadWasm = async () => {
            try {
                const wasm = await import("converter-wasm");
                setWasmModule(wasm);
                setHtml(wasm.convert_markdown_to_html(input));
            } catch (err) {
                console.error("Failed to load WASM module:", err);
            }
        };
        loadWasm();
    }, []);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setInput(val);
        if (wasmModule) {
            setHtml(wasmModule.convert_markdown_to_html(val));
        }
    };

    return (
        <ToolShell
            title="Markdown to HTML"
            description="Convert Markdown to HTML instantly using Rust & WebAssembly."
            icon={Code}
        >
            <div className="grid md:grid-cols-2 gap-6 h-[600px]">
                <Card className="flex flex-col">
                    <div className="p-3 border-b bg-muted/30 font-medium text-sm text-muted-foreground flex items-center gap-2">
                        <FileCode className="w-4 h-4" /> Markdown Input
                    </div>
                    <Textarea
                        className="flex-1 resize-none border-0 focus-visible:ring-0 p-4 font-mono text-sm"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type markdown here..."
                    />
                </Card>

                <Card className="flex flex-col overflow-hidden">
                    <div className="p-3 border-b bg-muted/30 font-medium text-sm text-muted-foreground flex items-center gap-2">
                        <Code className="w-4 h-4" /> HTML Output (Preview)
                    </div>
                    <div
                        className="flex-1 p-4 overflow-auto prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </Card>
            </div>

            <div className="flex justify-end mt-4">
                <Button onClick={() => navigator.clipboard.writeText(html)}>
                    Copy HTML
                </Button>
            </div>
        </ToolShell>
    );
}
