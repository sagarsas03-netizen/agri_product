export interface Farmer {
  id: string;
  name: string;
  phone: string;
  state: string;
  district: string;
  crops: CropEntry[];
}

export interface CropEntry {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  addedAt: string;
}

export interface MandiPrice {
  mandi: string;
  state: string;
  district: string;
  price: number;
  date: string;
}

export interface PriceTrend {
  date: string;
  price: number;
  predicted?: boolean;
}

export interface NearbyMandi {
  name: string;
  distance: number;
  price: number;
  lat: number;
  lng: number;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  condition: string;
  icon: string;
  wind: number;
}

export interface WeatherForecast {
  day: string;
  temp: number;
  condition: string;
  icon: string;
  alert?: string;
}

export interface TransportOption {
  mode: 'self' | 'platform';
  distance: number;
  cost: number;
  commission: number;
  netProfit: number;
}
