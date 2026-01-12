"use client";

import { useEffect, useState } from "react";
import TagsReport from "./TagsReport";
import PerformanceReport from "./PerformanceReport";
import NoteTagsReport from "./NoteTagsReport";

interface ReportsClientProps {
    categories: any[];
    trades: any[];
    notes: any[];
    noteTagCategories: any[];
    noteTagMap: Record<string, string[]>;
    tagMap: Record<string, any>;
}

export default function ReportsClient({ 
    categories, 
    trades,
    notes,
    noteTagCategories,
    noteTagMap,
    tagMap
}: ReportsClientProps) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [selectedNoteTagCategoryId, setSelectedNoteTagCategoryId] = useState<string>("");
    const [activeTab, setActiveTab] = useState<"performance" | "tradeTags" | "noteTags">("performance");

    useEffect(() => {
        if (categories.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(categories[0].id);
        }
    }, [categories]);

    useEffect(() => {
        if (noteTagCategories.length > 0 && !selectedNoteTagCategoryId) {
            setSelectedNoteTagCategoryId(noteTagCategories[0].id);
        }
    }, [noteTagCategories]);

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Reports</h2>

                {/* Main Tab Switcher */}
                <div className="flex space-x-2 bg-muted p-1 rounded-lg w-fit">
                    <button
                        onClick={() => setActiveTab("performance")}
                        className={`px-3 md:px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "performance"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Performance
                    </button>
                    <button
                        onClick={() => setActiveTab("tradeTags")}
                        className={`px-3 md:px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "tradeTags"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Trade Tags
                    </button>
                    <button
                        onClick={() => setActiveTab("noteTags")}
                        className={`px-3 md:px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "noteTags"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Note Tags
                    </button>
                </div>
            </div>


            {activeTab === "performance" ? (
                <PerformanceReport trades={trades} />
            ) : activeTab === "tradeTags" ? (
                <TagsReport
                    categories={categories}
                    trades={trades}
                    selectedCategoryId={selectedCategoryId}
                    setSelectedCategoryId={setSelectedCategoryId}
                />
            ) : (
                <NoteTagsReport
                    noteTagCategories={noteTagCategories}
                    notes={notes}
                    noteTagMap={noteTagMap}
                    tagMap={tagMap}
                    selectedCategoryId={selectedNoteTagCategoryId}
                    setSelectedCategoryId={setSelectedNoteTagCategoryId}
                />
            )}
        </div>
    );
}
