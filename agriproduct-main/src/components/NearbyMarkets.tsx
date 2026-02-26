import { getNearbyMandis } from "@/data/mockData";
import { MapPin, Navigation } from "lucide-react";

export default function NearbyMarkets({ crop }: { crop: string }) {
  const mandis = getNearbyMandis();

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="font-heading text-lg font-semibold mb-4">Nearby Mandis</h3>

      {/* Simple visual map */}
      <div className="relative rounded-lg bg-secondary h-40 mb-4 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            {mandis.map((m, i) => {
              const x = 15 + (i * 17);
              const y = 20 + Math.sin(i) * 25 + 20;
              return (
                <div key={i} className="absolute flex flex-col items-center" style={{ left: `${x}%`, top: `${y}%` }}>
                  <MapPin className={`h-5 w-5 ${i === 0 ? 'text-primary' : 'text-accent'}`} />
                  <span className="text-[10px] font-medium mt-0.5 whitespace-nowrap">{m.name.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {mandis.map((m, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{m.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Navigation className="h-3 w-3" /> {m.distance} km
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">₹{m.price.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">per quintal</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
