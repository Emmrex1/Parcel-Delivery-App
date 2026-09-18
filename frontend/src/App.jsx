import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "./components/protectedRoute";

// Public pages
import Index from "./pages/Index";
import TrackParcel from "./pages/TrackParcel";
import CalculateCost from "./pages/CalculateCost";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Authentication
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Resume from "./pages/Resume";


const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />

    <BrowserRouter>
      <Navbar />

      <Routes>

        <Route path="/" element={<Index />} />

        <Route path="/track" element={<TrackParcel />} />

        <Route path="/calculate" element={<CalculateCost />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/resume" element={<Resume />} />


        <Route element={<ProtectedRoute />}>

          {/* 
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/my-shipments"
            element={<Shipments />}
          />

          <Route
            path="/send-parcel"
            element={<CreateParcel />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />
          */}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
