

/**
 * The main application component that sets up the context providers, routing, and global configurations.
 *
 * This component wraps the entire application with the following providers:
 * - `QueryClientProvider`: Provides React Query functionality for data fetching and caching.
 * - `UserProvider`: Provides user context for managing user-related state.
 * - `TooltipProvider`: Provides tooltip functionality throughout the application.
 * - `Toaster` and `Sonner`: Render global toast notifications.
 * - `BrowserRouter`: Enables client-side routing with React Router.
 *
 * The application defines the following routes:
 * - `/`: Renders the `Login` component.
 * - `/index`: Renders the `Index` component.
 * - `/dispatcher-diary`: Renders the `DispatcherDiary` component.
 * - `/history-diary`: Renders the `History_DispatcherDiary` component.
 * - `*`: A catch-all route that renders the `NotFound` component for undefined paths.
 *
 * @returns The root application component.
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DispatcherDiary from "./pages/DispatcherDiary";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { UserProvider } from "@/components/UserContext";
import History_DispatcherDiary from "./pages/History_DispatcherDiary";
import OllamaChat from "./pages/VasiViz_AI";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/index" element={<Index />} />
            <Route path="/dispatcher-diary" element={<DispatcherDiary />} />
            <Route path="/history-diary" element={<History_DispatcherDiary />} />
            <Route path="/vasi-ai" element={<OllamaChat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
