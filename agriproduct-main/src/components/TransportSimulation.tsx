import { useState } from "react";
import { calculateTransport, getNearbyMandis, getMandiPrices } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, User, ArrowRight, IndianRupee } from "lucide-react";

export default function TransportSimulation({ crop }: { crop: string }) {
  const mandis = getNearbyMandis();
  const prices = getMandiPrices(crop);
  const [selectedMandi, setSelectedMandi] = useState("");
  const [quantity, setQuantity] = useState("10");
  const [result, setResult] = useState<ReturnType<typeof calculateTransport> | null>(null);

  const handleCalculate = () => {
    const mandi = mandis.find(m => m.name === selectedMandi);
    if (!mandi) return;
    const q = parseFloat(quantity) || 10;
    setResult(calculateTransport(mandi.distance, q, mandi.price));
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="font-heading text-lg font-semibold mb-4">Transport & Profit Simulator</h3>

      <div className="space-y-3">
        <div>
          <Label className="text-xs">Select Mandi</Label>
          <Select value={selectedMandi} onValueChange={setSelectedMandi}>
            <SelectTrigger><SelectValue placeholder="Choose a mandi" /></SelectTrigger>
            <SelectContent>
              {mandis.map(m => (
                <SelectItem key={m.name} value={m.name}>{m.name} ({m.distance} km)</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Quantity (quintals)</Label>
          <Input type="number" min={1} max={1000} value={quantity} onChange={e => setQuantity(e.target.value)} />
        </div>
        <Button onClick={handleCalculate} className="w-full" disabled={!selectedMandi}>
          Calculate <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {result && (
        <div className="mt-4 space-y-3">
          {/* Self transport */}
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Sell by Self</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground">Transport Cost</p>
                <p className="font-bold text-destructive">-₹{result.self.cost.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Net Profit</p>
                <p className="font-bold text-success">₹{result.self.netProfit.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Platform transport */}
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Platform Transport</span>
              <span className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full font-medium">Recommended</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground">Commission (3%)</p>
                <p className="font-bold text-destructive">-₹{result.platform.commission.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Net Profit</p>
                <p className="font-bold text-success">₹{result.platform.netProfit.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">Free pickup · No transport hassle · Insurance included</p>
          </div>
        </div>
      )}
    </div>
  );
}
