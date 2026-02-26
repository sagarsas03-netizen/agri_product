import heroImage from "@/assets/hero-farm.jpg";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, CloudSun, Truck, BarChart3, Sprout, Shield } from "lucide-react";

const features = [
  { icon: TrendingUp, title: "Live Mandi Prices", desc: "Real-time crop prices from mandis across India" },
  { icon: BarChart3, title: "AI Price Prediction", desc: "7-day price forecast using machine learning" },
  { icon: CloudSun, title: "Weather Alerts", desc: "Hyper-local weather with danger alerts" },
  { icon: Truck, title: "Transport Planner", desc: "Calculate transport costs and net profit" },
  { icon: Sprout, title: "Crop Management", desc: "Track multiple crops and their market data" },
  { icon: Shield, title: "Trusted Platform", desc: "Transparent pricing with minimal commission" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Indian farmland at sunrise" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 py-28 md:py-40">
          <div className="max-w-xl">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground leading-tight mb-4">
              Empowering India's Farmers with Data
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
              Get real-time mandi prices, AI-powered forecasts, and smart transport planning — all in one platform.
            </p>
            <div className="flex gap-3">
              <Link to="/login">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-8">
                  Get Started
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-3">Why Agri Product?</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
          Everything a farmer needs to make smarter selling decisions.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="group rounded-lg border bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}>
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-4">
            Join thousands of farmers making smarter decisions
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Register for free and start getting real-time market intelligence today.
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8">
              Register Now — It's Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          © 2026 Agri Product. Empowering Indian Agriculture.
        </div>
      </footer>
    </div>
  );
}
