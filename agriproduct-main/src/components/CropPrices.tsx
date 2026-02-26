import { getMandiPrices } from "@/data/mockData";
import { TrendingUp, TrendingDown, MapPin } from "lucide-react";

export default function CropPrices({ crop }: { crop: string }) {
  const prices = getMandiPrices(crop);
  const local = prices[0];
  const highest = [...prices].sort((a, b) => b.price - a.price)[0];
  const estimatedTransport = 1200;
  const netProfit = highest.price - local.price - estimatedTransport;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-lg border bg-card p-4">
        <p className="text-xs text-muted-foreground font-medium">Local Mandi Price</p>
        <p className="text-2xl font-heading font-bold mt-1">₹{local.price.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground mt-1">{local.mandi}</p>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <p className="text-xs text-muted-foreground font-medium">Highest in India</p>
        <p className="text-2xl font-heading font-bold text-success mt-1">₹{highest.price.toLocaleString()}</p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">{highest.mandi}, {highest.state}</p>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <p className="text-xs text-muted-foreground font-medium">Price Difference</p>
        <div className="flex items-center gap-1 mt-1">
          {highest.price > local.price ? (
            <TrendingUp className="h-5 w-5 text-success" />
          ) : (
            <TrendingDown className="h-5 w-5 text-destructive" />
          )}
          <p className="text-2xl font-heading font-bold">₹{Math.abs(highest.price - local.price).toLocaleString()}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">per quintal</p>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <p className="text-xs text-muted-foreground font-medium">Est. Net Profit</p>
        <p className={`text-2xl font-heading font-bold mt-1 ${netProfit > 0 ? 'text-success' : 'text-destructive'}`}>
          ₹{netProfit.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground mt-1">after transport (est.)</p>
      </div>
    </div>
  );
}
