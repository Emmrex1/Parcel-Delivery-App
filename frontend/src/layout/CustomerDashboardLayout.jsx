import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  Truck,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { logout } from "@/features/slice/authSlice";

const CustomerDashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Shipments",
      path: "/my-shipments",
      icon: Package,
    },
    {
      name: "Send a Parcel",
      path: "/send-parcel",
      icon: PlusCircle,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-2 hover:bg-muted"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <NavLink
          to="/dashboard"
          className="flex items-center gap-2 font-display font-bold"
        >
          <Truck className="h-5 w-5 text-accent" />
          <span>RapidXpress</span>
        </NavLink>

        <div className="w-9" />
      </header>

      
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 border-r bg-background
          transition-transform duration-200
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}

          <div className="flex h-16 items-center justify-between border-b px-5">
            <NavLink
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Truck className="h-5 w-5" />
              </div>

              <div>
                <p className="font-display font-bold leading-none">
                  RapidXpress
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Customer Portal
                </p>
              </div>
            </NavLink>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-md p-2 hover:bg-muted lg:hidden"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}

          <nav className="flex-1 space-y-1 p-4">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Menu
            </p>

            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3 rounded-lg px-3 py-2.5
                    text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                    `
                  }
                >
                  <Icon className="h-4 w-4" />

                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* User / Logout */}

          <div className="border-t p-4">
            <div className="mb-3 rounded-lg bg-muted/60 p-3">
              <p className="truncate text-sm font-medium">
                {user?.name || "Customer"}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {user?.email || ""}
              </p>
            </div>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      <main className="lg:pl-64">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboardLayout;
