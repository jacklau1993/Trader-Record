"use client";

import { useState, useEffect } from "react";
import { Folder, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/notebook/Editor";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createNote, deleteNote } from "@/app/actions/note-actions";
import { useRouter } from "next/navigation";

// Types
interface Section {
    id: string;
    name: string;
    userId: string;
}

interface Note {
    id: string;
    sectionId: string;
    title: string;
    date: string;
    content: string;
    userId: string;
}

interface NotebookClientProps {
    initialSections: Section[];
    initialNotes: Note[];
}

export default function NotebookClient({ 
    initialSections, 
    initialNotes
}: NotebookClientProps) {
    const [sections, setSections] = useState<Section[]>(initialSections);
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [activeSection, setActiveSection] = useState(initialSections[0]?.id || "s1");
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [showNotebooks, setShowNotebooks] = useState(true);
    const [showPages, setShowPages] = useState(true);
    const [mobileView, setMobileView] = useState<"notebooks" | "pages" | "note">("pages");
    const router = useRouter();

    useEffect(() => {
        setSections(initialSections);
        setNotes(initialNotes);
        if (initialSections.length > 0 && !initialSections.find(s => s.id === activeSection)) {
            setActiveSection(initialSections[0].id);
        }
    }, [initialSections, initialNotes]);

    const handleCreateNote = async () => {
        const id = `note_${Date.now()}`;
        const date = new Date().toISOString().split('T')[0];

        // Optimistic
        const newNote: any = {
            id,
            sectionId: activeSection,
            title: "New Note",
            date,
            content: "",
            userId: "temp" // irrelevant for UI
        };
        setNotes([newNote, ...notes]);
        setActiveNoteId(id);
        setMobileView("note");

        try {
            await createNote({
                id,
                sectionId: activeSection,
                title: "New Note",
                date,
                content: ""
            });
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteNote = async (noteId: string) => {
        if (!confirm("Are you sure you want to delete this note?")) return;

        setNotes(notes.filter(n => n.id !== noteId));
        if (activeNoteId === noteId) {
            setActiveNoteId(null);
            setMobileView("pages");
        }

        try {
            await deleteNote(noteId);
            router.refresh();
        } catch (error) { console.error(error); }
    };

    const handleNoteUpdated = () => {
        // Triggered by Editor on save. 
        // We might want to re-fetch or use router.refresh().
        // Editor calls onSave which we passed.
        router.refresh();
    };

    const currentNotes = notes.filter(n => n.sectionId === activeSection);
    const activeNote = notes.find(n => n.id === activeNoteId) || null;
    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] md:h-screen max-h-[calc(100vh-2rem)] overflow-hidden m-4 md:m-8 rounded-xl border border-border bg-card shadow-sm">
            <div className="md:hidden border-b border-border bg-muted/10 px-3 py-2">
                <Tabs value={mobileView} onValueChange={(value) => setMobileView(value as "notebooks" | "pages" | "note")}>
                    <TabsList className="grid w-full grid-cols-3 bg-muted/40">
                        <TabsTrigger value="notebooks" className="text-xs">Notebooks</TabsTrigger>
                        <TabsTrigger value="pages" className="text-xs">Pages</TabsTrigger>
                        <TabsTrigger value="note" className="text-xs">Note</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Sections Sidebar (Left) */}
            <div className={cn(
                "w-full md:w-60 border-b md:border-b-0 md:border-r border-border bg-muted/10 flex-col shrink-0 transition-all duration-300 min-h-0 md:h-full md:flex-none",
                mobileView === "notebooks" ? "flex" : "hidden",
                "md:flex",
                showNotebooks ? "flex-1" : "h-12"
            )}>
                <div
                    className="p-4 border-b border-border font-semibold flex justify-between items-center cursor-pointer md:cursor-default"
                    onClick={() => setShowNotebooks(!showNotebooks)}
                >
                    <div className="flex items-center gap-2">
                        <span className="md:hidden">
                            {showNotebooks ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </span>
                        <span>Notebooks</span>
                    </div>
                </div>
                {showNotebooks && (
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveSection(section.id);
                                    setActiveNoteId(null);
                                    setMobileView("pages");
                                }}
                                className={cn(
                                    "w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors",
                                    activeSection === section.id ? "bg-primary/10 text-primary" : "text-muted-foreground"
                                )}
                            >
                                <Folder className="h-4 w-4" />
                                <span className="flex-1 text-left">{section.name}</span>
                                <span className="text-xs opacity-50">{notes.filter(n => n.sectionId === section.id).length}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Notes List (Middle) */}
            <div className={cn(
                "w-full md:w-72 border-b md:border-b-0 md:border-r border-border bg-background flex-col shrink-0 transition-all duration-300 min-h-0 md:h-full md:flex-none",
                mobileView === "pages" ? "flex" : "hidden",
                "md:flex",
                showPages ? "flex-1" : "h-12"
            )}>
                <div
                    className="p-4 border-b border-border font-semibold flex justify-between items-center cursor-pointer md:cursor-default"
                    onClick={() => setShowPages(!showPages)}
                >
                    <div className="flex items-center gap-2">
                        <span className="md:hidden">
                            {showPages ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </span>
                        <span>Pages</span>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleCreateNote(); }}
                        className="hover:bg-muted p-1 rounded"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>

                {showPages && (
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
                                    onClick={() => {
                                        setActiveNoteId(note.id);
                                        setMobileView("note");
                                    }}
                                >
                                    <div className="flex justify-between w-full">
                                        <h4 className={cn("text-sm font-semibold", activeNoteId === note.id ? "text-primary" : "")}>{note.title}</h4>
                                        <button
                                            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1 hover:bg-destructive/10 text-destructive rounded transition-all"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteNote(note.id);
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
                )}
            </div>

            {/* Editor (Right) */}
            <div className={cn(
                "flex-1 bg-background min-h-0",
                mobileView === "note" ? "block" : "hidden",
                "md:block"
            )}>
                <Editor key={activeNote ? activeNote.id : "empty"} selectedNote={activeNote} onSave={handleNoteUpdated} />
            </div>
        </div>
    );
}
