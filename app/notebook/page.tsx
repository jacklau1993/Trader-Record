"use client";

import { useState, useEffect } from "react";
import { Folder, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/notebook/Editor";
import { getNotes, getSections, Note, Section, saveNote } from "@/lib/storage";

export default function NotebookPage() {
    const [sections, setSections] = useState<Section[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeSection, setActiveSection] = useState("s1");
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

    useEffect(() => {
        setSections(getSections());
        setNotes(getNotes());
    }, []);

    const handleNotesUpdate = () => {
        setNotes(getNotes());
    };

    const handleCreateNote = () => {
        const newNote: Note = {
            id: `note_${Date.now()}`,
            sectionId: activeSection,
            title: "New Note",
            date: new Date().toISOString().split('T')[0],
            content: "",
            tags: []
        };
        saveNote(newNote);
        setNotes([newNote, ...notes]);
        setActiveNoteId(newNote.id);
    };

    const currentNotes = notes.filter(n => n.sectionId === activeSection);
    const activeNote = notes.find(n => n.id === activeNoteId) || null;

    return (
        <div className="flex h-screen max-h-[calc(100vh-2rem)] overflow-hidden m-4 rounded-xl border border-border bg-card shadow-sm">

            {/* Sections Sidebar (Left) */}
            <div className="w-60 border-r border-border bg-muted/10 flex flex-col">
                <div className="p-4 border-b border-border font-semibold flex justify-between items-center">
                    <span>Notebooks</span>
                    {/* <button className="hover:bg-muted p-1 rounded"><Plus className="h-4 w-4" /></button> */}
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => { setActiveSection(section.id); setActiveNoteId(null); }}
                            className={cn(
                                "w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors",
                                activeSection === section.id ? "bg-primary/10 text-primary" : "text-muted-foreground"
                            )}
                        >
                            <Folder className="h-4 w-4" />
                            <span className="flex-1 text-left">{section.name}</span>
                            {/* <span className="text-xs opacity-50">{notes.filter(n => n.sectionId === section.id).length}</span> */}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notes List (Middle) */}
            <div className="w-72 border-r border-border bg-background flex flex-col">
                <div className="p-4 border-b border-border font-semibold flex justify-between items-center">
                    <span>Pages</span>
                    <button onClick={handleCreateNote} className="hover:bg-muted p-1 rounded"><Plus className="h-4 w-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {currentNotes.length === 0 ? (
                        <div className="p-4 text-sm text-muted-foreground text-center">No pages here</div>
                    ) : (
                        currentNotes.map(note => (
                            <div
                                key={note.id}
                                className={cn(
                                    "group w-full flex flex-col items-start px-4 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors text-left relative cursor-pointer",
                                    activeNoteId === note.id ? "bg-muted/50 border-l-2 border-l-primary pl-[14px]" : ""
                                )}
                                onClick={() => setActiveNoteId(note.id)}
                            >
                                <div className="flex justify-between w-full">
                                    <h4 className={cn("text-sm font-semibold", activeNoteId === note.id ? "text-primary" : "")}>{note.title}</h4>
                                    <button
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 text-destructive rounded transition-all"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm("Are you sure you want to delete this note?")) {
                                                const { deleteNote } = require("@/lib/storage");
                                                deleteNote(note.id);
                                                handleNotesUpdate();
                                                if (activeNoteId === note.id) setActiveNoteId(null);
                                            }
                                        }}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between mt-1 w-full">
                                    <span className="text-xs text-muted-foreground">{note.date}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{note.content.substring(0, 30)}...</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Editor (Right) */}
            <div className="flex-1 bg-background">
                <Editor key={activeNote ? activeNote.id : 'empty'} selectedNote={activeNote} onSave={handleNotesUpdate} />
            </div>

        </div>
    );
}
