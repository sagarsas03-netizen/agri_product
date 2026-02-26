import { createContext, useContext, useState, ReactNode } from "react";
import { Farmer, CropEntry } from "@/types/farmer";

interface FarmerContextType {
  farmer: Farmer | null;
  isLoggedIn: boolean;
  login: (phone: string) => void;
  logout: () => void;
  register: (data: Omit<Farmer, 'id' | 'crops'>) => void;
  addCrop: (crop: CropEntry) => void;
  removeCrop: (cropId: string) => void;
  selectedCrop: string | null;
  setSelectedCrop: (crop: string | null) => void;
}

const FarmerContext = createContext<FarmerContextType | null>(null);

export function FarmerProvider({ children }: { children: ReactNode }) {
  const [farmer, setFarmer] = useState<Farmer | null>(() => {
    const saved = localStorage.getItem("farmer");
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  const save = (f: Farmer) => {
    setFarmer(f);
    localStorage.setItem("farmer", JSON.stringify(f));
  };

  const login = (phone: string) => {
    const saved = localStorage.getItem("farmer");
    if (saved) {
      const f = JSON.parse(saved);
      if (f.phone === phone) setFarmer(f);
    }
  };

  const logout = () => {
    setFarmer(null);
    localStorage.removeItem("farmer");
  };

  const register = (data: Omit<Farmer, 'id' | 'crops'>) => {
    const newFarmer: Farmer = { ...data, id: crypto.randomUUID(), crops: [] };
    save(newFarmer);
  };

  const addCrop = (crop: CropEntry) => {
    if (!farmer) return;
    const updated = { ...farmer, crops: [...farmer.crops, crop] };
    save(updated);
    setSelectedCrop(crop.name);
  };

  const removeCrop = (cropId: string) => {
    if (!farmer) return;
    const updated = { ...farmer, crops: farmer.crops.filter(c => c.id !== cropId) };
    save(updated);
  };

  return (
    <FarmerContext.Provider value={{
      farmer, isLoggedIn: !!farmer, login, logout, register,
      addCrop, removeCrop, selectedCrop, setSelectedCrop
    }}>
      {children}
    </FarmerContext.Provider>
  );
}

export const useFarmer = () => {
  const ctx = useContext(FarmerContext);
  if (!ctx) throw new Error("useFarmer must be used within FarmerProvider");
  return ctx;
};
