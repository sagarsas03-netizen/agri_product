import { useFarmer } from "@/contexts/FarmerContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import CropPrices from "@/components/CropPrices";
import PriceTrendChart from "@/components/PriceTrendChart";
import WeatherSection from "@/components/WeatherSection";
import NearbyMarkets from "@/components/NearbyMarkets";
import TransportSimulation from "@/components/TransportSimulation";
import { Menu } from "lucide-react";

export default function Dashboard() {
  const { farmer, isLoggedIn, selectedCrop, setSelectedCrop } = useFarmer();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (farmer?.crops.length && !selectedCrop) {
      setSelectedCrop(farmer.crops[0].name);
    }
  }, [farmer, selectedCrop, setSelectedCrop]);

  if (!farmer) return null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`fixed lg:sticky top-0 z-50 h-screen transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <DashboardSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-md px-4 py-3 flex items-center gap-3 lg:px-6">
          <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="font-heading text-xl font-bold truncate">
            {selectedCrop ? `${selectedCrop} Dashboard` : "Farmer Dashboard"}
          </h1>
        </header>

        <div className="p-4 lg:p-6 space-y-6">
          {selectedCrop ? (
            <>
              <CropPrices crop={selectedCrop} />
              <div className="grid lg:grid-cols-2 gap-6">
                <PriceTrendChart crop={selectedCrop} />
                <WeatherSection />
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <NearbyMarkets crop={selectedCrop} />
                <TransportSimulation crop={selectedCrop} />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 rounded-lg border bg-card">
              <p className="text-muted-foreground">Add a crop from the sidebar to get started</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
