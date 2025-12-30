"use client";

import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Info, Maximize2 } from "lucide-react";
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
            if (!data[dateStr]) {
                data[dateStr] = { pnl: 0, count: 0 };
            }
            data[dateStr].pnl += t.pnl;
            data[dateStr].count += 1;
        });
        return data;
    }, [trades]);

    const days = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth));
        const end = endOfWeek(endOfMonth(currentMonth));
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    return (
        <Card className="md:col-span-8 h-full">
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
                 {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs text-muted-foreground py-2 border border-transparent">
                            {day}
                        </div>
                    ))}
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 h-[500px] border-t border-l border-border">
                    {days.map((day, idx) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const dayData = calendarData[dateStr];
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const isToday = isSameDay(day, new Date());
                        
                        let bgClass = "bg-background";
                        if (dayData && isCurrentMonth) {
                             if (dayData.pnl > 0) bgClass = "bg-green-900/20"; // Very subtle green
                             if (dayData.pnl < 0) bgClass = "bg-red-900/20"; // Very subtle red
                        }
                        // Use stronger opacity/color if P&L is significant? Reference shows solid cells.
                        // Let's use solid colors for P&L days as per reference.
                        if (dayData && isCurrentMonth) {
                            if (dayData.pnl > 0) bgClass = "bg-green-500/10 hover:bg-green-500/20"; 
                            if (dayData.pnl < 0) bgClass = "bg-red-500/10 hover:bg-red-500/20";
                            // High impact visual style like reference
                             if (dayData.pnl > 0) bgClass = "bg-green-950 border-green-900"; 
                             if (dayData.pnl < 0) bgClass = "bg-red-950 border-red-900";
                        }

                        return (
                            <div 
                                key={day.toString()} 
                                className={`
                                    min-h-[80px] p-2 flex flex-col justify-between border-b border-r border-border  
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
                                        <span className={`text-sm font-bold ${dayData.pnl > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {dayData.pnl > 0 ? "+" : ""}${dayData.pnl.toFixed(0)}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {dayData.count} trade{dayData.count !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
