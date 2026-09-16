import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { DashboardLayout } from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import CreateParcel from "@/pages/CreateParcel";
import ManageParcels from "@/pages/ManageParcels";
import ParcelDetails from "@/pages/ParcelDetails";
import ParcelTracking from "@/pages/ParcelTracking";
import AddAdmin from "@/pages/AddAdmin";
import LoginPage from "@/pages/Login";
import NotFound from "@/pages/NotFound";

const App = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected admin routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              {/* Dashboard */}
              <Route path="/" element={<Dashboard />} />

              {/* Parcels */}
              <Route path="/create-parcel" element={<CreateParcel />} />

              <Route path="/manage-parcels" element={<ManageParcels />} />

              <Route path="/parcel/:id" element={<ParcelDetails />} />

              <Route path="/tracking" element={<ParcelTracking />} />

              {/* Analytics */}
              <Route path="/analytics" element={<Analytics />} />

              {/* Admin management */}
              <Route path="/add-admin" element={<AddAdmin />} />
            </Route>
          </Route>

          {/* Unknown routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
