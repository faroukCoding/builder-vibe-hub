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
import DiagnosticResponseSheet from "./pages/DiagnosticResponseSheet";
import DiagnosticTests from "./pages/DiagnosticTests";
import PortageReport from "./pages/PortageReport";
import AgeCalculator from "./pages/AgeCalculator";
import PatientForm from "./pages/PatientForm";
import PreBasicAcquisitions from "./pages/PreBasicAcquisitions";
import ImplicitGroup from "./pages/ImplicitGroup";
import PerceptualExercises from "./pages/PerceptualExercises";
import MemoryExercises from "./pages/MemoryExercises";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/parent-register" element={<ParentRegister />} />
          <Route path="/specialist-register" element={<SpecialistRegister />} />
          <Route
            path="/parent-dashboard"
            element={
              <ProtectedRoute requiredUserType="parent">
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/specialist-dashboard"
            element={
              <ProtectedRoute requiredUserType="specialist">
                <SpecialistDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor"
            element={
              <ProtectedRoute requiredUserType="specialist">
                <SpecialistDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attention-exercises"
            element={
              <ProtectedRoute>
                <AttentionExercises />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cognitive-tests"
            element={
              <ProtectedRoute>
                <CognitiveTests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/theory-of-mind"
            element={
              <ProtectedRoute>
                <TheoryOfMind />
              </ProtectedRoute>
            }
          />
          <Route
            path="/theory-of-mind-games"
            element={
              <ProtectedRoute>
                <TheoryOfMindGames />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diagnostic-response-sheet"
            element={
              <ProtectedRoute>
                <DiagnosticResponseSheet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diagnostic-tests"
            element={
              <ProtectedRoute>
                <DiagnosticTests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portage-report"
            element={
              <ProtectedRoute>
                <PortageReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/age-calculator"
            element={
              <ProtectedRoute>
                <AgeCalculator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-form"
            element={
              <ProtectedRoute>
                <PatientForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orthophonic-balance"
            element={
              <ProtectedRoute>
                <PatientForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pre-basic-acquisitions"
            element={
              <ProtectedRoute>
                <PreBasicAcquisitions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/implicit-group"
            element={
              <ProtectedRoute>
                <ImplicitGroup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perceptual-exercises"
            element={
              <ProtectedRoute>
                <PerceptualExercises />
              </ProtectedRoute>
            }
          />
          <Route
            path="/memory-exercises"
            element={
              <ProtectedRoute>
                <MemoryExercises />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
