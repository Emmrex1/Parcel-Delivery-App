import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  TrendingUp,
  Package,
  DollarSign,
  BarChart3,
  CheckCircle,
  Weight,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import { StatsCard } from "@/components/StatsCard";

import { fetchAnalyticsThunk } from "@/features/analytics/analyticsSlice";

//  Helpers


const formatCurrency = (value) => {
  return `₦${Number(value || 0).toLocaleString("en-NG")}`;
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

// Analytics Page

export default function Analytics() {
  const dispatch = useDispatch();

  const {
    summary,
    revenueData,
    parcelGrowthData,
    topCitiesData,
    deliveryPerformanceData,
    loading,
    error,
  } = useSelector((state) => state.analytics);

  //  Fetch Analytics
 

  useEffect(() => {
    dispatch(fetchAnalyticsThunk());
  }, [dispatch]);

  //  Summary Cards
  

  const totalRevenue =
    summary?.totals?.revenue ??
    (revenueData || []).reduce(
      (sum, item) => sum + Number(item?.revenue || 0),
      0,
    );

  const totalParcels =
    summary?.totals?.parcels ??
    (parcelGrowthData || []).reduce(
      (sum, item) => sum + Number(item?.parcels || 0),
      0,
    );

  const citiesServed = summary?.citiesServed ?? (topCitiesData || []).length;

  const avgOnTime = useMemo(() => {
    const rows = deliveryPerformanceData || [];

    if (!rows.length) {
      return 0;
    }

    const validRows = rows.filter(
      (row) =>
        Number(row?.total || 0) > 0 && typeof row?.onTime?.onTime === "number",
    );

    if (!validRows.length) {
      return 0;
    }

    const average =
      validRows.reduce((sum, row) => sum + row.onTime.onTime, 0) /
      validRows.length;

    return Math.round(average);
  }, [deliveryPerformanceData]);

  //  Delivery Chart Data
  

  const deliveryChartData = useMemo(() => {
    return (deliveryPerformanceData || []).map((row) => ({
      month: row.month,

      onTime: Number(row?.onTime?.onTime || 0),

      delayed: Number(row?.onTime?.delayed || 0),
    }));
  }, [deliveryPerformanceData]);

  //  Status Distribution
  

  const statusDistribution = useMemo(() => {
    return (summary?.statusDistribution || []).map((item) => ({
      name: formatStatus(item.name),

      value: Number(item.value || 0),
    }));
  }, [summary]);

  
  //  Weight Distribution
  

  const weightDistribution = useMemo(() => {
    return (summary?.weightDistribution || []).map((item) => ({
      range: item.range,

      count: Number(item.count || 0),
    }));
  }, [summary]);

  
  //  Loading Skeleton
  

  if (loading && !summary) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-40" />

          <Skeleton className="mt-2 h-4 w-72" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[360px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  //  Render
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>

        <p className="text-sm text-muted-foreground">
          Advanced insights into your logistics operations
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Summary Cards */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={totalRevenue}
          icon={DollarSign}
          prefix="₦"
          index={0}
          iconClassName="bg-success/10 text-success"
        />

        <StatsCard
          title="Total Parcels"
          value={totalParcels}
          icon={Package}
          index={1}
          iconClassName="bg-primary/10 text-primary"
        />

        <StatsCard
          title="Avg On-Time %"
          value={avgOnTime}
          icon={TrendingUp}
          suffix="%"
          index={2}
          iconClassName="bg-info/10 text-info"
        />

        <StatsCard
          title="Cities Served"
          value={citiesServed}
          icon={BarChart3}
          index={3}
          iconClassName="bg-secondary/10 text-secondary"
        />
      </div>

      {/* Charts */}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue */}

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Revenue Trend</CardTitle>
          </CardHeader>

          <CardContent>
            {revenueData.length === 0 ? (
              <div className="flex h-[280px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No revenue data available.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--success))"
                        stopOpacity={0.3}
                      />

                      <stop
                        offset="95%"
                        stopColor="hsl(var(--success))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />

                  <XAxis
                    dataKey="month"
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                  />

                  <YAxis
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => `₦${value / 1000}k`}
                  />

                  <Tooltip
                    formatter={(value) => [formatCurrency(value), "Revenue"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--success))"
                    fill="url(#revenueGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Parcel Growth */}

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Parcel Growth</CardTitle>
          </CardHeader>

          <CardContent>
            {parcelGrowthData.length === 0 ? (
              <div className="flex h-[280px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No parcel growth data available.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={parcelGrowthData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />

                  <XAxis
                    dataKey="month"
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                  />

                  <YAxis
                    allowDecimals={false}
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                  />

                  <Tooltip
                    formatter={(value) => [
                      Number(value).toLocaleString(),
                      "Parcels",
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="parcels"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{
                      fill: "hsl(var(--primary))",
                      r: 4,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Cities */}

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Top Destination Cities</CardTitle>
          </CardHeader>

          <CardContent>
            {topCitiesData.length === 0 ? (
              <div className="flex h-[280px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No destination data available.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={topCitiesData}
                  layout="vertical"
                  margin={{
                    left: 10,
                    right: 20,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                  />

                  <YAxis
                    type="category"
                    dataKey="city"
                    width={120}
                    fontSize={11}
                    stroke="hsl(var(--muted-foreground))"
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${value} parcel${Number(value) === 1 ? "" : "s"}`,
                      "Parcels",
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />

                  <Bar
                    dataKey="parcels"
                    fill="hsl(var(--secondary))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Delivery Performance */}

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Delivery Performance</CardTitle>

            <p className="text-xs text-muted-foreground">
              On-time vs delayed delivery percentage
            </p>
          </CardHeader>

          <CardContent>
            {deliveryChartData.length === 0 ? (
              <div className="flex h-[280px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No delivery performance data available.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={deliveryChartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />

                  <XAxis
                    dataKey="month"
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                  />

                  <YAxis
                    domain={[0, 100]}
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => `${value}%`}
                  />

                  <Tooltip
                    formatter={(value, name) => [
                      `${Number(value).toFixed(2)}%`,
                      name === "onTime" ? "On Time" : "Delayed",
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />

                  <Legend />

                  <Bar
                    dataKey="onTime"
                    name="On Time"
                    fill="hsl(var(--success))"
                    radius={[4, 4, 0, 0]}
                    stackId="delivery"
                  />

                  <Bar
                    dataKey="delayed"
                    name="Delayed"
                    fill="hsl(var(--destructive))"
                    radius={[4, 4, 0, 0]}
                    stackId="delivery"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Status Distribution */}

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">
              Parcel Status Distribution
            </CardTitle>
          </CardHeader>

          <CardContent>
            {statusDistribution.length === 0 ? (
              <div className="flex h-[280px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No status data available.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusDistribution.map((_, index) => (
                      <Cell
                        key={`status-${index}`}
                        fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Weight Distribution */}

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">
              Parcel Weight Distribution
            </CardTitle>
          </CardHeader>

          <CardContent>
            {weightDistribution.length === 0 ? (
              <div className="flex h-[280px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No weight data available.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weightDistribution}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />

                  <XAxis
                    dataKey="range"
                    fontSize={11}
                    stroke="hsl(var(--muted-foreground))"
                  />

                  <YAxis
                    allowDecimals={false}
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${value} parcel${Number(value) === 1 ? "" : "s"}`,
                      "Parcels",
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />

                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
