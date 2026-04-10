"use client";

import { useMemo } from "react";
import { DailyAnalytic } from "@/utils/server-dashboard";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface Props {
    data: DailyAnalytic[];
}

export function AnalyticsChart({ data }: Props) {
    const chartData = useMemo(
        () =>
            data.map((item) => ({
                date: item.date,
                label: new Date(item.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                }),
                views: item.views,
            })),
        [data]
    );

    const yAxisMax = useMemo(() => {
        const max = Math.max(...chartData.map((item) => item.views), 10);
        return Math.ceil(max * 1.1);
    }, [chartData]);

    return (
        <div className="bg-white border border-[#DDD7CC] rounded-[4px] p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="font-heading font-bold text-[16px] text-[#1A1714]">Site Traffic Trends</h2>
                    <p className="text-[11px] text-[#8C857C] mt-0.5">Daily total views over the last 30 days</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#11412a]" />
                        <span className="text-[10px] font-bold tracking-wider text-[#1A1714] uppercase">Total Views</span>
                    </div>
                </div>
            </div>

            <div className="relative w-full overflow-hidden">
                {chartData.length === 0 ? (
                    <div className="h-[200px] flex items-center justify-center border border-dashed border-[#DDD7CC] rounded-[2px] text-[12px] text-[#8C857C] italic">
                        No analytics recorded yet. Data will appear as posts are viewed.
                    </div>
                ) : (
                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                                <CartesianGrid stroke="#EDE7D9" strokeDasharray="4 4" vertical={false} />

                                <XAxis
                                    dataKey="label"
                                    tick={{ fill: "#8C857C", fontSize: 10 }}
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={30}
                                />

                                <YAxis
                                    tick={{ fill: "#8C857C", fontSize: 10 }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={40}
                                    domain={[0, yAxisMax]}
                                />

                                <Tooltip
                                    cursor={{ stroke: "#DDD7CC", strokeDasharray: "3 3" }}
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #DDD7CC",
                                        borderRadius: "4px",
                                        fontSize: "11px",
                                        color: "#1A1714",
                                    }}
                                    labelStyle={{ color: "#8C857C", marginBottom: "4px" }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#11412a"
                                    strokeWidth={2.5}
                                    dot={{ r: 3, strokeWidth: 2, fill: "#fff", stroke: "#11412a" }}
                                    activeDot={{ r: 5, strokeWidth: 2, fill: "#fff", stroke: "#11412a" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
}
