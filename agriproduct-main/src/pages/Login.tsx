import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFarmer } from "@/contexts/FarmerContext";
import { CropEntry } from "@/types/farmer";
import { Sprout, ArrowRight, Plus, X } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const { isLoggedIn, login, register, addCrop } = useFarmer();
  const [step, setStep] = useState<'phone' | 'otp' | 'register'>(isLoggedIn ? 'register' : 'phone');
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [cropInput, setCropInput] = useState("");
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);

  const handleSendOtp = () => {
    if (phone.length < 10) { toast.error("Enter a valid 10-digit number"); return; }
    toast.success("OTP sent to +91 " + phone + " (simulated: 1234)");
    setStep('otp');
  };

  const handleVerifyOtp = () => {
    if (otp !== "1234") { toast.error("Invalid OTP. Use 1234"); return; }
    const saved = localStorage.getItem("farmer");
    if (saved) {
      const f = JSON.parse(saved);
      if (f.phone === phone) {
        login(phone);
        toast.success("Welcome back, " + f.name + "!");
        navigate("/dashboard");
        return;
      }
    }
    setStep('register');
  };

  const handleAddCrop = () => {
    const trimmed = cropInput.trim();
    if (!trimmed) return;
    if (selectedCrops.find(c => c.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Crop already added");
      return;
    }
    setSelectedCrops(prev => [...prev, trimmed]);
    setCropInput("");
  };

  const handleRemoveCrop = (crop: string) => {
    setSelectedCrops(prev => prev.filter(c => c !== crop));
  };

  const handleRegister = () => {
    if (!name.trim() || !state.trim() || !district.trim()) { toast.error("Please fill all fields"); return; }
    register({ name: name.trim(), phone, state: state.trim(), district: district.trim() });
    selectedCrops.forEach(crop => {
      const entry: CropEntry = { id: crypto.randomUUID(), name: crop, addedAt: new Date().toISOString() };
      addCrop(entry);
    });
    toast.success("Registration successful!");
    navigate("/dashboard");
  };

  if (isLoggedIn) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex rounded-full bg-primary/10 p-3 mb-4">
              <Sprout className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-heading text-3xl font-bold">Farmer Login</h1>
            <p className="text-muted-foreground mt-2">
              {step === 'phone' && "Enter your mobile number to get started"}
              {step === 'otp' && "Enter the OTP sent to your phone"}
              {step === 'register' && "Complete your registration"}
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            {step === 'phone' && (
              <div className="space-y-4">
                <div>
                  <Label>Mobile Number</Label>
                  <div className="flex gap-2 mt-1">
                    <div className="flex items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">+91</div>
                    <Input type="tel" maxLength={10} placeholder="9876543210" value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} />
                  </div>
                </div>
                <Button className="w-full" onClick={handleSendOtp}>
                  Send OTP <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {step === 'otp' && (
              <div className="space-y-4">
                <div>
                  <Label>OTP</Label>
                  <Input type="text" maxLength={4} placeholder="1234" value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} className="text-center text-2xl tracking-widest" />
                  <p className="text-xs text-muted-foreground mt-1">Hint: Use 1234 for simulation</p>
                </div>
                <Button className="w-full" onClick={handleVerifyOtp}>Verify OTP</Button>
              </div>
            )}

            {step === 'register' && (
              <div className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input maxLength={100} placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                  <Label>State</Label>
                  <Input maxLength={100} placeholder="Enter your state" value={state} onChange={e => setState(e.target.value)} />
                </div>
                <div>
                  <Label>District</Label>
                  <Input maxLength={100} placeholder="Enter your district" value={district} onChange={e => setDistrict(e.target.value)} />
                </div>
                <div>
                  <Label>Crops</Label>
                  <div className="flex gap-2 mt-1">
                    <Input placeholder="Type a crop name" value={cropInput}
                      onChange={e => setCropInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCrop(); } }} />
                    <Button type="button" size="icon" variant="outline" onClick={handleAddCrop}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {selectedCrops.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCrops.map(crop => (
                        <span key={crop} className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                          {crop}
                          <button onClick={() => handleRemoveCrop(crop)}><X className="h-3 w-3" /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Button className="w-full" onClick={handleRegister}>Complete Registration</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
