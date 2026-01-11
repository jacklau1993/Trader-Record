"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, Upload, Eye, Edit2, Columns } from "lucide-react";

interface RichTextEditorProps {
    content: string;
    onChange: (markdown: string) => void;
    placeholder?: string;
}

type ViewMode = "edit" | "preview" | "split";

export function RichTextEditor({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
    const [viewMode, setViewMode] = useState<ViewMode>("edit");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [content, viewMode]);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/images/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Upload failed");
                return;
            }

            // Insert markdown image syntax at cursor position or end
            const imageMarkdown = `![${file.name}](${data.url})`;
            
            if (textareaRef.current) {
                const start = textareaRef.current.selectionStart;
                const end = textareaRef.current.selectionEnd;
                const newContent = content.substring(0, start) + imageMarkdown + content.substring(end);
                onChange(newContent);
                
                // Restore cursor position after update (approximated)
                setTimeout(() => {
                     if(textareaRef.current) {
                        textareaRef.current.focus();
                        textareaRef.current.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length);
                     }
                }, 0);
            } else {
                onChange(content + "\n" + imageMarkdown);
            }

        } catch (error: any) {
            alert("Upload failed: " + error.message);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="flex h-full min-h-0 flex-col bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-2">
                <div className="flex items-center space-x-1">
                    <ToolbarButton
                        active={viewMode === "edit"}
                        onClick={() => setViewMode("edit")}
                        title="Edit Mode"
                    >
                        <Edit2 className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">Edit</span>
                    </ToolbarButton>
                    <ToolbarButton
                        active={viewMode === "preview"}
                        onClick={() => setViewMode("preview")}
                        title="Preview Mode"
                    >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">Preview</span>
                    </ToolbarButton>
                     <ToolbarButton
                        active={viewMode === "split"}
                        onClick={() => setViewMode("split")}
                        title="Split View (Large Screens)"
                        className="hidden md:flex"
                    >
                        <Columns className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">Split</span>
                    </ToolbarButton>
                </div>

                <div className="flex items-center space-x-2">
                     <button
                        onClick={handleImageClick}
                        disabled={isUploading || viewMode === "preview"} // Disable upload in preview mode
                        className={`flex items-center space-x-1 px-2 py-1.5 text-xs rounded hover:bg-muted transition-colors ${
                            isUploading || viewMode === "preview" ? "opacity-50 cursor-not-allowed" : "text-muted-foreground hover:text-foreground"
                        }`}
                        title="Upload Image"
                    >
                        {isUploading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Upload className="h-3.5 w-3.5" />
                        )}
                        <span>Image</span>
                    </button>
                    <a 
                        href="https://www.markdownguide.org/basic-syntax/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary transition-colors hover:underline"
                    >
                        Markdown Guide
                    </a>
                </div>
            </div>

            {/* Content Area */}
            <div className={`flex-1 min-h-0 flex relative overflow-hidden ${viewMode === 'split' ? 'md:flex-row flex-col' : ''}`}>
                
                {/* Editor Pane */}
                {(viewMode === "edit" || viewMode === "split") && (
                    <div className={`flex-1 h-full min-h-0 relative ${viewMode === 'split' ? 'border-r border-border' : ''}`}>
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            className="w-full h-full p-4 bg-transparent resize-none focus:outline-none font-mono text-sm leading-relaxed"
                            spellCheck={false}
                        />
                    </div>
                )}

                {/* Preview Pane */}
                {(viewMode === "preview" || viewMode === "split") && (
                    <div className="flex-1 h-full min-h-0 overflow-y-auto bg-background/50 p-6">
                        <article className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-sm prose-li:text-sm">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {content || "*No content*"}
                            </ReactMarkdown>
                        </article>
                    </div>
                )}
            </div>
        </div>
    );
}

function ToolbarButton({
    active,
    onClick,
    children,
    title,
    className = ""
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    title: string;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`flex items-center px-3 py-1.5 rounded transition-all ${
                active
                    ? "bg-background shadow-sm text-foreground font-medium ring-1 ring-border/50"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            } ${className}`}
        >
            {children}
        </button>
    );
}
