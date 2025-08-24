import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ParentRegister from "./pages/ParentRegister";
import SpecialistRegister from "./pages/SpecialistRegister";
import ParentDashboard from "./pages/ParentDashboard";
import SpecialistDashboard from "./pages/SpecialistDashboard";
import AttentionExercises from "./pages/AttentionExercises";
import CognitiveTests from "./pages/CognitiveTests";
import TheoryOfMind from "./pages/TheoryOfMind";
import TheoryOfMindGames from "./pages/TheoryOfMindGames";
import PortageReport from "./pages/PortageReport";
import AgeCalculator from "./pages/AgeCalculator";
import PatientForm from "./pages/PatientForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/parent-register" element={<ParentRegister />} />
          <Route path="/specialist-register" element={<SpecialistRegister />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="/specialist-dashboard" element={<SpecialistDashboard />} />
          <Route path="/doctor" element={<SpecialistDashboard />} />
          <Route path="/attention-exercises" element={<AttentionExercises />} />
          <Route path="/cognitive-tests" element={<CognitiveTests />} />
          <Route path="/theory-of-mind" element={<TheoryOfMind />} />
          <Route path="/portage-report" element={<PortageReport />} />
          <Route path="/age-calculator" element={<AgeCalculator />} />
          <Route path="/patient-form" element={<PatientForm />} />
          <Route path="/orthophonic-balance" element={<PatientForm />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
