"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, getDay, addMonths, subMonths, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Trade } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarHeatmap({ trades }: { trades: Trade[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const { weeks, dailyData, weeklyStats, currentMonthLabel } = useMemo(() => {
        // 1. Map trades to daily P&L and Count
        const dailyMap: Record<string, { pnl: number, count: number }> = {};

        trades.forEach(t => {
            if (!dailyMap[t.date]) dailyMap[t.date] = { pnl: 0, count: 0 };
            dailyMap[t.date].pnl += t.pnl;
            dailyMap[t.date].count += 1;
        });

        // 2. Build Calendar Grid
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);

        const daysInMonth = eachDayOfInterval({ start, end });
        let startDayOfWeek = getDay(start); // Sun=0, Mon=1...
        startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

        const days = Array(startDayOfWeek).fill(null).concat(daysInMonth);

        // 3. Calculate Weekly Stats
        const weeks: (Date | null)[][] = [];
        for (let i = 0; i < days.length; i += 7) {
            let chunk = days.slice(i, i + 7);
            if (chunk.length < 7) {
                chunk = chunk.concat(Array(7 - chunk.length).fill(null));
            }
            weeks.push(chunk);
        }

        const weeklyStatsData = weeks.map(week => {
            let pnl = 0;
            let count = 0;
            week.forEach(day => {
                if (day) {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const data = dailyMap[dateStr];
                    if (data) {
                        pnl += data.pnl;
                        count += data.count;
                    }
                }
            });
            return { pnl, count };
        });

        return {
            weeks,
            dailyData: dailyMap,
            weeklyStats: weeklyStatsData,
            currentMonthLabel: format(currentDate, 'MMMM yyyy')
        };
    }, [trades, currentDate]);

    return (
        <Card className="col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>{currentMonthLabel}</CardTitle>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /></button>
                    <button onClick={() => setCurrentDate(new Date())} className="text-xs text-primary hover:underline">Today</button>
                    <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"><ChevronRight className="h-4 w-4" /></button>
                </div>
            </CardHeader>
            <CardContent>
                {/* Header Row */}
                <div className="grid grid-cols-8 gap-2 text-center text-xs text-muted-foreground mb-2 font-medium">
                    <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
                    <div className="text-primary font-bold">Wkly</div>
                </div>

                {/* Weeks Rows */}
                <div className="space-y-2">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="grid grid-cols-8 gap-2">
                            {/* Days */}
                            {week.map((day, dayIndex) => {
                                let content = <div className="aspect-square" />;

                                if (day) {
                                    const dateStr = format(day, "yyyy-MM-dd");
                                    const data = dailyData[dateStr];
                                    const pnl = data?.pnl;

                                    let bgClass = "bg-secondary";
                                    if (pnl && pnl > 0) bgClass = "bg-green-500/20 text-green-500 border-green-500/50";
                                    else if (pnl && pnl < 0) bgClass = "bg-red-500/20 text-red-500 border-red-500/50";

                                    const isToday = isSameDay(day, new Date());
                                    const todayClass = isToday ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "";

                                    content = (
                                        <div
                                            className={cn(
                                                "aspect-square flex flex-col items-center justify-center rounded-md border border-transparent transition-all hover:scale-105 cursor-pointer relative",
                                                bgClass, todayClass
                                            )}
                                            title={`${dateStr}: $${pnl || 0}`}
                                        >
                                            <div className="text-sm font-bold">{format(day, "d")}</div> {/* Increased Size */}
                                            {pnl !== undefined && pnl !== 0 && (
                                                <div className="text-[10px] font-semibold leading-none mt-1">
                                                    {pnl > 0 ? "+" : ""}{Math.round(pnl)}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                return <div key={dayIndex}>{content}</div>;
                            })}

                            {/* Weekly Stat - HIGHLIGHTED */}
                            <div className="aspect-square flex flex-col items-center justify-center rounded-lg bg-muted/40 border border-border">
                                {weeklyStats[weekIndex].count > 0 ? (
                                    <>
                                        <span className={cn("font-bold text-sm", weeklyStats[weekIndex].pnl > 0 ? "text-green-500" : (weeklyStats[weekIndex].pnl < 0 ? "text-red-500" : "text-foreground"))}>
                                            {weeklyStats[weekIndex].pnl > 0 ? "+" : ""}{Math.round(weeklyStats[weekIndex].pnl / 1000)}k
                                        </span>
                                        <span className="text-[10px] text-muted-foreground font-medium">{weeklyStats[weekIndex].count} trades</span>
                                    </>
                                ) : (
                                    <span className="text-xs text-muted-foreground/30">-</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
