import Navbar from "@/components/Navbar";
import { Sprout, Target, Users, Cpu } from "lucide-react";

const values = [
  { icon: Target, title: "Our Mission", desc: "To bridge the information gap between farmers and markets, ensuring fair prices and reducing post-harvest losses across India." },
  { icon: Cpu, title: "Our Technology", desc: "We use AI and machine learning to predict crop prices, analyze weather patterns, and optimize transport routes for maximum farmer profit." },
  { icon: Users, title: "Our Community", desc: "Over 10,000 farmers across 13 states trust Agri Product for daily market intelligence and selling decisions." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex rounded-full bg-primary/10 p-3 mb-4">
            <Sprout className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">About Agri Product</h1>
          <p className="text-lg text-muted-foreground">
            We're building India's most accessible agricultural intelligence platform — designed for farmers, by people who understand farming.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {values.map((v, i) => (
            <div key={i} className="rounded-lg border bg-card p-6 text-center">
              <div className="mx-auto mb-4 inline-flex rounded-full bg-primary/10 p-3">
                <v.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-2xl mx-auto rounded-lg bg-secondary p-8 text-center">
          <h2 className="font-heading text-2xl font-bold mb-3">How It Works</h2>
          <ol className="text-left space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3"><span className="font-bold text-primary text-lg">1.</span> Register with your mobile number and select your crops</li>
            <li className="flex gap-3"><span className="font-bold text-primary text-lg">2.</span> View real-time mandi prices and AI-predicted trends</li>
            <li className="flex gap-3"><span className="font-bold text-primary text-lg">3.</span> Compare nearby mandis and estimate transport costs</li>
            <li className="flex gap-3"><span className="font-bold text-primary text-lg">4.</span> Decide the best time and place to sell for maximum profit</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
