import { getPriceTrend } from "@/data/mockData";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";

export default function PriceTrendChart({ crop }: { crop: string }) {
  const data = getPriceTrend(crop);
  const splitIndex = data.findIndex(d => d.predicted);

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold">Price Trend</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Actual</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-muted-foreground">AI Predicted</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(142, 45%, 28%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(142, 45%, 28%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(42, 90%, 55%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(42, 90%, 55%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 88%)" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={5} />
          <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ background: 'hsl(0, 0%, 100%)', border: '1px solid hsl(40, 15%, 88%)', borderRadius: '8px', fontSize: '12px' }}
            formatter={(value: number) => [`₹${value}`, 'Price']}
          />
          {splitIndex > 0 && (
            <ReferenceLine x={data[splitIndex]?.date} stroke="hsl(42, 90%, 55%)" strokeDasharray="4 4" label={{ value: "Prediction", fontSize: 10, fill: "hsl(140, 10%, 45%)" }} />
          )}
          <Area type="monotone" dataKey="price" stroke="hsl(142, 45%, 28%)" fill="url(#colorPrice)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
