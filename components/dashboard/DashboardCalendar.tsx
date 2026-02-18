"use client";

import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, addDays } from "date-fns";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trade } from "@/lib/types";

interface DashboardCalendarProps {
    trades: Trade[];
}

export function DashboardCalendar({ trades }: DashboardCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const calendarData = useMemo(() => {
        const data: Record<string, { pnl: number; count: number }> = {};
        trades.forEach(t => {
            const dateStr = format(new Date(t.date), 'yyyy-MM-dd');
            const netPnl = (t.pnl || 0) - ((t as any).commission || 0);
            if (!data[dateStr]) {
                data[dateStr] = { pnl: 0, count: 0 };
            }
            data[dateStr].pnl += netPnl;
            data[dateStr].count += 1;
        });
        return data;
    }, [trades]);

    const days = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth));
        const end = endOfWeek(endOfMonth(currentMonth));
        const intervalDays = eachDayOfInterval({ start, end });

        // Always render a full 6-row calendar grid (42 days) to avoid empty space in short months.
        while (intervalDays.length < 42) {
            intervalDays.push(addDays(intervalDays[intervalDays.length - 1], 1));
        }

        return intervalDays;
    }, [currentMonth]);

    // Calculate weekly summaries
    const weeklyData = useMemo(() => {
        const weeks: { weekIndex: number; pnl: number; count: number }[] = [];
        
        for (let i = 0; i < days.length; i += 7) {
            const weekDays = days.slice(i, i + 7);
            let weekPnl = 0;
            let weekCount = 0;
            
            weekDays.forEach(day => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const dayData = calendarData[dateStr];
                if (dayData) {
                    weekPnl += dayData.pnl;
                    weekCount += dayData.count;
                }
            });
            
            weeks.push({ weekIndex: i / 7, pnl: weekPnl, count: weekCount });
        }
        
        return weeks;
    }, [days, calendarData]);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    // Group days into weeks for rendering
    const weeks = useMemo(() => {
        const result: Date[][] = [];
        for (let i = 0; i < days.length; i += 7) {
            result.push(days.slice(i, i + 7));
        }
        return result;
    }, [days]);

    return (
        <Card className="md:col-span-8 self-start">
            <CardHeader className="px-6 py-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                     <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-bold text-sm min-w-[120px] text-center">
                        {format(currentMonth, 'MMMM yyyy')}
                    </span>
                    <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())} className="text-xs h-8">
                        This month
                    </Button>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                     <Maximize2 className="h-4 w-4 hidden sm:block" />

                </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
                 {/* Weekday Headers + Weekly Summary Header */}
                <div className="grid grid-cols-8 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs text-muted-foreground py-2 border border-transparent">
                            {day}
                        </div>
                    ))}
                    <div className="text-center text-xs text-muted-foreground py-2 border border-transparent font-medium">
                        Weekly
                    </div>
                </div>
                
                {/* Calendar Grid with Weekly Summaries */}
                <div className="border-t border-l border-border">
                    {weeks.map((week, weekIdx) => {
                        const weekSummary = weeklyData[weekIdx];
                        
                        return (
                            <div key={weekIdx} className="grid grid-cols-8">
                                {/* Day cells */}
                                {week.map((day) => {
                                    const dateStr = format(day, 'yyyy-MM-dd');
                                    const dayData = calendarData[dateStr];
                                    const isCurrentMonth = isSameMonth(day, currentMonth);
                                    const isToday = isSameDay(day, new Date());
                                    
                                    let bgClass = "bg-background";
                                    if (dayData && isCurrentMonth) {
                                         if (dayData.pnl > 0) bgClass = "bg-green-950 border-green-900"; 
                                         if (dayData.pnl < 0) bgClass = "bg-red-950 border-red-900";
                                    }

                                    return (
                                        <div 
                                            key={day.toString()} 
                                            className={`
                                                min-h-[92px] lg:min-h-[102px] p-2 flex flex-col justify-between border-b border-r border-border  
                                                ${bgClass}
                                                ${!isCurrentMonth ? 'opacity-30' : ''}
                                            `}
                                        >
                                            <div className="flex justify-end">
                                                <span className={`text-xs ${isToday ? 'bg-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-white' : 'text-muted-foreground'}`}>
                                                    {format(day, 'd')}
                                                </span>
                                            </div>
                                            
                                            {dayData && (
                                                <div className="flex flex-col items-center justify-center h-full">
                                                    <span
                                                        className={`max-w-full truncate text-[10px] font-bold leading-tight sm:text-sm ${dayData.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}
                                                    >
                                                        {dayData.pnl === 0 ? "$0" : `${dayData.pnl > 0 ? "+" : "-"}$${Math.abs(dayData.pnl).toFixed(0)}`}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {dayData.count} trade{dayData.count !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                
                                {/* Weekly Summary Cell */}
                                <div 
                                    className={`
                                        min-h-[92px] lg:min-h-[102px] p-2 flex flex-col items-center justify-center border-b border-r border-border
                                        ${weekSummary.count > 0 
                                            ? weekSummary.pnl >= 0 
                                                ? 'bg-green-900/30' 
                                                : 'bg-red-900/30'
                                            : 'bg-muted/20'
                                        }
                                    `}
                                >
                                    {weekSummary.count > 0 ? (
                                        <>
                                            <span
                                                className={`text-xs font-bold sm:text-sm ${weekSummary.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}
                                            >
                                                {weekSummary.pnl === 0 ? "$0" : `${weekSummary.pnl > 0 ? "+" : "-"}$${Math.abs(weekSummary.pnl).toFixed(0)}`}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {weekSummary.count} trade{weekSummary.count !== 1 ? 's' : ''}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-[10px] text-muted-foreground">—</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
