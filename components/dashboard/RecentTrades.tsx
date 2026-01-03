"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trade } from "@/lib/types";
import { format } from "date-fns";

export function RecentTrades({ trades }: { trades: Trade[] }) {
    // Sort trades by date descending and take top 8 for the table
    const recentTrades = [...trades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

    return (
        <Card className="col-span-3 h-full">
            <CardHeader className="px-6 pt-6 pb-2">
                <Tabs defaultValue="recent" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1">
                        <TabsTrigger value="recent" className="text-xs">Recent trades</TabsTrigger>
                        <TabsTrigger value="open" className="text-xs">Open positions</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="recent" className="mt-4">
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground px-2 pb-2 uppercase tracking-wider font-semibold">
                                <span className="w-24">Close Date</span>
                                <span className="flex-1 text-center">Symbol</span>
                                <span className="w-20 text-right">Net P&L</span>
                            </div>
                            
                            <div className="space-y-1">
                                {recentTrades.length === 0 ? (
                                    <div className="text-sm text-muted-foreground text-center py-8">No recent trades</div>
                                ) : (
                                    recentTrades.map(trade => (
                                        <div key={trade.id} className="flex items-center justify-between py-2 px-2 hover:bg-muted/30 rounded-md transition-colors text-sm">
                                            <span className="w-24 text-muted-foreground text-xs">
                                                {format(new Date(trade.date), 'MM/dd/yyyy')}
                                            </span>
                                            <span className="flex-1 text-center font-medium">
                                                {trade.ticker}
                                            </span>
                                            <span className={`w-20 text-right font-mono font-medium ${trade.pnl > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {trade.pnl > 0 ? "+" : ""}${trade.pnl.toFixed(0)}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="open" className="mt-4">
                        <div className="text-sm text-muted-foreground text-center py-10">
                            No open positions
                        </div>
                    </TabsContent>
                </Tabs>
            </CardHeader>
        </Card>
    );
}
