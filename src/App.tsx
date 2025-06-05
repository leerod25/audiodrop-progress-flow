
import { Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UserProvider, useUserContext } from "@/contexts/UserContext";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import Services from "./pages/Services";
import Auth from "./pages/Auth";
import BusinessSignup from "./pages/BusinessSignup";
import Profile from "./pages/Profile";
import UploadAudio from "./pages/UploadAudio";
import NotFound from "./pages/NotFound";
import Agents from "./pages/Agents";
import AgentPreview from "./pages/AgentPreview";
import BusinessApprovals from "./pages/admin/BusinessApprovals";
import BusinessInvitations from "./pages/admin/BusinessInvitations";

const queryClient = new QueryClient();

const AppContent = () => {
  const { setUser } = useUserContext();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return subscription.unsubscribe;
  }, [setUser]);

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/business-signup" element={<BusinessSignup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload-audio" element={<UploadAudio />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agent-preview" element={<AgentPreview />} />
          <Route path="/admin/business-approvals" element={<BusinessApprovals />} />
          <Route path="/admin/business-invitations" element={<BusinessInvitations />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <AppContent />
        </Suspense>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
