import { useFarmer } from "@/contexts/FarmerContext";
import { CropEntry } from "@/types/farmer";
import { Sprout, Plus, LogOut, MapPin, Phone, Wheat, X, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function DashboardSidebar({ onClose }: { onClose: () => void }) {
  const { farmer, logout, addCrop, removeCrop, selectedCrop, setSelectedCrop } = useFarmer();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [newCrop, setNewCrop] = useState("");

  if (!farmer) return null;

  const handleAddCrop = () => {
    if (!newCrop) return;
    if (farmer.crops.find(c => c.name === newCrop)) {
      toast.error("Crop already added");
      return;
    }
    const entry: CropEntry = { id: crypto.randomUUID(), name: newCrop, addedAt: new Date().toISOString() };
    addCrop(entry);
    toast.success(`${newCrop} added! Fetching prices...`);
    setAdding(false);
    setNewCrop("");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-64 h-full bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-sidebar-primary" />
          <span className="font-heading text-lg font-bold">Agri Product</span>
        </div>
        <button className="lg:hidden text-sidebar-foreground" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Profile */}
      <div className="p-4 border-b border-sidebar-border">
        <p className="font-semibold text-sm truncate">{farmer.name}</p>
        <div className="flex items-center gap-1 mt-1 text-xs text-sidebar-foreground/70">
          <Phone className="h-3 w-3" /> +91 {farmer.phone}
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-sidebar-foreground/70">
          <MapPin className="h-3 w-3" /> {farmer.district}, {farmer.state}
        </div>
      </div>

      {/* Crops */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 mb-3">My Crops</p>
        <div className="space-y-1">
          {farmer.crops.map(crop => (
            <div key={crop.id}
              className={`group flex items-center justify-between rounded-md px-3 py-2 text-sm cursor-pointer transition-colors ${
                selectedCrop === crop.name ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'
              }`}
              onClick={() => { setSelectedCrop(crop.name); onClose(); }}>
              <div className="flex items-center gap-2">
                <Wheat className="h-4 w-4 text-sidebar-primary" />
                <span>{crop.name}</span>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={e => { e.stopPropagation(); removeCrop(crop.id); }}>
                <Trash2 className="h-3.5 w-3.5 text-sidebar-foreground/50 hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>

        {adding ? (
          <div className="mt-3 space-y-2">
            <Input placeholder="Type crop name" value={newCrop} onChange={e => setNewCrop(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCrop(); } }}
              className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50" />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddCrop} className="flex-1 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">Add</Button>
              <Button size="sm" variant="ghost" onClick={() => setAdding(false)} className="text-sidebar-foreground hover:bg-sidebar-accent">Cancel</Button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAdding(true)}
            className="mt-3 flex items-center gap-2 text-sm text-sidebar-primary hover:text-sidebar-primary/80 transition-colors">
            <Plus className="h-4 w-4" /> Add new crop
          </button>
        )}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors w-full">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
