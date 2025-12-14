"use client";

import { useEffect, useState } from "react";
import TagsReport from "./TagsReport";
import PerformanceReport from "./PerformanceReport";

export default function ReportsClient({ categories, trades }: { categories: any[], trades: any[] }) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [activeTab, setActiveTab] = useState<"performance" | "tags">("performance");

    useEffect(() => {
        if (categories.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(categories[0].id);
        }
    }, [categories]);

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Reports</h2>

                {/* Main Tab Switcher */}
                <div className="flex space-x-2 bg-muted p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab("performance")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "performance"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Performance Report
                    </button>
                    <button
                        onClick={() => setActiveTab("tags")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "tags"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Tags Report
                    </button>
                </div>
            </div>

            {activeTab === "performance" ? (
                <PerformanceReport trades={trades} />
            ) : (
                <TagsReport
                    categories={categories}
                    trades={trades}
                    selectedCategoryId={selectedCategoryId}
                    setSelectedCategoryId={setSelectedCategoryId}
                />
            )}
        </div>
    );
}
