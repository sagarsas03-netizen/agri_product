import { MandiPrice, PriceTrend, NearbyMandi, WeatherData, WeatherForecast } from "@/types/farmer";

export const INDIAN_STATES = [
  "Andhra Pradesh", "Bihar", "Gujarat", "Haryana", "Karnataka",
  "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu",
  "Telangana", "Uttar Pradesh", "West Bengal"
];

export const DISTRICTS: Record<string, string[]> = {
  "Maharashtra": ["Pune", "Nashik", "Nagpur", "Aurangabad", "Kolhapur"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  "Uttar Pradesh": ["Lucknow", "Agra", "Varanasi", "Meerut", "Kanpur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Belgaum", "Mangalore"],
  "Gujarat": ["Ahmedabad", "Surat", "Rajkot", "Vadodara", "Junagadh"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "Haryana": ["Karnal", "Hisar", "Rohtak", "Panipat", "Ambala"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Trichy"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga"],
  "Andhra Pradesh": ["Guntur", "Vijayawada", "Visakhapatnam", "Kurnool", "Tirupati"],
  "Telangana": ["Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Khammam"],
  "West Bengal": ["Kolkata", "Howrah", "Siliguri", "Durgapur", "Bardhaman"],
};

export const AVAILABLE_CROPS = [
  "Wheat", "Rice", "Cotton", "Sugarcane", "Soybean",
  "Maize", "Groundnut", "Mustard", "Onion", "Tomato",
  "Potato", "Chilli", "Turmeric", "Jowar", "Bajra"
];

export function getMandiPrices(crop: string): MandiPrice[] {
  const base = getCropBasePrice(crop);
  return [
    { mandi: "Local Mandi", state: "Maharashtra", district: "Pune", price: base, date: "2026-02-24" },
    { mandi: "Azadpur Mandi", state: "Delhi", district: "Delhi", price: base + 320, date: "2026-02-24" },
    { mandi: "Vashi Market", state: "Maharashtra", district: "Mumbai", price: base + 180, date: "2026-02-24" },
    { mandi: "Yeshwanthpur", state: "Karnataka", district: "Bangalore", price: base + 450, date: "2026-02-24" },
    { mandi: "Koyambedu", state: "Tamil Nadu", district: "Chennai", price: base + 280, date: "2026-02-24" },
  ];
}

function getCropBasePrice(crop: string): number {
  const prices: Record<string, number> = {
    Wheat: 2200, Rice: 2800, Cotton: 6500, Sugarcane: 350, Soybean: 4200,
    Maize: 1900, Groundnut: 5500, Mustard: 5000, Onion: 1800, Tomato: 2500,
    Potato: 1200, Chilli: 8000, Turmeric: 7500, Jowar: 2800, Bajra: 2200,
  };
  return prices[crop] || 2000;
}

export function getPriceTrend(crop: string): PriceTrend[] {
  const base = getCropBasePrice(crop);
  const data: PriceTrend[] = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const variation = Math.sin(i * 0.3) * 200 + Math.random() * 100;
    data.push({
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      price: Math.round(base + variation),
    });
  }
  // 7-day prediction
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const trend = base + 150 + i * 30 + Math.random() * 80;
    data.push({
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      price: Math.round(trend),
      predicted: true,
    });
  }
  return data;
}

export function getNearbyMandis(): NearbyMandi[] {
  return [
    { name: "Pune Market Yard", distance: 12, price: 2400, lat: 18.52, lng: 73.85 },
    { name: "Shivajinagar Mandi", distance: 18, price: 2550, lat: 18.53, lng: 73.84 },
    { name: "Hadapsar APMC", distance: 8, price: 2350, lat: 18.50, lng: 73.93 },
    { name: "Pimpri Market", distance: 25, price: 2600, lat: 18.62, lng: 73.80 },
    { name: "Baramati Mandi", distance: 95, price: 2800, lat: 18.15, lng: 74.58 },
  ];
}

export function getWeather(): WeatherData {
  return { temp: 28, humidity: 65, condition: "Partly Cloudy", icon: "⛅", wind: 12 };
}

export function getWeatherForecast(): WeatherForecast[] {
  return [
    { day: "Tomorrow", temp: 30, condition: "Sunny", icon: "☀️" },
    { day: "Day 2", temp: 27, condition: "Rainy", icon: "🌧️", alert: "Heavy rainfall expected. Protect crops." },
    { day: "Day 3", temp: 29, condition: "Cloudy", icon: "☁️" },
  ];
}

export function calculateTransport(distance: number, quantity: number, pricePerQuintal: number) {
  const ratePerKm = 15;
  const transportCost = distance * ratePerKm;
  const totalRevenue = quantity * pricePerQuintal;
  const platformCommission = totalRevenue * 0.03;
  return {
    self: {
      mode: 'self' as const,
      distance,
      cost: transportCost,
      commission: 0,
      netProfit: totalRevenue - transportCost,
    },
    platform: {
      mode: 'platform' as const,
      distance,
      cost: 0,
      commission: platformCommission,
      netProfit: totalRevenue - platformCommission,
    },
  };
}
