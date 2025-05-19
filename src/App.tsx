
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import UploadAudio from "./pages/UploadAudio";
import Profile from "./pages/Profile";
import LandingPage from "./pages/LandingPage";
import PublicSamples from "./pages/PublicSamples";
import AgentPreview from "./pages/AgentPreview";
import BusinessSignup from "./pages/BusinessSignup";
import Agents from "./pages/Agents";
import BusinessApprovals from "./pages/admin/BusinessApprovals";
import AppLayout from "./layouts/AppLayout";
import Services from "./pages/Services";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout><LandingPage /></AppLayout>} />
            <Route path="/dashboard" element={<AppLayout><Index /></AppLayout>} />
            <Route path="/landing" element={<AppLayout><LandingPage /></AppLayout>} />
            <Route path="/samples" element={<AppLayout><PublicSamples /></AppLayout>} />
            <Route path="/auth" element={<AppLayout><Auth /></AppLayout>} />
            <Route path="/business-signup" element={<AppLayout><BusinessSignup /></AppLayout>} />
            <Route path="/upload" element={<AppLayout><UploadAudio /></AppLayout>} />
            <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
            <Route path="/agents" element={<AppLayout><Agents /></AppLayout>} />
            <Route path="/agent-preview" element={<AppLayout><AgentPreview /></AppLayout>} />
            <Route path="/services" element={<AppLayout><Services /></AppLayout>} />
            <Route path="/admin/business-approvals" element={<AppLayout><BusinessApprovals /></AppLayout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
