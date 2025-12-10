"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Download, Upload, Image as ImageIcon, X } from "lucide-react";
import ImageCompression from "browser-image-compression";
import { AdBanner } from "@/components/AdBanner";

export default function ImageConverter() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [format, setFormat] = useState("image/jpeg");
    const [quality, setQuality] = useState(0.8);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);

    const onFileChange = (e) => {
        const selected = e.target.files?.[0];
        if (selected) {
            handleFile(selected);
        }
    };

    const handleFile = (file) => {
        if (!file.type.startsWith("image/")) return;
        setFile(file);
        setPreview(URL.createObjectURL(file));
        setResult(null);
    };

    const convertImage = async () => {
        if (!file) return;
        setProcessing(true);

        try {
            // Use browser-image-compression for resizing/compression if needed, 
            // or just basic canvas for format conversion.
            // Let's use simple canvas for format conversion + browser-image-compression for JPG/WebP compression excellence.

            const options = {
                maxSizeMB: 2, // Default limit
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                fileType: format,
                initialQuality: quality
            };

            const compressedFile = await ImageCompression(file, options);
            setResult(getUrlFromBlob(compressedFile));
        } catch (error) {
            console.error(error);
        } finally {
            setProcessing(false);
        }
    };

    const getUrlFromBlob = (blob) => {
        return URL.createObjectURL(blob);
    };

    const downloadImage = () => {
        if (!result) return;
        const link = document.createElement('a');
        link.href = result;
        const ext = format.split('/')[1];
        link.download = `converted-image.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const clear = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl animate-in fade-in duration-500">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold mb-2">Image Converter</h1>
                <p className="text-muted-foreground">Convert images locally on your device with high speed.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Upload Area */}
                <Card className="h-full">
                    <CardContent className="p-6 h-full flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed rounded-xl transition-colors hover:bg-muted/50 relative">
                        {preview ? (
                            <div className="relative w-full h-full flex flex-col items-center">
                                <img src={preview} alt="Preview" className="max-h-[300px] object-contain rounded-md" />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                                    onClick={clear}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                                <p className="mt-4 text-sm font-medium text-muted-foreground">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                                <div className="p-4 bg-primary/10 rounded-full mb-4">
                                    <Upload className="w-8 h-8 text-primary" />
                                </div>
                                <p className="text-lg font-medium mb-1">Click to upload image</p>
                                <p className="text-sm text-muted-foreground">or drag and drop here</p>
                                <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                            </label>
                        )}
                    </CardContent>
                </Card>

                {/* Controls */}
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label>Target Format</Label>
                            <Select value={format} onValueChange={setFormat}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="image/jpeg">JPEG / JPG</SelectItem>
                                    <SelectItem value="image/png">PNG</SelectItem>
                                    <SelectItem value="image/webp">WebP</SelectItem>
                                    <SelectItem value="image/bmp">BMP</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label>Quality</Label>
                                <span className="text-sm text-muted-foreground">{Math.round(quality * 100)}%</span>
                            </div>
                            <Slider
                                value={[quality]}
                                min={0.1}
                                max={1}
                                step={0.1}
                                onValueChange={(val) => setQuality(val[0])}
                                disabled={format === 'image/png' || format === 'image/bmp'} // PNG/BMP are lossless usually in these libs
                            />
                            {(format === 'image/png' || format === 'image/bmp') && (
                                <p className="text-xs text-muted-foreground">Quality setting not applicable for lossless formats.</p>
                            )}
                        </div>

                        <div className="pt-4 space-y-3">
                            <Button className="w-full" size="lg" onClick={convertImage} disabled={!file || processing}>
                                {processing ? "Converting..." : "Convert Now"}
                            </Button>
                        </div>

                        {result && (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 animate-in slide-in-from-bottom-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-green-900 dark:text-green-100 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4" />
                                        Conversion Ready
                                    </span>
                                    <Button size="sm" variant="outline" onClick={downloadImage} className="gap-2">
                                        <Download className="w-4 h-4" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <AdBanner className="mt-12" />
        </div>
    );
}
