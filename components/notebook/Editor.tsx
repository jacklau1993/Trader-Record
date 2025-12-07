"use client";

import { useState, useEffect } from "react";
import { List, Tag as TagIcon, Save, Check, Settings, Plus, Trash } from "lucide-react";
// import { Note, saveNote, getTemplates, saveTemplates, Template } from "@/lib/storage"; // REMOVED
import { Modal } from "@/components/ui/modal";
import { updateNote } from "@/app/actions/note-actions";
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from "@/app/actions/template-actions";

// Define compatible types locally or import
interface Template {
    id: string;
    name: string;
    content: string;
}

interface Note {
    id: string;
    title: string;
    content: string;
    date: string;
}

export function Editor({ selectedNote, onSave }: { selectedNote: any | null, onSave: () => void }) {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [isSaved, setIsSaved] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [templates, setTemplates] = useState<Template[]>([]);

    // Template Manager State
    const [isManageOpen, setIsManageOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

    // Fetch templates on mount
    useEffect(() => {
        getTemplates().then((data: any[]) => setTemplates(data));
    }, []);

    useEffect(() => {
        if (selectedNote) {
            setTitle(selectedNote.title);
            setContent(selectedNote.content);
            setIsSaved(false);
        } else {
            setTitle("");
            setContent("");
        }
    }, [selectedNote]);

    const handleSave = async () => {
        if (!selectedNote) return;
        setIsSaved(true); // Optimistic UI

        await updateNote(selectedNote.id, {
            title,
            content
        });

        onSave(); // Refresh parent list
        setTimeout(() => setIsSaved(false), 2000);
    };

    const insertTemplate = (templateContent: string) => {
        setContent(prev => prev + templateContent);
        setShowTemplates(false);
    };

    const saveTemplate = async () => {
        if (!editingTemplate) return;

        // Optimistic Update
        let newTemplates = [...templates];
        const existingIndex = newTemplates.findIndex(t => t.id === editingTemplate.id);
        if (existingIndex >= 0) {
            newTemplates[existingIndex] = editingTemplate;
            await updateTemplate(editingTemplate.id, { name: editingTemplate.name, content: editingTemplate.content });
        } else {
            newTemplates.push(editingTemplate);
            await createTemplate({
                id: editingTemplate.id,
                name: editingTemplate.name,
                content: editingTemplate.content
            });
        }

        setTemplates(newTemplates);
        setEditingTemplate(null);

        // Refresh triggers implicit re-fetch if needed, but local state is fine.
    };

    const handleDeleteTemplate = async (id: string) => {
        if (confirm("Delete this template?")) {
            const newTemplates = templates.filter(t => t.id !== id);
            setTemplates(newTemplates);
            await deleteTemplate(id);
            if (editingTemplate?.id === id) setEditingTemplate(null);
        }
    };

    const insertImage = () => {
        const url = prompt("Enter Image URL:");
        if (url) {
            setContent(prev => prev + `\n<img src="${url}" alt="Image" style="max-width: 100%; border-radius: 8px; margin-top: 10px;" />\n`);
        }
    };

    if (!selectedNote) {
        return (
            <div className="flex h-full items-center justify-center text-muted-foreground">
                Select a page to start writing
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <div className="border-b border-border p-4">
                <input
                    type="text"
                    className="w-full bg-transparent text-3xl font-bold focus:outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Page Title"
                />
                <div className="mt-2 flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{selectedNote.date}</span>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center border-b border-border bg-muted/20 px-4 py-2 space-x-2 relative">
                {/* Templates Dropdown */}
                <div className="relative">
                    <button onClick={() => setShowTemplates(!showTemplates)} className="flex items-center space-x-1 px-2 py-1 text-xs bg-background border border-border rounded hover:bg-muted transition-colors">
                        <List className="h-3 w-3" />
                        <span>Templates</span>
                    </button>
                    {showTemplates && (
                        <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border shadow-lg rounded-md z-10 py-1 flex flex-col">
                            <div className="max-h-60 overflow-y-auto">
                                {templates.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => insertTemplate(t.content)}
                                        className="block w-full text-left px-4 py-2 text-xs hover:bg-muted truncate"
                                    >
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                            <div className="border-t border-border mt-1 pt-1">
                                <button
                                    onClick={() => { setIsManageOpen(true); setShowTemplates(false); }}
                                    className="w-full text-left px-4 py-2 text-xs hover:bg-muted flex items-center text-muted-foreground"
                                >
                                    <Settings className="h-3 w-3 mr-2" />
                                    Manage Templates
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-4 w-[1px] bg-border mx-2" />

                <button
                    onClick={insertImage}
                    className="flex items-center space-x-1 px-2 py-1 text-xs bg-background border border-border rounded hover:bg-muted transition-colors"
                >
                    <TagIcon className="h-3 w-3" />
                    <span>Add Image</span>
                </button>

                <div className="flex-1" />
                <button
                    onClick={handleSave}
                    className={`flex items-center space-x-1 px-3 py-1 text-xs rounded transition-colors ${isSaved ? "bg-green-500/20 text-green-500" : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                >
                    {isSaved ? <Check className="h-3 w-3" /> : <Save className="h-3 w-3" />}
                    <span>{isSaved ? "Saved" : "Save"}</span>
                </button>
            </div>

            <textarea
                className="flex-1 resize-none bg-transparent p-6 focus:outline-none font-mono text-sm leading-relaxed"
                placeholder="Start typing..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <p className="px-6 pb-2 text-[10px] text-muted-foreground/50 text-right">Markdown & HTML supported</p>

            {/* Template Manager Modal */}
            <Modal isOpen={isManageOpen} onClose={() => { setIsManageOpen(false); setEditingTemplate(null); }}>
                <h2 className="text-xl font-bold mb-4">Manage Templates</h2>

                {editingTemplate ? (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Template Name</label>
                            <input
                                className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                                value={editingTemplate.name}
                                onChange={e => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Content</label>
                            <textarea
                                className="w-full h-40 bg-muted/50 border border-input rounded px-3 py-2 text-sm font-mono"
                                value={editingTemplate.content}
                                onChange={e => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={saveTemplate} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded text-sm font-medium">
                                Save Template
                            </button>
                            <button onClick={() => setEditingTemplate(null)} className="flex-1 bg-muted text-foreground hover:bg-muted/80 py-2 rounded text-sm font-medium">
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            {templates.map(t => (
                                <div key={t.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
                                    <span className="text-sm font-medium">{t.name}</span>
                                    <div className="flex space-x-2">
                                        <button onClick={() => setEditingTemplate(t)} className="p-1 hover:bg-primary/10 text-primary rounded">
                                            <Settings className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleDeleteTemplate(t.id)} className="p-1 hover:bg-destructive/10 text-destructive rounded">
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setEditingTemplate({ id: `t_${Date.now()}`, name: "New Template", content: "" })}
                            className="w-full flex items-center justify-center space-x-2 border border-dashed border-border py-3 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Create New Template</span>
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
}
