import { getWeather, getWeatherForecast } from "@/data/mockData";
import { AlertTriangle, Droplets, Wind, Thermometer } from "lucide-react";

export default function WeatherSection() {
  const weather = getWeather();
  const forecast = getWeatherForecast();

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="font-heading text-lg font-semibold mb-4">Weather</h3>

      {/* Current */}
      <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-secondary">
        <span className="text-4xl">{weather.icon}</span>
        <div>
          <p className="text-2xl font-heading font-bold">{weather.temp}°C</p>
          <p className="text-sm text-muted-foreground">{weather.condition}</p>
        </div>
        <div className="ml-auto space-y-1 text-right">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Droplets className="h-3 w-3" /> {weather.humidity}%
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Wind className="h-3 w-3" /> {weather.wind} km/h
          </div>
        </div>
      </div>

      {/* 3-day forecast */}
      <div className="space-y-2">
        {forecast.map((f, i) => (
          <div key={i}>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="text-xl">{f.icon}</span>
                <div>
                  <p className="text-sm font-medium">{f.day}</p>
                  <p className="text-xs text-muted-foreground">{f.condition}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Thermometer className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm font-medium">{f.temp}°C</span>
              </div>
            </div>
            {f.alert && (
              <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <p className="text-xs text-destructive font-medium">{f.alert}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
