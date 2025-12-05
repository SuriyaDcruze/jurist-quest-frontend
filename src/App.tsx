import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MemberDashboard from "./pages/MemberDashboard";
import JuriDashboard from "./pages/JuriDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Marks from "@/components/JuriDashboard/Marks"
import Memorial from "@/components/JuriDashboard/Memorial"
import Round from "@/components/JuriDashboard/Round"
import OralMarksEntryPage from "@/components/JuriDashboard/OralMarksEntryPage"

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/member-dashboard" element={<MemberDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/juri-dashboard"  >
            <Route index element={<JuriDashboard />} />

            <Route path="marks" element={<Marks />} />
            <Route path="memorial" element={<Memorial />} />
            <Route path="round" element={<Round />} />
            <Route path="oral-marks" element={<OralMarksEntryPage />} />
          </Route>


          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

