import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import CustomerDashboardLayout from "./layouts/CustomerDashboardLayout";

import Index from "./pages/Index";
import TrackParcel from "./pages/TrackParcel";
import CalculateCost from "./pages/CalculateCost";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/dashboard/Dashboard";
import MyShipments from "./pages/dashboard/myshipments";
import ShipmentDetails from "./pages/dashboard/shipmentDetails";
import SendParcel from "./pages/dashboard/sendParcel";
const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />

    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public routes */}

        <Route path="/" element={<Index />} />
        <Route path="/track" element={<TrackParcel />} />
        <Route path="/calculate" element={<CalculateCost />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected customer routes */}

        <Route element={<ProtectedRoute />}>
          <Route element={<CustomerDashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/my-shipments" element={<MyShipments />} />

            <Route path="/my-shipments/:id" element={<ShipmentDetails />} />
           
            <Route path="/send-parcel" element={<SendParcel />} />
          
          </Route>
        </Route>

        {/* 404 */}

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
