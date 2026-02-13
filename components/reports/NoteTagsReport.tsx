"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, CartesianGrid, Legend
} from "recharts";
import { StatCard } from "@/components/dashboard/StatCard";
import { Calendar, Hash, Layers, Tag } from "lucide-react";

interface NoteTagMetric {
    tagId: string;
    tagName: string;
    tagColor: string;
    days: number; // Number of days this tag was used
    notes: number; // Number of notes with this tag
}

interface CoOccurrence {
    pair: string;
    count: number;
}

interface NoteTagsReportProps {
    noteTagCategories: any[];
    notes: any[];
    noteTagMap: Record<string, string[]>;
    tagMap: Record<string, any>;
    selectedCategoryId: string;
    setSelectedCategoryId: (id: string) => void;
}

const CHART_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function NoteTagsReport({ 
    noteTagCategories, 
    notes, 
    noteTagMap, 
    tagMap, 
    selectedCategoryId, 
    setSelectedCategoryId 
}: NoteTagsReportProps) {
    const chartAxisColor = "var(--chart-axis)";
    const chartGridColor = "var(--chart-grid)";
    const chartTooltipBackground = "var(--chart-tooltip-bg)";
    const chartTooltipBorder = "var(--chart-tooltip-border)";
    const chartTooltipText = "var(--chart-tooltip-text)";

    const selectedCategory = noteTagCategories.find(c => c.id === selectedCategoryId);
    
    // Calculate tag metrics
    const tagMetrics: NoteTagMetric[] = useMemo(() => {
        if (!selectedCategory) return [];
        
        return selectedCategory.tags.map((tag: any) => {
            // Find all notes that have this tag
            const notesWithTag = notes.filter(note => 
                (noteTagMap[note.id] || []).includes(tag.id)
            );
            
            // Count unique days
            const uniqueDays = new Set(notesWithTag.map(n => n.date)).size;
            
            return {
                tagId: tag.id,
                tagName: tag.name,
                tagColor: tag.color || 'bg-primary/10 text-primary',
                days: uniqueDays,
                notes: notesWithTag.length
            };
        }).sort((a: NoteTagMetric, b: NoteTagMetric) => b.days - a.days);
    }, [notes, noteTagMap, selectedCategory]);
    
    // Calculate co-occurrence (tags frequently used together on same note)
    const coOccurrences: CoOccurrence[] = useMemo(() => {
        if (!selectedCategory) return [];
        
        const pairCounts: Record<string, number> = {};
        const categoryTagIds = new Set(selectedCategory.tags.map((t: any) => t.id));
        
        notes.forEach(note => {
            const noteTags = (noteTagMap[note.id] || []).filter(id => categoryTagIds.has(id));
            // Generate all pairs
            for (let i = 0; i < noteTags.length; i++) {
                for (let j = i + 1; j < noteTags.length; j++) {
                    const tag1 = tagMap[noteTags[i]]?.name || noteTags[i];
                    const tag2 = tagMap[noteTags[j]]?.name || noteTags[j];
                    const pair = [tag1, tag2].sort().join(' + ');
                    pairCounts[pair] = (pairCounts[pair] || 0) + 1;
                }
            }
        });
        
        return Object.entries(pairCounts)
            .map(([pair, count]) => ({ pair, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }, [notes, noteTagMap, selectedCategory, tagMap]);
    
    // Summary stats
    const stats = useMemo(() => {
        if (tagMetrics.length === 0) return null;
        
        const totalDays = new Set(notes.map(n => n.date)).size;
        const daysWithTags = new Set(
            notes
                .filter(n => (noteTagMap[n.id] || []).length > 0)
                .map(n => n.date)
        ).size;
        
        const mostUsedTag = tagMetrics[0];
        const totalTagUsages = tagMetrics.reduce((sum, t) => sum + t.notes, 0);
        
        return {
            totalDays,
            daysWithTags,
            coverage: totalDays > 0 ? ((daysWithTags / totalDays) * 100) : 0,
            mostUsedTag,
            totalTagUsages
        };
    }, [tagMetrics, notes, noteTagMap]);

    return (
        <div className="space-y-6">
            {/* Category Tabs */}
            <div className="flex space-x-2 border-b border-border pb-1 overflow-x-auto">
                {noteTagCategories.map((cat: any) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategoryId(cat.id)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${selectedCategoryId === cat.id
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Content */}
            {tagMetrics.length > 0 && stats ? (
                <>
                    {/* Summary Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Total Trading Days"
                            value={stats.totalDays.toString()}
                            icon={Calendar}
                            trend={`${stats.daysWithTags} days with tags`}
                        />
                        <StatCard
                            title="Tag Coverage"
                            value={`${stats.coverage.toFixed(1)}%`}
                            icon={Layers}
                            trend="of days have at least one tag"
                            trendUp={stats.coverage >= 50}
                        />
                        <StatCard
                            title="Most Used Tag"
                            value={stats.mostUsedTag?.tagName || "-"}
                            icon={Tag}
                            trend={`${stats.mostUsedTag?.days || 0} days`}
                        />
                        <StatCard
                            title="Total Tag Usages"
                            value={stats.totalTagUsages.toString()}
                            icon={Hash}
                            trend="across all notes"
                        />
                    </div>

                    {/* Charts Row */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Tag Distribution (Days) */}
                        <Card className="min-w-0">
                            <CardHeader><CardTitle>Tag Distribution (Days)</CardTitle></CardHeader>
                            <CardContent className="h-[300px] min-w-0 min-h-[300px]">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <BarChart data={tagMetrics} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} opacity={0.3} horizontal={false} />
                                        <XAxis type="number" stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis dataKey="tagName" type="category" width={100} stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} />
                                        <RechartsTooltip 
                                            contentStyle={{ backgroundColor: chartTooltipBackground, border: `1px solid ${chartTooltipBorder}`, color: chartTooltipText }}
                                            itemStyle={{ color: chartTooltipText }}
                                            labelStyle={{ color: chartTooltipText }}
                                            cursor={{ fill: 'transparent' }}
                                            formatter={(value: any) => [`${value} days`, 'Days']}
                                        />
                                        <Bar dataKey="days" name="Days" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                                            {tagMetrics.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Tag Usage Pie Chart */}
                        <Card className="min-w-0">
                            <CardHeader><CardTitle>Tag Usage Share</CardTitle></CardHeader>
                            <CardContent className="h-[300px] min-w-0 min-h-[300px]">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <PieChart>
                                        <Pie
                                            data={tagMetrics as any}
                                            dataKey="notes"
                                            nameKey="tagName"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label={({ tagName, percent }: any) => `${tagName} (${(percent * 100).toFixed(0)}%)`}
                                            labelLine={false}
                                        >
                                            {tagMetrics.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip 
                                            contentStyle={{ backgroundColor: chartTooltipBackground, border: `1px solid ${chartTooltipBorder}`, color: chartTooltipText }}
                                            itemStyle={{ color: chartTooltipText }}
                                            labelStyle={{ color: chartTooltipText }}
                                            formatter={(value: any) => [`${value} notes`, 'Notes']}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Distribution Table */}
                    <Card>
                        <CardHeader><CardTitle>Tag Distribution Summary</CardTitle></CardHeader>
                        <CardContent>
                            <table className="w-full text-sm">
                                <thead className="text-muted-foreground border-b border-border text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="text-left py-3 pl-4">Tag</th>
                                        <th className="text-right py-3">Days Used</th>
                                        <th className="text-right py-3">Notes</th>
                                        <th className="text-right py-3 pr-4">% of Total Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tagMetrics.map(tag => (
                                        <tr key={tag.tagId} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                            <td className="py-3 pl-4">
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${tag.tagColor}`}>
                                                    {tag.tagName}
                                                </span>
                                            </td>
                                            <td className="text-right py-3 font-medium">{tag.days}</td>
                                            <td className="text-right py-3 text-muted-foreground">{tag.notes}</td>
                                            <td className="text-right py-3 pr-4 text-muted-foreground">
                                                {stats.totalDays > 0 ? ((tag.days / stats.totalDays) * 100).toFixed(1) : 0}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    {/* Co-occurrence Analysis */}
                    {coOccurrences.length > 0 && (
                        <Card>
                            <CardHeader><CardTitle>Tag Co-occurrence (Frequently Used Together)</CardTitle></CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {coOccurrences.map((co, idx) => (
                                        <div key={idx} className="p-3 border border-border rounded-lg bg-muted/10 text-center">
                                            <span className="text-sm font-medium">{co.pair}</span>
                                            <div className="text-lg font-bold text-primary mt-1">{co.count}</div>
                                            <span className="text-xs text-muted-foreground">notes</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border border-dashed border-border rounded-lg">
                    <Tag className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No Note Tags Data</p>
                    <p className="text-sm">Create Note Tags and assign them to your daily journal entries.</p>
                </div>
            )}
        </div>
    );
}
