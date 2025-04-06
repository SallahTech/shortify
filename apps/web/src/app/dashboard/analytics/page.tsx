"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import * as links from "@/lib/links";

interface ClickData {
  date: string;
  clicks: number;
  ctaClicks: number;
}

export default function AnalyticsPage() {
  const [clickData, setClickData] = useState<ClickData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("7d");

  useEffect(() => {
    const fetchClickData = async () => {
      try {
        const allLinks = await links.getLinks();

        // Create a map to store clicks by date
        const clicksByDate = new Map<
          string,
          { clicks: number; ctaClicks: number }
        >();

        // Get the start date based on the selected range
        const startDate = new Date();
        startDate.setDate(
          startDate.getDate() -
            (dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90)
        );

        // Initialize the map with all dates in the range
        for (
          let d = new Date(startDate);
          d <= new Date();
          d.setDate(d.getDate() + 1)
        ) {
          clicksByDate.set(d.toISOString().split("T")[0], {
            clicks: 0,
            ctaClicks: 0,
          });
        }

        // Aggregate clicks by date
        allLinks.forEach((link) => {
          link.clicks.forEach((click) => {
            const clickDate = new Date(click.createdAt)
              .toISOString()
              .split("T")[0];
            if (clicksByDate.has(clickDate)) {
              const current = clicksByDate.get(clickDate)!;
              clicksByDate.set(clickDate, {
                clicks: current.clicks + 1,
                ctaClicks: current.ctaClicks + (click.ctaClick ? 1 : 0),
              });
            }
          });
        });

        // Convert map to array and sort by date
        const data = Array.from(clicksByDate.entries())
          .map(([date, stats]) => ({
            date,
            clicks: stats.clicks,
            ctaClicks: stats.ctaClicks,
          }))
          .sort((a, b) => a.date.localeCompare(b.date));

        setClickData(data);
      } catch (error) {
        console.error("Failed to fetch click data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClickData();
  }, [dateRange]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          View detailed analytics for all your links
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Clicks</h3>
          </div>
          <div className="text-2xl font-bold">
            {clickData.reduce((sum, day) => sum + day.clicks, 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            In the last {dateRange}
          </p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">CTA Clicks</h3>
          </div>
          <div className="text-2xl font-bold">
            {clickData.reduce((sum, day) => sum + day.ctaClicks, 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            In the last {dateRange}
          </p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Average Daily Clicks</h3>
          </div>
          <div className="text-2xl font-bold">
            {clickData.length > 0
              ? Math.round(
                  clickData.reduce((sum, day) => sum + day.clicks, 0) /
                    clickData.length
                )
              : 0}
          </div>
          <p className="text-xs text-muted-foreground">
            In the last {dateRange}
          </p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">CTA Click Rate</h3>
          </div>
          <div className="text-2xl font-bold">
            {clickData.reduce((sum, day) => sum + day.clicks, 0) > 0
              ? Math.round(
                  (clickData.reduce((sum, day) => sum + day.ctaClicks, 0) /
                    clickData.reduce((sum, day) => sum + day.clicks, 0)) *
                    100
                )
              : 0}
            %
          </div>
          <p className="text-xs text-muted-foreground">
            In the last {dateRange}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Click Trends */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="font-semibold">Click Trends</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setDateRange("7d")}
                className={`px-2 py-1 text-sm rounded ${
                  dateRange === "7d"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                7D
              </button>
              <button
                onClick={() => setDateRange("30d")}
                className={`px-2 py-1 text-sm rounded ${
                  dateRange === "30d"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                30D
              </button>
              <button
                onClick={() => setDateRange("90d")}
                className={`px-2 py-1 text-sm rounded ${
                  dateRange === "90d"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                90D
              </button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={clickData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) =>
                      new Date(date).toLocaleDateString(undefined, {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#2563eb"
                    name="Total Clicks"
                  />
                  <Line
                    type="monotone"
                    dataKey="ctaClicks"
                    stroke="#16a34a"
                    name="CTA Clicks"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Links */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="font-semibold">Top Performing Links</h3>
          </div>
          <div className="space-y-4">
            {topLinks.map((link) => (
              <div key={link.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {link.shortUrl}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {link.clicks} clicks
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {link.ctr}% CTR
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Stats Table */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Link Performance</h3>
        <div className="rounded-lg border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Short URL
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Total Clicks
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    CTA Clicks
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    CTR
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Last Click
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {linkStats.map((stat) => (
                  <tr
                    key={stat.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle">{stat.shortUrl}</td>
                    <td className="p-4 align-middle">{stat.totalClicks}</td>
                    <td className="p-4 align-middle">{stat.ctaClicks}</td>
                    <td className="p-4 align-middle">{stat.ctr}%</td>
                    <td className="p-4 align-middle">{stat.lastClick}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const topLinks = [
  { id: "1", shortUrl: "short.ly/abc123", clicks: 450, ctr: 45 },
  { id: "2", shortUrl: "short.ly/def456", clicks: 380, ctr: 38 },
  { id: "3", shortUrl: "short.ly/ghi789", clicks: 320, ctr: 32 },
  { id: "4", shortUrl: "short.ly/jkl012", clicks: 290, ctr: 29 },
];

const linkStats = [
  {
    id: "1",
    shortUrl: "short.ly/abc123",
    totalClicks: 450,
    ctaClicks: 203,
    ctr: 45,
    lastClick: "2 minutes ago",
  },
  {
    id: "2",
    shortUrl: "short.ly/def456",
    totalClicks: 380,
    ctaClicks: 144,
    ctr: 38,
    lastClick: "15 minutes ago",
  },
  {
    id: "3",
    shortUrl: "short.ly/ghi789",
    totalClicks: 320,
    ctaClicks: 102,
    ctr: 32,
    lastClick: "1 hour ago",
  },
  {
    id: "4",
    shortUrl: "short.ly/jkl012",
    totalClicks: 290,
    ctaClicks: 84,
    ctr: 29,
    lastClick: "3 hours ago",
  },
];
