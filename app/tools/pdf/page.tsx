"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolShell } from "@/components/tools/ToolShell";
import { FileText, Save, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PdfTools() {
    const [files, setFiles] = useState([]);
    const [processing, setProcessing] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                file,
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2)
            }));
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (id) => {
        setFiles(files.filter(f => f.id !== id));
    };

    const moveFile = (index, direction) => {
        const newFiles = [...files];
        if (direction === 'up' && index > 0) {
            [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
        } else if (direction === 'down' && index < newFiles.length - 1) {
            [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
        }
        setFiles(newFiles);
    };

    const mergePDFs = async () => {
        if (files.length < 2) return;
        setProcessing(true);

        try {
            const mergedPdf = await PDFDocument.create();

            for (const fileObj of files) {
                const arrayBuffer = await fileObj.file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `merged-${Date.now()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Error merging PDFs:", err);
            alert("Failed to merge PDFs. Please ensure they are valid PDF files.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <ToolShell
            title="PDF Merger"
            description="Combine multiple PDF files into a single document. Drag and drop to reorder."
            icon={FileText}
        >
            <Card className="border-2 border-dashed min-h-[200px] flex flex-col items-center justify-center p-8 bg-muted/50 hover:bg-muted/70 transition-colors">
                <div className="text-center space-y-4">
                    <div className="p-4 bg-background rounded-full inline-block shadow-sm">
                        <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Add PDF Files</h3>
                        <p className="text-sm text-muted-foreground">Select PDF files you want to combine</p>
                    </div>
                    <Input
                        type="file"
                        accept=".pdf"
                        multiple
                        className="hidden"
                        id="pdf-upload"
                        onChange={handleFileChange}
                    />
                    <Button size="lg" asChild className="cursor-pointer">
                        <label htmlFor="pdf-upload">Select Files</label>
                    </Button>
                </div>
            </Card>

            {files.length > 0 && (
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center justify-between">
                        <span>Files to Merge ({files.length})</span>
                        <Button onClick={() => setFiles([])} variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            Clear All
                        </Button>
                    </h3>

                    <div className="space-y-2">
                        {files.map((file, index) => (
                            <Card key={file.id} className="p-4 flex items-center gap-4 group hover:border-primary/50 transition-colors">
                                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded text-red-600 dark:text-red-400">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{file.size} MB</p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => moveFile(index, 'up')}
                                        disabled={index === 0}
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => moveFile(index, 'down')}
                                        disabled={index === files.length - 1}
                                    >
                                        <ArrowDown className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-muted-foreground hover:text-destructive"
                                    onClick={() => removeFile(file.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </Card>
                        ))}
                    </div>

                    <div className="pt-4 sticky bottom-6">
                        <Button
                            size="lg"
                            className="w-full shadow-xl"
                            onClick={mergePDFs}
                            disabled={files.length < 2 || processing}
                        >
                            {processing ? (
                                "Merging PDFs..."
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Merge {files.length} Files
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}

            {files.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No files added yet.</p>
                </div>
            )}
        </ToolShell>
    );
}
